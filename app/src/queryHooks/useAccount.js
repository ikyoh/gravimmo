import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import { request, requestIRI } from '../utils/axios.utils'
import { API_USERS as API, API_LOGIN, API_LOGOUT, API_CURRENT_USER } from '../config/api.config'


import _ from 'lodash'

/* CONFIG */
const queryKey = 'account'

/* API REQUESTS */
const getCurrentAccount = () => {
    return request({ url: API_CURRENT_USER, method: 'get' })
}

const loginAccount = form => {
    return request({ url: API_LOGIN, method: 'post', data: form })
}

const logoutAccount = () => {
    return request({ url: API_LOGOUT, method: 'post' })
}

const postData = form => {
    return request({ url: API, method: 'post', data: form })
}

const putData = form => {
    return request({ url: API + "/" + form.id, method: 'put', data: form })
}

export const useGetCurrentAccount = () => {
    return useQuery([queryKey], getCurrentAccount, {
        cacheTime: 120000,
        staleTime: 120000,
        retry: 2,
    })
}

export const useLoginAccount = () => {
    const navigate = useNavigate();
    return useMutation(loginAccount, {
        onSuccess: (response) => {
            if (response.roles.includes("ROLE_ADMINISTRATOR")) navigate("/users")
            else navigate("/dashboard")
        },
        onError: (error, _, context) => {
            console.log('error', error)
            console.log('error context', context)
        },
    })
}

export const useLogoutAccount = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(logoutAccount, {
        onSuccess: () => {
            queryClient.removeQueries()
            navigate("/")
        },
        onError: (error, _, context) => {
            console.log('error', error)
            console.log('error context', context)
        },
    })
}

export const usePostData = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(postData, {
        onError: (error, _, context) => {
            console.log('error', error)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        },
        onSuccess: () => {
            navigate("/acknowledgement")
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
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })
}





