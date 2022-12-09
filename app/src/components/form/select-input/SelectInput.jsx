import React from 'react';
import uuid from "react-uuid"
import './style.css'
import { useGetAllDatas } from 'hooks/useService';
import Label from '../label/FormLabel';


export const SelectInput = ({ name, label, register, errors, required, type, placeholder, validationSchema, setValue }) => {

	const { data = [], isLoading, error } = useGetAllDatas()

	const uniqCategories = () => {
		return (data.reduce(
			(unique, item) => (unique.includes(item.category) ? unique : [...unique, item.category]),
			[],
		).sort())
	}

	return (
		<div className="w-full mb-2">
			<Label name={name} label={label} required={required} />
			<div className='flex gap-3'>
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					{...register(name, validationSchema)}
					className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent"
				/>

				{!isLoading && data.length >= 1 ?
					<select
						name="cat"
						id="cat"
						className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-accent arrow"
						onChange={(e) => setValue(name, e.target.value)}
					>
						<option value=''>Catégories</option>
						{uniqCategories().map((item) =>
							<option key={uuid()} value={item}>{item}</option>)}
					</select>
					: null
				}
			</div>
			{errors && errors[name] && (
				<span className="text-error text-sm">{errors[name]?.message}</span>
			)}
		</div>
	)
}
