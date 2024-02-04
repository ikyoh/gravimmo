import React from 'react'

const Thead = ({ children }) => {
    return (
            <thead className='hidden md:table-header-group p-0 border-b border-light/10'>
                <tr className=''>
                    {children}
                </tr>
            </thead>
    )
}

export default Thead