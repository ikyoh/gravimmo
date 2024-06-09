import { Button, ButtonSize } from "components/button/Button";
import { CardContact } from "components/cards/contact/CardContact";
import { CardService } from "components/cards/service/CardService";
import Dropdown from "components/dropdown/Dropdown";
import PropertyForm from "components/forms/property/PropertyForm";
import PropertyContactForm from "components/forms/propertyContact/PropertyContactForm";
import PropertyServiceForm from "components/forms/propertyService/PropertyServiceForm";
import Loader from "components/loader/Loader";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import { commandDetails } from "config/translations.config";
import useMakeLetterboxes from "hooks/useMakeLetterboxes";
import { useModal } from "hooks/useModal";
import _ from "lodash";
import { usePostData as PostLetterbox } from "queryHooks/useLetterbox";
import { useGetOneData } from "queryHooks/useProperty";
import { IoIosAddCircleOutline, IoIosGrid } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { MdArrowBack, MdGroups } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";

export const PropertyPage = () => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();
    const { id } = useParams();
    const { data, isLoading, error } = useGetOneData(id);

    if (!data && isLoading) return <Loader />;
    return (
        <>
            <Modal />
            <Header
                title={data.title}
                isLoading={isLoading}
                error={error}
                subtitle={data.reference}
            >
                <Dropdown type="button">
                    <button
                        onClick={() =>
                            handleOpenModal({
                                title: "Modifier la copropriété",
                                content: (
                                    <PropertyForm
                                        id={data.id}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <LuSettings2 size={30} />
                        Modifier la copropriété
                    </button>
                    <button
                        onClick={() =>
                            handleOpenModal({
                                title: "Gérer les contacts",
                                content: (
                                    <PropertyContactForm
                                        iri={data["@id"]}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <MdGroups size={30} />
                        Gérer les contacts
                    </button>
                    <button
                        onClick={() =>
                            handleOpenModal({
                                title: "Ajouter une prestation",
                                content: (
                                    <PropertyServiceForm
                                        propertyIRI={data["@id"]}
                                        handleCloseModal={handleCloseModal}
                                    />
                                ),
                            })
                        }
                    >
                        <IoIosAddCircleOutline size={30} />
                        Ajouter une prestation
                    </button>
                    {data.letterboxes.length === 0 && (
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    size: "small",
                                    title: "Créer un tableau BAL",
                                    content: (
                                        <LetterboxForm
                                            iri={data["@id"]}
                                            handleCloseModal={handleCloseModal}
                                            entrances={data.entrances}
                                        />
                                    ),
                                })
                            }
                        >
                            <IoIosGrid size={30} />
                            Créer un tableau BAL
                        </button>
                    )}

                    {data.letterboxes.length !== 0 && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/letterboxes/" + data.letterboxes[0].id
                                )
                            }
                        >
                            <IoIosGrid size={30} />
                            Voir le tableau BAL
                        </button>
                    )}
                </Dropdown>
                {_.isEmpty(previousPageState) ? (
                    <Button size={ButtonSize.Big} onClick={() => navigate(-1)}>
                        <MdArrowBack />
                    </Button>
                ) : (
                    <Button
                        size={ButtonSize.Big}
                        onClick={() =>
                            navigate("/properties", {
                                state: previousPageState,
                            })
                        }
                    >
                        <MdArrowBack />
                    </Button>
                )}
            </Header>
            <Content>
                <section>
                    <div className="section-title">informations</div>
                    <div className="cards-container">
                        <div className="_card">
                            <div className="subtitle">Syndic</div>
                            <div>{data.trustee.title}</div>
                            <div>
                                {data.trustee.postcode} - {data.trustee.city}
                            </div>
                        </div>
                        <div className="_card">
                            <div className="subtitle">Secteur</div>
                            {data.zone}
                        </div>
                        <div className="_card">
                            <div className="subtitle">Adresse</div>
                            <div>{data.address}</div>
                            <div>
                                {data.postcode} - {data.city}
                            </div>
                        </div>
                        <div className="_card">
                            <div className="subtitle">Contact</div>
                            <div>{data.contactName}</div>
                            <div>{data.contactPhone}</div>
                        </div>
                        <div className="_card">
                            <div className="subtitle">TVA</div>
                            {data.tva} %
                        </div>
                        {data.digicode && (
                            <div className="_card">
                                <div className="subtitle">Accès Digicode</div>
                                {data.digicode}
                            </div>
                        )}
                        {data.vigik && (
                            <div className="_card">
                                <div className="subtitle">Accès Vigik</div>
                                {data.vigik}
                            </div>
                        )}
                        {data.transmitter && (
                            <div className="_card">
                                <div className="subtitle">Accès Emetteur</div>
                                {data.transmitter}
                            </div>
                        )}
                        {data.accesses.length !== 0 && (
                            <div className="_card">
                                <div className="subtitle">Autres accès</div>
                                <div className="flex gap-3 flex-wrap">
                                    {data.accesses?.sort().map((access) => (
                                        <div
                                            key={uuid()}
                                            className="border border-white/20 rounded p-2"
                                        >
                                            {access}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.entrances.length !== 0 && (
                            <div className="_card">
                                <div className="subtitle">Entrées</div>
                                <div className="flex gap-3 flex-wrap">
                                    {data.entrances?.sort().map((entrance) => (
                                        <div
                                            key={uuid()}
                                            className="border border-white/20 rounded p-2"
                                        >
                                            {entrance}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="_card">
                            <div className="subtitle">Configuration</div>
                            <div className="flex flex-wrap gap-3">
                                {data.params.sort().map((p) => (
                                    <div
                                        key={uuid()}
                                        className="border border-white/20 rounded p-2"
                                    >
                                        {commandDetails[p]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-6">
                        <div className="title">contacts syndic</div>
                        <div className="chat chat-start">
                            <div className="chat-bubble text-sm pt-3">
                                {data.contacts.length}
                            </div>
                        </div>
                    </div>
                    <div className="cards-container">
                        {data.contacts.map((iri) => (
                            <CardContact
                                handleOpenModal={handleOpenModal}
                                handleCloseModal={handleCloseModal}
                                key={iri}
                                iri={iri}
                                property={data["@id"]}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-6">
                        <div className="title">prestations</div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">
                                {data.services.length}
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "Ajouter une prestation",
                                    content: (
                                        <PropertyServiceForm
                                            propertyIRI={data["@id"]}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            <IoIosAddCircleOutline size={50} />
                        </button>
                    </div>
                    <div className="cards-container">
                        {data.services.sort().map((iri) => (
                            <CardService
                                handleOpenModal={handleOpenModal}
                                handleCloseModal={handleCloseModal}
                                key={iri}
                                iri={iri}
                            />
                        ))}
                    </div>
                </section>
            </Content>
        </>
    );
};

const LetterboxForm = ({ iri, entrances, handleCloseModal }) => {
    const { isPending, setData } = useMakeLetterboxes();
    const { mutate, isLoading } = PostLetterbox();

    const handleValidate = () => {
        if (entrances.length === 0)
            mutate({
                property: iri,
                content: [],
                columns: 1,
                entrance: null,
            });
        else setData({ entrances: entrances, propertyIRI: iri });
    };

    return (
        <div className="py-5">
            <p>
                Attention cette opération est irréversible, voulez-vous
                confirmer cette action ?
            </p>
            <div className="flex items-center gap-5 justify-start py-5">
                <button
                    className="btn btn-outline"
                    onClick={() => handleCloseModal()}
                >
                    Annuler
                </button>
                <button
                    className="btn btn-error text-white"
                    onClick={() => handleValidate()}
                    disabled={isPending || isLoading}
                >
                    Confirmer
                </button>
            </div>
        </div>
    );
};
