import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_USERS as API, itemsPerPage } from '../config/api.config'
import _ from 'lodash'
import { generatePassword } from 'utils/functions.utils'

/* CONFIG */
const queryKey = 'installers'

/* API REQUESTS */
const fetchAllDatas = () => {
    let options = "?pagination=false" + "&order[id]=ASC&roles=ROLE_INSTALLER"
    return request({ url: API + options, method: 'get' })
}

const fetchFilteredDatas = (sortValue="id", sortDirection="ASC", searchValue) => {
    let options = "?pagination=false" + "&order[" + sortValue + "]=" + sortDirection + "&roles=ROLE_INSTALLER"
    if (searchValue) options += "&search=" + searchValue
    return request({ url: API + options, method: 'get' })
}

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    let options = "?page=" + page + "&itemsPerPage=" + itemsPerPage + "&order[" + sortValue + "]=" + sortDirection + "&roles=ROLE_INSTALLER"
    if (searchValue) options += "&search=" + searchValue
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
    const datas = { ...form, plainPassword: generatePassword(8), roles : ["ROLE_USER"] }
    return request({ url: API, method: 'post', data: datas })
}

const putData = form => {
    return request({ url: API + "/" + form.id, method: 'put', data: form })
}

/* HOOKS */
export const useGetAllDatas = (search = '', sortValue, sortDirection) => {
    return useQuery([queryKey], fetchAllDatas, {
        cacheTime: 60000,
        staleTime: 60000,
    })
}

export const useGetFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, sortValue, sortDirection, searchValue],
        queryFn: () => fetchFilteredDatas(sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        cacheTime: 60000,
        staleTime: 60000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue],
        queryFn: () => fetchPaginatedDatas(page, sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        cacheTime: 60000,
        staleTime: 60000,
        //select: data => {return data['hydra:member']}
    })
}

export const useGetOneData = (id) => {
    return useQuery([queryKey, id], fetchOneData, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: id ? true : false
    })
}

export const useGetIRI = (iri) => {
    return useQuery([queryKey, iri], fetchIRI, {
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
            queryClient.invalidateQueries()
        }
    })
}