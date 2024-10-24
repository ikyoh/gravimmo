import { Dot } from "components/dot/Dot";
import Dropdown from "components/dropdown/Dropdown";
import TourForm from "components/forms/tour/TourForm";
import Loader from "components/loader/Loader";
import { NoDataFound } from "components/noDataFound/NoDataFound";
import Pagination from "components/pagination/Pagination";
import Header from "components/templates/header/Header";
import Table from "components/templates/table/Table";
import Tbody from "components/templates/table/Tbody";
import Td from "components/templates/table/Td";
import Th from "components/templates/table/Th";
import Thead from "components/templates/table/Thead";
import Tr from "components/templates/table/Tr";
import {
    statusColor,
    status as translateStatus,
} from "config/translations.config";
import dayjs from "dayjs";
import useMakeInvoices from "hooks/useMakeInvoices";
import { useModal } from "hooks/useModal";
import { useSearch } from "hooks/useSearch";
import { useSortBy } from "hooks/useSortBy";
import { useToursFilter } from "hooks/useToursFilter";
import { usePutData as usePutCommand } from "queryHooks/useCommand";
import { useGetPaginatedDatas } from "queryHooks/useTour";
import { useEffect, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import {
    IoIosArrowDropright,
    IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { MdPendingActions } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export const ToursPage = ({ title }) => {
    const navigate = useNavigate();
    const { state: initialPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { filter, filters } = useToursFilter();
    const { searchValue, searchbar } = useSearch(
        initialPageState ? initialPageState.searchValue : ""
    );
    const [page, setPage] = useState(
        initialPageState ? initialPageState.page : 1
    );
    const { sortValue, sortDirection, handleSort } = useSortBy(
        initialPageState
            ? {
                value: initialPageState.sortValue,
                direction: initialPageState.sortDirection,
            }
            : ""
    );


    const {
        data = [],
        isLoading,
        error,
    } = useGetPaginatedDatas(
        page,
        sortValue,
        sortDirection,
        searchValue,
        filters
    );

    const { mutate: updateCommand } = usePutCommand();

    const {
        setCommands: setInvoiceCommands,
        isLoading: isLoadingMakeInvoices,
    } = useMakeInvoices();

    useEffect(() => {
        if (searchValue && !initialPageState) {
            setPage(1);
        }
        if (sortValue && !initialPageState) {
            setPage(1);
        }
    }, [searchValue, sortValue]);

    const handleChangeCommandsStatus = (commands, status) => {
        commands.map((command) => {
            const _command = { id: command.id, status: status };
            if (status === "DEFAULT - posé") _command.deliveredAt = dayjs();
            updateCommand(_command);
        });
    };

    useEffect(() => {
        if (searchValue && !initialPageState) {
            setPage(1);
        }
        if (sortValue && !initialPageState) {
            setPage(1);
        }
    }, [searchValue, sortValue]);

    if (isLoading) return <Loader />;
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
                        <Th
                            label="Date"
                            sortBy="scheduledAt"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Secteur"
                            sortBy="sector"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Poseur"
                            sortBy="user"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th label="Commandes" />
                        <Th
                            label="Statut"
                            sortBy="status"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th label="" style={{ width: 10 }} />
                    </Thead>
                    <Tbody>
                        {!isLoading &&
                            data["hydra:member"].map((data) =>
                                data.commands.length === 0 ? null : (
                                    <Tr
                                        key={data.id}
                                        onClick={() =>
                                            navigate("/tours/" + data.id, {
                                                state: {
                                                    page: page,
                                                    sortDirection:
                                                        sortDirection,
                                                    sortValue: sortValue,
                                                    searchValue: searchValue,
                                                },
                                            })
                                        }
                                    >
                                        <Td text={data.id} />
                                        <Td
                                            label="Date"
                                            isTextUppercase={true}
                                            text={dayjs(
                                                data.scheduledAt
                                            ).format("dddd D MMMM YYYY")}
                                        />
                                        <Td
                                            label="Secteur"
                                            text={data.sector}
                                        />
                                        <Td
                                            label="Poseur"
                                            text={data.user.firstname}
                                        />
                                        <Td
                                            label="Commandes"
                                            text={data.commands.length}
                                        />
                                        <Td label="Statut">
                                            <div className="flex items-center gap-1">
                                                <Dot
                                                    color={
                                                        statusColor[data.status]
                                                    }
                                                />
                                                <p className="first-letter:uppercase">
                                                    {
                                                        translateStatus[
                                                        data.status
                                                        ]
                                                    }
                                                </p>
                                            </div>
                                        </Td>
                                        <Td label="" text={""}>
                                            <Dropdown type="table">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/tours/" + data.id,
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
                                                    {" "}
                                                    <IoIosArrowDropright
                                                        size={26}
                                                    />
                                                    Consulter la fiche
                                                </button>
                                                {data.status ===
                                                    "DEFAULT - à traiter" && (
                                                        <button
                                                            onClick={() =>
                                                                handleChangeCommandsStatus(
                                                                    data.commands,
                                                                    "DEFAULT - préparé"
                                                                )
                                                            }
                                                        >
                                                            <IoIosCheckmarkCircleOutline
                                                                size={26}
                                                            />
                                                            Valider la préparation
                                                        </button>
                                                    )}
                                                {(data.status ===
                                                    "DEFAULT - préparé" ||
                                                    data.status ===
                                                    "DEFAULT - à traiter") && (
                                                        <button
                                                            onClick={() =>
                                                                handleOpenModal({
                                                                    title: "Date de la tournée",
                                                                    content: (
                                                                        <TourForm
                                                                            commands={
                                                                                data.commands
                                                                            }
                                                                            handleCloseModal={
                                                                                handleCloseModal
                                                                            }
                                                                        />
                                                                    ),
                                                                })
                                                            }
                                                        >
                                                            <MdPendingActions
                                                                size={26}
                                                            />
                                                            Reporter la tournée
                                                        </button>
                                                    )}
                                                {data.status ===
                                                    "DEFAULT - préparé" && (
                                                        <button
                                                            onClick={() =>
                                                                handleChangeCommandsStatus(
                                                                    data.commands,
                                                                    "DEFAULT - posé"
                                                                )
                                                            }
                                                        >
                                                            <IoIosCheckmarkCircleOutline
                                                                size={26}
                                                            />
                                                            Valider la pose
                                                        </button>
                                                    )}
                                                {data.status ===
                                                    "DEFAULT - posé" && (
                                                        <button
                                                            onClick={() =>
                                                                setInvoiceCommands(
                                                                    data.commands
                                                                )
                                                            }
                                                        >
                                                            <BsPiggyBank
                                                                size={26}
                                                            />
                                                            Facturer la tournée
                                                        </button>
                                                    )}
                                            </Dropdown>
                                        </Td>
                                    </Tr>
                                )
                            )}
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
