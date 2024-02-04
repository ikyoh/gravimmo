import React from 'react'
import { useGetOneData, useDeleteData } from 'queryHooks/usePropertyService'
import Dropdown from 'components/dropdown/Dropdown'
import PropertyServiceForm from 'components/forms/propertyService/PropertyServiceForm'
import uuid from 'react-uuid'
import Loader from 'components/loader/Loader'

export const CardProduction = ({ handleOpenModal, handleCloseModal, iri }) => {

    const { data = {}, isLoading, error } = useGetOneData(iri)
    const { mutate: deleteData } = useDeleteData()

    return (
        <div className="_card">
            {isLoading ?
                <Loader />
                :
                <>
                    <div className='flex flex-col '>
                        <div className="mr-auto text-white bg-neutral text-sm px-3 py-1 rounded-full">
                            {data.service.category}
                        </div>
                        <div className="subtitle mt-3">
                            {data.service.title}
                        </div>
                        <div className="">
                            {data.material &&
                                <>
                                    <p className='text-accent mt-2'>Matière :</p>
                                    <p>
                                        {data.material}
                                    </p>
                                </>
                            }
                            {data.color &&
                                <>
                                    <p className='text-accent mt-2'>Couleur :</p>
                                    <p>
                                        {data.color}
                                    </p>
                                </>
                            }
                            {data.finishing.length > 0 &&
                                <>
                                    <p className='text-accent mt-2'>Façonnages :</p>
                                    {data.finishing.map(finishing => <p key={finishing}>{finishing}</p>)}
                                </>
                            }
                            {data.configuration &&
                                <>
                                    <p className='text-accent mt-2'>Config. machine :</p>
                                    <p>
                                        {data.configuration}
                                    </p>
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

