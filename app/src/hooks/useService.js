import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../utils/axios.utils'
import { API_SERVICES } from '../config/api.config'
import _ from 'lodash'

/* API REQUESTS */
const fetchServices = () => {
    return request({ url: API_SERVICES, method: 'get' })
}

const fetchService = ({ queryKey }) => {
    const serviceId = queryKey[1]
    return request({ url: API_SERVICES + "/" + serviceId, method: 'get' })
}

const postService = service => {
    return request({ url: API_SERVICES, method: 'post', data: service })
}

const putService = service => {
    return request({ url: API_SERVICES + "/" + service.id, method: 'put', data: service })
}


/* HOOKS */
const queryKey = ['services']

export const useServices = (search, sortValue, sortDirection) => {
    return useQuery(queryKey, fetchServices, {
        staleTime: 60_000,
        select: data => {
            if (search === '') return _.orderBy(data['hydra:member'], sortValue, sortDirection)
            else return _.orderBy(data['hydra:member'].filter(f =>
                f.title.toLowerCase().includes(search.toLowerCase()) ||
                f.category.toLowerCase().includes(search.toLowerCase())
            ), sortValue, sortDirection)
        }
    }
    )
}

export const useService = (serviceId) => {
    return useQuery(['service', serviceId], fetchService,
        { cacheTime: 0 }
    )
}

export const usePostService = () => {
    const queryClient = useQueryClient()
    return useMutation(postService, {
        onMutate: async data => {
            await queryClient.cancelQueries(queryKey)
            const previousDatas = queryClient.getQueryData(queryKey)
            console.log('previousDatas', previousDatas)
            queryClient.setQueryData(queryKey, datas => {
                return { ...datas, "hydra:member": [...datas["hydra:member"], { ...data, id: '...' }] }
            })
            return { previousDatas }
        },
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData(queryKey, context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries(queryKey)
        }
    })
}

export const usePutService = () => {
    const queryClient = useQueryClient()
    return useMutation(putService, {
        onMutate: async updateData => {
            await queryClient.cancelQueries(queryKey)
            const previousDatas = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, datas => {
                return { ...datas, "hydra:member": datas["hydra:member"].map((d) => d.id === updateData.id ? updateData : d) }
            })
            return { previousDatas }
        },
        onError: (error, _, context) => {
            console.log('error', error)
            queryClient.setQueryData(queryKey, context.previousDatas)
        },
        onSettled: () => {
            queryClient.invalidateQueries(queryKey)
        }
    })

}