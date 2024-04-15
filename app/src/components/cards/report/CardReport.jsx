import Dropdown from "components/dropdown/Dropdown";
import CommandReportForm from "components/forms/commandReport/CommandReportForm";
import Loader from "components/loader/Loader";
import { useModal } from "hooks/useModal";
import { useDelete, useGetIRI, usePutData } from "queryHooks/useCommandReport";
import { useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";

export const CardReport = ({ iri }) => {
    const { data, isLoading } = useGetIRI(iri);
    const { mutate: putData } = usePutData();
    const { mutate: deleteData } = useDelete();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    return (
        <div className="_card !pr-8">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Modal />
                    <Dropdown>
                        <Modal />
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "Modifier l'incident",
                                    content: (
                                        <CommandReportForm
                                            iri={iri}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            <LuSettings2 size={30} />
                            Modifier l'incident
                        </button>

                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "Supprimer l'incident",
                                    size: "small",
                                    content: (
                                        <DeleteForm
                                            iri={iri}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            <IoIosCloseCircle size={30} />
                            Supprimer l'incident
                        </button>
                    </Dropdown>
                    <div className="flex flex-col gap-3">
                        <div className="mr-auto text-white bg-error text-sm px-3 py-1 rounded-full">
                            {data.service.title}
                        </div>
                        <p>{data.report.title}</p>
                        {data.comment && <p>{data.comment}</p>}
                    </div>
                </>
            )}
        </div>
    );
};

const DeleteForm = ({ iri, handleCloseModal }) => {
    const {
        mutate: remove,
        isLoading: isRemovePending,
        isSuccess: isRemoveSuccess,
    } = useDelete();

    const handleValidate = () => {
        remove(iri);
    };

    useEffect(() => {
        if (isRemoveSuccess) handleCloseModal();
    }, [isRemovePending]);

    return (
        <div className="py-5">
            <p>
                Attention cette opération est irréversible, voulez-vous
                confirmer cette action ?
            </p>
            <div className="flex items-center gap-5 justify-start py-5">
                <button
                    disabled={isRemovePending}
                    className="btn btn-outline"
                    onClick={() => handleCloseModal()}
                >
                    Annuler
                </button>
                <button
                    disabled={isRemovePending}
                    className="btn btn-error text-white"
                    onClick={() => handleValidate()}
                >
                    Confirmer
                </button>
            </div>
        </div>
    );
};
