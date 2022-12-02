import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import TrusteeForm from '../forms/trustee/TrusteeForm'
import ContactForm from "forms/contact/ContactForm"
import PropertyForm from "forms/property/PropertyForm";
import { useGetOneData } from 'hooks/useTrustee'
import { useGetFilteredDatas as useGetFilteredDatasContact } from 'hooks/useContact'
import { useGetFilteredDatas as useGetFilteredDatasProprerty } from 'hooks/useProperty'
import { MdClose, MdArrowBack } from 'react-icons/md'
import Dropdown from 'components/dropdown/Dropdown'
import { API_URL, API_TRUSTEES } from "config/api.config"
import './style.css'

export const TrusteePage = () => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const navigate = useNavigate();
		const { state: previousPageState } = useLocation();
		const { id } = useParams()
		const { data = [], isLoading, error } = useGetOneData(id)
		const { data: dataContact = [], isLoading: isLoadingContact, error: errorContact } = useGetFilteredDatasContact('lastname', 'ASC', "trustee=" + API_URL + API_TRUSTEES + "/" + id)
		const { data: dataProperty = [], isLoading: isLoadingProperty, error: errorProperty } = useGetFilteredDatasProprerty('title', 'ASC', "trustee=" + API_URL + API_TRUSTEES + "/" + id)

		return (
			<>
				<Header title={data.title} isLoading={isLoading} error={error}>
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate("/trustees", { state: previousPageState })}
					>
						<MdArrowBack />
					</Button>
				</Header>

				<Content>
					{!isLoading &&
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
								<div className="absolute top-3 right-3">
									<Dropdown>
										<div
											onClick={() => handleOpenModal({ title: "modifier le syndic", content: <TrusteeForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
											Modifier le syndic
										</div>
									</Dropdown>
								</div>
							</div>
							<div className="title">
								contacts
							</div>
							<div className="cards-container">
								{!isLoadingContact && dataContact['hydra:member'].map(data =>
									<div className="card" key={data["@id"]}>
										<div className="subtitle">
											{data.firstname} {data.lastname}
										</div>
										<div>
											{data.email}
										</div>
										<div>
											{data.phone}
										</div>
										<div className="mt-3 text-sm">
											{data.title}
										</div>
										<div className="absolute top-3 right-3">
											<Dropdown>
												<div
													onClick={() => handleOpenModal({ title: "modifier le contact", content: <ContactForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
													Modifier le contact
												</div>
											</Dropdown>
										</div>
									</div>
								)}
								<div className="card-button">
									<Button size={ButtonSize.Big}
										onClick={() => handleOpenModal({ title: "nouveau contact", content: <ContactForm trustee={data['@id']} handleCloseModal={handleCloseModal} /> })}
									/>
									<div>
										ajouter <br /> un contact
									</div>
								</div>
							</div>
							<div className="title">
								copropriétés
							</div>
							<div className="cards-container">
								{!isLoadingProperty && dataProperty['hydra:member'].map(data =>
									<div className="card" key={data["@id"]}>
										<div className="subtitle">
											{data.title}
										</div>
										<div>
											{data.address}
										</div>
										<div>
											{data.postcode} - {data.city}
										</div>
										<div className="mt-3 text-sm">
											{data.zone}
										</div>
										<div className="absolute top-3 right-3">
											<Dropdown>
												<div
													onClick={() => navigate("/properties/" + data.id, { state: {} })}
												>
													Voir la fiche
												</div>
												<div
													onClick={() => handleOpenModal({ title: "modifier la copropriété", content: <PropertyForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
													Modifier la copropriété
												</div>
											</Dropdown>
										</div>
									</div>
								)}
								<div className="card-button">
									<Button size={ButtonSize.Big}
										onClick={() => handleOpenModal({ title: "Nouvelle copropriété", content: <PropertyForm trusteeIRI={data["@id"]} handleCloseModal={handleCloseModal} /> })}
									/>
									<div>
										ajouter <br /> une copropriété
									</div>
								</div>
							</div>
						</div>
					}
				</Content >
			</>
		)
	}

	return (
		<Layout>
			<PageContent />
		</Layout>

	)

}




