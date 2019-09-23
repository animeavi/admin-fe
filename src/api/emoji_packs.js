import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

import _ from 'lodash'

export async function deletePack(host, token, name) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${name}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function reloadEmoji(host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/admin/reload_emoji',
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function importFromFS(host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/emoji/packs/import_from_fs',
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function createPack(host, token, name) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${name}`,
    method: 'put',
    headers: authHeaders(token)
  })
}

export async function listPacks(host) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/`,
    method: 'get'
  })
}

export async function downloadFrom(host, instance_address, pack_name, as, token) {
  if (as.trim() === '') {
    as = null
  }

  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/emoji/packs/download_from',
    method: 'post',
    headers: authHeaders(token),
    data: { instance_address, pack_name, as },
    timeout: 0
  })
}

export async function savePackMetadata(host, token, name, new_data) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${name}/update_metadata`,
    method: 'post',
    headers: authHeaders(token),
    data: { name, new_data },
    timeout: 0 // This might take a long time
  })
}

function fileUpdateFormData(d) {
  const data = new FormData()

  _.each(d, (v, k) => {
    data.set(k, v)
  })

  return data
}

export async function updatePackFile(host, token, args) {
  let data = null

  switch (args.action) {
    case 'add': {
      const { shortcode, file, fileName } = args

      data = fileUpdateFormData({
        action: 'add',
        shortcode: shortcode,
        file: file
      })
      if (fileName.trim() !== '') {
        data.set('filename', fileName)
      }

      break
    }

    case 'update': {
      const { oldName, newName, newFilename } = args

      data = fileUpdateFormData({
        action: 'update',
        shortcode: oldName,
        new_shortcode: newName,
        new_filename: newFilename
      })

      break
    }

    case 'remove': {
      const { name } = args
      data = fileUpdateFormData({
        action: 'remove',
        shortcode: name
      })

      break
    }
  }

  const { packName } = args

  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/update_file`,
    method: 'post',
    headers: authHeaders(token),
    data: data,
    timeout: 0
  })
}

export function addressOfEmojiInPack(host, packName, name) {
  // This needs http because hackney on the BE does not understand URLs with just "//"
  return `http://${baseName(host)}/emoji/${packName}/${name}`
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
