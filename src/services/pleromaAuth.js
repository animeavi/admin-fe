import localforage from 'localforage'
import _ from 'lodash'

const pleromaFEStateKey = 'vuex-lz'

export const authenticateWithPleromaFE = async(store) => {
  const pleromaFEState = await localforage.getItem(pleromaFEStateKey)
  const token = _.get(pleromaFEState, 'oauth.userToken')

  if (token === undefined) {
    throw new Error('PleromaFE token not found')
  }

  await store.dispatch('LoginByPleromaFE', { token })
}
