import request from '@/utils/request'
import { baseName } from './utils'

export async function getNodeInfo(authHost) {
  return await request({
    baseURL: baseName(authHost),
    url: `/nodeinfo/2.0.json`,
    method: 'get'
  })
}
