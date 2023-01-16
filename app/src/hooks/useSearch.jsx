import { useState } from 'react';
import { BsSearch } from "react-icons/bs";

export const useSearch = (props) => {

    const [searchValue, setSearchvalue] = useState(props ? props : "")

    return {
        searchValue,
        searchbar:
            <div className='md:flex items-center rounded-full border border-dark dark:border-white px-4 h-12 text-dark dark:text-white gap-6 mr-6' >
                <BsSearch size={26} className="text-dark dark:text-white" />
                <input
                    value={searchValue}
                    name='search'
                    type="text"
                    placeholder='Recherche'
                    className='appearance-none outline-none bg-transparent'
                    onChange={(e) => setSearchvalue(e.target.value)}
                />
            </div >
    }
}