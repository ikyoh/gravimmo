import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import { useGetOneData } from 'hooks/useProperty'
import { MdArrowBack } from 'react-icons/md'
import PropertyForm from "forms/property/PropertyForm"
import PropertyServiceForm from "forms/propertyService/PropertyServiceForm"
import { CardService } from "components/card/service/CardService"
import Dropdown from 'components/dropdown/Dropdown'
import _ from "lodash"
import './style.css'

export const PropertyPage = () => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const navigate = useNavigate();
		const { state: previousPageState } = useLocation();
		const { id } = useParams()
		const { data = [], isLoading, error } = useGetOneData(id)

		return (
			<>
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
										Secteur
									</div>
									{data.zone}
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
											<div className="bg-black/20 rounded p-3" key={p}>{p}</div>
										)}
									</div>
								</div>
								<div className="absolute top-2 right-1">
									<Dropdown>
										<div
											onClick={() => handleOpenModal({ title: "modifier la copropriété", content: <PropertyForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
											Modifier la copropriété
										</div>
									</Dropdown>
								</div>
							</div>
							<div className="title">
								Syndic
							</div>
							<div className="flex gap-3">
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
								{data.contact &&
									<div className="card">
										<div className="subtitle">
											Contact Syndic
										</div>
										<div>
											{data.contact.lastname} {data.contact.firstname}
										</div>
										<div>
											{data.contact.phone}
										</div>
										<div>
											{data.contact.email}
										</div>
									</div>
								}
							</div>
							<div className="title">
								prestations
							</div>
							<div className="cards-container">
								{data.services.map((iri) =>
									<CardService key={iri} id={iri} />
								)}
							</div>
							<div className="card-button">
								<Button size={ButtonSize.Big}
									onClick={() => handleOpenModal({ title: "Ajouter une prestation", content: <PropertyServiceForm propertyIRI={data['@id']} handleCloseModal={handleCloseModal} /> })}
								/>
								<div>
									ajouter <br /> une prestation
								</div>
							</div>
						</div>
					}
				</Content>
			</>
		)
	}

	return (
		<Layout>
			<PageContent />
		</Layout>

	)

}




