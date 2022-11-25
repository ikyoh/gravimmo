import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import TrusteeForm from '../forms/trustee/TrusteeForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { useGetPaginatedDatas } from 'hooks/useProperty'
import { useSearch } from 'hooks/useSearch'
import { useSortBy } from 'hooks/useSortBy'
import { GoPrimitiveDot } from 'react-icons/go'
import { useState } from 'react'
import Pagination from 'components/pagination/Pagination'

export const PropertiesPage = ({ title }) => {

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
						onClick={() => handleOpenModal({ title: "Nouveau syndic", content: <TrusteeForm handleCloseModal={handleCloseModal} /> })}
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
							<Th label="Nom"
								sortBy='title'
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
							<Th label="Secteur"
								sortBy='zone'
								sortValue={sortValue}
								sortDirection={sortDirection}
								handleSort={handleSort}
							/>
							<Th label="Code postal"
								sortBy='postcode'
								sortValue={sortValue}
								sortDirection={sortDirection}
								handleSort={handleSort}
							/>
							<Th label="Ville"
								sortBy='city'
								sortValue={sortValue}
								sortDirection={sortDirection}
								handleSort={handleSort}
							/>

						</Thead>
						<Tbody>
							{!isLoading && data['hydra:member'].map(data =>
								<Tr key={data.id} onClick={() => navigate("/properties/" + data.id, { state: { page: page, sortDirection: sortDirection, sortValue: sortValue, searchValue: searchValue } })}>
									<Td text={data.id} />
									<Td label="Nom" text={data.title} />
									<Td label="Syndic" text={data.trustee.title} />
									<Td label="Secteur" text={data.zone} />
									<Td label="Code postal" text={data.postcode} />
									<Td label="Ville" text={data.city} />
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




