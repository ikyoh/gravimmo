import React, { useState } from 'react';
import { useFieldArray } from "react-hook-form";
import { Button } from '../../button/Button';
import { IoIosClose } from "react-icons/io";
import Label from '../label/FormLabel';


const FormInputMargin = ({ name, label, setValue, required, type, placeholder, control }) => {

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: name
	});

	const initialState = {
		top: '',
		bottom: '',
		left: '',
		right: ''
	}

	const [inputValues, setInputValues] = useState(initialState)

	const [error, setError] = useState();

	const handleChange = ({ currentTarget }) => {
		setError()
		const { name, value } = currentTarget
		setInputValues({ ...inputValues, [name]: value })
	}

	const handleAddItem = () => {
		if (Object.values(inputValues).every(value => value !== '')) {
			append({ 'data': inputValues })
			setInputValues(initialState)
		}
		else setError("Champs requis")
	}

	const className = "appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 grow leading-tight focus:outline focus:outline-blue-500 w-1/6"

	return (
		<div className="w-full mb-2">
			<Label name={name} label={label} required={required} />
			<div className='mt-2 flex flex-row w-full items-center gap-2'>
				<input
					id="top"
					name="top"
					type="number"
					placeholder="Haut"
					className={className}
					onChange={handleChange}
					value={inputValues.top}
					min={0}
				/>
				<input
					id="bottom"
					name="bottom"
					type="number"
					placeholder="Bas"
					className={className}
					onChange={handleChange}
					value={inputValues.bottom}
					min={0}
				/>
				<input
					id="left"
					name="left"
					type="number"
					placeholder="Gauche"
					className={className}
					onChange={handleChange}
					value={inputValues.left}
					min={0}
				/>
				<input
					id="right"
					name="right"
					type="number"
					placeholder="Droite"
					className={className}
					onChange={handleChange}
					value={inputValues.right}
					min={0}
				/>
				<Button onClick={handleAddItem} />
			</div>
			{error && <span className="text-error text-sm">{error}</span>}
			<div className='flex flex-row flex-wrap gap-3 mt-3'>
				{fields.map((field, index) =>
					<div key={field.id} className='flex items-center rounded bg-dark h-[50px] pl-3 text-white'>
						Haut : {field.data.top} - Bas : {field.data.bottom} - Gauche : {field.data.left} - Droite : {field.data.right}
						<IoIosClose size={32} className="text-slate-600 cursor-pointer" onClick={() => remove(index)} />
					</div>
				)}
			</div>
		</div>
	);
}

export default FormInputMargin