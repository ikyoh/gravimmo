import React from 'react'

const Error = ({ errors = false }) => {
    return (
        errors ?
            <span className="text-error text-sm">{errors?.message}</span>
            : null
    )
}

export default Error