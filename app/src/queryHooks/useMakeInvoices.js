import { useQueries } from '@tanstack/react-query'
import { API_INVOICES as API } from '../config/api.config'
import { request, requestIRI } from '../utils/axios.utils'


/* CONFIG */
const queryKey = 'invoices'


/* API REQUESTS */

const postData = data => {
    return request({ url: API, method: 'post', data: data })
}


export const useMakeInvoices = (commandsIRI) => {

    const commands = useQueries({
        queries: commandsIRI
            ? commandsIRI.map((IRI) => {
                return {
                    queryKey: ['commands', IRI],
                    queryFn: () => requestIRI({ url: IRI, method: 'get' }), staleTime: Infinity
                }
            })
            : [], // if commandsIRI is undefined, an empty array will be returned
    })

    const isLoading = commands.some(result => result.isLoading)
    const isSuccess = commands.some(result => result.isSuccess)

    const invoices = useQueries({
        queries: isSuccess && commands
            ? commands.map((command) => {
                return
            })
            : [], // if commandsIRI is undefined, an empty array will be returned
    })


    return { commands, isLoading, isSuccess }

}



