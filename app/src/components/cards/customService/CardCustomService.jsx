import { useGetIRI, usePutData } from 'queryHooks/useCustomService'
import { useGetIRI as useService } from 'queryHooks/useService'
import Dropdown from 'components/dropdown/Dropdown'
import Loader from 'components/loader/Loader'
import { commandDetails } from "config/translations.config"

export const CardCustomService = ({ iri, handleRemoveService }) => {

    const { data = {}, isLoading, error } = useGetIRI(iri)
    const { data: service, isLoading: isLoadingService } = useGetIRI(data.service && data.service)

    console.log('data', data)

    return(
        <div className="_card">
            {isLoading || isLoadingService ?
                <Loader />
                :
                <>
                    <Dropdown>
                        <button
                            onClick={() => handleRemoveService(iri)}>
                            Retirer la prestation
                        </button>
                    </Dropdown>
                    <div className='flex flex-col card'>
                        <div className="mr-auto text-white bg-accent text-sm px-3 py-1 rounded-full">
                            {service.category}
                        </div>
                        <div className="subtitle mt-3">
                            {service.title}
                        </div>
                        {Object.keys(data.details).map(key =>
                            <div>{commandDetails[key]} - {data.details[key]}</div>
                        )}
                    </div>
                </>
            }
        </div>
    )
}

