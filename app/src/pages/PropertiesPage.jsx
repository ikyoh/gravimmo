import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import ServiceForm from '../forms/services/ServiceForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { Dot, StatusColor } from 'components/dot/Dot'
import { useServices } from 'hooks/useService'
import { useFilters } from 'hooks/useFilters'
import { BsPiggyBank } from 'react-icons/bs'

export const PropertiesPage = ({ title }) => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const { searchvalue, searchbar } = useFilters()
		const { data = [], isLoading, error } = useServices(searchvalue)

		return (
			<>
				<Header title={title} isLoading={isLoading} error={error}>
					{searchbar}
					<Button
						size={ButtonSize.Big}
						onClick={() => handleOpenModal({ title: "Nouvelle commande", content: <ServiceForm handleCloseModal={handleCloseModal} /> })}
					/>
				</Header>
				<Content>
					<Table>
						<Thead>
							<Th label="#" />
							<Th label="Nom" />
							<Th label="Syndic" />
							<Th label="Adresse" />
							<Th label="Code postal" />
							<Th label="Ville" />
						</Thead>
						<Tbody>
							{!isLoading && data.map(data =>
								<Tr key={data.id}
									onClick={() => handleOpenModal({ title: "édition du service", content: <ServiceForm id={data.id} handleCloseModal={handleCloseModal} /> })}
								>
									<Td text={data.id} />
									<Td label="Nom" text="Copropriété" />
									<Td label="Syndic" text="Syndic" />
									<Td label="Adresse" text="Adresse" />
									<Td label="Code postal" text="06000" />
									<Td label="Ville" text="Nice" />
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




