import { Button, ButtonSize } from "components/button/Button";
import CardsContainer from "components/cards/cardsContainer/CardsContainer";
import { CardExtraService } from "components/cards/extraService/CardExtraService";
import { CardImage } from "components/cards/image/CardImage";
import { CardReport } from "components/cards/report/CardReport";
import { CardService } from "components/cards/service/CardService";
import Dropdown from "components/dropdown/Dropdown";
import { CommandForm } from "components/forms/command/CommandForm";
import { CommandImageForm } from "components/forms/commandImage/CommandImageForm";
import CommandReportForm from "components/forms/commandReport/CommandReportForm";
import { CustomServiceForm } from "components/forms/customService/CustomServiceForm";
import { ExtraServiceForm } from "components/forms/extraService/ExtraServiceForm";
import Loader from "components/loader/Loader";
import CommandStatus from "components/status/CommandStatus";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import { commandDetails } from "config/translations.config";
import dayjs from "dayjs";
import useMakeInvoices from "hooks/useMakeInvoices";
import { useModal } from "hooks/useModal";
import _ from "lodash";

import {
    useDeleteIRI,
    useGetIRI,
    useGetOneData,
    usePutData,
} from "queryHooks/useCommand";
import { useGetIRI as getCustomer } from "queryHooks/useCustomer";
import { useGetIRI as getProperty } from "queryHooks/useProperty";
import { useGetIRI as getTrustee } from "queryHooks/useTrustee";
import { useEffect } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import {
    IoIosAddCircleOutline,
    IoIosCheckmarkCircleOutline,
    IoIosCloseCircle,
} from "react-icons/io";
import { LuLink2, LuSettings2 } from "react-icons/lu";
import { MdArrowBack, MdWarning } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";

