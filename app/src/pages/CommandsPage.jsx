import { Button, ButtonSize } from "components/button/Button";
import Dropdown from "components/dropdown/Dropdown";
import { CommandForm } from "components/forms/command/CommandForm";
import { CommandImageForm } from "components/forms/commandImage/CommandImageForm";
import TourForm from "components/forms/tour/TourForm";
import Loader from "components/loader/Loader";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import Pagination from "components/pagination/Pagination";
import CommandPdf from "components/pdf/CommandPdf";
import CommandStatus from "components/status/CommandStatus";
import Header from "components/templates/header/Header";
import Table from "components/templates/table/Table";
import Tbody from "components/templates/table/Tbody";
import Td from "components/templates/table/Td";
import Th from "components/templates/table/Th";
import Thead from "components/templates/table/Thead";
import Tr from "components/templates/table/Tr";
import dayjs from "dayjs";
import { useCommandsFilter } from "hooks/useCommandsFilter";
import useMakeInvoices from "hooks/useMakeInvoices";
import { useModal } from "hooks/useModal";
import { useSearch } from "hooks/useSearch";
import { useSortBy } from "hooks/useSortBy";
import _ from "lodash";
import { useGetPaginatedDatas, usePutData } from "queryHooks/useCommand";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { BsPiggyBank } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import {
    IoIosAddCircleOutline,
    IoIosArrowDropright,
    IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { LuSettings2, LuTable } from "react-icons/lu";
import { MdPendingActions, MdWarning } from "react-icons/md";
import { RiLockFill } from "react-icons/ri";
import { SlPicture } from "react-icons/sl";
import { useLocation, useNavigate } from "react-router-dom";

export const CommandsPage = ({ title }) => {
    const navigate = useNavigate();
    const { state: initialPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { searchValue, searchbar } = useSearch(
        initialPageState ? initialPageState.searchValue : ""
    );
    const { filter, filters } = useCommandsFilter();
    const [page, setPage] = useState(
        initialPageState ? initialPageState.page : 1
    );
    const { sortValue, sortDirection, handleSort } = useSortBy(
        initialPageState
            ? {
                value: initialPageState.sortValue,
                direction: initialPageState.sortDirection,
            }
            : { value: "id", direction: "DESC" }
    );

    const { data, isLoading, error } = useGetPaginatedDatas({
        enabled: true,
        page: page,
        sortValue: sortValue,
        sortDirection: sortDirection,
        searchValue: searchValue,
        filters: filters,
    });
    const { mutate: putData } = usePutData();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    const { setCommands, isLoading: isLoadingMakeInvoices } = useMakeInvoices();

    useEffect(() => {
        if (searchValue && !initialPageState) {
            setPage(1);
        }
        if (sortValue && !initialPageState) {
            setPage(1);
        }
        setCheckedList([]);
        setIsCheckAll(false);
    }, [searchValue, sortValue, filters]);

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        if (!isCheckAll) {
            setCheckedList(data["hydra:member"]);
        }
        if (isCheckAll) {
            setCheckedList([]);
        }
    };

    const handleCheck = (data) => {
        if (_.find(checkedList, { id: data.id }))
            setCheckedList(checkedList.filter((f) => f.id !== data.id));
        else {
            setCheckedList([...checkedList, data]);
        }
    };

    const handleValidateSelection = async (status) => {
        await Promise.all(
            checkedList.map(async (command) => {
                const _command = { id: command.id };
                if (
                    status === "DEFAULT - à traiter" &&
                    command.status === "DEFAULT - à traiter"
                ) {
                    _command.madeAt = dayjs();
                    _command.status = "DEFAULT - préparé";
                }
                if (
                    status === "DEFAULT - préparé" &&
                    command.status === "DEFAULT - préparé"
                ) {
                    _command.deliveredAt = dayjs();
                    _command.status = "DEFAULT - posé";
                }
                putData(_command);
            })
        );
    };

    const csvDatas = () => {
        const getRegularServicesReferences = (services) => {
            return services.reduce(
                (acc, curr) => [...acc, curr.service.reference],
                []
            );
        };

        const reducedDatas = checkedList.reduce(
            (commandAccumulator, currentCommand) =>
                !currentCommand.isCustom
                    ? [
                        ...commandAccumulator,
                        {
                            ...currentCommand,
                            references: getRegularServicesReferences(
                                currentCommand.property.services
                            ),
                        },
                    ]
                    : _.concat(
                        commandAccumulator,
                        _.compact(
                            currentCommand.customServices.map(
                                (customService) => ({
                                    ...currentCommand,
                                    details: customService.details,
                                    references: getRegularServicesReferences(
                                        customService.propertyServices
                                    ),
                                })
                            )
                        )
                    ),
            []
        );
        return reducedDatas;
    };

    const csvheaders = [
        { label: "#", key: "id" },
        { label: "Prestations", key: "references" },
        { label: "Syndic", key: "trustee.title" },
        { label: "Copro", key: "property.title" },
        { label: "Secteur", key: "property.zone" },
        { label: "Nouvel Occupant", key: "details.nouveloccupant" },
        { label: "N° Entrée", key: "details.entree" },
        { label: "N° Appartement", key: "details.numeroappartement" },
        { label: "N° Boite aux lettre", key: "details.numeroboiteauxlettres" },
        { label: "N° Etage", key: "details.numeroetage" },
        { label: "N° Lot", key: "details.numerodelot" },
        { label: "N° Porte", key: "details.numerodeporte" },
        { label: "N° Villa", key: "details.numerodevilla" },
    ];

    if (isLoading && !data) return <Loader />;
    if (isLoadingMakeInvoices) return <Loader text="Enregistrement en cours" />;
    return (
        <>
            <Modal />
            <Header
                title={title}
                subtitle={data["hydra:totalItems"].toString()}
                error={error}
            >
                {searchbar}
                {filter}
                <Dropdown type="button" isDisabled={checkedList.length === 0}>
                    <div>Sélection</div>
                    {checkedList.length !== 0 &&
                        checkedList.filter(
                            (command) =>
                                command.status === "DEFAULT - à traiter"
                        ).length !== 0 && (
                            <button
                                onClick={() =>
                                    handleValidateSelection(
                                        "DEFAULT - à traiter"
                                    )
                                }
                            >
                                <IoIosCheckmarkCircleOutline size={26} />
                                Valider la préparation
                            </button>
                        )}
                    {checkedList.length !== 0 &&
                        checkedList.filter(
                            (command) => command.status === "DEFAULT - préparé"
                        ).length !== 0 && (
                            <button
                                onClick={() =>
                                    handleValidateSelection("DEFAULT - préparé")
                                }
                            >
                                <IoIosCheckmarkCircleOutline size={26} />
                                Valider la pose
                            </button>
                        )}
                    {checkedList.length === 0 ? (
                        <button disabled={checkedList.length === 0}>
                            <LuTable size={26} /> Données CSV
                        </button>
                    ) : (
                        <CSVLink
                            filename={"Commandes.csv"}
                            data={csvDatas()}
                            headers={csvheaders}
                        >
                            <LuTable size={26} /> Données CSV
                        </CSVLink>
                    )}
                    <CommandPdf commands={checkedList} />
                    <button
                        disabled={checkedList.length === 0}
                        onClick={() =>
                            handleOpenModal({
                                title: "Date de la tournée",
                                content: (
                                    <TourForm
                                        commands={checkedList}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <MdPendingActions size={26} /> Programmer la tournée
                    </button>
                    <button
                        disabled={checkedList.length === 0 ||
                            checkedList.filter((command) => command.status === "DEFAULT - posé").length === 0
                        }
                        onClick={() => setCommands(checkedList)}
                    >
                        <BsPiggyBank size={26} /> Facturer
                    </button>
                </Dropdown>
                <Button
                    size={ButtonSize.Big}
                    onClick={() =>
                        handleOpenModal({
                            title: "Nouvelle commande",
                            content: (
                                <CommandForm
                                    handleCloseModal={handleCloseModal}
                                />
                            ),
                        })
                    }
                />
            </Header>

            {data["hydra:totalItems"] === 0 ? (
                <NoDataFound />
            ) : (
                <Table>
                    <Thead>
                        <Th
                            label="#"
                            sortBy="id"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th label="">
                            <div className="p-3 flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    name="selectAll"
                                    id="selectAll"
                                    onChange={handleSelectAll}
                                    checked={isCheckAll}
                                    className="checkbox"
                                />
                            </div>
                        </Th>
                        <Th
                            label="Syndic / Client"
                            sortBy="trustee.title"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Copropriété"
                            sortBy="property.title"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Secteur"
                            sortBy="property.zone"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Créée le"
                            sortBy="createdAt"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Posée le"
                            sortBy="tour.scheduledAt"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Poseur"
                            sortBy="tour.user.firstname"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Statut"
                            sortBy="status"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th />
                    </Thead>
                    <Tbody>
                        {!isLoading &&
                            data["hydra:member"].map((data) => (
                                <Tr
                                    key={data.id}
                                    onClick={() =>
                                        navigate("/commands/" + data.id, {
                                            state: {
                                                page: page,
                                                sortDirection: sortDirection,
                                                sortValue: sortValue,
                                                searchValue: searchValue,
                                            },
                                        })
                                    }
                                >
                                    <Td text={data.id} />
                                    <Td>
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-3"
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox mt-4"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={() =>
                                                    handleCheck(data)
                                                }
                                                checked={
                                                    _.find(checkedList, {
                                                        id: data.id,
                                                    })
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </div>
                                    </Td>
                                    {data.trustee ? (
                                        <Td
                                            label="Syndic"
                                            text={data.trustee.title}
                                        >
                                            <div className="flex flex-col mr-3">
                                                <GoDotFill
                                                    size={20}
                                                    color={data.trustee.color}
                                                />
                                                <GoDotFill
                                                    size={20}
                                                    color={data.trustee.color2}
                                                />
                                            </div>
                                        </Td>
                                    ) : (
                                        <Td
                                            label="Client"
                                            text={data.customer.title}
                                        >
                                            <div className="flex flex-col mr-3">
                                                <GoDotFill
                                                    size={20}
                                                    color="#0a0e26"
                                                />
                                                <GoDotFill
                                                    size={20}
                                                    color="#0a0e26"
                                                />
                                            </div>
                                        </Td>
                                    )}
                                    {data.property ? (
                                        <>
                                            <Td
                                                label="Copropriété"
                                                text={data.property.title}
                                            />
                                            <Td
                                                label="Secteur"
                                                text={data.property.zone}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Td
                                                label="Copropriété"
                                                text="..."
                                            />
                                            <Td label="Secteur" text="..." />
                                        </>
                                    )}
                                    <Td
                                        label="Date"
                                        text={dayjs(data.createdAt).format(
                                            "DD/MM/YYYY"
                                        )}
                                    />
                                    <Td
                                        label="Date"
                                        text={
                                            data.deliveredAt
                                                ? dayjs(
                                                    data.deliveredAt
                                                ).format("DD/MM/YYYY")
                                                : "..."
                                        }
                                    />
                                    <Td
                                        label="Poseur"
                                        text={
                                            data.tour
                                                ? data.tour.user.firstname
                                                : "..."
                                        }
                                    />
                                    <Td label="Statut">
                                        <div className="flex justify-between items-center w-full">
                                            <CommandStatus
                                                status={data.status}
                                                isHanging={data.isHanging}
                                                date={data.createdAt}
                                            />

                                            <div className="grid grid-cols-4 gap-1">
                                                <div className="self-center">
                                                    {data.isHanging && (
                                                        <RiLockFill size={20} />
                                                    )}
                                                </div>
                                                <div className="self-center">
                                                    {data.reports.length !==
                                                        0 && (
                                                            <MdWarning
                                                                size={20}
                                                                className="text-error"
                                                            />
                                                        )}
                                                </div>
                                                <div className="self-center">
                                                    {data.images.length !==
                                                        0 && (
                                                            <div
                                                                className="tooltip flex items-center"
                                                                data-tip={
                                                                    data.images
                                                                        .length
                                                                }
                                                            >
                                                                <button className="">
                                                                    <SlPicture
                                                                        size={20}
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="self-center">
                                                    {data.tour && (
                                                        <div
                                                            className="tooltip flex items-center"
                                                            data-tip={
                                                                data.tour.id
                                                            }
                                                        >
                                                            <MdPendingActions
                                                                size={22}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td label="" text={""}>
                                        <Dropdown type="table">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        "/commands/" + data.id,
                                                        {
                                                            state: {
                                                                page: page,
                                                                sortDirection:
                                                                    sortDirection,
                                                                sortValue:
                                                                    sortValue,
                                                                searchValue:
                                                                    searchValue,
                                                            },
                                                        }
                                                    )
                                                }
                                            >
                                                <IoIosArrowDropright
                                                    size={26}
                                                />
                                                Consulter la fiche
                                            </button>
                                            <CommandPdf commands={[data]} />
                                            {data.status !== "facturé" &&
                                                data.status !== "posé" &&
                                                data.status !== "annulé" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleOpenModal(
                                                                    {
                                                                        title: "édition de la commande",
                                                                        content:
                                                                            (
                                                                                <CommandForm
                                                                                    id={
                                                                                        data.id
                                                                                    }
                                                                                    handleCloseModal={
                                                                                        handleCloseModal
                                                                                    }
                                                                                />
                                                                            ),
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <LuSettings2
                                                                size={26}
                                                            />
                                                            Modifier la commande
                                                        </button>
                                                        {data.status ===
                                                            "DEFAULT - à traiter" && (
                                                                <button
                                                                    onClick={() =>
                                                                        putData({
                                                                            id: data.id,
                                                                            status: "DEFAULT - préparé",
                                                                            madeAt: dayjs(),
                                                                        })
                                                                    }
                                                                >
                                                                    <IoIosCheckmarkCircleOutline
                                                                        size={26}
                                                                    />
                                                                    Valider la
                                                                    préparation
                                                                </button>
                                                            )}
                                                        {data.status ===
                                                            "DEFAULT - préparé" && (
                                                                <button
                                                                    onClick={() =>
                                                                        putData({
                                                                            id: data.id,
                                                                            status: "DEFAULT - posé",
                                                                            madeAt: dayjs(),
                                                                        })
                                                                    }
                                                                >
                                                                    <IoIosCheckmarkCircleOutline
                                                                        size={26}
                                                                    />
                                                                    Valider la pose
                                                                </button>
                                                            )}
                                                        {!data.invoice &&
                                                            data.status ===
                                                            "DEFAULT - posé" && (
                                                                <button
                                                                    onClick={() =>
                                                                        setCommands(
                                                                            [
                                                                                data,
                                                                            ]
                                                                        )
                                                                    }
                                                                >
                                                                    <BsPiggyBank
                                                                        size={
                                                                            26
                                                                        }
                                                                    />
                                                                    Facturer la
                                                                    commande
                                                                </button>
                                                            )}
                                                    </>
                                                )}
                                            <button
                                                onClick={() =>
                                                    handleOpenModal({
                                                        title: "Ajouter des visuels",
                                                        content: (
                                                            <CommandImageForm
                                                                commandID={
                                                                    data.id
                                                                }
                                                                handleCloseModal={
                                                                    handleCloseModal
                                                                }
                                                            />
                                                        ),
                                                    })
                                                }
                                            >
                                                <IoIosAddCircleOutline
                                                    size={30}
                                                />
                                                Ajout de visuels
                                            </button>
                                        </Dropdown>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            )}
            <Pagination
                totalItems={data["hydra:totalItems"]}
                page={page}
                setPage={setPage}
            />
        </>
    );
};
