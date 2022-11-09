import React from 'react'
import { FormSubmitButton } from '../submit-button/FormSubmitButton'


const Form = ({ children, onSubmit, isLoading, isDisabled }) => {
    return (
        <form className="flex flex-col h-full" onSubmit={onSubmit}>
            <div className="px-1 pt-3 grow">
                {children}
            </div>
            <div className="sticky bottom-0 flex justify-center pt-6 pb-9 md:py-4 mt-6 border-t border-slate-600 bg-white dark:bg-dark dark:bg-gradient-modal-footer">
                <FormSubmitButton isLoading={isLoading} isDisabled={isDisabled}  />
            </div>
        </form>
    )
}

export default Form