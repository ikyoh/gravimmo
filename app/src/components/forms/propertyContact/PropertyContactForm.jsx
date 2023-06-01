import { useState, useEffect } from 'react'
import { usePutData, useGetIRI } from 'queryHooks/useProperty'
import { useGetIRI as useGetContact } from 'queryHooks/useContact'
import Form from "components/form/form/Form";
import classNames from 'classnames'

export default function PropertyContactForm({ iri, handleCloseModal }) {

    const { data, isLoading, error, isError } = useGetIRI(iri)
    const { mutate } = usePutData()

    const [contacts, setContacts] = useState([])

    useEffect(() => {
        if (data) setContacts(data.contacts)
    }, [data])

    const onSubmit = (event) => {
        event.preventDefault()
        mutate({...data, trustee : data.trustee['@id'], contacts : contacts})
        handleCloseModal()
    }

    const handleUpdateContact = (iri) => {
        if (contacts.includes(iri)) {
            const filterContacts = contacts.filter((f) => f !== iri)
            setContacts(filterContacts)
        }
        else {
            const cloneContacts = JSON.parse(JSON.stringify(contacts))
            cloneContacts.push(iri)
            setContacts(cloneContacts)
        }
    }


    const ContactCard = ({ iri, handleUpdateContact }) => {

        const { data, isLoading, error, isError } = useGetContact(iri)

        const className = classNames("card cursor-pointer",
            {
                "ring-2 ring-accent ring-inset": contacts.includes(iri)
            })

        if (isLoading) return null
        else return (
            <div className={className} onClick={() => handleUpdateContact(iri)}>
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
            </div>
        )
    }

    if (iri) {
        if (isLoading) {
            return <h2>Loading...</h2>
        }
        if (isError) {
            return <h2 className='py-3'>Error : {error.message}</h2>
        }
    }
    return (
        <Form onSubmit={onSubmit}>
            <div className='mt-3 grid grid-cols-2 gap-3'>
                {data.trustee.contacts.map(iri => (
                    <ContactCard handleUpdateContact={handleUpdateContact} iri={iri} key={iri} />
                ))}
            </div>
        </Form>

    )
}