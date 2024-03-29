import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import ContactForm from '../components/forms/contact/ContactForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { useGetPaginatedDatas } from 'queryHooks/useContact'
import { useSearch } from 'hooks/useSearch'
import { useSortBy } from 'hooks/useSortBy'
import Pagination from 'components/pagination/Pagination'
import Dropdown from 'components/dropdown/Dropdown'
import { useModal } from 'hooks/useModal'
import Loader from 'components/loader/Loader'
import { LuSettings2 } from 'react-icons/lu'
import { NoDataFound } from 'components/noDataFound/NoDataFound'

export const ContactsPage = ({ title }) => {

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

	if (isLoading) return (<Loader />)
	return (
		<>
			<Modal />
			<Header
				title={title}
				subtitle={data["hydra:totalItems"].toString()}
				error={error}
			>
				{searchbar}
				<Button
					size={ButtonSize.Big}
					onClick={() => handleOpenModal({ title: "Nouveau contact", content: <ContactForm handleCloseModal={handleCloseModal} /> })}
				/>
			</Header>
			{data["hydra:totalItems"] === 0
				? <NoDataFound />
				: <Table>
					<Thead>
						<Th
							label="#"
							sortBy='id'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Nom / Prénom"
							sortBy='lastname'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Syndic"
							sortBy='trustee.title'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Fonction"
							sortBy='title'
							sortValue={sortValue}
							sortDirection={sortDirection}
							handleSort={handleSort}
						/>
						<Th label="Téléphone" />
						<Th label="Email" />
						<Th label="" style={{ width: 10 }} />
					</Thead>
					<Tbody>
						{!isLoading && data['hydra:member'].map(data =>
							<Tr key={data.id}
								onClick={() => handleOpenModal({ title: "édition du contact", content: <ContactForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}
							>
								<Td text={data.id} />
								<Td label="Nom" text={data.lastname + ' ' + data.firstname} />
								<Td label="Syndic" text={data.trustee ? data.trustee.title : ''} />
								<Td label="Fonction" text={data.title} />
								<Td label="Téléphone" text={data.phone} />
								<Td label="Email" text={data.email} />
								<Td label="" text={""} >
									<Dropdown type='table'>
										<button
											onClick={() => handleOpenModal({ title: "édition du contact", content: <ContactForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}
										>
											<LuSettings2 size={30} />
											Modifier le contact
										</button>
									</Dropdown>
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			}
			<Pagination totalItems={data['hydra:totalItems']} page={page} setPage={setPage} />
		</>
	)
}