export const CommandPage = ({
    title,
    isModalContent = false,
    commandIRI = null,
}) => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { id } = useParams();
    const { data: dataIRI, isLoading: isLoadingIRI } = useGetIRI(
        commandIRI ? commandIRI : null
    );
    const { data: dataID, isLoading: isLoadingID } = useGetOneData(
        commandIRI ? null : id
    );
    const { mutate: putData } = usePutData();

    const data = dataID || dataIRI;

    const { data: property, isLoading: isLoadingProperty } = getProperty(
        data && data.property ? data.property["@id"] || data.property : null
    );
    const { data: trustee, isLoading: isLoadingTrustee } = getTrustee(
        data && data.trustee ? data.trustee["@id"] || data.trustee : null
    );
    const {
        data: customer,
        isLoading: isLoadingCustomer,
        error: errorCustomer,
        isSuccess: isSuccessCustomer,
        isFetched,
        fetchStatus,
    } = getCustomer(
        data && data.customer ? data.customer["@id"] || data.customer : null
    );

    const { setCommands, isLoading: isLoadingMakeInvoices } = useMakeInvoices();

    const CommandInfos = ({ details = false, customServiceIRI }) => {
        const infos = details ? details : data.details;

        return (
            <div className="_card">
                {customServiceIRI && (
                    <div className="absolute top-2 right-1">
                        <Dropdown>
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "Modifier",
                                        content: (
                                            <CustomServiceForm
                                                iri={data["@id"]}
                                                propertyIRI={data.property}
                                                handleCloseModal={
                                                    handleCloseModal
                                                }
                                            />
                                        ),
                                    })
                                }
                            >
                                <LuSettings2 size={30} />
                                Modifier
                            </button>
                            <button onClick={() => deleteData(data.id)}>
                                <IoIosCloseCircle size={30} />
                                Retirer la prestation
                            </button>
                        </Dropdown>
                    </div>
                )}
                <div className="flex flex-col gap-3 mt-3">
                    <div className="mr-auto text-white bg-success text-sm px-3 py-1 rounded-full">
                        Infos gravure
                    </div>
                    <div className="" key={uuid()}>
                        <div>
                            <span className="text-accent">
                                Nouvel occupant :
                            </span>
                            <span>{" " + infos.nouveloccupant}</span>
                        </div>
                    </div>

                    {Object.keys(infos)
                        .filter(
                            (f) =>
                                f !== "entrance" &&
                                f !== "nouveloccupant" &&
                                f !== "ancienoccupant" &&
                                f !== "proprietaire" &&
                                f !== "orderTags"
                        )
                        .map((key) => (
                            <div className="" key={uuid()}>
                                <div>
                                    <span className="text-accent">
                                        {commandDetails[key]} :
                                    </span>
                                    <span
                                        className={`${
                                            !infos[key] && "text-warning"
                                        }`}
                                    >
                                        {infos[key]
                                            ? " " + infos[key]
                                            : " info manquante"}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        );
    };

    if (!commandIRI && isLoadingID) return <Loader />;
    if (commandIRI && isLoadingIRI) return <Loader />;

    if (
        (data.property && isLoadingProperty) ||
        (data.trustee && isLoadingTrustee) ||
        (data.customer && isLoadingCustomer)
    )
        return <Loader />;
    if (isLoadingMakeInvoices) return <Loader text="Enregistrement en cours" />;

    return (
        <>
            <Modal />
            {!isModalContent && (
                <Header
                    title={title + data.id}
                    subtitle={
                        data.details.orderTags &&
                        Object.keys(data.details.orderTags).map(
                            (orderTag) =>
                                " " +
                                orderTag +
                                " : " +
                                (data.details.orderTags[orderTag]
                                    ? data.details.orderTags[orderTag]
                                    : "non renseigné")
                        )
                    }
                >
                    <Dropdown type="button">
                        {data.status === "DEFAULT - à traiter" && (
                            <button
                                disabled={
                                    data.status === "annulé" || data.isHanging
                                }
                                onClick={() =>
                                    putData({
                                        id: data.id,
                                        status: "DEFAULT - préparé",
                                        madeAt: dayjs(),
                                    })
                                }
                            >
                                <IoIosCheckmarkCircleOutline size={30} />
                                Valider la préparation
                            </button>
                        )}
                        {data.status === "DEFAULT - préparé" && (
                            <button
                                disabled={
                                    data.status === "annulé" || data.isHanging
                                }
                                onClick={() =>
                                    putData({
                                        id: data.id,
                                        status: "DEFAULT - posé",
                                        deliveredAt: dayjs(),
                                    })
                                }
                            >
                                <IoIosCheckmarkCircleOutline size={30} />
                                Valider la pose
                            </button>
                        )}
                        {!data.invoice && (
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "édition de la commande",
                                        content: (
                                            <CommandForm
                                                id={data.id}
                                                handleCloseModal={
                                                    handleCloseModal
                                                }
                                            />
                                        ),
                                    })
                                }
                            >
                                <LuSettings2 size={30} />
                                Modifier la commande
                            </button>
                        )}
                        {data.trackingEmail && (
                            <a
                                href={data.trackingEmail}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <LuLink2 size={30} />
                                Email
                            </a>
                        )}
                        {!data.invoice && (
                            <button
                                disabled={
                                    data.status === "annulé" || data.isHanging
                                }
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
                        <button
                            className="w-52"
                            disabled={
                                data.status === "annulé" || data.isHanging
                            }
                            onClick={() =>
                                handleOpenModal({
                                    title: "Ajouter des visuels",
                                    content: (
                                        <CommandImageForm
                                            commandID={data.id}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            <IoIosAddCircleOutline size={30} />
                            Ajout de visuels
                        </button>
                        {!data.invoice && data.status === "DEFAULT - posé" && (
                            <button onClick={() => setCommands([data])}>
                                <BsPiggyBank size={26} />
                                Facturer la commande
                            </button>
                        )}
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "Incident",
                                    content: (
                                        <CommandReportForm
                                            commandIRI={data["@id"]}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            <MdWarning size={30} />
                            Signaler un incident
                        </button>
                        {!data.invoice && (
                            <button
                                onClick={() =>
                                    handleOpenModal({
                                        title: "Suppression",
                                        size: "small",
                                        content: (
                                            <DeleteForm
                                                handleCloseModal={
                                                    handleCloseModal
                                                }
                                                iri={data["@id"]}
                                            />
                                        ),
                                    })
                                }
                            >
                                <IoIosCloseCircle size={30} />
                                Supprimer
                            </button>
                        )}
                    </Dropdown>

                    {_.isEmpty(previousPageState && !isModalContent) ? (
                        <Button
                            size={ButtonSize.Big}
                            onClick={() => navigate(-1)}
                        >
                            <MdArrowBack />
                        </Button>
                    ) : (
                        <Button
                            size={ButtonSize.Big}
                            onClick={() =>
                                navigate("/commands", {
                                    state: previousPageState,
                                })
                            }
                        >
                            <MdArrowBack />
                        </Button>
                    )}
                </Header>
            )}

            <Content isModalContent={isModalContent}>
                <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
                    {data.customer && (
                        <>
                            {!customer ? (
                                <Loader />
                            ) : (
                                <div
                                    tabIndex={1}
                                    className="md:col-start-1 md:col-end-5"
                                >
                                    <div
                                        tabIndex={1}
                                        className="collapse collapse-arrow rounded bg-dark/10 dark:bg-gradient-page min-h-[156px]"
                                    >
                                        <div className="title !mt-0">
                                            Client
                                        </div>
                                        <div className="subtitle flex items-center gap-1">
                                            {customer.title}
                                        </div>
                                    </div>

                                    <div className="collapse-content leading-8">
                                        <p>{customer.address}</p>
                                        <p>
                                            {customer.postcode} {customer.city}
                                        </p>
                                        <p>Email : {customer.email}</p>
                                        <p>
                                            Facturation :{" "}
                                            {customer.billingEmail}
                                        </p>
                                        <p>Tél. : {customer.phone}</p>
                                        {customer.mobile && (
                                            <p>Mobile : {customer.mobile}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {data.trustee && (
                        <>
                            {!trustee ? (
                                <Loader />
                            ) : (
                                <div
                                    tabIndex={1}
                                    className="md:col-start-1 md:col-end-5"
                                >
                                    <div
                                        tabIndex={1}
                                        className="collapse collapse-arrow rounded bg-dark/10 dark:bg-gradient-page min-h-[156px]"
                                    >
                                        <div className="collapse-title">
                                            <div className="title !mb-5">
                                                Syndic
                                            </div>
                                            <div className="subtitle flex items-center gap-1">
                                                {trustee.title}
                                                <GoDotFill
                                                    size={20}
                                                    color={trustee.color}
                                                />
                                                <GoDotFill
                                                    size={20}
                                                    color={trustee.color2}
                                                />
                                            </div>
                                        </div>

                                        <div className="collapse-content leading-8 text-dark dark:text-white">
                                            <p>{trustee.address}</p>
                                            <p>
                                                {trustee.postcode}{" "}
                                                {trustee.city}
                                            </p>
                                            <p>Email : {trustee.email}</p>
                                            <p>
                                                Facturation :{" "}
                                                {trustee.billingEmail}
                                            </p>
                                            <p>Tél. : {trustee.phone}</p>
                                            {trustee.mobile && (
                                                <p>Mobile : {trustee.mobile}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {data.property && (
                        <>
                            {!property ? (
                                <Loader />
                            ) : (
                                <div
                                    tabIndex={1}
                                    className="md:col-start-5 md:col-end-9 "
                                >
                                    <div
                                        tabIndex={1}
                                        className="collapse collapse-arrow rounded bg-dark/10 dark:bg-gradient-page min-h-[156px]"
                                    >
                                        <div className="collapse-title">
                                            <div className="title !mb-5">
                                                Copropriété
                                            </div>
                                            <div className="subtitle">
                                                {property.title}
                                            </div>
                                        </div>
                                        <div className="collapse-content leading-8 text-dark dark:text-white">
                                            <p>{property.address}</p>
                                            <p>
                                                {property.postcode}{" "}
                                                {property.city}
                                            </p>
                                            {property.contactName && (
                                                <p>
                                                    Contact :{" "}
                                                    {property.contactName}
                                                </p>
                                            )}
                                            {property.contactPhone && (
                                                <p>
                                                    Tél :{" "}
                                                    {property.contactPhone}
                                                </p>
                                            )}
                                            {property.accesses.length !== 0 && (
                                                <div className="_card">
                                                    <div className="subtitle">
                                                        Accès
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {property.accesses?.map(
                                                            (access) => (
                                                                <div
                                                                    key={uuid()}
                                                                    className="border border-white/20 rounded p-2"
                                                                >
                                                                    {access}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div className="col-start-10 col-end-13 flex flex-col gap-3">
                        <div className="rounded flex flex-col bg-dark/10 dark:bg-gradient-page p-3">
                            <div className="flex justify-between text-dark dark:text-white">
                                <div className="">Status</div>
                                <CommandStatus
                                    status={data.status}
                                    isHanging={data.isHanging}
                                    date={data.createdAt}
                                />
                            </div>
                        </div>
                        <div className="rounded flex flex-col bg-dark/10 dark:bg-gradient-page p-3 text-dark dark:text-white">
                            <div className="flex justify-between">
                                <div>Création :</div>
                                <div>
                                    {dayjs(data.createdAt).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Préparation :</div>
                                <div>
                                    {data.madeAt
                                        ? dayjs(data.madeAt).format(
                                              "DD/MM/YYYY"
                                          )
                                        : "....."}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Pose :</div>
                                <div>
                                    {data.deliveredAt
                                        ? dayjs(data.deliveredAt).format(
                                              "DD/MM/YYYY"
                                          )
                                        : "....."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {data.isCustom && (
                    <section className="!text-error !flex-row items-center gap-3">
                        <MdWarning size={32} />
                        Commande non standard
                    </section>
                )}

                {data.isHanging && (
                    <section className="">
                        <div className="section-title decoration-warning">
                            Infos manquantes
                        </div>
                        <div className="cards-container">
                            {data.entrance === "" && (
                                <div className="_card">Entrée (pose)</div>
                            )}
                            {Object.entries(data.details).map(
                                ([key, value]) => {
                                    if (
                                        key !== "ancienoccupant" &&
                                        key !== "nouveloccupant" &&
                                        key !== "proprietaire" &&
                                        key !== "orderTags" &&
                                        value === ""
                                    ) {
                                        return (
                                            <div className="_card" key={uuid()}>
                                                {commandDetails[key]}
                                            </div>
                                        );
                                    }
                                    return null;
                                }
                            )}
                            {data.details &&
                                data.details.orderTags &&
                                Object.entries(data.details.orderTags).map(
                                    ([key, value]) => {
                                        if (value === "") {
                                            return (
                                                <div
                                                    className="_card"
                                                    key={uuid()}
                                                >
                                                    {key}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }
                                )}
                        </div>
                    </section>
                )}

                {data.reports.length !== 0 && (
                    <section className="">
                        <div className="section-title decoration-error">
                            Incidents
                        </div>
                        <div className="cards-container">
                            {data.reports?.map((report) => (
                                <CardReport iri={report} key={uuid()} />
                            ))}
                        </div>
                    </section>
                )}

                {data.commentMake && (
                    <section>
                        <div className="section-title">
                            Commentaire fabrication
                        </div>

                        <div>{data.commentMake}</div>
                    </section>
                )}

                {data.commentDeliver && (
                    <section>
                        <div className="section-title">Commentaire pose</div>

                        <div>{data.commentDeliver}</div>
                    </section>
                )}

                {data.contractorEmail && (
                    <section>
                        <div className="section-title">Donneur d'ordre</div>

                        <div>{data.contractorEmail}</div>
                    </section>
                )}

                <section>
                    <div className="section-title">Préparation</div>

                    {!data.isCustom && (
                        <CardsContainer aside={<CommandInfos />}>
                            {property.services?.map((service) => (
                                <CardService
                                    key={uuid()}
                                    iri={service}
                                    editable={false}
                                />
                            ))}
                        </CardsContainer>
                    )}

                    {data.isCustom &&
                        data.customServices.length !== 0 &&
                        data.customServices?.map((customService) => (
                            <CardsContainer
                                key={uuid()}
                                className="border-t border-gray-800 pt-8 mt-3"
                                aside={
                                    <CommandInfos
                                        details={customService.details}
                                        customServiceIRI={customService["@id"]}
                                    />
                                }
                            >
                                {customService.propertyServices.map(
                                    (service) => (
                                        <CardService
                                            key={uuid()}
                                            iri={service}
                                            editable={false}
                                        />
                                    )
                                )}
                            </CardsContainer>
                        ))}
                </section>

                {data.extraServices.length !== 0 && (
                    <section>
                        <div className="title">Prestations complémentaires</div>

                        <div className="cards-container">
                            {data.extraServices?.map((extraService) => (
                                <CardExtraService
                                    key={uuid()}
                                    iri={extraService["@id"]}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <div className="title w-full">Pose</div>
                    <div className="cards-container">
                        <div className="_card">
                            <div className="subtitle">Secteur</div>
                            {property && property.zone}
                            {customer && customer.zone}
                        </div>
                        <div className="_card">
                            <div className="subtitle">Adresse</div>
                            <div>
                                {property && property.address}
                                {customer && customer.address}
                            </div>
                            <div>
                                {property &&
                                    property.postcode + " " + property.city}
                                {customer &&
                                    customer.postcode + " " + customer.city}
                            </div>
                        </div>
                        {property && (
                            <>
                                <div className="_card">
                                    <div className="subtitle">Contact</div>
                                    <div>
                                        {property && property.contactName}
                                    </div>
                                    <div>
                                        {property && property.contactPhone}
                                    </div>
                                </div>

                                {property.accesses.length !== 0 && (
                                    <div className="_card">
                                        <div className="subtitle">Accès</div>
                                        <div className="flex gap-3">
                                            {property.accesses?.map(
                                                (access) => (
                                                    <div
                                                        key={uuid()}
                                                        className="border border-white/20 rounded p-2"
                                                    >
                                                        {access}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                                {data.details.ancienoccupant && (
                                    <div className="_card">
                                        <div className="subtitle">
                                            Ancien occupant
                                        </div>
                                        {data.details.ancienoccupant}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {data.images.length !== 0 && (
                    <section>
                        <div className="title">Visuels</div>

                        <div className="cards-container">
                            {data.images.map((iri) => (
                                <CardImage key={uuid()} iri={iri} />
                            ))}
                        </div>
                    </section>
                )}
            </Content>
        </>
    );
};

const DeleteForm = ({ iri, handleCloseModal }) => {
    const {
        mutate: remove,
        isLoading: isRemovePending,
        isSuccess: isRemoveSuccess,
    } = useDeleteIRI();

    const navigate = useNavigate();

    const handleValidate = () => {
        remove(iri);
    };

    useEffect(() => {
        if (isRemoveSuccess) navigate(-1);
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
