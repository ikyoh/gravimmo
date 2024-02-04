import React from 'react'
import classNames from 'classnames'

const Tr = ({ onClick, children }) => {

    const ClassNames = classNames("flex flex-col md:table-row text-dark dark:text-white leading-8 lg:leading-normal xl:leading-[3em]",
        {
            "hover:bg-light dark:hover:bg-dark cursor-pointer": onClick,
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