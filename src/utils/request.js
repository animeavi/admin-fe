import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  timeout: 60000 // request timeout
})

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log(`Error ${error}`)
    console.log(error.response.data)

    // If there's an "error" property in the json, use it
    const edata = error.response.data.error ? error.response.data.error : error.response.data
    const message = !error.response.headers['content-type'].includes('application/json')
      ? `${error.message}`
      : `${error.message} - ${edata}`

    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
