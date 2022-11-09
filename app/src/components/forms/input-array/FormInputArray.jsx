import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from '../../button/Button'
import { IoIosClose } from "react-icons/io"
import uuid from "react-uuid"


const FormInputArray = ({ name, label, setValue, getValues, required, type, placeholder, register }) => {

	const [inputValue, setInputValue] = useState("");

	const [items, setItems] = useState(getValues(name));

	const [error, setError] = useState();

	useEffect(() => {
		setValue(name, items)
	}, [items])


	const handleChange = ({ currentTarget }) => {
		setError()
		setInputValue(currentTarget.value)
	}

	const handleAddItem = () => {
		if (inputValue !== '') {
			setItems([...items, inputValue])
			setInputValue('')
		}
		else setError("Champ requis")
	}

	const handleRemoveItem = (item) => {
		const previousItems = [...items]
		setItems(previousItems.filter(f => f !== item))
	}

	return (
		<div className="w-full mb-2">
			<label htmlFor={name}
				className="text-dark dark:text-white text-sm">
				{label}
				{required && " *"}
			</label>
			<div className='mt-2 flex flex-row items-center gap-2'>
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 grow leading-tight focus:outline focus:outline-blue-500"
					onChange={handleChange}
					value={inputValue}
				/>
				<Button onClick={handleAddItem} />
			</div>
			{error && <span className="text-error text-sm">{error}</span>}
			<div className='flex flex-row flex-wrap gap-3 mt-3'>
				{items.map(item =>
					<div key={uuid()} className='flex items-center rounded bg-dark h-[50px] pl-3 text-white'>
						{item}
						<IoIosClose size={32} className="text-slate-600 cursor-pointer" onClick={() => handleRemoveItem(item)} />
					</div>
				)}
			</div>

		</div>
	);
}

export default FormInputArray