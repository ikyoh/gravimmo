import React from 'react'
import { CgSpinner } from "react-icons/cg";

interface ButtonProps {
    /**
     * Button contents
     */
    label?: string;
    /**
     * Is the form loading?
     */
    isLoading?: boolean;
    /**
     * Is the button disabled?
     */
    isDisabled?: boolean;
}


export const FormSubmitButton = ({
    label = "Valider",
    isLoading = false,
    isDisabled = false

}: ButtonProps) => {
    
    const buttonStyles = "text-white font-semibold uppercase p-3 rounded w-[220px] h-[50px] flex justify-center items-center bg-gradient-to-b from-action to-actiongradient focus:bg-gradient-to-b focus:from-actiongradient focus:to-action"
    const buttonDisabledStyles = "text-white font-semibold uppercase p-3 rounded w-[220px] h-[50px] flex justify-center items-center bg-gradient-to-b from-slate-400 to-slate-500"

    return (
        <button
            type="submit"
            className={`${isDisabled ? buttonDisabledStyles
                : buttonStyles}`}
            disabled={isDisabled}
        >
            {isLoading ? <CgSpinner size={24} className='animate-spin' /> : label}
        </button>
    )
}
