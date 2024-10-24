import { Dot } from "components/dot/Dot";
import Dropdown from "components/dropdown/Dropdown";
import { CommandImageForm } from "components/forms/commandImage/CommandImageForm";
import CommandReportForm from "components/forms/commandReport/CommandReportForm";
import { ExtraServiceForm } from "components/forms/extraService/ExtraServiceForm";
import {
    statusColor,
    status as translateStatus,
} from "config/translations.config";
import { useModal } from "hooks/useModal";
import { CommandPage } from "pages/CommandPage";
import { useGetIRI } from "queryHooks/useCommand";
import { useGetIRI as useGetCustomerIRI } from "queryHooks/useCustomer";
import { useGetIRI as useGetPropertyIRI } from "queryHooks/useProperty";
import {
    MdOutlineAssignment,
    MdOutlineDriveFileRenameOutline,
} from "react-icons/md";

import { IoIosAddCircleOutline } from "react-icons/io";
import { MdWarning } from "react-icons/md";
import { SlPicture } from "react-icons/sl";
import uuid from "react-uuid";

export const CardTour = ({ iri }) => {
    console.log("iri", iri);
    const { data, isLoading } = useGetIRI(iri);
    const { data: property, isLoading: isLoadingProperty } = useGetPropertyIRI(
        data ? data.property : null
    );
    const { data: customer, isLoading: isLoadingCustomer } = useGetCustomerIRI(
        data ? data.customer : null
    );
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    if (isLoading && !data) return <Loading />;
    if (data && data.property && isLoadingProperty) return <Loading />;
    if (data && data.customer && isLoadingCustomer) return <Loading />;

    return (
        <>
            <Modal />
            <div className="_card !py-2 dark:bg-gradient-page flex flex-col md:flex-row gap-3 items-center justify-between w-full flex-wrap">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 flex-wrap">
                    <div className="">#{data.id}</div>
                    <div className="text-accent font-semibold">
                        {property && property.title}
                        {customer && customer.title}
                    </div>
                    <div>
                        {property && property.zone}
                        {customer && customer.zone}
                    </div>
                    {property && (
                        <>
                            {property.digicode && (
                                <div className="rounded border border-slate-500 p-2 text-xs">
                                    Digicode : {property.digicode}
                                </div>
                            )}
                            {property.vigik && (
                                <div className="rounded border border-slate-500 p-2 text-xs">
                                    Vigik : {property.vigik}
                                </div>
                            )}
                            {property.transmitter && (
                                <div className="rounded border border-slate-500 p-2 text-xs">
                                    Emetteur : {property.transmitter}
                                </div>
                            )}
                            {property.accesses?.map((access) => (
                                <div
                                    key={uuid()}
                                    className="rounded border border-slate-500 p-2 text-xs"
                                >
                                    {access}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="flex gap-5 items-center">
                    {data.images.length !== 0 && (
                        <div className="relative mr-14">
                            <span className="text-xs absolute -top-1 -right-4 rounded-full bg-action px-2">
                                {data.images.length}
                            </span>
                            <SlPicture size={30} />
                        </div>
                    )}
                    {data.reports.length !== 0 && (
                        <div className="relative mr-14">
                            <span className="text-sm absolute -top-3 -right-4 rounded-full bg-error px-2">
                                {data.reports.length}
                            </span>
                            <MdWarning size={30} />
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
                                        isPageContent: true,
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
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "Incident",
                                        content: (
                                            <CommandReportForm
                                                commandIRI={data["@id"]}
                                                handleCloseModal={
                                                    handleCloseModal
                                                }
                                            />
                                        ),
                                    })
                                }
                            >
                                <MdWarning size={30} />
                                Signaler un incident
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
                <div className="grid grid-cols-4 gap-3 md:hidden">
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
                    <button
                        className="btn btn-primary btn-circle"
                        onClick={() =>
                            handleOpenModal({
                                title: "Prestations",
                                content: (
                                    <ExtraServiceForm
                                        commandIRI={data["@id"]}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <MdOutlineDriveFileRenameOutline size={30} />
                    </button>
                    <button
                        className="btn btn-error btn-circle"
                        onClick={() =>
                            handleOpenModal({
                                title: "Rapport",
                                content: (
                                    <CommandReportForm
                                        commandIRI={data["@id"]}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <MdWarning size={26} />
                    </button>
                    <div className="btn btn-primary btn-circle overflow-hidden !p-0 flex items-center justify-center relative">
                        <CommandImageForm commandID={data.id} />
                    </div>
                </div>
            </div>
        </>
    );
};

const Loading = () => {
    return (
        <div className="_card !py-1 dark:bg-gradient-page w-full">
            <span className="loading loading-spinner loading-md my-2"></span>
        </div>
    );
};
