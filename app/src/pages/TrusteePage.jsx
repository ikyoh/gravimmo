import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import TrusteeForm from '../forms/trustee/TrusteeForm'
import { useGetOneData } from 'hooks/useTrustee'
import { MdClose } from 'react-icons/md'
import './style.css'

export const TrusteePage = () => {

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
						onClick={() => navigate("/trustees", { state: previousPageState })}
					>
						<MdClose />
					</Button>
				</Header>

				<Content>
					<div className="pl-2">
						<div className="title">
							coordonnées
						</div>
						{!isLoading &&
							<>

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
									<div className="card">
										<div className="subtitle">
											Email
										</div>
										{data.email}
									</div>
									<div className="card">
										<div className="subtitle">
											Email de facturation
										</div>
										{data.billingEmail}
									</div>
								</div>
								<div className="title">
									contacts
								</div>
								<div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
									{!isLoading && data.contacts.map(data =>
										<div className="card">
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
										</div>
									)}
								</div>
							</>
						}
						<div className="title">
							copropriétés
						</div>
						<div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
							{!isLoading && data.properties.map(data =>
								<div className="card">
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
								</div>
							)}
						</div>
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




