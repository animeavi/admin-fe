export async function getNodeInfo(authHost) {
  const data = {
    metadata: {
      mailerEnabled: true
    }
  }

  return Promise.resolve({ data })
}
