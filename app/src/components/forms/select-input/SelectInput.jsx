import React from 'react';
import { useQueryClient } from '@tanstack/react-query'
import uuid from "react-uuid"
import './style.css'


export const SelectInput = ({ name, label, register, errors, required, type, placeholder, validationSchema, setValue }) => {

	const queryClient = useQueryClient();

	const uniqCategories = queryClient.getQueryData(["services"])["hydra:member"].reduce(
		(unique, item) => (unique.includes(item.category) ? unique : [...unique, item.category]),
		[],
	).sort()

	return (
		<div className="w-full mb-2">
			<label htmlFor={name}
				className="text-dark dark:text-white text-sm">
				{label}
				{required && " *"}
			</label>
			<div className='flex gap-3'>
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					{...register(name, validationSchema)}
					className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-blue-500"
				/>
				<select
					name="cat"
					id="cat"
					className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 mt-2 w-full leading-tight focus:outline focus:outline-blue-500 arrow"
					onChange={(e) => setValue(name, e.target.value)}
				>
					{uniqCategories.map((item) =>
						<option key={uuid()} value={item}>{item}</option>)}
				</select>
			</div>
			{errors && errors[name] && (
				<span className="text-error text-sm">{errors[name]?.message}</span>
			)}
		</div>
	)
}
