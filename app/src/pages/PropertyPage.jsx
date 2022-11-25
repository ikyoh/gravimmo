import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import TrusteeForm from '../forms/trustee/TrusteeForm'
import { useGetOneData } from 'hooks/useProperty'
import { MdClose } from 'react-icons/md'
import './style.css'

export const PropertyPage = () => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const navigate = useNavigate();
		const { state: previousPageState } = useLocation();
		const { id } = useParams()

		const { data = [], isLoading, error } = useGetOneData(id)

		console.log('data', data)

		return (
			<>
				<Header title={data.title} isLoading={isLoading} error={error}>
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate("/properties", { state: previousPageState })}
					>
						<MdClose />
					</Button>
				</Header>

				<Content>
					<div className="pl-2">
						{!isLoading &&
							<>
								<div className="title">
									informations
								</div>
								<div className="flex gap-3">
									<div className="card">
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
									<div className="card">
										<div className="subtitle">
											Secteur
										</div>
										{data.zone}
									</div>
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
									<div className="card">
										<div className="subtitle">
											Contact Copro
										</div>
										<div>
											{data.contactName}
										</div>
										<div>
											{data.contactPhone}
										</div>
									</div>
								</div>
								<div className="title">
									prestations
								</div>
								<div className="flex gap-3">
									<div className="card">
										<div>
											<div className="subtitle">
												Adresse
											</div>
											{data.address}
										</div>
										<div>
											{data.postcode} - {data.city}
										</div>
									</div>
									<div className="card">
										<div className="subtitle">
											Téléphone
										</div>
										{data.phone}
									</div>
									{data.mobile &&
										<div className="card">
											<div className="subtitle">
												Mobile
											</div>
											{data.mobile}
										</div>
									}
								</div>
							</>
						}
					</div>
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




