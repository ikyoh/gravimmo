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
import { Dot, StatusColor } from 'components/dot/Dot'
import { useServices } from 'queryHooks/useService'
import { useSearch } from 'hooks/useSearch'


export const InvoicesPage = ({ title }) => {

		return (
			<>
				<Header title={title}>

				</Header>
				<Content>

				</Content>
			</>
		)
	}





