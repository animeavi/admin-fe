<template>
  <div>
    <h2>{{ name }}</h2>

    <prop-editing-row name="Share pack">
      <el-switch v-model="share" :disabled="!isLocal" />
    </prop-editing-row>
    <prop-editing-row name="Homepage">
      <el-input v-if="isLocal" v-model="homepage" />
      <el-input v-else :value="homepage" />
    </prop-editing-row>
    <prop-editing-row name="Description">
      <el-input v-if="isLocal" :rows="2" v-model="description" type="textarea" />
      <el-input v-else :rows="2" :value="description" type="textarea" />
    </prop-editing-row>
    <prop-editing-row name="License">
      <el-input v-if="isLocal" v-model="license" />
      <el-input v-else :value="license" />
    </prop-editing-row>
    <prop-editing-row name="Fallback source">
      <el-input v-if="isLocal" v-model="fallbackSrc" />
      <el-input v-else :value="fallbackSrc" />
    </prop-editing-row>

    <prop-editing-row v-if="fallbackSrc && fallbackSrc.trim() !== ''" name="Fallback source SHA">
      {{ pack.pack["fallback-src-sha256"] }}
    </prop-editing-row>

    <el-button v-if="isLocal" type="success" @click="savePackMetadata">Save pack metadata</el-button>

    <el-collapse v-model="shownPackEmoji" class="contents-collapse">
      <el-collapse-item :name="name" title="Show pack contents">
        <new-emoji-uploader v-if="isLocal" :pack-name="name" class="new-emoji-uploader" />

        <h4>Manage existing emoji</h4>

        <single-emoji-editor
          v-for="(file, ename) in pack.files"
          :key="ename"
          :host="host"
          :pack-name="name"
          :name="ename"
          :file="file"
          :is-local="isLocal" />
      </el-collapse-item>
    </el-collapse>

    <div v-if="!isLocal" class="shared-pack-dl-box">
      <div>
        This will download the "{{ name }}" pack to the current instance under the name
        "{{ downloadSharedAs.trim() === '' ? name : downloadSharedAs }}" (can be changed below).
        It will then be usable and shareable from the current instance.
      </div>

      <el-button type="primary" @click="downloadFromInstance">
        Download shared pack to current instance
      </el-button>

      <el-input v-model="downloadSharedAs" class="dl-as-input" placeholder="Download as (optional)" />
    </div>

    <el-link
      v-if="pack.pack['can-download']"
      :href="`//${host}/api/pleroma/emoji/packs/${name}/download_shared`"
      type="primary"
      target="_blank">
      Download pack archive
    </el-link>

    <div v-if="isLocal" class="pack-actions">
      <el-button type="danger" @click="deletePack">
        Delete the local pack
      </el-button>
    </div>
  </div>
</template>

<style>
  .shared-pack-dl-box {
    margin: 1em;
  }

  .dl-as-input {
    margin: 1em;
    max-width: 30%;
  }

  .contents-collapse {
    margin: 1em;
  }

  .pack-actions {
    margin-top: 1em;
  }

  .new-emoji-uploader {
    margin-bottom: 3em;
  }
</style>

<script>
import PropEditingRow from './PropertyEditingRow.vue'
import SingleEmojiEditor from './SingleEmojiEditor.vue'
import NewEmojiUploader from './NewEmojiUploader.vue'

export default {

  components: { PropEditingRow, SingleEmojiEditor, NewEmojiUploader },
  props: {
    name: {
      type: String,
      required: true
    },
    pack: {
      type: Object,
      required: true
    },
    host: {
      type: String,
      required: true
    },
    isLocal: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      shownPackEmoji: [],
      downloadSharedAs: ''
    }
  },
  computed: {
    share: {
      get() { return this.pack.pack['share-files'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'share-files', value }
        )
      }
    },
    homepage: {
      get() { return this.pack.pack['homepage'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'homepage', value }
        )
      }
    },
    description: {
      get() { return this.pack.pack['description'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'description', value }
        )
      }
    },
    license: {
      get() { return this.pack.pack['license'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'license', value }
        )
      }
    },
    fallbackSrc: {
      get() { return this.pack.pack['fallback-src'] },
      set(value) {
        if (value.trim() !== '') {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value }
          )
        } else {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value: null }
          )
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src-sha256', value: null }
          )
        }
      }
    }
  },
  methods: {
    downloadFromInstance() {
      this.$store.dispatch(
        'DownloadFrom',
        { instanceAddress: this.host, packName: this.name, as: this.downloadSharedAs }
      ).then(() => this.$store.dispatch('ReloadEmoji'))
        .then(() => this.$store.dispatch('SetLocalEmojiPacks'))
    },

    deletePack() {
      this.$confirm('This will delete the pack, are you sure?', 'Warning', {
        confirmButtonText: 'Yes, delete the pack',
        cancelButtonText: 'No, leave it be',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeletePack', { name: this.name })
          .then(() => this.$store.dispatch('ReloadEmoji'))
          .then(() => this.$store.dispatch('SetLocalEmojiPacks'))
      }).catch(() => {})
    },

    savePackMetadata() {
      this.$store.dispatch('SavePackMetadata', { packName: this.name })
    }
  }
}
</script>
