import {
  listPacks,
  listRemotePacks,
  downloadFrom,
  reloadEmoji,
  createPack,
  deletePack,
  savePackMetadata,
  importFromFS,
  updatePackFile } from '@/api/emojiPacks'

import { Message } from 'element-ui'

import Vue from 'vue'

const packs = {
  state: {
    localPacks: {},
    remotePacks: {}
  },
  mutations: {
    SET_LOCAL_PACKS: (state, packs) => {
      state.localPacks = packs
    },
    SET_REMOTE_PACKS: (state, packs) => {
      state.remotePacks = packs
    },

    UPDATE_LOCAL_PACK_VAL: (state, { name, key, value }) => {
      Vue.set(state.localPacks[name]['pack'], key, value)
    },

    UPDATE_LOCAL_PACK_PACK: (state, { name, pack }) => {
      state.localPacks[name]['pack'] = pack
    },

    UPDATE_LOCAL_PACK_FILES: (state, { name, files }) => {
      // Use vue.set in case "files" was null
      Vue.set(
        state.localPacks[name],
        'files',
        files
      )
    }
  },
  actions: {
    async SetLocalEmojiPacks({ commit, getters, state }) {
      const { data } = await listPacks(getters.authHost)
      commit('SET_LOCAL_PACKS', data)
    },
    async SetRemoteEmojiPacks({ commit, getters, state }, { remoteInstance }) {
      const { data } = await listRemotePacks(getters.authHost, getters.token, remoteInstance)

      commit('SET_REMOTE_PACKS', data)
    },
    async DownloadFrom({ commit, getters, state }, { instanceAddress, packName, as }) {
      const result = await downloadFrom(getters.authHost, instanceAddress, packName, as, getters.token)

      if (result.data === 'ok') {
        Message({
          message: `Successfully downloaded ${packName}`,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async ReloadEmoji({ commit, getters, state }) {
      await reloadEmoji(getters.authHost, getters.token)
    },
    async ImportFromFS({ commit, getters, state }) {
      const result = await importFromFS(getters.authHost, getters.token)

      if (result.status === 200) {
        const message = result.data.length > 0 ? `Successfully imported ${result.data}` : 'No new packs to import'

        Message({
          message,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async DeletePack({ commit, getters, state }, { name }) {
      await deletePack(getters.authHost, getters.token, name)
    },
    async CreatePack({ commit, getters, state }, { name }) {
      await createPack(getters.authHost, getters.token, name)
    },

    async UpdateLocalPackVal({ commit, getters, state }, args) {
      commit('UPDATE_LOCAL_PACK_VAL', args)
    },

    async SavePackMetadata({ commit, getters, state }, { packName }) {
      const result =
        await savePackMetadata(
          getters.authHost,
          getters.token,
          packName,
          state.localPacks[packName]['pack']
        )

      if (result.status === 200) {
        Message({
          message: `Successfully updated ${packName} metadata`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_PACK', { name: packName, pack: result.data })
      }
    },

    async UpdateAndSavePackFile({ commit, getters, state }, args) {
      const result = await updatePackFile(getters.authHost, getters.token, args)

      if (result.status === 200) {
        const { packName } = args

        Message({
          message: `Successfully updated ${packName} files`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
      }
    }
  }
}

export default packs
