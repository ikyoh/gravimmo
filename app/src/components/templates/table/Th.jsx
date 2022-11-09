import React from 'react'
import { BsSortDownAlt } from "react-icons/bs";
import { BsSortDown } from "react-icons/bs";
import classNames from 'classnames';

const Th = ({ label, sortBy, sortValue, sortDirection, setSortValue }) => {


    const className = classNames("text-dark dark:text-white leading-10 font-semibold p-0",
        {
            "cursor-pointer": sortBy,
            "cursor-no-drop": !sortBy,
        }
    )


    return (
        <th
            className={className}
            onClick={() => setSortValue(sortBy)}
        >
            <div className='flex justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-600 h-[60px] items-center'>
                <div className="">
                    {label}
                </div>
                {sortBy && sortBy === sortValue &&
                    <BsSortDownAlt size={20} />
                }
            </div>
        </th>
    )
}

export default Th