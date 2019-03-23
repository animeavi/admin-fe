const isLocalhost = (instanceName) =>
  instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')

export const baseName = (instanceName) =>
  isLocalhost(instanceName) ? `http://${instanceName}` : `https://${instanceName}`
