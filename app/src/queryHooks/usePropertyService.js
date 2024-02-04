
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_PROPERTY_SERVICES as API, itemsPerPage } from '../config/api.config'
import _ from 'lodash'

/* CONFIG */
const queryKey = 'propertyservices'

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API, method: 'get' })
}

const fetchFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?pagination=false" + "&order[" + sortValue + "]=" + sortDirection + "&" + searchValue, method: 'get' })
}

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?page=" + page + "&itemsPerPage=" + itemsPerPage + "&order[" + sortValue + "]=" + sortDirection + "&search[id,title,postcode,city,zone]=" + searchValue, method: 'get' })
}

const fetchOneData = ({ queryKey }) => {
    const iri = queryKey[1]
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

const deleteData = id => {
    return request({ url: API + "/" + id, method: 'delete' })
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

export const useGetPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue],
        queryFn: () => fetchPaginatedDatas(page, sortValue, sortDirection, searchValue),
        keepPreviousData: true,
        staleTime: 60000,
        cacheTime: 60000,
        //select: data => {return data['hydra:member']}
    })

}

export const useGetOneData = (iri) => {
    return useQuery([queryKey, iri], fetchOneData, {
        staleTime: 60000,
        cacheTime: 60000,
        enabled: iri ? true : false
    })
}

export const useGetIRI = (iri) => {
    const queryClient = useQueryClient()
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
            queryClient.invalidateQueries([queryKey])
        }
    })
}

export const useDeleteData = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteData, {
        onError: (error, _, context) => {
            console.log('error', error)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })
}