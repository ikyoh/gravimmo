import React from 'react'

const Thead = ({ children }) => {
    return (
        <thead className='hidden md:table-header-group sticky top-32 bg-white dark:bg-gradient-page-head p-0 z-[1]'>
            <tr>
            {children}
            </tr>
        </thead>
    )
}

export default Thead