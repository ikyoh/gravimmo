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
    return (
        <button
            type="submit"
            className={`${isDisabled ? "submit-button-disabled" : "submit-button"}`}
            disabled={isDisabled}
        >
            {isLoading ?  <CgSpinner size={24} className='animate-spin' />  : label}
        </button>
    )
}
