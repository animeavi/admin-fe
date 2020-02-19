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
import i18n from '@/lang'
import { Message } from 'element-ui'

import Vue from 'vue'

const packs = {
  state: {
    localPacks: {},
    remoteInstance: '',
    remotePacks: {}
  },
  mutations: {
    SET_LOCAL_PACKS: (state, packs) => {
      state.localPacks = packs
    },
    SET_REMOTE_INSTANCE: (state, name) => {
      state.remoteInstance = name
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
    async CreatePack({ getters }, { name }) {
      await createPack(getters.authHost, getters.token, name)
    },
    async DeletePack({ getters }, { name }) {
      await deletePack(getters.authHost, getters.token, name)
    },
    async DownloadFrom({ getters }, { instanceAddress, packName, as }) {
      const result = await downloadFrom(getters.authHost, instanceAddress, packName, as, getters.token)

      if (result.data === 'ok') {
        Message({
          message: `${i18n.t('settings.successfullyDownloaded')} ${packName}`,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async ImportFromFS({ getters }) {
      const result = await importFromFS(getters.authHost, getters.token)

      if (result.status === 200) {
        const message = result.data.length > 0
          ? `${i18n.t('settings.successfullyImported')} ${result.data}`
          : i18n.t('settings.nowNewPacksToImport')

        Message({
          message,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async ReloadEmoji({ getters }) {
      await reloadEmoji(getters.authHost, getters.token)
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
          message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_PACK', { name: packName, pack: result.data })
      }
    },
    async SetLocalEmojiPacks({ commit, getters }) {
      const { data } = await listPacks(getters.authHost)
      commit('SET_LOCAL_PACKS', data)
    },
    async SetRemoteEmojiPacks({ commit, getters }, { remoteInstance }) {
      const { data } = await listRemotePacks(getters.authHost, getters.token, remoteInstance)

      commit('SET_REMOTE_INSTANCE', remoteInstance)
      commit('SET_REMOTE_PACKS', data)
    },
    async UpdateAndSavePackFile({ commit, getters }, args) {
      const result = await updatePackFile(getters.authHost, getters.token, args)

      if (result.status === 200) {
        const { packName } = args

        Message({
          message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
      }
    },
    async UpdateLocalPackVal({ commit }, args) {
      commit('UPDATE_LOCAL_PACK_VAL', args)
    }
  }
}

export default packs
