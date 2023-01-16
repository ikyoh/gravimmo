import React from 'react'
import { useGetOneData } from 'hooks/useContact'
import Dropdown from 'components/dropdown/Dropdown'
import ContactForm from 'forms/contact/ContactForm'

export const CardContact = ({ handleOpenModal, handleCloseModal, iri }) => {

    const { data = {}, isLoading, error } = useGetOneData(iri)

    return (
        <div className="card">
            {isLoading ?
                <div>Loading</div>
                :
                <>
                    <Dropdown>
                        <div
                            onClick={() => handleOpenModal({ title: "modifier le contact", content: <ContactForm iri={data["@id"]} trusteeIRI={data.trustee} handleCloseModal={handleCloseModal} /> })}>
                            Modifier le contact
                        </div>
                    </Dropdown>
                    <div className='flex flex-col'>
                        <div className="mr-auto text-white bg-accent text-sm px-3 py-1 rounded-full">
                            {data.title}
                        </div>
                        <div className="subtitle mt-3">
                            {data.lastname} {data.firstname}
                        </div>
                        <div>
                            {data.phone}
                        </div>
                        <div>
                            {data.email}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

