import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function addNewEmojiFile(packName, file, shortcode, filename, host, token) {
  const data = new FormData()
  if (filename.trim() !== '') {
    data.set('filename', filename)
  }
  if (shortcode.trim() !== '') {
    data.set('shortcode', shortcode)
  }
  data.set('file', file)

  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/files`,
    method: 'post',
    headers: authHeaders(token),
    data
  })
}

export function addressOfEmojiInPack(host, packName, name) {
  return `${baseName(host)}/emoji/${packName}/${name}`
}

export async function createPack(host, token, packName) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}`,
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function deleteEmojiFile(packName, shortcode, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/files`,
    method: 'delete',
    headers: authHeaders(token),
    data: { shortcode }
  })
}

export async function deletePack(host, token, packName) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function downloadFrom(host, instance, packName, as, token) {
  if (as.trim() === '') {
    as = null
  }

  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/emoji/packs/download',
    method: 'post',
    headers: authHeaders(token),
    data: { url: baseName(instance), name: packName, as },
    timeout: 0
  })
}

export async function fetchPack(packName, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function importFromFS(host, token) {
  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/emoji/packs/import',
    method: 'get',
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

export async function listRemotePacks(host, token, instance) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/remote?url=${baseName(instance)}`,
    method: 'get',
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

export async function savePackMetadata(host, token, packName, metadata) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}`,
    method: 'patch',
    headers: authHeaders(token),
    data: { metadata },
    timeout: 0 // This might take a long time
  })
}

export async function updateEmojiFile(packName, shortcode, newShortcode, newFilename, force, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/files`,
    method: 'patch',
    headers: authHeaders(token),
    data: { shortcode, new_shortcode: newShortcode, new_filename: newFilename, force }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
