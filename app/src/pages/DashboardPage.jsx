import { Layout } from '../components/templates/layout/Layout'
import Content from '../components/templates/content/Content'
import Header from '../components/templates/header/Header'
import { AiOutlineSlack } from "react-icons/ai";


export const DashboardPage = ({ title }) => {

	const PageContent = ({ handleOpenModal, handleCloseModal }) => {


		const card = 'bg-dark/60 rounded p-10 flex gap-20 items-center'
		const card2 = 'bg-dark/60 rounded p-10 flex justify-between items-center'
		const cardtitle = 'text-3xl font-bold'
		const text = 'text-white/50'

		return (
			<>
				<Header title={title}>
				</Header>
				<Content>
					<div className='px-4 py-6'>
						<div className="grid md:grid-cols-1 xl:grid-cols-3 gap-8">
							<div className={card}>
								<AiOutlineSlack size={70} className="bg-blue-500 rounded-full p-3 text-dark" />
								<div>
									<div className={cardtitle}>
										123
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
										456
									</div>
									<div className={text}>
										Lorem Ipsum
									</div>
								</div>
							</div>
							<div className={card}>
								<AiOutlineSlack size={70} className="bg-red-500 rounded-full p-3 text-dark" />
								<div>
									<div className={cardtitle}>
										789
									</div>
									<div className={text}>
										Lorem Ipsum
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

	return (
		<Layout>
			<PageContent />
		</Layout>

	)

}




