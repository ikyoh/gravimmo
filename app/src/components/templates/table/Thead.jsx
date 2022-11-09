import React from 'react'

const Thead = ({ children }) => {
    return (
        <thead className='hidden md:table-header-group sticky z-10 top-0 bg-white dark:bg-gradient-page-head p-0'>
            <tr>
            {children}
            </tr>
        </thead>
    )
}

export default Thead