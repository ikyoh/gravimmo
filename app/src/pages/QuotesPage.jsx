import axios from "axios";
import { Button, ButtonSize } from "components/button/Button";
import { Dot } from "components/dot/Dot";
import Dropdown from "components/dropdown/Dropdown";
import QuoteForm from "components/forms/quote/QuoteForm";
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
import { statusColor } from "config/translations.config";
import dayjs from "dayjs";
import { useModal } from "hooks/useModal";
import { useQuotesFilter } from "hooks/useQuotesFilter";
import { useSearch } from "hooks/useSearch";
import { useSortBy } from "hooks/useSortBy";
import fileDownload from "js-file-download";
import _ from "lodash";
import { useGetPaginatedDatas } from "queryHooks/useQuote";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineAssignment, MdOutlineFileDownload } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { CommandPage } from "./CommandPage";

export const QuotesPage = ({ title }) => {
    const navigate = useNavigate();
    const { state: initialPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { searchValue, searchbar } = useSearch(
        initialPageState ? initialPageState.searchValue : ""
    );
    const { filter, filters } = useQuotesFilter();
    const [page, setPage] = useState(
        initialPageState ? initialPageState.page : 1
    );
    const { sortValue, sortDirection, handleSort } = useSortBy(
        initialPageState
            ? {
                  value: initialPageState.sortValue,
                  direction: initialPageState.sortDirection,
              }
            : { value: "chrono", direction: "DESC" }
    );
    const { data, isLoading, error } = useGetPaginatedDatas(
        page,
        sortValue,
        sortDirection,
        searchValue,
        filters
    );

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

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
        setCheckedList(data["hydra:member"]);
        if (isCheckAll) {
            setCheckedList([]);
        }
    };

    const handleCheck = (data) => {
        //event.stopPropagation()
        if (_.find(checkedList, { id: data.id }))
            setCheckedList(checkedList.filter((f) => f.id !== data.id));
        else {
            setCheckedList([...checkedList, data]);
        }
    };

    const downloadFile = (id, chrono) => {
        axios({
            url: "/api/pdf/quote/" + id,
            method: "GET",
            responseType: "blob",
        }).then((response) => {
            fileDownload(response.data, "devis_" + chrono + ".pdf");
        });
    };

    if (isLoading) return <Loader />;
    else
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
                    <Dropdown
                        type="button"
                        isDisabled={checkedList.length === 0}
                    >
                        <div>Sélection</div>
                        <button
                            onClick={() => downloadFile(data.id, data.chrono)}
                        >
                            <MdOutlineFileDownload size={30} />
                            Télécharger
                        </button>
                    </Dropdown>
                    <Button
                        size={ButtonSize.Big}
                        onClick={() =>
                            handleOpenModal({
                                title: "Nouveau devis",
                                content: (
                                    <QuoteForm
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
                                sortBy="chrono"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th label="">
                                <input
                                    type="checkbox"
                                    name="selectAll"
                                    id="selectAll"
                                    onChange={handleSelectAll}
                                    checked={isCheckAll}
                                    className="checkbox"
                                />
                            </Th>
                            <Th
                                label="Commande"
                                sortBy="command.id"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Syndic / Client"
                                sortBy="trusteeTitle"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Copropriété"
                                sortBy="propertyTitle"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Date"
                                sortBy="createdAt"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Montant H.T."
                                sortBy="amountHT"
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
                                            navigate("/quotes/" + data.id, {
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
                                        <Td text={data.chrono} />
                                        <Td>
                                            <div>
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
                                        <Td
                                            label="Commande"
                                            text={
                                                data.command && data.command.id
                                                    ? data.command.id
                                                    : "..."
                                            }
                                        />
                                        <Td
                                            label="Syndic"
                                            text={
                                                data.trusteeTitle ||
                                                data.customerTitle ||
                                                "..."
                                            }
                                        />
                                        <Td
                                            label="Copropriété"
                                            text={
                                                data.propertyTitle
                                                    ? data.propertyTitle
                                                    : "..."
                                            }
                                        />
                                        <Td
                                            label="Date"
                                            text={dayjs(data.createdAt).format(
                                                "DD/MM/YYYY"
                                            )}
                                        />
                                        <Td
                                            label="Montant"
                                            text={data.formattedAmountHT}
                                        />
                                        <Td label="Statut">
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="flex items-center">
                                                    <Dot
                                                        color={
                                                            statusColor[
                                                                data.status
                                                            ]
                                                        }
                                                    />
                                                    <span className="ml-1 mr-3 capitalize">
                                                        {data.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td label="" text={""}>
                                            <Dropdown type="table">
                                                <button
                                                    onClick={() =>
                                                        downloadFile(data.id)
                                                    }
                                                >
                                                    <MdOutlineFileDownload
                                                        size={30}
                                                    />
                                                    Télécharger
                                                </button>
                                                {data.command && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal({
                                                                title: "Commande",
                                                                content: (
                                                                    <CommandPage
                                                                        isModalContent={
                                                                            true
                                                                        }
                                                                        commandIRI={
                                                                            data
                                                                                .command[
                                                                                "@id"
                                                                            ]
                                                                        }
                                                                    />
                                                                ),
                                                            })
                                                        }
                                                    >
                                                        <MdOutlineAssignment
                                                            size={30}
                                                        />
                                                        Voir la commande
                                                    </button>
                                                )}
                                                {data.status === "édité" && (
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                "/commands/" +
                                                                    data.id,
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
                                                        <IoIosCheckmarkCircleOutline
                                                            size={30}
                                                        />
                                                        Valider le devis
                                                    </button>
                                                )}
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
