import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_ORDERS as API, itemsPerPage } from '../config/api.config'
import _ from 'lodash'
import { generatePassword } from 'utils/functions.utils'

/* CONFIG */
const queryKey = 'orders'

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API, method: 'get' })
}

const fetchFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?pagination=false" + "&order[" + sortValue + "]=" + sortDirection + "&" + searchValue, method: 'get' })
}

const fetchFilteredByStatus = (status) => {
    return request({ url: API + "?pagination=false" + "&status=" + status, method: 'get' })
}

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue, filters) => {
    let options = "?page=" + page + "&itemsPerPage=" + itemsPerPage + "&order[" + sortValue + "]=" + sortDirection
    if (searchValue) options += "&search=" + searchValue
    if (filters.isHanging) options += "&isHanging=true"
    if (filters.status !== "all") options += "&status=" + filters.status
    return request({ url: API + options, method: 'get' })
}

const fetchOneData = ({ queryKey }) => {
    const id = queryKey[1]
    return request({ url: API + "/" + id, method: 'get' })
}

const fetchIRI = ({ queryKey }) => {
    const iri = queryKey[1]
    return requestIRI({ url: iri, method: 'get' })
}

const postData = form => {
    const datas = { ...form, plainPassword: generatePassword(8), roles: ["ROLE_USER"] }
    return request({ url: API, method: 'post', data: datas })
}

const putData = form => {
    return request({ url: API + "/" + form.id, method: 'put', data: form })
}

/* HOOKS */
export const useGetAllDatas = (search = '', sortValue, sortDirection) => {
    return useQuery([queryKey], fetchAllDatas, {
        staleTime: 60_000,
        select: data => {
            if (search === '') return _.orderBy(data['hydra:member'], sortValue, sortDirection)
            else return _.orderBy(data['hydra:member'].filter(f =>
                f.title.toLowerCase().includes(search.toLowerCase())
            ), sortValue, sortDirection)
        }
    })
}

export const useGetFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, sortValue, sortDirection, searchValue],
        queryFn: () => fetchFilteredDatas(sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        staleTime: 60_000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetPaginatedDatas = (page, sortValue, sortDirection, searchValue, filters) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue, filters],
        queryFn: () => fetchPaginatedDatas(page, sortValue, sortDirection, searchValue, filters),
        keepPreviousData: true,
        staleTime: 60_000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetOneData = (id) => {
    return useQuery([queryKey, id], fetchOneData, {
        cacheTime: 60_000,
        enabled: id ? true : false
    })
}

export const useGetIRI = (iri) => {
    return useQuery([queryKey, iri], fetchIRI, {
        cacheTime: 60_000,
        enabled: iri ? true : false
    })
}

export const usePostData = () => {
    const queryClient = useQueryClient()
    return useMutation(postData, {
        onError: (error, _, context) => {
            console.log('error', error)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })
}

export const usePutData = () => {
    const queryClient = useQueryClient()
    return useMutation(putData, {
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey])
        }
    })
}

export const useGetOrdersToInvoiceNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("posée"),
        staleTime: 60_000,
        select: data => data['hydra:totalItems']
    })

}
export const useGetOrdersToDeliverNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("préparéé"),
        staleTime: 60_000,
        select: data => data['hydra:totalItems']
    })
}

