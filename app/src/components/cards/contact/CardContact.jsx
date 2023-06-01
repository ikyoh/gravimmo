import React from 'react'
import { useGetIRI, usePutData } from 'queryHooks/useContact'
import Dropdown from 'components/dropdown/Dropdown'
import ContactForm from 'components/forms/contact/ContactForm'
import Loader from 'components/loader/Loader'

export const CardContact = ({ handleOpenModal, handleCloseModal, iri, trustee, property }) => {

    const { data = {}, isLoading, error } = useGetIRI(iri)
    const { mutate: putData } = usePutData()

    const handleRemoveContact = () => {
        const submitDatas = { ...data }
        if (trustee) {
            submitDatas.trustee = null
            submitDatas.properties = []
            putData(submitDatas)
        }
        if (property) {
            submitDatas.properties = submitDatas.properties.filter(propertyIRI=> propertyIRI != property)
            putData(submitDatas)
        }
    }

    return (
        <div className="card">
            {isLoading ?
                <Loader />
                :
                <>
                    <Dropdown>
                        <button
                            onClick={() => handleRemoveContact()}>
                            Retirer le contact
                        </button>
                        <button
                            onClick={() => handleOpenModal({ title: "modifier le contact", content: <ContactForm iri={data["@id"]} trusteeIRI={data.trustee} handleCloseModal={handleCloseModal} /> })}>
                            Modifier le contact
                        </button>
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

