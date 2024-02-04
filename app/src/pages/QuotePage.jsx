import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import { useGetID, usePutData, usePostData } from 'queryHooks/useInvoice'
import { useGetAllDatas as useGetServices } from 'queryHooks/useService'
import Dropdown from 'components/dropdown/Dropdown'
import Loader from "components/loader/Loader"
import { useModal } from 'hooks/useModal'

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
import Form from "components/form/form/Form"
import { FormInput } from "components/form/input/FormInput"

import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'

import uuid from "react-uuid"
import { price, roundPrice } from "utils/functions.utils"
import dayjs from "dayjs"

import { MdArrowBack, MdOutlineAssignment, MdOutlineFileDownload } from 'react-icons/md'
import { LuSettings2 } from "react-icons/lu"
import { IoIosCloseCircle, IoIosAddCircleOutline, IoMdCheckmark, IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { IoReloadCircleOutline } from "react-icons/io5";
import { CommandPage } from "./CommandPage"

import { Dot } from 'components/dot/Dot'
import { statusColor } from 'config/translations.config'

import axios from 'axios'
import fileDownload from 'js-file-download'

import _ from "lodash"

export const QuotePage = ({ title }) => {

	const navigate = useNavigate();
	const { state: previousPageState } = useLocation();

	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { id } = useParams()

	const { data, isLoading, error, isSuccess } = useGetID(id)

	const { mutate: put, isLoading: isPutPending, isSuccess: isPutSuccess } = usePutData()

	const [invoiceData, setInvoiceData] = useState([])

	useEffect(() => {
		if (isSuccess) setInvoiceData(data)
	}, [isSuccess])

	const handleUpdateInvoice = () => {
		put(invoiceData)
	}

	const downloadFile = (id, chrono) => {
		console.log('chrono', chrono)
		axios({
			url: "/api/pdf/invoice/" + id,
			method: 'GET',
			responseType: 'blob'
		}).then((response) => {
			fileDownload(response.data, 'facture_'+chrono+'.pdf');
		});
	};

	const handleDeleteService = (index) => {
		let _content = invoiceData.content.slice(0, index).concat(invoiceData.content.slice(index + 1));
		const { amountHT, amountTTC } = calcAmounts(_content)
		console.log('amountHT', amountHT)
		console.log('amountTTC', amountTTC)
		handleCloseModal()
		setInvoiceData({ ...invoiceData, content: _content, amountHT: amountHT, amountTTC: amountTTC })
	}

	const handleUpdateService = (index, service) => {
		let _content = invoiceData.content
		_content[index] = service
		const { amountHT, amountTTC } = calcAmounts(_content)
		handleCloseModal()
		setInvoiceData({ ...invoiceData, content: _content, amountHT: amountHT, amountTTC: amountTTC })
	}

	const handleAddService = (service) => {

		let _service = {
			type: "extraService",
			serviceId: service.id,
			reference: service.reference,
			title: service.title,
			quantity: 1,
			price: service.price,
			discount: 0,
			amount: service.price,
		}

		const _content = [...invoiceData.content, _service]
		handleCloseModal()
		const { amountHT, amountTTC } = calcAmounts(_content)
		setInvoiceData({ ...invoiceData, content: _content, amountHT: amountHT, amountTTC: amountTTC })

	}

	const calcAmounts = (content) => {
		console.log('content', content)
		const amountHT = content.reduce((acc, curr) =>
			acc + curr.amount
			, 0)
		const amountTTC = amountHT + (amountHT * data.tva / 100)

		return { amountHT: amountHT, amountTTC: amountTTC }
	}

	if (isLoading ) return (<Loader />)
	else return (
		<>
			<Modal />
			<Header
				title={title + data.chrono}
				isLoading={isLoading}
				error={error}
				subtitle={dayjs(data.createdAt).format('DD/MM/YYYY')}
			>
				{!_.isEqual(data.content, invoiceData.content) &&
					<Button
						size={ButtonSize.Big}
						onClick={() => handleUpdateInvoice()}
						disabled={isPutPending}
					>
						{isPutPending ?
							<span className="loading loading-spinner loading-sm text-accent"></span>
							: <IoMdCheckmark />
						}
					</Button>
				}
				<Dropdown type="button">
				<button
						onClick={() => downloadFile(data.id, data.chrono)}
					>
						<MdOutlineFileDownload size={30} />
						Télécharger
					</button>
					{
						data.status === "édité" &&
						<button
							onClick={() => handleOpenModal({ title: "Valider la facture", size: "small", content: <Validate handleCloseModal={handleCloseModal} data={data} /> })}>
							<IoIosCheckmarkCircleOutline size={30} />
							Valider cette facture
						</button>
					}
					{data.command &&
						<button
							onClick={() => handleOpenModal({ title: "Commande", content: <CommandPage isModalContent={true} commandIRI={data.command} /> })}>
							<MdOutlineAssignment size={30} />
							Voir la commande
						</button>
					}
					{data.status === "édité" &&
						<button
							onClick={() => handleOpenModal({ title: "Prestations", content: <AddServiceModal handleAddService={handleAddService} handleCloseModal={handleCloseModal} /> })}>
							<IoIosAddCircleOutline size={30} />
							Ajouter une ligne
						</button>
					}
					{data.status === "validé" &&
						<button
							onClick={() => handleOpenModal({ title: "Facture irrécouvrable", size: "small", content: <Irrecoverable handleCloseModal={handleCloseModal} data={data} /> })}>
							<IoReloadCircleOutline size={30} />
							Facture irrécouvrable
						</button>
					}
					{data.status === "validé" && !data.isRefund && !data.refundReference &&
						<button
							onClick={() => handleOpenModal({ title: "Créer un avoir", size: "small", content: <Refund handleCloseModal={handleCloseModal} data={data} /> })}>
							<IoReloadCircleOutline size={30} />
							Créer un avoir
						</button>
					}
					{data.status !== "édité" &&
						<button
							onClick={() => handleOpenModal({ title: "Dupliquer la facture", size: "small", content: <Duplicate handleCloseModal={handleCloseModal} data={data} /> })}>
							<IoReloadCircleOutline size={30} />
							Dupliquer
						</button>
					}
				</Dropdown>

				<Button
					size={ButtonSize.Big}
					onClick={() => navigate("/invoices", { state: previousPageState })}
				>
					<MdArrowBack />
				</Button>
			</Header>

			<div className="flex flex-row mx-10 mb-10 justify-between">

				<div className="flex items-start flex-row gap-3">
					{data.customer &&
						<div className="dark:bg-gradient-page rounded p-3 flex flex-col gap-3">
							<p className="title">Client</p>
							<p className="subtitle">{data.customerTitle}</p>
						</div>
					}
					{data.trustee &&
						<div className="dark:bg-gradient-page rounded p-3 flex flex-col gap-3">
							<p className="title">Syndic</p>
							<p className="subtitle">{data.trusteeTitle}</p>
						</div>
					}
					{data.property &&
						<div className="dark:bg-gradient-page rounded p-3 flex flex-col gap-3">
							<p className="title">Copropriété</p>
							<p className="subtitle">{data.propertyTitle}</p>
						</div>
					}
				</div>
				<div className="flex flex-col gap-3 w-64">
					<div className="flex justify-between dark:bg-gradient-page rounded p-3">
						<p>Statut</p>
						<div className="flex gap-2">
							<Dot color={statusColor[data.status]} />
							<div className='caspanitalize'>{data.status}</div>
						</div>
					</div>
					<div className="dark:bg-gradient-page rounded p-3">
						<div className="flex justify-between">
							<p>Total HT</p>
							<p>{price(invoiceData.amountHT)}</p>
						</div>
						<div className="flex justify-between">
							<p>TVA ({invoiceData.tva}%)</p>
							<p>{price(invoiceData.amountTTC - invoiceData.amountHT)}</p>
						</div>
						<div className="flex justify-between">
							<p>Total TTC</p>
							<p>{price(invoiceData.amountTTC)}</p>
						</div>
					</div>
				</div>
			</div>

			<Table>
				<Thead>
					<Th label="Réf." />
					<Th label="Désignation" />
					<Th label="Quantité" style={{ textAlign: 'center' }} />
					<Th label="Prix unitaire HT" />
					<Th label="Total HT" />
					<Th label="Total TTC" />
					<Th label="" style={{ width: 10 }} />
				</Thead>
				<Tbody>
					{invoiceData.content?.map((content, index) =>
						<Tr key={uuid()}>
							<Td>{content.reference}</Td>
							<Td>{content.title} {content.occupant && " (" + content.occupant + ")"} </Td>
							<Td className="text-center" text={content.quantity} style={{ textAlign: 'center' }} />
							<Td>{price(content.price)}</Td>
							<Td>{price(content.amount)}</Td>
							<Td>
								{price(content.amount + content.amount * data.tva / 100)}
							</Td>
							<Td label="" text={""} >
								{data.status === "édité" &&
									<Dropdown type='table'>
										<button onClick={() => handleOpenModal({ title: "Prestation", content: <UpdateServiceModal handleUpdateService={handleUpdateService} service={content} index={index} tva={data.tva} handleCloseModal={handleCloseModal} /> })}>
											<LuSettings2 size={30} />
											Modifier la ligne
										</button>
										<button onClick={() => handleDeleteService(index)}>
											<IoIosCloseCircle size={30} />
											Supprimer la ligne
										</button>
									</Dropdown>
								}
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</>
	)
}

const AddServiceModal = ({ handleCloseModal, handleAddService }) => {

	const { data, isLoading, error } = useGetServices()

	if (isLoading) return <Loader />
	return (
		<div className="flex flex-col gap-3">
			{data.map(service =>
				<button key={uuid()} className="btn btn-primary" onClick={() => handleAddService(service)}>
					{service.title}
				</button>
			)}

		</div>
	)

}

const UpdateServiceModal = ({ handleCloseModal, handleUpdateService, service, index, tva }) => {

	const validationSchema = yup.object({
		title: yup.string().required("Champ obligatoire"),
		amount: yup.number().required().typeError("Champ obligatoire"),
		quantity: yup.number().required().typeError("Champ obligatoire"),
		price: yup.number(),
		amountTTC: yup.number(),
	})

	const { register, handleSubmit, setValue, setError, reset, setFocus, watch, control, formState: { errors, isSubmitting, isSubmitted } } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: service
	})

	const onSubmit = form => {
		handleUpdateService(index, form)
	}

	const _quantity = parseFloat(watch("quantity"))
	const _price = parseFloat(watch("price"))

	useEffect(() => {
		setValue("amount", roundPrice(_quantity * _price))
		setValue("amountTTC", roundPrice((_price + (_price * tva / 100)) * _quantity))
	}, [_quantity, _price])

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormInputs register={register} errors={errors} />
		</Form>
	)

}

