import React, { useState } from 'react';
import { useFieldArray } from "react-hook-form";
import { Button } from 'components/button/Button';
import { IoIosClose } from "react-icons/io";
import Label from '../label/FormLabel';

const FieldArray = ({ name, label, required, placeholder, control }) => {

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: name
    });

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState();

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget
        setError()
        setInputValue(value)
    }

    const handleAddItem = () => {
        if (inputValue !== '') {
            append(inputValue)
            setInputValue('')
        }
        else setError("Champ requis")
    }


    const formatFieldValue = (field) => {
        const formattedField = {...field}
        delete formattedField.id
        return Object.values(formattedField).join('') // object values to array
    }

    return (
        <div className="w-full mb-2">
            <Label name={name} label={label} required={required} />
            <div className='mt-2 flex flex-row items-center gap-2'>
                <input
                    name="data"
                    placeholder={placeholder}
                    className="appearance-none bg-light dark:bg-dark text-dark dark:text-white h-[50px] rounded px-2 grow leading-tight focus:outline focus:outline-accent"
                    onChange={handleChange}
                    value={inputValue}
                />
                <Button onClick={handleAddItem} />
            </div>
            {error && <span className="text-error text-sm">{error}</span>}
            <div className='flex flex-row flex-wrap gap-3 mt-3'>
                {fields.map((field, index) =>
                    <div key={field.id} className='flex items-center rounded bg-dark h-[50px] pl-3 text-white'>
                        {formatFieldValue(field)}
                        <IoIosClose size={32} className="text-slate-600 cursor-pointer" onClick={() => remove(index)} />
                    </div>
                )}
            </ div>
        </div>
    )
}

export default FieldArray