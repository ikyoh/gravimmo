import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import { useGetOneData, usePutData } from 'queryHooks/useOrder'
import { useGetIRI as getProperty } from 'queryHooks/useProperty'
import { useGetIRI as getTrustee } from 'queryHooks/useTrustee'
import { MdArrowBack } from 'react-icons/md'
import Dropdown from 'components/dropdown/Dropdown'
import { useModal } from 'hooks/useModal'
import { orderDetails } from 'config/translations.config'
import OrderStatus from 'components/status/OrderStatus'
import dayjs from "dayjs"
import { GoPrimitiveDot } from 'react-icons/go'
import uuid from "react-uuid"
import _ from "lodash"
import './style.css'
import Loader from "components/loader/Loader"
import { CardProduction } from "components/cards/production/CardProduction"
import { CardExtraService } from "components/cards/extraService/CardExtraService"
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoMdAddCircleOutline, IoIosCheckmarkCircleOutline } from "react-icons/io"
import { OrderServiceForm } from "components/forms/OrderService/OrderServiceForm"
import { OrderDropdown } from "components/dropdown/contents/OrderDropdown"


export const OrderPage = ({ title }) => {

	const navigate = useNavigate();
	const { state: previousPageState } = useLocation();
	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { id } = useParams()
	const { data = {}, isLoading, error } = useGetOneData(id)
	const { mutate: putData } = usePutData()
	const { data: property, isLoading: isLoadingProperty, error: errorProperty } = getProperty(data.property || null)
	const { data: trustee, isLoading: isLoadingTrustee, error: errorTrustee } = getTrustee(data.trustee || null)

	console.log('data', data)

	const handleRemoveService = (iri) => {
		const submitDatas = { ...data }
		submitDatas.services = data.services.filter(serviceIRI => serviceIRI != iri)
		putData(submitDatas)
	}

	if (isLoading || isLoadingProperty || isLoadingTrustee) return (<Loader />)
	else return (
		<>
			<Modal />
			<Header title={title + data.id} isLoading={isLoading} error={error}>

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
						onClick={() => navigate("/orders", { state: previousPageState })}
					>
						<MdArrowBack />
					</Button>
				}
			</Header>

			<Content>
				<Modal />
				<div className="flex flex-col mt-3">
					<div className="flex flex-col-reverse md:flex-row gap-3 content-start items-start">
						{!trustee ? <Loader />
							:
							<div tabIndex={0} className="md:w-2/6 w-full collapse collapse-arrow card">
								<div className="collapse-title">
									<div className="title !mt-0">
										Syndic
									</div>
									<div className='subtitle flex items-center gap-1'>
										{trustee.title}
										<GoPrimitiveDot size={20} color={trustee.color} />
										<GoPrimitiveDot size={20} color={trustee.color2} />
									</div>
								</div>

								<div className="collapse-content leading-8">
									<p>{trustee.address}</p>
									<p>{trustee.postcode} {trustee.city}</p>
									<p>Email : {trustee.email}</p>
									<p>Facturation : {trustee.billingEmail}</p>
									<p>Tél. : {trustee.phone}</p>
									{trustee.mobile &&
										<p>Mobile : {trustee.mobile}</p>}
								</div>
							</div>
						}
						{!property ? <Loader />
							:
							<div tabIndex={1} className="md:w-2/6 w-full collapse collapse-arrow card">
								<div className="collapse-title">
									<div className="title !mt-0">
										Copropriété
									</div>
									<div className='subtitle'>
										{property.title}
									</div>
								</div>
								<div className="collapse-content leading-8">
									<p>{property.address}</p>
									<p>{property.postcode} {property.city}</p>
									{property.contactName &&
										<p>Contact : {property.contactName}</p>
									}
									{property.contactPhone &&
										<p>Tél : {property.contactPhone}</p>
									}
									{property.accessType &&
										<p>Accès : {property.accessType}</p>
									}
									{property.accessCode &&
										<p>Code : {property.accessCode}</p>
									}
								</div>
							</div>
						}
						<div className="card md:w-2/6 w-full flex flex-col gap-2 min-h-[145px]">
							<div className="flex justify-between">
								<div>Status</div>
								<OrderStatus status={data.status} isHanging={data.isHanging} date={data.createdAt} />
							</div>
							<div className="flex justify-between">
								<div>Création :</div>
								<div>{dayjs(data.createdAt).format('DD/MM/YYYY')}</div>
							</div>
							<div className="flex justify-between">
								<div>Préparation :</div>
								<div>{data.madeAt ? dayjs(data.madeAt).format('DD/MM/YYYY') : '.....'}</div>
							</div>
							<div className="flex justify-between">
								<div>Pose :</div>
								<div>{data.deliveredAt ? dayjs(data.deliveredAt).format('DD/MM/YYYY') : '.....'}</div>
							</div>
						</div>

						<div className="md:w-2/6 w-full grid grid-cols-2 gap-2 min-h-[145px]">

							<button className="btn btn-secondary h-full !flex gap-2 text-left justify-start"
								disabled={data.status === "annulé" || data.isHanging}
								onClick={() => handleOpenModal({ title: "Ajouter des prestations", content: <OrderServiceForm id={data.id} services={data.services} handleCloseModal={handleCloseModal} /> })}
							>
								<IoMdAddCircleOutline size={30} />
								Ajout de<br />prestations
							</button>

							{data.status === "à traiter" &&
								<button className="btn btn-primary h-full !flex gap-2 text-left justify-start"
									disabled={data.status === "annulé" || data.isHanging}
									onClick={() => putData({ id: data.id, status: 'préparé', madeAt: dayjs() })}
								>
									<IoIosCheckmarkCircleOutline size={30} />
									Valider la<br />préparation
								</button>
							}

							{data.status === "préparé" &&
								<button className="btn btn-primary h-full !flex gap-2 text-left justify-start"
									disabled={data.status === "annulé" || data.isHanging}
									onClick={() => putData({ id: data.id, status: 'posé', deliveredAt: dayjs() })}
								>
									<IoIosCheckmarkCircleOutline size={30} />
									Valider la<br />pose
								</button>
							}

							<button className="btn btn-secondary h-full !flex gap-2 text-left justify-start"
							disabled={data.status === "annulé" || data.isHanging}
							>
								<IoMdAddCircleOutline size={30} />
								Ajout de<br />visuels
							</button>

							<div className="dropdown w-full">
								<button tabIndex={0} className="btn btn-secondary h-full !flex w-full gap-2 text-left justify-start" disabled={data.status === "annulé"}>
									<BsThreeDotsVertical size={30} />
									Actions
								</button>
								<OrderDropdown orderID={data.id} status={data.status} isHanging={data.isHanging} />
							</div>




						</div>
					</div>

					<div className="title">
						Préparation
					</div>


					{property &&
						<div className="cards-container">
							{property.services.map(service =>
								<CardProduction key={uuid()} iri={service} />
							)}
						</div>
					}

					<div className="flex gap-3 mt-3">

						<div className="card" key={uuid()}>
							<div>
								<span className="text-accent">
									Nouvel occupant :
								</span>
								<span>
									{" " + data.details.nouveloccupant}
								</span>
							</div>
						</div>

						{Object.keys(data.details)
							.filter(f => f !== 'nouveloccupant' && f !== 'ancienoccupant' && f !== 'proprietaire')
							.map(key =>
								<div className="card" key={uuid()}>
									<div>
										<span className="text-accent">
											{orderDetails[key]} :
										</span>
										<span>
											{" " + data.details[key]}
										</span>
									</div>
								</div>
							)}
					</div>

					{data.services.length !== 0 &&
						<>
							<div className="title">
								Prestations complémentaires
							</div>

							<div className="cards-container">
								{data.services.map(iri =>
									<CardExtraService key={uuid()} iri={iri} handleRemoveService={handleRemoveService} />
								)}
							</div>
						</>
					}

					<div className="title">
						Pose
					</div>


					<div className="card flex flex-wrap flex-col md:flex-row gap-8">
						<div className="flex-1">
							<div className="subtitle">
								Secteur
							</div>
							{property.zone}
						</div>
						<div className="flex-1">
							<div className="subtitle">
								Adresse
							</div>
							<div>
								{property.address}
							</div>
							<div>
								{property.postcode} - {property.city}
							</div>
						</div>
						<div className="flex-1">
							<div className="subtitle">
								Contact
							</div>
							<div>
								{property.contactName}
							</div>
							<div>
								{property.contactPhone}
							</div>
						</div>
						<div className="flex-1">
							<div className="subtitle">
								Type d'accès
							</div>
							{property.accessType}
						</div>
						<div className="flex-1">
							<div className="subtitle">
								Code d'accès
							</div>
							{property.accessCode}
						</div>
						<div className="flex-1">
							<div className="subtitle">
								Ancien occupant
							</div>
							{data.details.ancienoccupant}
						</div>

					</div>


				</div>

			</Content>
		</>
	)
}





