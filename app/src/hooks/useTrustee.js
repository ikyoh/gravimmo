import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../utils/axios.utils'
import { API_TRUSTEES } from '../config/api.config'
import _ from 'lodash'

/* API REQUESTS */
const fetchTrustees = () => {
    return request({ url: API_TRUSTEES, method: 'get' })
}

const fetchTrustee = ({ queryKey }) => {
    const trusteeId = queryKey[1]
    return request({ url: API_TRUSTEES + "/" + trusteeId, method: 'get' })
}

const postTrustee = trustee => {
    return request({ url: API_TRUSTEES, method: 'post', data: trustee })
}

const putTrustee = trustee => {
    return request({ url: API_TRUSTEES + "/" + trustee.id, method: 'put', data: trustee })
}


/* HOOKS */
const queryKey = ['trustees']

export const useTrustees = (search, sortValue, sortDirection) => {
    return useQuery(queryKey, fetchTrustees, {
        staleTime: 60_000,
        select: data => {
            if (search === '') return _.orderBy(data['hydra:member'], sortValue, sortDirection)
            else return _.orderBy(data['hydra:member'].filter(f =>
                f.title.toLowerCase().includes(search.toLowerCase()) ||
                f.city.toLowerCase().includes(search.toLowerCase()) ||
                f.postcode.toLowerCase().includes(search.toLowerCase())
            ), sortValue, sortDirection)
        }
    }
    )
}

export const useTrustee = (trusteeId) => {
    return useQuery(['trustee', trusteeId], fetchTrustee,
        { cacheTime: 0 }
    )
}

export const usePostTrustee = () => {
    const queryClient = useQueryClient()
    return useMutation(postTrustee, {
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

export const usePutTrustee = () => {
    const queryClient = useQueryClient()
    return useMutation(putTrustee, {
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