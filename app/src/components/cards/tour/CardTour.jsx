import { Dot } from "components/dot/Dot";
import Dropdown from "components/dropdown/Dropdown";
import { CommandImageForm } from "components/forms/commandImage/CommandImageForm";
import { ExtraServiceForm } from "components/forms/extraService/ExtraServiceForm";
import Loader from "components/loader/Loader";
import {
    statusColor,
    status as translateStatus,
} from "config/translations.config";
import { useModal } from "hooks/useModal";
import { CommandPage } from "pages/CommandPage";
import { useGetIRI } from "queryHooks/useCommand";
import { useGetIRI as useGetCustomerIRI } from "queryHooks/useCustomer";
import { useGetIRI as useGetPropertyIRI } from "queryHooks/useProperty";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineAssignment } from "react-icons/md";
import { SlPicture } from "react-icons/sl";
import uuid from "react-uuid";

export const CardTour = ({ iri }) => {
    const { data, isLoading } = useGetIRI(iri);
    const { data: property, isLoading: isLoadingProperty } = useGetPropertyIRI(
        data ? data.property : null
    );
    const { data: customer, isLoading: isLoadingCustomer } = useGetCustomerIRI(
        data ? data.customer : null
    );
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    if (isLoading) return <Loading />;
    if (data && data.property && isLoadingProperty) return <Loading />;
    if (data && data.customer && isLoadingCustomer) return <Loading />;

    return (
        <>
            <Modal />
            <div className="_card dark:bg-gradient-page flex flex-row gap-3 items-center justify-between w-full flex-wrap">
                <div className="flex-row items-center gap-5 flex">
                    <div className="">#{data.id}</div>
                    <div className="text-accent font-semibold">
                        {property && property.title}
                        {customer && customer.title}
                    </div>
                    <div>
                        {property && property.zone}
                        {customer && customer.zone}
                    </div>
                    {property &&
                        property.accesses?.map((access) => (
                            <div
                                key={uuid()}
                                className="rounded border border-slate-500 p-2"
                            >
                                {access}
                            </div>
                        ))}
                </div>

                <div className="flex gap-5 items-center">
                    {data.images.length !== 0 && (
                        <div className="relative mr-14">
                            <span className="text-sm absolute -top-3 -right-4 rounded-full bg-action px-2">
                                {data.images.length}
                            </span>
                            <SlPicture size={30} />
                        </div>
                    )}

                    <div className="mr-5">
                        <div className="flex items-center gap-1">
                            <Dot color={statusColor[data.status]} />
                            <p className="first-letter:uppercase">
                                {translateStatus[data.status]}
                            </p>
                        </div>
                        <Dropdown type="tour">
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "Commande",
                                        content: (
                                            <CommandPage
                                                isModalContent={true}
                                                commandIRI={data["@id"]}
                                            />
                                        ),
                                    })
                                }
                            >
                                <MdOutlineAssignment size={30} />
                                Voir la commande
                            </button>
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "Ajouter des visuels",
                                        content: (
                                            <CommandImageForm
                                                commandID={data.id}
                                                handleCloseModal={
                                                    handleCloseModal
                                                }
                                            />
                                        ),
                                    })
                                }
                            >
                                <IoIosAddCircleOutline size={30} />
                                Ajout de visuels
                            </button>
                            {data.status !== "facturé" && (
                                <button
                                    onClick={() =>
                                        handleOpenModal({
                                            title: "Prestations",
                                            content: (
                                                <ExtraServiceForm
                                                    commandIRI={data["@id"]}
                                                    handleCloseModal={
                                                        handleCloseModal
                                                    }
                                                />
                                            ),
                                        })
                                    }
                                >
                                    <IoIosAddCircleOutline size={30} />
                                    Prestations
                                </button>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <button
                    className="btn btn-primary btn-circle"
                    onClick={() =>
                        handleOpenModal({
                            title: "Commande",
                            content: (
                                <CommandPage
                                    isModalContent={true}
                                    commandIRI={data["@id"]}
                                />
                            ),
                        })
                    }
                >
                    <MdOutlineAssignment size={30} />
                </button>
                <button className="btn btn-primary btn-circle">
                    <MdOutlineAssignment size={30} />
                </button>
                <div className="btn btn-primary btn-circle">
                    <CommandImageForm commandID={data.id} />
                </div>
            </div>
        </>
    );
};

const Loading = () => {
    return (
        <div className="_card dark:bg-gradient-page w-full">
            <Loader />
        </div>
    );
};
