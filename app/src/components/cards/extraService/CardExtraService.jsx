import React from 'react'
import { useGetIRI, usePutData } from 'queryHooks/useService'
import Dropdown from 'components/dropdown/Dropdown'
import ContactForm from 'components/forms/contact/ContactForm'
import Loader from 'components/loader/Loader'

export const CardExtraService = ({ iri, handleRemoveService }) => {

    const { data = {}, isLoading, error } = useGetIRI(iri)


return (
    <div className="card">
        {isLoading ?
            <Loader />
            :
            <>
                <Dropdown>
                    <button
                        onClick={() => handleRemoveService(iri)}>
                        Retirer la prestation
                    </button>
                </Dropdown>
                <div className='flex flex-col'>
                    <div className="mr-auto text-white bg-accent text-sm px-3 py-1 rounded-full">
                        {data.category}
                    </div>
                    <div className="subtitle mt-3">
                        {data.title}
                    </div>
                </div>
            </>
        }
    </div>
)
}

