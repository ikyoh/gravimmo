import React from 'react'
import { useGetIRI, usePutData } from 'queryHooks/useExtraService'
import { useGetIRI as useGetService } from 'queryHooks/useExtraService'
import Dropdown from 'components/dropdown/Dropdown'
import Loader from 'components/loader/Loader'

export const CardExtraService = ({ iri }) => {

    const { data, isLoading, error } = useGetIRI(iri)
    const { data: dataService, isLoading: isLoadingService } = useGetService(data && !isLoading ? data.service : null)

    return (
        <div className="_card">
            {isLoading || isLoadingService ? <Loader /> :
                <>
                    <div className='flex flex-col'>
                        <div className="mr-auto text-white bg-accent text-sm px-3 py-1 rounded-full">
                            {dataService.category}
                        </div>
                        <div className="subtitle mt-3">
                            {dataService.title}
                        </div>
                        {data.details.quantity &&
                            <div>
                                <span className='text-accent'>Quantité : </span>
                                <span>
                                    {data.details.quantity}
                                </span>
                            </div>
                        }
                        {data.details.comment &&
                            <div>
                                <span className='text-accent'>Commentaire : </span>
                                <span>
                                    {data.details.comment}
                                </span>
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

