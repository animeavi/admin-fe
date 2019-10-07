<template>
  <el-collapse-item :title="name" :name="name">
    <el-form label-width="120px" label-position="left" size="small">
      <el-form-item :label="$t('settings.sharePack')">
        <el-switch v-model="share" :disabled="!isLocal" />
      </el-form-item>
      <el-form-item :label="$t('settings.homepage')">
        <el-input v-if="isLocal" v-model="homepage" />
        <el-input v-else :value="homepage" />
      </el-form-item>
      <el-form-item :label="$t('settings.description')">
        <el-input v-if="isLocal" v-model="description" type="textarea" />
        <el-input v-else :value="description" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('settings.license')">
        <el-input v-if="isLocal" v-model="license" />
        <el-input v-else :value="license" />
      </el-form-item>
      <el-form-item :label="$t('settings.fallbackSrc')">
        <el-input v-if="isLocal" v-model="fallbackSrc" />
        <el-input v-else :value="fallbackSrc" />
      </el-form-item>
      <el-form-item
        v-if="fallbackSrc && fallbackSrc.trim() !== ''"
        :label="$t('settings.fallbackSrcSha')">
        {{ pack.pack["fallback-src-sha256"] }}
      </el-form-item>
      <el-form-item class="save-pack-button">
        <el-button v-if="isLocal" type="primary" @click="savePackMetadata">{{ $t('settings.savePackMetadata') }}</el-button>
      </el-form-item>
    </el-form>
    <el-collapse v-model="showPackContent" class="contents-collapse">
      <el-collapse-item :name="name" title="Show pack contents">
        <new-emoji-uploader v-if="isLocal" :pack-name="name"/>
      </el-collapse-item>
    </el-collapse>
  </el-collapse-item>
</template>

<style>
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-collapse-item__header {
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.emoji-pack-card {
  margin-top: 5px;
}
</style>

<script>
import SingleEmojiEditor from './SingleEmojiEditor.vue'
import NewEmojiUploader from './NewEmojiUploader.vue'

export default {

  components: { SingleEmojiEditor, NewEmojiUploader },
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
      showPackContent: [],
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
