import React from 'react';
import { MdClose } from "react-icons/md";

interface ButtonProps {
    label?: string,
    isActive?: boolean,
    onClick?: (e: MouseEvent) => void;
}

export const Button = ({
    isActive = true,
    onClick
}: ButtonProps) => {
    return (
        <>
            <button className="h-16 w-16 flex items-center justify-center p-0.5 rounded-full group bg-gradient-to-br from-purple-500 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white  focus:ring-4 focus:ring-blue-500 ring-offset-2 dark:focus:ring-blue-500">
                <div className="w-full h-full flex items-center justify-center transition-all ease-in duration-75 bg-white dark:text-white dark:bg-dark group-hover:bg-opacity-0 rounded-full">
                    <MdClose size={36} />
                </div>
            </button>
        </>

    )
}