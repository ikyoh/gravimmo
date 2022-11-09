import React from 'react'

const Td = ({ label, text, children }) => {
    return (
        <td className='px-4'>
            {label ?
                <span className="inline-block w-5/12 md:hidden text-sm text-indigo-300">
                    {label}
                </span>
                : null
            }
            {text}
            {children}
        </td>
    )
}

export default Td 