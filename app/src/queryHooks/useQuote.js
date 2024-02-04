import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_QUOTES as API, IRI, itemsPerPage } from '../config/api.config'
import _ from 'lodash'
import dayjs from 'dayjs'

/* CONFIG */
const queryKey = 'quotes'

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
    let options = "?order[" + sortValue + "]=" + sortDirection
    if (filters.beginAt === "" || filters.endAt === "") options += "&page=" + page + "&itemsPerPage=" + itemsPerPage
    if (filters.beginAt !== "" || filters.endAt !== "") options += "&pagination=false"
    if (searchValue) options += "&search=" + searchValue
    if (filters.refundReference) options += "&exists[refundReference]=true"
    if (filters.isSend) options += "&isSend=false"
    if (filters.status !== "all") options += "&status=" + filters.status
    if (filters.beginAt !== "") options += "&createdAt[after]=" + filters.beginAt
    if (filters.endAt !== "") options += "&createdAt[before]=" + dayjs(filters.endAt).add(1, 'day').format('YYYY-MM-DD')
    return request({ url: API + options, method: 'get' })
}

const fetchData = ({ queryKey }) => { 
    const iri = queryKey[0]
    return requestIRI({ url: iri, method: 'get' })
}

const fetchIRI = ({ queryKey }) => {
    const iri = queryKey[1]
    return requestIRI({ url: iri, method: 'get' })
}

const postData = form => {
    return request({ url: API, method: 'post', data: form })
}

const putData = form => {
    return request({ url: API + "/" + form.id, method: 'put', data: form })
}

/* HOOKS */
export const useGetAllDatas = (search = '', sortValue, sortDirection) => {
    return useQuery([queryKey], fetchAllDatas, {
        staleTime: 60000,
        cacheTime: 60000,
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
        staleTime: 60000,
        cacheTime: 60000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetPaginatedDatas = (page, sortValue, sortDirection, searchValue, filters) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue, filters],
        queryFn: () => fetchPaginatedDatas(page, sortValue, sortDirection, searchValue, filters),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetID = (id) => {
    return useQuery([IRI + API + "/" + id], fetchData, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: id ? true : false
    })
}

export const useGetIRI = (iri) => {
    return useQuery([iri], fetchIRI, {
        staleTime: 60000,
        cacheTime: 60000,
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
            return null
        },
        onSuccess: (data) => {
            return data
        },
    })
}

export const usePutData = () => {
    const queryClient = useQueryClient()
    return useMutation(putData, {
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([queryKey])
            queryClient.invalidateQueries([data["@id"]])
        }
    })
}

export const useGetOrdersToInvoiceNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("posée"),
        staleTime: 60000,
        cacheTime: 60000,
        select: data => data['hydra:totalItems']
    })

}

export const useGetOrdersToDeliverNumber = () => {
    return useQuery({
        queryKey: [queryKey, "ToInvoiceNumber"],
        queryFn: () => fetchFilteredByStatus("préparéé"),
        staleTime: 60000,
        cacheTime: 60000,
        select: data => data['hydra:totalItems']
    })
}

