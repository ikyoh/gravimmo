import { useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import ServiceForm from '../components/forms/service/ServiceForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { useGetPaginatedDatas } from 'queryHooks/useService'
import { useSearch } from 'hooks/useSearch'
import { useSortBy } from 'hooks/useSortBy'
import { useState } from 'react'
import Pagination from 'components/pagination/Pagination'
import Dropdown from 'components/dropdown/Dropdown'
import { useModal } from 'hooks/useModal'
import Loader from 'components/loader/Loader'

export const ServicesPage = ({ title }) => {

	const navigate = useNavigate()
	const { state: initialPageState } = useLocation()
	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { searchValue, searchbar } = useSearch(initialPageState ? initialPageState.searchValue : "")
	const [page, setPage] = useState(initialPageState ? initialPageState.page : 1)
	const { sortValue, sortDirection, handleSort } = useSortBy(initialPageState ? { value: initialPageState.sortValue, direction: initialPageState.sortDirection } : "")
	const { data = [], isLoading, error } = useGetPaginatedDatas(page, sortValue, sortDirection, searchValue)

	useEffect(() => {
		if (searchValue && !initialPageState) {
			setPage(1)
		}
		if (sortValue && !initialPageState) {
			setPage(1)
		}
	}, [searchValue, sortValue])

	if(isLoading) return (<Loader />)
	return (
		<>
			<Modal />
			<Header title={title} isLoading={isLoading} error={error}>
				{searchbar}
				<Button
					size={ButtonSize.Big}
					onClick={() => handleOpenModal({ title: "nouvelle prestation", content: <ServiceForm handleCloseModal={handleCloseModal} /> })}
				>
				</Button>
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
						<Th
							label="Intitulé"
							sortBy='title'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th
							label="Catégorie"
							sortBy='category'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Tarif H.T." />
						<Th label="" style={{ width: 10 }} />
					</Thead>
					<Tbody>
						{!isLoading && data['hydra:member'].map(data =>
							<Tr key={data.id}
								onClick={() => handleOpenModal({ title: "édition de la prestation", content: <ServiceForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}
							>
								<Td text={data.id} />
								<Td label="Intitulé" text={data.title} />
								<Td label="Catégorie" text={data.category} />
								<Td label="Tarif H.T" text={data.price + ' €'} />
								<Td label="" text={""} >
									<Dropdown type='table'>
										<button
											onClick={() => handleOpenModal({ title: "édition de la prestation", content: <ServiceForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}
										>
											Modifier la prestation
										</button>
									</Dropdown>
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Content>
			<Pagination totalItems={data['hydra:totalItems']} page={page} setPage={setPage} />
		</>
	)
}





