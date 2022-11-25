import React, { useState } from 'react';
import { useFieldArray } from "react-hook-form";
import { Button } from '../../button/Button';
import { IoIosClose } from "react-icons/io";
import Label from '../label/FormLabel';


const FormInputContact = ({ name, label, setValue, required, type, placeholder, control }) => {

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: name
	});

	const initialState = {
		role: '',
		fullname: '',
		email: '',
		phone: ''
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

	const className = "basis-1/2 appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 grow leading-tight focus:outline focus:outline-blue-500 w-1/6"

	return (
		<div className="w-full mb-2">
			<Label name={name} label={label} required={required} />
			<div className='mt-2 flex flex-wrap w-full items-center gap-2 '>
				<input
					id="role"
					name="role"
					type="text"
					placeholder="Role"
					className={className}
					onChange={handleChange}
					value={inputValues.role}
				/>
				<input
					id="fullname"
					name="fullname"
					type="text"
					placeholder="Nom et prénom"
					className={className}
					onChange={handleChange}
					value={inputValues.fullname}
				/>
				<input
					id="email"
					name="email"
					type="text"
					placeholder="Email"
					className={className}
					onChange={handleChange}
					value={inputValues.email}
				/>
				<input
					id="phone"
					name="phone"
					type="text"
					placeholder="Téléphone"
					className={className}
					onChange={handleChange}
					value={inputValues.phone}
				/>
				<Button onClick={handleAddItem} />
			</div>
			{error && <span className="text-error text-sm">{error}</span>}
			<div className='flex flex-col gap-3 mt-3'>
				{fields.map((field, index) =>
					<div key={field.id} className='flex rounded bg-dark h-[50px] pl-3 text-white'>
						<div>
						Role : {field.data.role} - Nom et prénom : {field.data.fullname} - Email : {field.data.email} - Téléphone : {field.data.phone}
						</div>
						<IoIosClose size={32} className="text-slate-600 cursor-pointer" onClick={() => remove(index)} />
					</div>
				)}
			</div>
		</div>
	);
}

export default FormInputContact