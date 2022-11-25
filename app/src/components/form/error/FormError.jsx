import React from 'react'

const FormError = ({ errors = false }) => {
    return (
        errors ?
            <span className="text-error text-sm">{errors?.message}</span>
            : null
    )
}

export default FormError