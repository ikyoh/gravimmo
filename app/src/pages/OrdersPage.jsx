import { Layout } from 'components/templates/layout/Layout'
import Content from 'components/templates/content/Content'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import ServiceForm from '../forms/service/ServiceForm'
import Table from 'components/templates/table/Table'
import Thead from 'components/templates/table/Thead'
import Th from 'components/templates/table/Th'
import Tbody from 'components/templates/table/Tbody'
import Tr from 'components/templates/table/Tr'
import Td from 'components/templates/table/Td'
import { Dot, StatusColor } from 'components/dot/Dot'
import { useServices } from 'hooks/useService'
import { useSearch } from 'hooks/useSearch'


export const OrdersPage = ({ title }) => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {

		const {searchvalue, searchbar} = useSearch()
		const { data=[], isLoading, error } = useServices(searchvalue)

		return (
			<>
				<Header title={title} isLoading={isLoading} error={error}>
					{searchbar}
					<Button
						size={ButtonSize.Big}
						onClick={() => handleOpenModal({ title: "Nouvelle commande", content: <ServiceForm handleCloseModal={handleCloseModal} /> })}
					>
					</Button>
				</Header>
				<Content>
					<Table>
						<Thead>
							<Th label="#" />
							<Th label="Syndic" />
							<Th label="Copropriété" />
							<Th label="Date" />
							<Th label="Date de pose" />
							<Th label="Montant H.T." />
							<Th label="" />
						</Thead>
						<Tbody>
							{!isLoading && data.map(data =>
								<Tr key={data.id}
									onClick={() => handleOpenModal({ title: "édition du service", content: <ServiceForm id={data.id} handleCloseModal={handleCloseModal} /> })}
								>
									<Td text={data.id} />
									<Td label="Syndic" text="Syndic" />
									<Td label="Copropriété" text="Copropriété" />
									<Td label="Date" text="04 11 2022" />
									<Td label="Date de pose" text="04 11 2022" />
									<Td label="Montant H.T." text="24.20" />
									<Td label="">
										<Dot color={StatusColor.Action} />
									</Td>
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




