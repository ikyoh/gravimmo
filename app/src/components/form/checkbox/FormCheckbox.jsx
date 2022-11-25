import React from 'react'

const FormCheckbox = ({ name, register }) => {
    return (
        <input {...register(name)}
            id={name}
            name={name}
            type="checkbox"
        />
    )
}

export default FormCheckbox