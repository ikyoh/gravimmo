import { useState } from 'react';
import { BsSearch, BsFilter } from "react-icons/bs";

export const useFilters = () => {

    const [searchValue, setSearchvalue] = useState("")

    return {
        searchValue,
        searchbar:
            <div className='md:flex items-center rounded-full border px-4 h-12 text-white gap-6 mr-6' >
                <BsSearch size={26} />
                <input
                    name='search'
                    type="text"
                    placeholder='Recherche'
                    className='appearance-none outline-none bg-transparent'
                    onChange={(e) => setSearchvalue(e.target.value)}
                />
                <div className='pl-8 flex items-center space-x-4'>
                    <BsFilter size={26} />
                </div>
            </div >
    }
}