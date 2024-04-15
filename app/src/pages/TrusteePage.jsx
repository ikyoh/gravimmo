import { Button, ButtonSize } from "components/button/Button";
import CardsContainer from "components/cards/cardsContainer/CardsContainer";
import { CardContact } from "components/cards/contact/CardContact";
import { CardProperty } from "components/cards/property/CardProperty";
import Dropdown from "components/dropdown/Dropdown";
import ContactForm from "components/forms/contact/ContactForm";
import PropertyForm from "components/forms/property/PropertyForm";
import Loader from "components/loader/Loader";
import Content from "components/templates/content/Content";
import Header from "components/templates/header/Header";
import { useModal } from "hooks/useModal";
import { useGetID } from "queryHooks/useTrustee";
import { MdArrowBack } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TrusteeForm from "../components/forms/trustee/TrusteeForm";

export const TrusteePage = () => {
    const navigate = useNavigate();
    const { state: previousPageState } = useLocation();
    const { Modal, handleOpenModal, handleCloseModal } = useModal();

    const { id } = useParams();
    const { data, isLoading, error } = useGetID(id);

    if (isLoading) return <Loader />;
    else
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
                                    title: "modifier le syndic",
                                    content: (
                                        <TrusteeForm
                                            id={data.id}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            Modifier le syndic
                        </button>
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "nouveau contact",
                                    content: (
                                        <ContactForm
                                            trusteeIRI={data["@id"]}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            Ajouter un contact
                        </button>
                        <button
                            onClick={() =>
                                handleOpenModal({
                                    title: "Nouvelle copropriété",
                                    content: (
                                        <PropertyForm
                                            trusteeIRI={data["@id"]}
                                            handleCloseModal={handleCloseModal}
                                        />
                                    ),
                                })
                            }
                        >
                            Ajouter une copropriété
                        </button>
                    </Dropdown>
                    <Button
                        size={ButtonSize.Big}
                        onClick={() =>
                            navigate("/trustees", { state: previousPageState })
                        }
                    >
                        <MdArrowBack />
                    </Button>
                </Header>
                <Content>
                    <section>
                        <div className="title">informations</div>
                        <CardsContainer cols={6}>
                            <div className="_card">
                                <div className="subtitle">Couleurs</div>
                                <div className="flex gap-3">
                                    <div
                                        className="rounded-full h-5 w-5"
                                        style={{ backgroundColor: data.color }}
                                    ></div>
                                    <div
                                        className="rounded-full h-5 w-5"
                                        style={{ backgroundColor: data.color2 }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="_card">
                                    <div className="subtitle">Adresse</div>
                                    {data.address} - {data.postcode} -{" "}
                                    {data.city}
                                </div>
                            </div>
                            <div className="_card">
                                <div className="subtitle">Téléphone</div>
                                {data.phone}
                            </div>
                            {data.mobile && (
                                <div className="_card">
                                    <div className="subtitle">Mobile</div>
                                    {data.mobile}
                                </div>
                            )}
                            <div className="_card">
                                <div className="subtitle">Email</div>
                                {data.email}
                            </div>
                            <div className="_card">
                                <div className="subtitle">
                                    Email de facturation
                                </div>
                                {data.billingEmail}
                            </div>
                        </CardsContainer>
                    </section>
                    <section>
                        <div className="flex items-center gap-6">
                            <div className="title">contacts</div>
                            <div className="chat chat-start">
                                <div className="chat-bubble text-sm pt-3">
                                    {data.contacts.length}
                                </div>
                            </div>
                        </div>
                        <CardsContainer>
                            {data.contacts.map((iri) => (
                                <CardContact
                                    handleOpenModal={handleOpenModal}
                                    handleCloseModal={handleCloseModal}
                                    key={iri}
                                    iri={iri}
                                    trustee={data["@id"]}
                                />
                            ))}
                        </CardsContainer>
                    </section>
                    <section>
                        <div className="flex items-center gap-6">
                            <div className="title">copropriétés</div>
                            <div className="chat chat-start">
                                <div className="chat-bubble text-sm pt-3">
                                    {data.properties.length}
                                </div>
                            </div>
                        </div>
                        <CardsContainer cols={4}>
                            {data.properties?.map((iri) => (
                                <CardProperty
                                    handleOpenModal={handleOpenModal}
                                    handleCloseModal={handleCloseModal}
                                    key={iri}
                                    iri={iri}
                                />
                            ))}
                        </CardsContainer>
                    </section>
                </Content>
            </>
        );
};
