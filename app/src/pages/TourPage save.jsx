import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useParams } from 'react-router-dom'
import Header from 'components/templates/header/Header'
import { Button, ButtonSize } from 'components/button/Button'
import { useGetOneData, usePutData } from 'queryHooks/useTour'
import { MdArrowBack } from 'react-icons/md'
import _ from "lodash"
import { useModal } from 'hooks/useModal'
import Loader from "components/loader/Loader"
import dayjs from "dayjs"
import { CardTour } from "components/cards/tour/CardTour"
import Content from 'components/templates/content/Content'
import Dropdown from 'components/dropdown/Dropdown'
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { removeDuplicates, arrayOfIris } from 'utils/functions.utils';

import {
	DndContext,
	closestCenter
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
	useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export const TourPage = () => {

	const navigate = useNavigate();
	const { state: previousPageState } = useLocation();
	const { Modal, handleOpenModal, handleCloseModal } = useModal()
	const { id } = useParams()
	const { data = [], isLoading, error, isSuccess } = useGetOneData(id)

	const [commands, setCommands] = useState([]);

	const { mutate } = usePutData()

	useEffect(() => {
		if (isSuccess && data && data.positions.length === 0 ) setCommands(arrayOfIris(data.commands))
		if (isSuccess && data && data.positions.length !== 0 ) setCommands(data.positions)
	}, [isSuccess])


	console.log('data', data)
	console.log('commands', commands)

	function handleDragEnd(event) {
		const { active, over } = event;

		if (active.id !== over.id) {
			setCommands((items) => {
				const activeIndex = items.indexOf(active.id);
				const overIndex = items.indexOf(over.id);
				mutate({ id: id, positions: arrayMove(items, activeIndex, overIndex) });
				return arrayMove(items, activeIndex, overIndex);
				// items: [2, 3, 1]   0  -> 2
				// [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1] 
			});

		}
	}


	const SortableItem = ({ iri }) => {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition
		} = useSortable({ id: iri });

		const style = {
			transform: CSS.Transform.toString(transform),
			//transition
		}

		return (
			<div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
				<CardTour iri={iri} />
			</div>

		)
	}

	if (isLoading) return (<Loader />)
	else return (
		<>
			<Modal />
			<Header title={"Tournée #" + data.id} subtitle={dayjs(data.scheduledAt).format('dddd D MMMM YYYY')} isLoading={isLoading} error={error}>

				<Dropdown type="button">
						<button className="bg-secondary"
							disabled={data.status === "annulé" || data.isHanging}
							onClick={() => putData({ id: data.id, status: 'préparé', madeAt: dayjs() })}
						>
							<IoIosCheckmarkCircleOutline size={30} />
							Valider la préparation
						</button>
						<button className="bg-secondary"
							disabled={data.status === "annulé" || data.isHanging}
							onClick={() => putData({ id: data.id, status: 'posé', deliveredAt: dayjs() })}
						>
							<IoIosCheckmarkCircleOutline size={30} />
							Valider la pose
						</button>
				</Dropdown>

				{_.isEmpty(previousPageState)
					?
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate(-1)}
					>
						<MdArrowBack />
					</Button>
					:
					<Button
						size={ButtonSize.Big}
						onClick={() => navigate("/tours", { state: previousPageState })}
					>
						<MdArrowBack />
					</Button>
				}
			</Header>
			<Content>
				<div className="flex">
					<ul className="steps steps-vertical">
						{commands.map(item => <li key={item} className="step step-neutral"></li>)}
					</ul>
					<div className="grow">
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={commands}
								strategy={verticalListSortingStrategy}
							>
								{/* We need components that use the useSortable hook */}
								<div className="flex flex-col space-y-4">
									{commands.map(item => <SortableItem key={item} iri={item} />)}
								</div>
							</SortableContext>
						</DndContext >
					</div>
				</div>
			</Content>

		</>
	)
}
