import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_MEDIAS as API, itemsPerPage } from '../config/api.config'
import _ from 'lodash'

/* CONFIG */
const queryKey = 'media'

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API + "?pagination=false", method: 'get' })
}

const fetchFilteredDatas = (sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?pagination=false" + "&order[" + sortValue + "]=" + sortDirection + "&" + searchValue, method: 'get' })
}

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?page=" + page + "&itemsPerPage=" + itemsPerPage + "&order[" + sortValue + "]=" + sortDirection + "&search[id,fullname,organization,email,rcc,gln]=" + searchValue, method: 'get' })
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
    console.log('form', form)
    const formData = new FormData()
    formData.append('file', form.file[0])
    if (form.command) formData.append('command', form.command)
    return request({ url: API, method: 'post', data: formData })
}

const deleteIRI = iri => {
    return requestIRI({ url: iri, method: 'delete'})
}

const deleteID = id => {
    return request({ url: API + "/" + id, method: 'delete' })
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
        },
        onSuccess: (data) => {
            return data
        }
    })
}

export const useDeleteIRI = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteIRI, {
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })
}

export const useDeleteID = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteID, {
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })
}