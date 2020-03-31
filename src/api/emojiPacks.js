import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

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
    url: '/api/pleroma/emoji/packs/import',
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function createPack(host, token, name) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${name}`,
    method: 'post',
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

export async function downloadFrom(host, instance, pack_name, as, token) {
  if (as.trim() === '') {
    as = null
  }

  return await request({
    baseURL: baseName(host),
    url: '/api/pleroma/emoji/packs/download',
    method: 'post',
    headers: authHeaders(token),
    data: { url: baseName(instance), name: pack_name, as },
    timeout: 0
  })
}

export async function savePackMetadata(host, token, name, metadata) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${name}`,
    method: 'patch',
    headers: authHeaders(token),
    data: { metadata },
    timeout: 0 // This might take a long time
  })
}

export async function addNewEmojiFile(packName, file, shortcode, filename, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/files`,
    method: 'post',
    headers: authHeaders(token),
    data: {
      file,
      shortcode: shortcode.trim() !== '' ? shortcode : null,
      filename: filename.trim() !== '' ? filename : null }
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

export async function deleteEmojiFile(packName, shortcode, host, token) {
  return await request({
    baseURL: baseName(host),
    url: `/api/pleroma/emoji/packs/${packName}/files`,
    method: 'delete',
    headers: authHeaders(token),
    data: { shortcode }
  })
}

export function addressOfEmojiInPack(host, packName, name) {
  return `${baseName(host)}/emoji/${packName}/${name}`
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
