import { Button, ButtonSize } from "components/button/Button";
import Dropdown from "components/dropdown/Dropdown";
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
import { useModal } from "hooks/useModal";
import { useSearch } from "hooks/useSearch";
import { useSortBy } from "hooks/useSortBy";
import { useGetPaginatedDatas } from "queryHooks/useService";
import { useEffect, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import ServiceForm from "../components/forms/service/ServiceForm";

export const ServicesPage = ({ title }) => {
    const { state: initialPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
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
    } = useGetPaginatedDatas(page, sortValue, sortDirection, searchValue);

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
                //subtitle={data["hydra:totalItems"].toString()}
                error={error}
            >
                {searchbar}
                <Button
                    size={ButtonSize.Big}
                    onClick={() =>
                        handleOpenModal({
                            title: "nouvelle prestation",
                            content: (
                                <ServiceForm
                                    handleCloseModal={handleCloseModal}
                                />
                            ),
                        })
                    }
                ></Button>
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
                            label="Référence"
                            sortBy="reference"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Intitulé"
                            sortBy="title"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Intitulé facture"
                            sortBy="invoiceTitle"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th
                            label="Catégorie"
                            sortBy="category"
                            sortValue={sortValue}
                            sortDirection={sortDirection}
                            handleSort={handleSort}
                        />
                        <Th label="Tarif H.T." />
                        <Th label="" style={{ width: 10 }} />
                    </Thead>
                    <Tbody>
                        {!isLoading &&
                            data["hydra:member"].map((data) => (
                                <Tr
                                    key={data.id}
                                    onClick={() =>
                                        handleOpenModal({
                                            title: "édition de la prestation",
                                            content: (
                                                <ServiceForm
                                                    iri={data["@id"]}
                                                    handleCloseModal={
                                                        handleCloseModal
                                                    }
                                                />
                                            ),
                                        })
                                    }
                                >
                                    <Td text={data.id} />
                                    <Td label="Réf." text={data.reference} />
                                    <Td label="Intitulé" text={data.title} />
                                    <Td
                                        label="Intitulé facture"
                                        text={data.invoiceTitle || "..."}
                                    />
                                    <Td
                                        label="Catégorie"
                                        text={data.category}
                                    />
                                    <Td
                                        label="Tarif H.T"
                                        text={data.formattedPrice}
                                    />
                                    <Td label="" text={""}>
                                        <Dropdown type="table">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal({
                                                        title: "édition de la prestation",
                                                        content: (
                                                            <ServiceForm
                                                                iri={
                                                                    data["@id"]
                                                                }
                                                                handleCloseModal={
                                                                    handleCloseModal
                                                                }
                                                            />
                                                        ),
                                                    })
                                                }
                                            >
                                                <LuSettings2 size={30} />
                                                Modifier la prestation
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
