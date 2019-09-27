const isLocalhost = (instanceName) =>
  instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')

export const baseName = (instanceName = 'localhost') => {
  if (instanceName.match(/https?:\/\//)) {
    return instanceName
  } else {
    return isLocalhost(instanceName) ? `http://${instanceName}` : `https://${instanceName}`
  }
}
