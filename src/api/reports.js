import { reports } from './reportsData'

export function fetchReports(index, size) {
  const response = reports.slice(index, index + size)
  return response
}

export function deleteNote(reportId, noteId) {
  const updatedNotes = reports
    .find(report => report.id === reportId)
    .notes
    .filter(note => note.id !== noteId)
  return updatedNotes
}
