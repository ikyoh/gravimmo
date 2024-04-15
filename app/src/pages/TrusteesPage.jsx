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
import { useGetPaginatedDatas } from "queryHooks/useTrustee";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowDropright } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import TrusteeForm from "../components/forms/trustee/TrusteeForm";

export const TrusteesPage = ({ title }) => {
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
            : { value: "title" }
    );
    const { data, isLoading, error } = useGetPaginatedDatas(
        page,
        sortValue,
        sortDirection,
        searchValue
    );

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
                                title: "Nouveau syndic",
                                content: (
                                    <TrusteeForm
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
                            <Th label="Téléphone" />
                            <Th label="Email" />
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
                                            navigate("/trustees/" + data.id, {
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
                                        >
                                            <div className="flex flex-col mr-3">
                                                <GoDotFill
                                                    size={20}
                                                    color={data.color}
                                                />
                                                <GoDotFill
                                                    size={20}
                                                    color={data.color2}
                                                />
                                            </div>
                                        </Td>
                                        <Td label="Nom" text={data.title} />
                                        <Td
                                            label="Téléphone"
                                            text={data.phone}
                                        />
                                        <Td label="Email" text={data.email} />
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
                                                            "/trustees/" +
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
                                                            title: "édition du syndic",
                                                            content: (
                                                                <TrusteeForm
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
                                                    Modifier le syndic
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
