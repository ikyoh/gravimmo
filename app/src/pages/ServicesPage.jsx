import { Layout } from '../components/templates/layout/Layout'
import Content from '../components/templates/content/Content'
import Header from '../components/templates/header/Header'
import { Button, ButtonSize } from '../components/button/Button'
import ServiceForm from '../forms/services/ServiceForm'
import Table from '../components/templates/table/Table'
import Thead from '../components/templates/table/Thead'
import Th from '../components/templates/table/Th'
import Tbody from '../components/templates/table/Tbody'
import Tr from '../components/templates/table/Tr'
import Td from '../components/templates/table/Td'
import { useServices } from '../hooks/useService'
import { useFilters } from 'hooks/useFilters'
import { useSortBy } from 'hooks/useSortBy'

export const ServicesPage = ({title}) => {	

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {
				
		const { searchValue, searchbar } = useFilters()
		const { sortValue, sortDirection, setSortValue } = useSortBy()
		const { data = [], isLoading, error } = useServices(searchValue, sortValue, sortDirection)

		return (
			<>
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
								setSortValue={setSortValue}
							/>
							<Th
								label="Intitulé"
								sortBy='title'
								sortValue={sortValue}
								sortDirection={sortDirection}
								setSortValue={setSortValue}
							/>
							<Th
								label="Catégorie"
								sortBy='category'
								sortValue={sortValue}
								sortDirection={sortDirection}
								setSortValue={setSortValue}
							/>
							<Th label="Tarif H.T." />
						</Thead>
						<Tbody>
							{!isLoading && data.map(data =>
								<Tr key={data.id}
									onClick={() => handleOpenModal({ title: "édition de la prestation", content: <ServiceForm id={data.id} handleCloseModal={handleCloseModal} /> })}
								>
									<Td text={data.id} />
									<Td label="Intitulé" text={data.title} />
									<Td label="Catégorie" text={data.category} />
									<Td label="Tarif H.T" text={data.price + ' €'} />
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




