import React from 'react'
import { useGetOneData, useDeleteData} from 'hooks/usePropertyService'
import Dropdown from 'components/dropdown/Dropdown'

export const CardService = ({ id }) => {

    const { data = {}, isLoading, error } = useGetOneData(id)
    const { mutate: deleteData } = useDeleteData()

    return (
        <div className="card">
            {isLoading ?
                <div>Loading</div>
                :
                <>
                    <div className="absolute top-2 right-1">
                        <Dropdown>
                            <div
                                onClick={() => handleOpenModal({ title: "modifier la copropriété", content: <PropertyForm id={data.id} handleCloseModal={handleCloseModal} /> })}>
                                Modifier la prestation
                            </div>
                            <div
                                onClick={() => deleteData(data.id)}>
                                Retirer la prestation
                            </div>
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
                            {data.margin &&
                                <p>
                                    <span className='text-accent mr-3'>Marges :</span>
                                    H : {data.margin.top} - B : {data.margin.bottom} - G : {data.margin.left} - D : {data.margin.right}
                                </p>
                            }
                            {data.material &&
                                <p>
                                    <span className='text-accent mr-3'>Matière :</span>
                                    {data.material}
                                </p>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

