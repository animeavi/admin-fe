<template>
  <el-container class="emoji-packs-container">
    <el-header>
      <h1>
        Emoji packs
      </h1>
    </el-header>

    <el-row class="local-packs-actions">
      <el-button type="primary" @click="reloadEmoji">
        Reload emoji
      </el-button>

      <el-tooltip effects="dark" content="Importing from the filesystem will scan the directories and import those without pack.json but with emoji.txt or without neither" placement="bottom">
        <el-button type="success" @click="importFromFS">
          Import packs from the server filesystem
        </el-button>
      </el-tooltip>
    </el-row>

    <el-tabs v-model="activeName">
      <el-tab-pane label="Local packs" name="local">
        <div>
          Local packs can be viewed and downloaded for backup here.
        </div>

        <div class="local-packs-actions">
          <el-popover
            v-model="createNewPackVisible"
            placement="bottom"
            trigger="click">

            <el-input v-model="newPackName" placeholder="Name" />
            <el-button
              :disabled="newPackName.trim() === ''"
              class="create-pack-button"
              type="success"
              @click="createLocalPack" >
              Create
            </el-button>

            <el-button slot="reference" type="success">
              Create a new local pack
            </el-button>
          </el-popover>

          <el-button type="primary" @click="refreshLocalPacks">
            Refresh local packs
          </el-button>
        </div>

        <div v-for="(pack, name) in $store.state.emoji_packs.localPacks" :key="name">
          <emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="true" />
          <el-divider />
        </div>
      </el-tab-pane>

      <el-tab-pane label="Remote packs" name="remote">
        <el-input
          v-model="remoteInstanceAddress"
          class="remote-instance-input"
          placeholder="Remote instance address" />
        <el-button type="primary" @click="refreshRemotePacks">
          Refresh remote packs
        </el-button>

        <div v-for="(pack, name) in $store.state.emoji_packs.remotePacks" :key="name">
          <emoji-pack :name="name" :pack="pack" :host="remoteInstanceAddress" :is-local="false" />
          <el-divider />
        </div>

      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style>
  .emoji-packs-container {
    margin: 22px 0 0 15px;
  }

  .local-packs-actions {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .remote-instance-input {
    max-width: 10%;
  }

  .create-pack-button {
    margin-top: 1em;
  }
</style>

<script>
import EmojiPack from './components/EmojiPack'

export default {
  components: { EmojiPack },

  data() {
    return {
      activeName: 'local',
      remoteInstanceAddress: '',
      downloadFromState: null,

      newPackName: '',
      createNewPackVisible: false
    }
  },

  mounted() {
    this.refreshLocalPacks()
  },

  methods: {
    createLocalPack() {
      this.createNewPackVisible = false

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
