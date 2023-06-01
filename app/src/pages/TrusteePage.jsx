import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import TrusteeForm from '../components/forms/trustee/TrusteeForm'
import ContactForm from "components/forms/contact/ContactForm"
import PropertyForm from "components/forms/property/PropertyForm";
import { useGetOneData } from 'queryHooks/useTrustee'
import { MdClose, MdArrowBack } from 'react-icons/md'
import Dropdown from 'components/dropdown/Dropdown'
import { API_URL, API_TRUSTEES } from "config/api.config"
import { CardContact } from "components/cards/contact/CardContact"
import './style.css'
import { useModal } from 'hooks/useModal'
import { CardProperty } from "components/cards/property/CardProperty"
import Loader from "components/loader/Loader"

export const TrusteePage = () => {

	const navigate = useNavigate();
	const { state: previousPageState } = useLocation();
	const { Modal, handleOpenModal, handleCloseModal } = useModal()

	const { id } = useParams()
	const { data, isLoading, error } = useGetOneData(id)

	if (isLoading) return (<Loader />)
	else return (
			<>
				<Modal />
				<Header title={data.title} isLoading={isLoading} error={error}>
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate("/trustees", { state: previousPageState })}
					>
						<MdArrowBack />
					</Button>
				</Header>
				<Content>
					<div className="pl-2">
						<div className="title">
							informations
						</div>
						<div className="card flex flex-col md:flex-row gap-16">
							<div className="flex flex-col gap-3 items-center justify-center">
								<div className="rounded-full h-5 w-5" style={{ backgroundColor: data.color }}></div>
								<div className="rounded-full h-5 w-5" style={{ backgroundColor: data.color2 }}></div>
							</div>
							<div>
								<div>
									<div className="subtitle">
										Adresse
									</div>
									{data.address} - {data.postcode} - {data.city}
								</div>
							</div>
							<div>
								<div className="subtitle">
									Téléphone
								</div>
								{data.phone}
							</div>
							{data.mobile &&
								<div>
									<div className="subtitle">
										Mobile
									</div>
									{data.mobile}
								</div>
							}
							<div>
								<div className="subtitle">
									Email
								</div>
								{data.email}
							</div>
							<div>
								<div className="subtitle">
									Email de facturation
								</div>
								{data.billingEmail}
							</div>
							<Dropdown>
								<button
									onClick={() => handleOpenModal({ title: "modifier le syndic", content: <TrusteeForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
									Modifier le syndic
								</button>
							</Dropdown>
						</div>
						<div className="title">
							contacts
						</div>
						<div className="cards-container">
							{data.contacts.map((iri) =>
								<CardContact handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} key={iri} iri={iri} trustee={data['@id']} />
							)}
						</div>
						<div className="card-button">
							<Button size={ButtonSize.Big}
								onClick={() => handleOpenModal({ title: "nouveau contact", content: <ContactForm trusteeIRI={data["@id"]} handleCloseModal={handleCloseModal} /> })}
							/>
							<div>
								ajouter <br /> un contact
							</div>
						</div>
						<div className="title">
							copropriétés
						</div>
						<div className="cards-container">
							{data.properties?.map((iri) =>
								<CardProperty handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} key={iri} iri={iri} />
							)
							}

						</div>
						<div className="card-button">
							<Button size={ButtonSize.Big}
								onClick={() => handleOpenModal({ title: "Nouvelle copropriété", content: <PropertyForm trusteeIRI={data["@id"]} handleCloseModal={handleCloseModal} /> })}
							/>
							<div>
								ajouter <br /> une copropriété
							</div>
						</div>
					</div>

				</Content >
			</>
		)
}






