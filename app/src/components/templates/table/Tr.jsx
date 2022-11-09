import React from 'react'
import classNames from 'classnames'

const Tr = ({ onClick, children }) => {

    const ClassNames = classNames("flex flex-col md:table-row border-b border-slate-500/20 text-dark dark:text-white leading-8 md:leading-[3em]",
        {
            "hover:bg-dark cursor-pointer": onClick,
        })

    return (
        <tr
            onClick={onClick}
            className={ClassNames}
        >
            {children}
        </tr>
    )
}

export default Tr