import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchReports(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports`,
    method: 'get',
    headers: authHeaders(token)
  })
}

// export function deleteNote(reportId, noteId) {
//   const updatedNotes = reports
//     .find(report => report.id === reportId)
//     .notes
//     .filter(note => note.id !== noteId)
//   return updatedNotes
// }

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
