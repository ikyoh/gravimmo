import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request, requestIRI } from '../utils/axios.utils'
import { API_SERVICES as API , itemsPerPage } from '../config/api.config'
import _ from 'lodash'

/* CONFIG */
const queryKey = 'services'

/* API REQUESTS */
const fetchAllDatas = () => {
    return request({ url: API, method: 'get' })
}

const fetchPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return request({ url: API + "?page=" + page + "&itemsPerPage=" + itemsPerPage +"&order[" + sortValue + "]=" + sortDirection + "&search[id,category,title]=" + searchValue , method: 'get' })
}

const fetchOneData = ({ queryKey }) => {
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
export const useGetAllDatas = (search='', sortValue, sortDirection) => {
    return useQuery([queryKey], fetchAllDatas, {
        staleTime: 60_000,
        select: data => {
            if (search === '') return _.orderBy(data['hydra:member'], sortValue, sortDirection)
            else return _.orderBy(data['hydra:member'].filter(f =>
                f.title.toLowerCase().includes(search.toLowerCase()) ||
                f.category.toLowerCase().includes(search.toLowerCase())
            ), sortValue, sortDirection)
        }
    })
}

export const useGetPaginatedDatas = (page, sortValue, sortDirection, searchValue) => {
    return useQuery({
        queryKey: [queryKey, page, sortValue, sortDirection, searchValue],
        queryFn: () => fetchPaginatedDatas(page, sortValue, sortDirection, searchValue),
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

export const usePostData = () => {
    const queryClient = useQueryClient()
    return useMutation(postData, {
        onMutate: async data => {
            await queryClient.cancelQueries([queryKey])
            const previousDatas = queryClient.getQueryData([queryKey])
            queryClient.setQueryData([queryKey], datas => {
                return { ...datas, "hydra:member": [...datas["hydra:member"], { ...data, id: '...' }] }
            })
            return { previousDatas }
        },
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey])
        }
    })
}

export const usePutData = () => {
    const queryClient = useQueryClient()
    return useMutation(putData, {
        onMutate: async updateData => {
            await queryClient.cancelQueries([queryKey])
            const previousDatas = queryClient.getQueryData([queryKey])
            queryClient.setQueryData([queryKey], datas => {
                console.log('datas', datas)
                return { ...datas, "hydra:member": datas["hydra:member"].map((d) => d.id === updateData.id ? updateData : d) }
            })
            return { previousDatas }
        },
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData([queryKey], context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries([queryKey])
        }
    })

}