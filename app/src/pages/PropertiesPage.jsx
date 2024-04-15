import { Button, ButtonSize } from "components/button/Button";
import Dropdown from "components/dropdown/Dropdown";
import PropertyForm from "components/forms/property/PropertyForm";
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
import { useGetPaginatedDatas } from "queryHooks/useProperty";
import { useEffect, useState } from "react";
import { CgDuplicate } from "react-icons/cg";
import { IoIosArrowDropright } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

export const PropertiesPage = ({ title }) => {
    const navigate = useNavigate();
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
                    <Button
                        size={ButtonSize.Big}
                        onClick={() =>
                            handleOpenModal({
                                title: "Nouvelle copropriété",
                                content: (
                                    <PropertyForm
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
                            <Th
                                label="Référence"
                                sortBy="reference"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Nom"
                                sortBy="title"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Syndic"
                                sortBy="trustee.title"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Secteur"
                                sortBy="zone"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Code postal"
                                sortBy="postcode"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th
                                label="Ville"
                                sortBy="city"
                                sortValue={sortValue}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                            />
                            <Th label="" style={{ width: 10 }} />
                        </Thead>
                        <Tbody>
                            {!isLoading &&
                                data["hydra:member"].map((data) => (
                                    <Tr
                                        key={data.id}
                                        onClick={() =>
                                            navigate("/properties/" + data.id, {
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
                                            label="Référence"
                                            text={data.reference}
                                        />
                                        <Td label="Nom" text={data.title} />
                                        <Td
                                            label="Syndic"
                                            text={data.trustee.title}
                                        />
                                        <Td label="Secteur" text={data.zone} />
                                        <Td
                                            label="Code postal"
                                            text={data.postcode}
                                        />
                                        <Td label="Ville" text={data.city} />
                                        <Td label="" text={""}>
                                            <Dropdown type="table">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/properties/" +
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
                                                    <IoIosArrowDropright
                                                        size={26}
                                                    />
                                                    Consulter la fiche
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleOpenModal({
                                                            title: "édition de la copropriété",
                                                            content: (
                                                                <PropertyForm
                                                                    id={data.id}
                                                                    handleCloseModal={
                                                                        handleCloseModal
                                                                    }
                                                                />
                                                            ),
                                                        })
                                                    }
                                                >
                                                    <LuSettings2 size={26} />
                                                    Modifier la copropriété
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleOpenModal({
                                                            title: "Dupliquer la copropriété",
                                                            content: (
                                                                <PropertyForm
                                                                    id={data.id}
                                                                    handleCloseModal={
                                                                        handleCloseModal
                                                                    }
                                                                    duplicate={
                                                                        true
                                                                    }
                                                                />
                                                            ),
                                                        })
                                                    }
                                                >
                                                    <CgDuplicate size={26} />
                                                    Dupliquer la copropriété
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
