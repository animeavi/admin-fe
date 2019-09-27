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

    Message({
      message: `${error.message} - ${edata}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
