import React from 'react'

const Td = ({ label, text, children, isTextUppercase = false }) => {
    return (
        <td className='pl-2 pr-2 first:pl-5 relative'>
            <div className='flex items-center relative'>
                {label ?
                    <span className="inline-block w-5/12 md:hidden text-sm text-indigo-300">
                        {label}
                    </span>
                    : null
                }
                {children}
                <p className={`overflow-hidden ${isTextUppercase && "first-letter:uppercase"}`}>
                    {text}
                </p>
            </div>
        </td>
    )
}

export default Td 