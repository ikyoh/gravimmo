import axios from 'axios'
import { API_URL } from '../config/api.config'

const client = axios.create({ baseURL: API_URL })

export const request = async ({ ...options }) => {
  // client.defaults.headers.common.Authorization = `Bearer token`

  const onSuccess = response => {
    //console.log('Axios utils response', response)
    return response.data
  }
  const onError = error => {
    //console.log('Axios utils error', error)
    return Promise.reject(error);
  }

  //await new Promise(resolve => setTimeout(resolve, 1000))

  return client(options).then(onSuccess).catch(onError)
}