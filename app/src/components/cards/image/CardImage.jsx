import React from 'react'
import { useGetIRI, useDeleteIRI } from 'queryHooks/useMedia'
import Dropdown from 'components/dropdown/Dropdown'
import ContactForm from 'components/forms/contact/ContactForm'
import Loader from 'components/loader/Loader'

export const CardImage = ({ iri }) => {

    const { data = {}, isLoading, error } = useGetIRI(iri)
    const { mutate } = useDeleteIRI()

    const handleRemove = () => {
        mutate(iri)
    }

    return (
        <div className="card">
            {isLoading ?
                <Loader />
                :
                <>
                    <Dropdown>
                        <button
                            onClick={() => handleRemove()}>
                            Retirer le visuel
                        </button>
                    </Dropdown>
                    <div className='flex pr-5'>
                        <img src={data.contentUrl} className='object-cover rounded' />
                    </div>
                </>
            }
        </div>
    )
}

