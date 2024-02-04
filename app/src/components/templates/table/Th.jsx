import React from 'react'
import { BsSortDownAlt, BsSortDown } from "react-icons/bs";
import classNames from 'classnames';

const Th = ({ label="", sortBy, sortValue, sortDirection, handleSort, children}) => {

    const className = classNames("text-dark dark:text-white leading-10 font-semibold pl-2 pr-2 first:pl-5",
        {
            "w-28": label === "#",
            "w-12": label === "",
            "cursor-pointer": sortBy,
            "cursor-no-drop": !sortBy,
        }
    )

    if (sortBy) return (
        <th
            className={className}
            onClick={() => handleSort(sortBy)}
        >
            <div className='flex justify-between py-2 h-[60px] items-center'>
                <div>
                    {label}
                </div>
                {sortBy === sortValue && sortDirection === 'asc' &&
                    <BsSortDownAlt size={20} />
                }
                {sortBy === sortValue && sortDirection === 'desc' &&
                    <BsSortDown size={20} />
                }
            </div>
        </th>
    )

    else return (
        <th
            className={className}
        >
            <div className='py-2 0 h-[60px] items-center'>
                <div className="h-full flex items-center">
                    {label}
                    {children}
                </div>
            </div>
        </th>
    )

}

export default Th