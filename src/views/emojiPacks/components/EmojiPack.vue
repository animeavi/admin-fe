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
      <el-form-item v-if="isLocal" class="save-pack-button">
        <el-button type="primary" @click="savePackMetadata">{{ $t('settings.savePackMetadata') }}</el-button>
        <el-button @click="deletePack">{{ $t('settings.deletePack') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-link
          v-if="pack.pack['can-download']"
          :href="`//${host}/api/pleroma/emoji/packs/${name}/download_shared`"
          :underline="false"
          type="primary"
          target="_blank">
          <el-button class="download-archive">{{ $t('settings.downloadPackArchive') }}</el-button>
        </el-link>
      </el-form-item>
    </el-form>
    <el-collapse v-model="showPackContent" class="contents-collapse">
      <el-collapse-item v-if="isLocal" :title="$t('settings.addNewEmoji')" name="addEmoji">
        <new-emoji-uploader :pack-name="name"/>
      </el-collapse-item>
      <el-collapse-item v-if="Object.keys(pack.files).length > 0" :title="$t('settings.manageEmoji')" name="manageEmoji">
        <single-emoji-editor
          v-for="(file, ename) in pack.files"
          :key="ename"
          :host="host"
          :pack-name="name"
          :name="ename"
          :file="file"
          :is-local="isLocal" />
      </el-collapse-item>
      <el-collapse-item v-if="!isLocal" :title="$t('settings.downloadPack')" name="downloadPack">
        <p>
          {{ $t('settings.thisWillDownload') }} "{{ name }}" {{ $t('settings.downloadToCurrentInstance') }}
          "{{ downloadSharedAs.trim() === '' ? name : downloadSharedAs }}" ({{ $t('settings.canBeChanged') }}).
          {{ $t('settings.willBeUsable') }}.
        </p>
        <div class="download-shared-pack">
          <el-input v-model="downloadSharedAs" :placeholder="$t('settings.downloadAsOptional')"/>
          <el-button type="primary" class="download-shared-pack-button" @click="downloadFromInstance">
            {{ $t('settings.downloadSharedPack') }}
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-collapse-item>
</template>

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

<style>
.download-archive {
  width: 250px
}
.download-shared-pack {
  display: flex;
  margin-bottom: 10px;
}
.download-shared-pack-button {
  margin-left: 10px;
}
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
.save-pack-button {
  margin-bottom: 5px
}
</style>
