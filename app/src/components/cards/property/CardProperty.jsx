import React from 'react'
import { useGetIRI } from 'queryHooks/useProperty'
import Dropdown from 'components/dropdown/Dropdown'
import PropertyForm from 'components/forms/property/PropertyForm'
import Loader from 'components/loader/Loader'

export const CardProperty = ({ handleOpenModal, handleCloseModal, iri }) => {

    const { data, isLoading, error } = useGetIRI(iri)

    return (
        <div className="_card">
            {isLoading ?
                <Loader />
                :
                <>
                    <Dropdown type="card">
                        <button onClick={() => handleOpenModal({ title: "Modifier la copropriété", content: <PropertyForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
                            Modifier la copropriété
                        </button>
                    </Dropdown>
                    <div className='flex flex-col'>
                        <div className="subtitle">
                            {data.title}
                        </div>
                        <p>{data.address}</p>
                        <p>{data.postcode}</p>
                        <p>{data.city}</p>
                    </div>
                </>
            }
        </div>
    )
}

