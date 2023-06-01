import React from 'react'
import { useGetOneData, useDeleteData } from 'queryHooks/usePropertyService'
import Dropdown from 'components/dropdown/Dropdown'
import PropertyServiceForm from 'components/forms/propertyService/PropertyServiceForm'
import Loader from 'components/loader/Loader'

export const CardService = ({ handleOpenModal, handleCloseModal, iri }) => {

    const { data = {}, isLoading, error } = useGetOneData(iri)
    const { mutate: deleteData } = useDeleteData()

    const parse = (object) => {
        return JSON.parse(object)
    }

    return (
        <div className="card">
            {isLoading ?
                <Loader />
                :
                <>
                    <div className="absolute top-2 right-1">
                        <Dropdown>
                            <button onClick={() => handleOpenModal({ title: "Modifier une prestation", content: <PropertyServiceForm iri={data["@id"]} handleCloseModal={handleCloseModal} /> })}>
                                Modifier la prestation
                            </button>
                            <button
                                onClick={() => deleteData(data.id)}>
                                Retirer la prestation
                            </button>
                        </Dropdown>
                    </div>
                    <div className='flex flex-col'>
                        <div className="mr-auto text-white bg-accent text-sm px-3 py-1 rounded-full">
                            {data.service.category}
                        </div>
                        <div className="subtitle mt-3">
                            {data.service.title}
                        </div>
                        <div className="flex flex-col gap-2">
                            {data.material &&
                                <p>
                                    <span className='text-accent mr-3'>Matière :</span>
                                    {data.material}
                                </p>
                            }
                            {data.size &&
                                <p>
                                    <span className='text-accent mr-3'>Dimension :</span>
                                    {data.size}
                                </p>
                            }
                            {data.color &&
                                <p>
                                    <span className='text-accent mr-3'>Couleur :</span>
                                    {data.color}
                                </p>
                            }
                            {data.font &&
                                <p>
                                    <span className='text-accent mr-3'>Police :</span>
                                    {data.font}
                                </p>
                            }
                            {data.finishing.length > 0 &&
                                <div>
                                    <span className='text-accent mr-3'>Façonnages :</span>
                                    {data.finishing.map(finishing => <p key={finishing}>{finishing}</p>)}
                                </div>
                            }
                            {data.configuration &&
                                <div>
                                    <p className='text-accent'>Config. machine :</p>
                                    <p>{data.configuration}</p>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

