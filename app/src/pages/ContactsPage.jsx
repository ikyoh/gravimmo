import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import ContactForm from '../forms/contact/ContactForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { useGetPaginatedDatas } from 'hooks/useContact'
import { useSearch } from 'hooks/useSearch'
import { useSortBy } from 'hooks/useSortBy'
import { useState } from 'react'
import Pagination from 'components/pagination/Pagination'

export const ContactsPage = ({ title }) => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const navigate = useNavigate()
		const { state: initialPageState } = useLocation()

		const { searchValue, searchbar } = useSearch(initialPageState ? initialPageState.searchValue : "")
		const [page, setPage] = useState(initialPageState ? initialPageState.page : 1)
		const { sortValue, sortDirection, handleSort } = useSortBy(initialPageState ? { value: initialPageState.sortValue, direction: initialPageState.sortDirection } : "")
		const { data = [], isLoading, error } = useGetPaginatedDatas(page, sortValue, sortDirection, searchValue)

		useEffect(() => {
			if (searchValue && !initialPageState) {
				setPage(1)
			}
		}, [searchValue])

		return (
			<>
				<Header title={title} isLoading={isLoading} error={error}>
					{searchbar}
					<Button
						size={ButtonSize.Big}
						onClick={() => handleOpenModal({ title: "Nouveau contact", content: <ContactForm handleCloseModal={handleCloseModal} /> })}
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
						</Thead>
						<Tbody>
							{!isLoading && data['hydra:member'].map(data =>
								<Tr key={data.id}
									onClick={() => handleOpenModal({ title: "édition du contact", content: <ContactForm id={data.id} handleCloseModal={handleCloseModal} /> })}
								>
									<Td text={data.id} />
									<Td label="Nom" text={data.lastname + ' ' + data.firstname} />
									<Td label="Syndic" text={data.trustee.title} />
									<Td label="Fonction" text={data.title} />
									<Td label="Téléphone" text={data.phone} />
									<Td label="Email" text={data.email} />

								</Tr>
							)}
						</Tbody>
					</Table>
				</Content>
				<Pagination totalItems={data['hydra:totalItems']} page={page} setPage={setPage} />
			</>
		)
	}

	return (
		<Layout>
			<PageContent />
		</Layout>

	)

}




