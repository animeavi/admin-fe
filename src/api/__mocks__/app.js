export async function needReboot(authHost, token) {
  return Promise.resolve({ data: false })
}

export async function restartApp(authHost, token) {
  return Promise.resolve()
}
