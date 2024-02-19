import { useState } from "react";
import { BsSearch } from "react-icons/bs";

export const useSearch = (props) => {
    const [searchValue, setSearchvalue] = useState(props ? props : "");

    return {
        setSearchvalue,
        searchValue,
        searchbar: (
            <div className="flex items-center rounded-full border border-dark dark:border-white px-4 h-12 text-dark dark:text-white gap-2 md:gap-6">
                <BsSearch size={26} className="text-dark dark:text-white" />
                <input
                    value={searchValue}
                    name="search"
                    type="search"
                    placeholder="Recherche"
                    className="appearance-none outline-none bg-transparent w-full"
                    onChange={(e) => setSearchvalue(e.target.value)}
                    autoFocus={true}
                />
            </div>
        ),
    };
};
