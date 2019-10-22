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
    let errorMessage
    console.log(`Error ${error}`)

    if (error.response) {
      const edata = error.response.data.error ? error.response.data.error : error.response.data
      errorMessage = !error.response.headers['content-type'].includes('application/json')
        ? `${error.message}`
        : `${error.message} - ${edata}`
    } else {
      errorMessage = error
    }

    Message({
      message: errorMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