const FormInputs = ({ errors, register }) => (
	<>
		<FormInput
			type="text"
			name="title"
			label="Intitulé"
			error={errors['title']}
			register={register}
			required={true}
		/>
		<FormInput
			type="text"
			name="occupant"
			label="Information complémentaire"
			error={errors['occupant']}
			register={register}
			required={false}
		/>
		<FormInput
			type="text"
			name="quantity"
			label="Quantité"
			error={errors['quantity']}
			register={register}
			required={true}
		/>
		<FormInput
			type="text"
			name="price"
			label="Tarif unitaire H.T."
			error={errors['price']}
			register={register}
			required={true}
		/>
		<FormInput
			type="text"
			name="amount"
			label="Total HT"
			error={errors['amount']}
			register={register}
			disabled={true}
		/>
		<FormInput
			type="text"
			name="amountTTC"
			label="Total TTC"
			error={errors['amountTTC']}
			register={register}
			disabled={true}
		/>
	</>
)

const Refund = ({ data, handleCloseModal }) => {

	const { mutate: post, isLoading: isPostPending, isSuccess: isPostSuccess } = usePostData()
	const { mutate: put, isLoading: isPutPending, isSuccess: isPutSuccess } = usePutData()

	const handleRefund = () => {
		const _postData = {
			...data,
			status: "validé",
			amountHT: 0 - data.amountHT,
			amountTTC: 0 - data.amountTTC,
			refundReference: data.chrono
		}
		delete _postData["@id"]
		delete _postData.id
		delete _postData.chrono
		delete _postData.command
		post(_postData)

		const _putData = {
			...data,
			isRefund: true
		}
		put(_putData)
	}


	useEffect(() => {
		if (isPostSuccess && isPutSuccess) handleCloseModal()
	}, [isPostSuccess, isPutSuccess])


	return (
		<div className='p-8'>
			<p>Attention cette opération est irréversible, voulez-vous confirmer l'action ?</p>
			<div className="flex items-center gap-5 justify-center p-5">
				<button className='btn btn-outline'
					onClick={() => handleCloseModal()}
				>Annuler</button>
				<button className='btn btn-error text-white'
					onClick={() => handleRefund()}
				>Confirmer</button>
			</div>
		</div>
	)

}

