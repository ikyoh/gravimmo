import React from 'react'

const FormError = ({ error }) => {
    return (
        error ?
            <span className="text-error text-sm">{error?.message}</span>
            : null
    )
}

export default FormError