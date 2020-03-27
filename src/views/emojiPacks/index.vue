<template>
  <div class="emoji-packs">
    <h1 class="emoji-packs-header">{{ $t('emoji.emojiPacks') }}</h1>
    <div class="emoji-packs-header-button-container">
      <el-button type="primary" class="reload-emoji-button" @click="reloadEmoji">{{ $t('emoji.reloadEmoji') }}</el-button>
      <el-tooltip :content="$t('emoji.importEmojiTooltip')" effects="dark" placement="bottom" class="import-pack-button">
        <el-button type="primary" @click="importFromFS">
          {{ $t('emoji.importPacks') }}
        </el-button>
      </el-tooltip>
    </div>
    <el-divider class="divider"/>
    <el-form :label-width="labelWidth" class="emoji-packs-form">
      <el-form-item :label="$t('emoji.localPacks')">
        <el-button type="primary" @click="refreshLocalPacks">{{ $t('emoji.refreshLocalPacks') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('emoji.createLocalPack')">
        <div class="create-pack">
          <el-input v-model="newPackName" :placeholder="$t('users.name')" />
          <el-button
            :disabled="newPackName.trim() === ''"
            class="create-pack-button"
            @click="createLocalPack">
            {{ $t('users.create') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="Object.keys(localPacks).length > 0" :label="$t('emoji.packs')">
        <el-collapse v-for="(pack, name) in localPacks" :key="name" v-model="activeLocalPack">
          <local-emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="true" />
        </el-collapse>
      </el-form-item>
      <el-divider class="divider"/>
      <el-form-item :label="$t('emoji.remotePacks')">
        <div class="create-pack">
          <el-input
            v-model="remoteInstanceAddress"
            :placeholder="$t('emoji.remoteInstanceAddress')" />
          <el-button
            :disabled="remoteInstanceAddress.trim() === ''"
            class="create-pack-button"
            @click="refreshRemotePacks">
            {{ $t('emoji.refreshRemote') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="Object.keys(remotePacks).length > 0" :label="$t('emoji.packs')">
        <el-collapse v-for="(pack, name) in remotePacks" :key="name" v-model="activeRemotePack">
          <remote-emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="false" />
        </el-collapse>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import LocalEmojiPack from './components/LocalEmojiPack'
import RemoteEmojiPack from './components/RemoteEmojiPack'
import i18n from '@/lang'

export default {
  components: { LocalEmojiPack, RemoteEmojiPack },
  data() {
    return {
      remoteInstanceAddress: '',
      newPackName: '',
      activeLocalPack: [],
      activeRemotePack: []
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '105px'
      } else if (this.isTablet) {
        return '180px'
      } else {
        return '240px'
      }
    },
    localPacks() {
      return this.$store.state.emojiPacks.localPacks
    },
    remotePacks() {
      return this.$store.state.emojiPacks.remotePacks
    }
  },
  mounted() {
    this.refreshLocalPacks()
  },
  methods: {
    createLocalPack() {
      this.$store.dispatch('CreatePack', { name: this.newPackName })
        .then(() => {
          this.newPackName = ''

          this.$store.dispatch('SetLocalEmojiPacks')
          this.$store.dispatch('ReloadEmoji')
        })
    },
    importFromFS() {
      this.$store.dispatch('ImportFromFS')
        .then(() => {
          this.$store.dispatch('SetLocalEmojiPacks')
          this.$store.dispatch('ReloadEmoji')
        })
    },
    refreshLocalPacks() {
      try {
        this.$store.dispatch('SetLocalEmojiPacks')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('emoji.refreshed')
      })
    },
    refreshRemotePacks() {
      this.$store.dispatch('SetRemoteEmojiPacks', { remoteInstance: this.remoteInstanceAddress })
    },
    async reloadEmoji() {
      try {
        this.$store.dispatch('ReloadEmoji')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('emoji.reloaded')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.emoji-packs-header-button-container {
  display: flex;
  margin: 0 0 22px 15px;
}
.create-pack {
  display: flex;
  justify-content: space-between
}
.create-pack-button {
  margin-left: 10px;
}
.emoji-packs-form {
  margin: 0 30px;
}
.emoji-packs-header {
  margin: 10px 0 20px 15px;
}
.import-pack-button {
  margin-left: 10px;
}
.line {
    width: 100%;
    height: 0;
    border: 1px solid #eee;
    margin-bottom: 22px;
  }

@media only screen and (min-width: 1824px) {
  .emoji-packs {
    max-width: 1824px;
    margin: auto;
  }
}

@media only screen and (max-width:480px) {
  .create-pack {
    height: 82px;
    flex-direction: column;
  }
  .create-pack-button {
    margin-left: 0;
  }
  .divider {
    margin: 15px 0;
  }
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .emoji-packs-form {
    margin: 0 7px;
    label {
      padding-right: 8px;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .emoji-packs-header {
    margin: 15px;
  }
  .emoji-packs-header-button-container {
    height: 82px;
    flex-direction: column;
    .el-button+.el-button {
      margin: 7px 0 0 0;
      width: fit-content;
    }
  }
  .reload-emoji-button {
    width: fit-content;
  }
}
</style>
