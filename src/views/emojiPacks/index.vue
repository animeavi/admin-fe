<template>
  <div>
    <h1 class="emoji-packs-header">{{ $t('settings.emojiPacks') }}</h1>
    <div class="button-container">
      <el-button type="primary" @click="reloadEmoji">{{ $t('settings.reloadEmoji') }}</el-button>
      <el-tooltip :content="$t('settings.importEmojiTooltip')" effects="dark" placement="bottom">
        <el-button type="primary" @click="importFromFS">
          {{ $t('settings.importPacks') }}
        </el-button>
      </el-tooltip>
    </div>
    <div class="line"/>
    <el-form label-width="230px" class="emoji-packs-form">
      <el-form-item :label="$t('settings.localPacks')">
        <el-button type="primary" @click="refreshLocalPacks">{{ $t('settings.refreshLocalPacks') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('settings.createLocalPack')">
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
      <el-form-item v-if="Object.keys(localPacks).length > 0" :label="$t('settings.packs')">
        <el-collapse v-for="(pack, name) in localPacks" :key="name" v-model="activeLocalPack">
          <emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="true" />
        </el-collapse>
      </el-form-item>
      <div class="line"/>
      <el-form-item :label="$t('settings.remotePacks')">
        <div class="create-pack">
          <el-input
            v-model="remoteInstanceAddress"
            :placeholder="$t('settings.remoteInstanceAddress')" />
          <el-button
            :disabled="remoteInstanceAddress.trim() === ''"
            class="create-pack-button"
            @click="refreshRemotePacks">
            {{ $t('settings.refreshRemote') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="Object.keys(remotePacks).length > 0" :label="$t('settings.packs')">
        <el-collapse v-for="(pack, name) in remotePacks" :key="name" v-model="activeRemotePack">
          <emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="false" />
        </el-collapse>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import EmojiPack from './components/EmojiPack'

export default {
  components: { EmojiPack },
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
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
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
    refreshLocalPacks() {
      this.$store.dispatch('SetLocalEmojiPacks')
    },
    refreshRemotePacks() {
      this.$store.dispatch('SetRemoteEmojiPacks', { remoteInstance: this.remoteInstanceAddress })
    },
    reloadEmoji() {
      this.$store.dispatch('ReloadEmoji')
    },
    importFromFS() {
      this.$store.dispatch('ImportFromFS')
        .then(() => {
          this.$store.dispatch('SetLocalEmojiPacks')
          this.$store.dispatch('ReloadEmoji')
        })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.button-container {
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
  margin: 22px 0 20px 15px;
}
.line {
    width: 100%;
    height: 0;
    border: 1px solid #eee;
    margin-bottom: 22px;
  }
</style>
