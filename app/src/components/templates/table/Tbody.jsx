import React from 'react'

const Tbody = ({ children }) => {
    return (
        <tbody className='divide-y dark:divide-gray-800'>
            {children}
        </tbody>
    )
}

export default Tbody