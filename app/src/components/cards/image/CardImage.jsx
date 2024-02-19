import Dropdown from "components/dropdown/Dropdown";
import Loader from "components/loader/Loader";
import { useModal } from "hooks/useModal";
import { useDeleteIRI, useGetIRI } from "queryHooks/useMedia";

export const CardImage = ({ iri }) => {
    const { data = {}, isLoading } = useGetIRI(iri);
    const { mutate } = useDeleteIRI();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    const handleRemove = () => {
        mutate(iri);
    };

    return (
        <div className="card">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Modal />
                    <Dropdown>
                        <button onClick={() => handleRemove()}>
                            Retirer le visuel
                        </button>
                    </Dropdown>
                    <div
                        className="flex pr-5 cursor-pointer"
                        onClick={() =>
                            handleOpenModal({
                                title: data.filePath,
                                content: (
                                    <img
                                        src={data.contentUrl}
                                        className="object-cover"
                                        alt={data.filePath}
                                    />
                                ),
                            })
                        }
                    >
                        <img
                            src={data.contentUrl}
                            className="object-cover rounded"
                            alt={data.filePath}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
