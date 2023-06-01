import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import OrderForm from 'components/forms/order/OrderForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { useGetPaginatedDatas, usePutData } from 'queryHooks/useOrder'
import { useSearch } from 'hooks/useSearch'
import { useSortBy } from 'hooks/useSortBy'
import { useOrdersFilter } from 'hooks/useOrdersFilter'
import Pagination from 'components/pagination/Pagination'
import Dropdown from 'components/dropdown/Dropdown'
import dayjs from 'dayjs'
import { useModal } from 'hooks/useModal'
import OrderStatus from 'components/status/OrderStatus'
import { Dot } from 'components/dot/Dot'
import { orderStatusColor } from 'config/translations.config'
import { GoPrimitiveDot, GoSettings } from 'react-icons/go'
import { ImTable2 } from 'react-icons/im'
import Loader from 'components/loader/Loader'
import { CSVLink } from 'react-csv'
import OrderPdf from "components/pdf/OrderPdf"
import _ from "lodash"




export const OrdersPage = ({ title }) => {

	const navigate = useNavigate()
	const { state: initialPageState } = useLocation()
	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { searchValue, searchbar } = useSearch(initialPageState ? initialPageState.searchValue : "")
	const { filter, filters } = useOrdersFilter()
	const [page, setPage] = useState(initialPageState ? initialPageState.page : 1)
	const { sortValue, sortDirection, handleSort } = useSortBy(initialPageState ? { value: initialPageState.sortValue, direction: initialPageState.sortDirection } : "")
	const { data, isLoading, error } = useGetPaginatedDatas(page, sortValue, sortDirection, searchValue, filters)
	const { mutate: putData } = usePutData()

	const [isCheckAll, setIsCheckAll] = useState(false)
	const [checkedList, setCheckedList] = useState([])

	useEffect(() => {
		if (searchValue && !initialPageState) {
			setPage(1)
		}
		if (sortValue && !initialPageState) {
			setPage(1)
		}
		setCheckedList([])
		setIsCheckAll(false)
	}, [searchValue, sortValue, filters])

	const handleSelectAll = () => {
		setIsCheckAll(!isCheckAll)
		setCheckedList(data['hydra:member'])
		if (isCheckAll) {
			setCheckedList([])
		}
	}

	const handleCheck = (data) => {
		//event.stopPropagation()
		if (_.find(checkedList, { 'id': data.id }))
			setCheckedList(checkedList.filter(f => f.id !== data.id))
		else {
			setCheckedList([...checkedList, data])
		}
	}

	const csvheaders = [
		{ label: "#", key: "id" },
		{ label: "Syndic", key: "trustee.title" },
		{ label: "Copro", key: "property.title" },
		{ label: "Secteur", key: "property.zone" },
		{ label: "Nouvel Occupant", key: "details.nouveloccupant" },
		{ label: "N° Entrée", key: "details.entree" },
		{ label: "N° Appartement", key: "details.numeroappartement" },
		{ label: "N° Boite aux lettre", key: "details.numeroboiteauxlettres" },
		{ label: "N° Etage", key: "details.numeroetage" },
		{ label: "N° Lot", key: "details.numerodelot" },
		{ label: "N° Porte", key: "details.numerodeporte" },
		{ label: "N° Villa", key: "details.numerodevilla" },
	]


	if (isLoading)
		return (
			<Loader />
		)
	else return (
		<>
			<Modal />
			<Header title={title + " - " + data["hydra:totalItems"]}>
				{searchbar}
				{filter}
				<Button size={ButtonSize.Big} disabled={checkedList.length === 0}>
					<CSVLink
						filename={"Commandes.csv"}
						data={checkedList}
						headers={csvheaders}
						onClick={() => {
							if (checkedList.length === 0)
								return false; // 👍🏻 You are stopping the handling of component
						}}
						className={`${checkedList.length === 0 && 'cursor-not-allowed'}`}
					>
						<ImTable2 size={26} />
					</CSVLink>
				</Button>
				<OrderPdf orders={checkedList} />
				<Button
					size={ButtonSize.Big}
					onClick={() => handleOpenModal({ title: "Nouvelle commande", content: <OrderForm handleCloseModal={handleCloseModal} /> })}
				/>
			</Header>


			<Content>
				<Table>
					<Thead>
						<Th
							label="#"
							sortBy='id'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="">
							<input
								type="checkbox"
								name="selectAll"
								id="selectAll"
								onChange={handleSelectAll}
								checked={isCheckAll}
								className='checkbox'
							/>
						</Th>
						<Th label="Syndic"
							sortBy='trustee.title'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Copropriété"
							sortBy='property.title'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Secteur"
							sortBy='property.zone'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Créée le"
							sortBy='createdAt'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Préparée le"
							sortBy='madeAt'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Posée le"
							sortBy='deliveredAt'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Statut"
							sortBy='status'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th />

					</Thead>
					<Tbody>
						{!isLoading && data['hydra:member'].map(data =>
							<Tr key={data.id}
								onClick={() => navigate("/orders/" + data.id, { state: { page: page, sortDirection: sortDirection, sortValue: sortValue, searchValue: searchValue } })}
							>
								<Td text={data.id} />
								<Td>
									<div>
										<input
											type="checkbox"
											className='checkbox mt-4'
											onClick={(e) => e.stopPropagation()}
											onChange={() => handleCheck(data)}
											checked={_.find(checkedList, { 'id': data.id }) ? true : false}
										/>
									</div>
								</Td>
								<Td label="Syndic" text={data.trustee.title}>
									<div className="flex flex-col mr-3">
										<GoPrimitiveDot size={20} color={data.trustee.color} />
										<GoPrimitiveDot size={20} color={data.trustee.color2} />
									</div>
								</Td>
								<Td label="Copropriété" text={data.property.title} />
								<Td label="Secteur" text={data.property.zone} />
								<Td label="Date" text={dayjs(data.createdAt).format('DD/MM/YYYY')} />
								<Td label="Date" text={data.madeAt ? dayjs(data.madeAt).format('DD/MM/YYYY') : "..."} />
								<Td label="Date" text={data.deliveredAt ? dayjs(data.deliveredAt).format('DD/MM/YYYY') : "..."} />
								<Td label="Statut">
									<OrderStatus status={data.status} isHanging={data.isHanging} date={data.createdAt} />
								</Td>
								<Td label="" text={""}>
									<Dropdown type='table'>
										<button
											onClick={() => navigate("/orders/" + data.id, { state: { page: page, sortDirection: sortDirection, sortValue: sortValue, searchValue: searchValue } })}
										>
											Consulter la fiche
										</button>
										{data.status !== 'facturé' && data.status !== 'posé' && data.status !== 'annulé' &&
											<>
												<button
													onClick={() => handleOpenModal({ title: "édition de la commande", content: <OrderForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
													Modifier la commande
												</button>
												<div>Status</div>

												<button
													onClick={() => putData({ id: data.id, status: 'préparé', madeAt: dayjs() })}
													disabled={data.status === 'préparé' || data.status === 'posé'}>
													<Dot color={orderStatusColor["préparé"]} />Préparé
												</button>

												<button
													onClick={() => putData({ id: data.id, status: 'posé', deliveredAt: dayjs() })}
													disabled={data.status === 'posé'}
												>
													<Dot color={orderStatusColor["posé"]} /> Posé
												</button>

												<button
													onClick={() => putData({ id: data.id, isHanging: !data.isHanging })}
												>
													<Dot color={orderStatusColor["bloqué"]} /> Bloqué
												</button>

												<button
													onClick={() => putData({ id: data.id, status: 'annulé' })}
													disabled={data.status === 'annulé' || data.status === 'posé'}
												>
													<Dot color={orderStatusColor["annulé"]} /> Annulé
												</button>
											</>
										}
									</Dropdown>
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Content >
			<Pagination totalItems={data['hydra:totalItems']} page={page} setPage={setPage} />
		</>
	)
}




