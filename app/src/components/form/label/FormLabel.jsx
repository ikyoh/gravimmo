import React from 'react'

const FormLabel = ({name, label, required}) => {
    return (
        <label htmlFor={name}
            className="text-dark dark:text-blue-500">
            {label}
            {required && " *"}
        </label>
    )
}

export default FormLabel