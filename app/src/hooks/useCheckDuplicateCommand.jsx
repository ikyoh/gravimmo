import { useModal } from "hooks/useModal";
import { CommandPage } from "pages/CommandPage";
import { useGetPaginatedDatas } from "queryHooks/useCommand";
import { useEffect, useState } from "react";
import uuid from "react-uuid";

export const useCheckDuplicateCommand = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [property, setProperty] = useState("");

    const { Modal, handleOpenModal } = useModal();

    const { data, isLoading, isSuccess, error } = useGetPaginatedDatas({
        enabled: property && searchTerm ? true : false,
        page: 1,
        sortValue: "id",
        sortDirection: "ASC",
        details: searchTerm,
        filters: { status: "all" },
        property: property,
    });

    useEffect(() => {
        if (property && searchTerm && isSuccess) {
            setIsChecked(true);
        }
    }, [property, searchTerm, isLoading, data]);

    useEffect(() => {
        if (data) {
            setIsChecked(true);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isChecked && data && data["hydra:totalItems"] === 0)
            setIsDuplicate(false);
    }, [data, isChecked]);

    const DuplicateCommandCard = () => {
        if (!data) return null;
        if (data["hydra:totalItems"] === 0) return null;
        if (data["hydra:totalItems"] !== 0)
            return (
                <>
                    <Modal />
                    <div className="bg-error rounded p-5 my-5">
                        <p className="pb-4">
                            Attention probabilité de commande en doublon
                        </p>
                        <div className="flex gap-5">
                            {data["hydra:member"].map((command) => (
                                <button
                                    key={uuid()}
                                    className="btn"
                                    onClick={() =>
                                        handleOpenModal({
                                            title: "Commande",
                                            isPageContent: true,
                                            content: (
                                                <CommandPage
                                                    isModalContent={true}
                                                    commandIRI={command["@id"]}
                                                />
                                            ),
                                        })
                                    }
                                >
                                    Commande n° {command.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            );
    };

    return {
        isDuplicate,
        isChecked,
        isLoading,
        setSearchTerm,
        setProperty,
        DuplicateCommandCard,
    };
};