const Duplicate = ({ data, handleCloseModal }) => {

	const { mutate, isLoading, isSuccess } = usePostData()

	const handleDuplicate = () => {
		const _data = { ...data, status: "édité" }
		delete _data["@id"]
		delete _data.id
		delete _data.chrono
		delete _data.command
		delete _data.createdAt
		mutate(_data)
	}


	useEffect(() => {
		if (isSuccess) handleCloseModal()
	}, [isSuccess])


	return (
		<div>
			<p>Attention cette opération est irréversible, voulez-vous confirmer cette action ?</p>
			<div className="flex items-center gap-5 justify-start py-5">
				<button className='btn btn-outline'
					onClick={() => handleCloseModal()}
				>Annuler</button>
				<button className='btn btn-error text-white'
					onClick={() => handleDuplicate()}
				>Confirmer</button>
			</div>
		</div>
	)

}

const Irrecoverable = ({ data, handleCloseModal }) => {

	const { mutate, isLoading, isSuccess } = usePutData()

	const handleIrrecoverable = () => {
		const _data = {
			...data,
			status: "irrécouvrable"
		}
		mutate(_data)
	}


	useEffect(() => {
		if (isSuccess) handleCloseModal()
	}, [isSuccess])


	return (
		<div>
			<p>Attention cette opération est irréversible, voulez-vous confirmer cette action ?</p>
			<div className="flex items-center gap-5 justify-start py-5">
				<button className='btn btn-outline'
					onClick={() => handleCloseModal()}
				>Annuler</button>
				<button className='btn btn-error text-white'
					onClick={() => handleIrrecoverable()}
				>Confirmer</button>
			</div>
		</div>
	)

}

const Validate = ({ data, handleCloseModal }) => {

	const { mutate, isLoading, isSuccess } = usePutData()

	const handleValidate = () => {
		const _data = { "@id": data["@id"], id: data.id, status: "validé" }
		mutate(_data)
	}

	useEffect(() => {
		if (isSuccess) handleCloseModal()
	}, [isSuccess])


	return (
		<div>
			<p>Attention cette opération est irréversible, voulez-vous confirmer cette action ?</p>
			<div className="flex items-center gap-5 justify-start py-5">
				<button className='btn btn-outline'
					onClick={() => handleCloseModal()}
				>Annuler</button>
				<button className='btn btn-error text-white'
					onClick={() => handleValidate()}
				>Confirmer</button>
			</div>
		</div>
	)

}