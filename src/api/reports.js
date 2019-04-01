import { reports } from './reportsData'

export function fetchReports(index, size) {
  const response = reports.slice(index, index + size)
  return response
}
