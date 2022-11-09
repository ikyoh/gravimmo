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
import { useTrustees } from 'hooks/useTrustee'
import { useFilters } from 'hooks/useFilters'
import { useSortBy } from 'hooks/useSortBy'

export const TrusteesPage = ({ title }) => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const { searchValue, searchbar } = useFilters()
		const { sortValue, sortDirection, setSortValue } = useSortBy()
		const { data = [], isLoading, error } = useTrustees(searchValue, sortValue, sortDirection)

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
								setSortValue={setSortValue}
							/>
							<Th label="Nom" sortBy='title' sortValue={sortValue} sortDirection={sortDirection} setSortValue={setSortValue} />
							<Th label="Téléphone" />
							<Th label="Email" />
							<Th label="Code postal" sortBy='postcode' sortValue={sortValue} sortDirection={sortDirection} setSortValue={setSortValue} />
							<Th label="Ville" sortBy='city' sortValue={sortValue} sortDirection={sortDirection} setSortValue={setSortValue} />
						</Thead>
						<Tbody>
							{!isLoading && data.map(data =>
								<Tr key={data.id}
									onClick={() => handleOpenModal({ title: "édition du syndic", content: <TrusteeForm id={data.id} handleCloseModal={handleCloseModal} /> })}
								>
									<Td text={data.id} />
									<Td label="Nom" text={data.title} />
									<Td label="Téléphone" text={data.phone} />
									<Td label="Email" text={data.email} />
									<Td label="Code postal" text={data.postcode} />
									<Td label="Ville" text={data.city} />
								</Tr>
							)}
						</Tbody>
					</Table>
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




