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
import _ from "lodash";
import { useGetPaginatedDatas } from "queryHooks/useProperty";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { CgDuplicate } from "react-icons/cg";
import { IoIosArrowDropright } from "react-icons/io";
import { LuSettings2, LuTable } from "react-icons/lu";
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

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

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


    const csvheaders = [
        { label: "#", key: "id" },
        { label: "Référence", key: "reference" },
        { label: "Nom", key: "title" },
        { label: "Vigik", key: "vigik" },
        { label: "Syndic", key: "trustee.title" },
        { label: "Réf. Syndic", key: "trustee.reference" },
        { label: "Secteur", key: "zone" },
        { label: "Code postal", key: "postcode" },
        { label: "Ville", key: "city" },
    ];


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
                    <Dropdown type="button" isDisabled={checkedList.length === 0}>
                        <div>Sélection</div>
                        {checkedList.length === 0 ? (
                            <button disabled={checkedList.length === 0}>
                                <LuTable size={26} /> Données CSV
                            </button>
                        ) : (
                            <CSVLink
                                filename={"Commandes.csv"}
                                data={checkedList}
                                headers={csvheaders}
                            >
                                <LuTable size={26} /> Données CSV
                            </CSVLink>
                        )}


                    </Dropdown>
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
                                label="Vigik"
                                sortBy="vigik"
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
                                label="Réf. Syndic"
                                sortBy="trustee.reference"
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
                                        <Td
                                            label="Référence"
                                            text={data.reference}
                                        />
                                        <Td label="Nom" text={data.title} />
                                        <Td label="Vigik" text={data.vigik ? data.vigik : "..."} />
                                        <Td
                                            label="Syndic"
                                            text={data.trustee.title}
                                        />
                                        <Td
                                            label="Réf. Syndic"
                                            text={data.trustee.reference}
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
