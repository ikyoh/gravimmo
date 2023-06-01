import Content from '../components/templates/content/Content'
import Header from '../components/templates/header/Header'
import { AiOutlineSlack } from "react-icons/ai"
import { MdPendingActions} from "react-icons/md"
import { useGetOrdersToInvoiceNumber, useGetOrdersToDeliverNumber } from 'queryHooks/useOrder'


export const DashboardPage = ({ title }) => {


		const card = 'bg-dark/60 rounded p-10 flex gap-20 items-center'
		const card2 = 'bg-dark/60 rounded p-10 flex justify-between items-center'
		const cardtitle = 'text-3xl font-bold'
		const text = 'text-white/50'

		const {data : toInvoiceNumber} = useGetOrdersToInvoiceNumber()
		const {data : toDeliverNumber} = useGetOrdersToDeliverNumber()

		return (
			<>
				<Header title={title}>
				</Header>
				<Content>
					<div className='px-4 py-6'>
						<div className="grid md:grid-cols-1 xl:grid-cols-3 gap-8">
							<div className={card}>
								<AiOutlineSlack size={70} className="bg-accent rounded-full p-3 text-dark" />
								<div>
									<div className={cardtitle}>
										12365656
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>
							<div className={card}>
								<AiOutlineSlack size={70} className="bg-green-500 rounded-full p-3 text-dark" />
								<div>
									<div className={cardtitle}>
										{toDeliverNumber}
									</div>
									<div className={text}>
										Commandes prêtes à poser
									</div>
								</div>
							</div>
							<div className={card}>
								<MdPendingActions size={70} className="bg-red-500 rounded-full p-3 text-dark" />
								<div>
									<div className={cardtitle}>
										{toInvoiceNumber}
									</div>
									<div className={text}>
										Commandes à facturer
									</div>
								</div>
							</div>

						</div>
						<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10">
							<div className={card2}>
								<AiOutlineSlack size={70} className="text-violet-800 rounded-full" />
								<div>
									<div className={cardtitle}>
										123
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>
							<div className={card2}>
								<AiOutlineSlack size={70} className="text-violet-800 rounded-full" />
								<div>
									<div className={cardtitle}>
										456
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>
							<div className={card2}>
								<AiOutlineSlack size={70} className="text-violet-800 rounded-full" />
								<div>
									<div className={cardtitle}>
										789
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>
							<div className={card2}>
								<AiOutlineSlack size={70} className="text-violet-800 rounded-full" />
								<div>
									<div className={cardtitle}>
										333
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>

						</div>
					</div>


				</Content>
			</>
		)
	}





