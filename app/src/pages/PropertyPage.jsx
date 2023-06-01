import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import { useGetOneData } from 'queryHooks/useProperty'
import { MdArrowBack } from 'react-icons/md'
import PropertyForm from "components/forms/property/PropertyForm"
import PropertyServiceForm from "components/forms/propertyService/PropertyServiceForm"
import PropertyContactForm from "components/forms/propertyContact/PropertyContactForm"
import { CardService } from "components/cards/service/CardService"
import { CardContact } from "components/cards/contact/CardContact"
import Dropdown from 'components/dropdown/Dropdown'
import { MdSettings } from 'react-icons/md'
import { orderDetails } from "config/translations.config"
import _ from "lodash"
import './style.css'
import { useModal } from 'hooks/useModal'


export const PropertyPage = () => {

	const navigate = useNavigate();
	const { state: previousPageState } = useLocation();
	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { id } = useParams()
	const { data = [], isLoading, error } = useGetOneData(id)

	console.log('data', data)

	return (
		<>
			<Modal />
			<Header title={data.title} isLoading={isLoading} error={error}>
				{_.isEmpty(previousPageState)
					?
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate(-1)}
					>
						<MdArrowBack />
					</Button>
					:
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate("/properties", { state: previousPageState })}
					>
						<MdArrowBack />
					</Button>
				}
			</Header>

			<Content>
				{!isLoading &&
					<div className="pl-2">
						<div className="title">
							informations
						</div>
						<div className="card flex flex-wrap flex-col md:flex-row gap-16">
							<div>
								<div className="subtitle">
									Secteur
								</div>
								{data.zone}
							</div>
							<div>
								<div className="subtitle">
									Adresse
								</div>
								<div>
									{data.address}
								</div>
								<div>
									{data.postcode} - {data.city}
								</div>
							</div>
							<div>
								<div className="subtitle">
									Contact
								</div>
								<div>
									{data.contactName}
								</div>
								<div>
									{data.contactPhone}
								</div>
							</div>
							<div>
								<div className="subtitle">
									TVA
								</div>
								{data.tva} %
							</div>
							<div>
								<div className="subtitle">
									Type d'accès
								</div>
								{data.accessType}
							</div>
							<div>
								<div className="subtitle">
									Code d'accès
								</div>
								{data.accessCode}
							</div>
							<div>
								<div className="subtitle">
									Eléments
								</div>
								<div className="flex flex-wrap gap-3">
									{data.params.map(p =>
										<div className="bg-black/20 rounded p-3" key={p}>{orderDetails[p]}</div>
									)}
								</div>
							</div>
							<div className="absolute top-2 right-1">
								<Dropdown>
									<button
										onClick={() => handleOpenModal({ title: "modifier la copropriété", content: <PropertyForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
										Modifier la copropriété
									</button>
								</Dropdown>
							</div>
						</div>
						<div className="title">
							Syndic
						</div>
						<div className="cards-container">
							<div className="card">
								<div className="subtitle">
									Syndic
								</div>
								<div>
									{data.trustee.title}
								</div>
								<div>
									{data.trustee.postcode} - {data.trustee.city}
								</div>
							</div>
							{data.contacts.map((iri) =>
								<CardContact handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} key={iri} iri={iri} property={data['@id']} />
							)}
							<div className="card-button">
								<Button size={ButtonSize.Big}
									onClick={() => handleOpenModal({ title: "Ajouter un contact", content: <PropertyContactForm iri={data['@id']} handleCloseModal={handleCloseModal} /> })}
								>
									<MdSettings />
								</Button>
								<div className="text-dark dark:text-white">
									gerer <br /> les contacts
								</div>
							</div>
						</div>
						<div className="title">
							prestations
						</div>
						<div className="cards-container">
							{data.services.map((iri) =>
								<CardService handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} key={iri} iri={iri} />
							)}
						</div>
						<div className="card-button">
							<Button size={ButtonSize.Big}
								onClick={() => handleOpenModal({ title: "Ajouter une prestation", content: <PropertyServiceForm propertyIRI={data['@id']} handleCloseModal={handleCloseModal} /> })}
							/>
							<div className="text-dark dark:text-white">
								ajouter <br /> une prestation
							</div>
						</div>
					</div>
				}
			</Content>
		</>
	)
}
