import { Button, ButtonSize } from "components/button/Button";
import CardsContainer from "components/cards/cardsContainer/CardsContainer";
import { CardExtraService } from "components/cards/extraService/CardExtraService";
import { CardImage } from "components/cards/image/CardImage";
import { CardProduction } from "components/cards/production/CardProduction";
import Dropdown from "components/dropdown/Dropdown";
import { CommandForm } from "components/forms/command/CommandForm";
import { CommandImageForm } from "components/forms/commandImage/CommandImageForm";
import { ExtraServiceForm } from "components/forms/extraService/ExtraServiceForm";
import Loader from "components/loader/Loader";
import CommandStatus from "components/status/CommandStatus";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import { commandDetails } from "config/translations.config";
import dayjs from "dayjs";
import { useModal } from "hooks/useModal";
import _ from "lodash";
import { useGetOneData, usePutData } from "queryHooks/useCommand";
import { useGetIRI as getCustomer } from "queryHooks/useCustomer";
import { useGetIRI as getProperty } from "queryHooks/useProperty";
import { useGetIRI as getTrustee } from "queryHooks/useTrustee";
import { BsPiggyBank } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import {
    IoIosAddCircleOutline,
    IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { LuLink2, LuSettings2 } from "react-icons/lu";
import { MdArrowBack, MdWarning } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";

import useMakeInvoices from "hooks/useMakeInvoices";

export const CommandPage = ({
    title,
    isModalContent = false,
    commandIRI = false,
}) => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    //const { id } = commandIRI ? commandIRI : useParams();
    const { id } = useParams();
    const { data, isLoading, error, isSuccess } = useGetOneData(id);
    // const { data, isLoading, error, isSuccess } = commandIRI
    //     ? useGetIRI(commandIRI)
    //     : useGetOneData(id);
    const { mutate: putData } = usePutData();
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

    const CommandInfos = ({ details = false }) => {
        const infos = details ? details : data.details;

        return (
            <div className="_card">
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
                                    <span>{" " + infos[key]}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        );
    };

    if (
        isLoading ||
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
                    isLoading={isLoading}
                    error={error}
                    subtitle={
                        data.details.orderTags &&
                        Object.keys(data.details.orderTags).map(
                            (orderTag) =>
                                " " +
                                orderTag +
                                " : " +
                                data.details.orderTags[orderTag] +
                                " "
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

            <Content>
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
                                        className="collapse collapse-arrow rounded dark:bg-gradient-page min-h-[156px]"
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
                                        className="collapse collapse-arrow rounded dark:bg-gradient-page min-h-[156px]"
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

                                        <div className="collapse-content leading-8">
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
                                    className="md:col-start-5 md:col-end-9"
                                >
                                    <div
                                        tabIndex={1}
                                        className="collapse collapse-arrow rounded dark:bg-gradient-page min-h-[156px]"
                                    >
                                        <div className="collapse-title">
                                            <div className="title !mb-5">
                                                Copropriété
                                            </div>
                                            <div className="subtitle">
                                                {property.title}
                                            </div>
                                        </div>
                                        <div className="collapse-content leading-8">
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
                        <div className="rounded flex flex-col dark:bg-gradient-page p-3">
                            <div className="flex justify-between">
                                <div>Status</div>
                                <CommandStatus
                                    status={data.status}
                                    isHanging={data.isHanging}
                                    date={data.createdAt}
                                />
                            </div>
                        </div>
                        <div className="rounded flex flex-col dark:bg-gradient-page p-3">
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

                {data.comment && (
                    <section>
                        <div className="section-title">Commentaire</div>

                        <div>{data.comment}</div>
                    </section>
                )}

                <section>
                    <div className="section-title">Préparation</div>

                    {!data.isCustom && (
                        <CardsContainer aside={<CommandInfos />}>
                            {property.services?.map((service) => (
                                <CardProduction key={uuid()} iri={service} />
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
                                    />
                                }
                            >
                                {customService.propertyServices.map(
                                    (service) => (
                                        <CardProduction
                                            key={uuid()}
                                            iri={service}
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