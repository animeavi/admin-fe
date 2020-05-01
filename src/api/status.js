import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/statuses/${id}`,
    method: 'put',
    headers: authHeaders(token),
    data: { sensitive, visibility }
  })
}

export async function deleteStatus(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/statuses/${id}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function fetchStatus({ godmode, localOnly, authHost, token, pageSize, page }) {
  return {
    data:
      {
        'account': {
          'acct': 'leo',
          'avatar': 'http://localhost:4000/images/avi.png',
          'avatar_static': 'http://localhost:4000/images/avi.png',
          'bot': false,
          'created_at': '2019-10-24T17:19:12.000Z',
          'display_name': 'leo',
          'emojis': {},
          'fields': {},
          'followers_count': 0,
          'following_count': 0,
          'header': 'http://localhost:4000/images/banner.png',
          'header_static': 'http://localhost:4000/images/banner.png',
          'id': '9oG0YghgBi94EATI9I',
          'locked': false,
          'note': '.',
          'pleroma': {
            'background_image': null,
            'confirmation_pending': false,
            'hide_favorites': true,
            'hide_followers': false,
            'hide_followers_count': false,
            'hide_follows': false,
            'hide_follows_count': false,
            'is_admin': true,
            'is_moderator': true,
            'relationship': {},
            'skip_thread_containment': false,
            'tags': [
              'force_nsfw',
              'strip_media'
            ]
          },
          'source': {
            'fields': {},
            'note': '.',
            'pleroma': {
              'actor_type': 'Person',
              'discoverable': false
            },
            'sensitive': false
          },
          'statuses_count': 2,
          'url': 'http://localhost:4000/users/leo',
          'username': 'leo',
          'confirmation_pending': false,
          'deactivated': false,
          'local': true,
          'nickname': 'leo',
          'roles': {
            'admin': true,
            'moderator': true
          },
          'tags': [
            'force_nsfw',
            'strip_media'
          ]
        },
        'application': {
          'name': 'Web',
          'website': null
        },
        'bookmarked': false,
        'card': null,
        'content': 'hungry and craving some milk tea',
        'created_at': '2019-11-23T12:53:57.000Z',
        'emojis': {},
        'favourited': false,
        'favourites_count': 0,
        'id': '9pFoIeW6uCSMDyfk80',
        'in_reply_to_account_id': null,
        'in_reply_to_id': null,
        'language': null,
        'media_attachments': {},
        'mentions': {},
        'muted': false,
        'pinned': false,
        'pleroma': {
          'content': {
            'text/plain': 'hungry and craving some milk tea'
          },
          'conversation_id': 148,
          'direct_conversation_id': null,
          'emoji_reactions': {},
          'expires_at': null,
          'in_reply_to_account_acct': null,
          'local': true,
          'spoiler_text': {
            'text/plain': ''
          },
          'thread_muted': false
        },
        'poll': null,
        'reblog': null,
        'reblogged': false,
        'reblogs_count': 0,
        'replies_count': 0,
        'sensitive': false,
        'spoiler_text': '',
        'tags': {},
        'uri': 'http://localhost:4000/objects/4c315900-ffaa-4ec8-b5e9-6bf89c3e5d0e',
        'url': 'http://localhost:4000/notice/9pFoIeW6uCSMDyfk80',
        'visibility': 'public'
      }
  }
}

export async function fetchStatuses({ godmode, localOnly, authHost, token, pageSize, page }) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/statuses?godmode=${godmode}&local_only=${localOnly}&page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchStatusesCount(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/stats`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchStatusesByInstance({ instance, authHost, token, pageSize, page }) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/instances/${instance}/statuses?page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
