import React from 'react'
import { useGetIRI } from 'queryHooks/useProperty'
import Dropdown from 'components/dropdown/Dropdown'
import PropertyServiceForm from 'components/forms/propertyService/PropertyServiceForm'
import Loader from 'components/loader/Loader'

export const CardProperty = ({ handleOpenModal, handleCloseModal, iri }) => {

    const { data = {}, isLoading, error } = useGetIRI(iri)

    return (
        <div className="card">
            {isLoading ?
                <Loader />
                :
                <>
                        <Dropdown>
                            {/* <button onClick={() => handleOpenModal({ title: "Modifier une prestation", content: <PropertyServiceForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}>
                                Modifier la prestation
                            </button>
                            <button
                                onClick={() => deleteData(data.id)}>
                                Retirer la prestation
                            </button> */}
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

