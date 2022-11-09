import React from 'react'

const Table = ({children}) => {
    return (
        <table className="w-full table-fixed text-left border-collapse">
            {children}
        </table>
    )
}

export default Table