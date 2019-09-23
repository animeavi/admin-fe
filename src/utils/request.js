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
    console.log('Error ' + error)
    Message({
      message: `${error.message} - ${error.response.data}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
