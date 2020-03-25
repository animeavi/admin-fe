<template>
  <el-collapse-item :title="name" :name="name" class="has-background">
    <el-form v-if="isLocal" :label-width="labelWidth" label-position="left" size="small" class="emoji-pack-metadata">
      <el-form-item :label=" $t('emoji.sharePack')">
        <el-switch v-model="share" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.homepage')">
        <el-input v-model="homepage" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.description')">
        <el-input v-model="description" type="textarea" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.license')">
        <el-input v-model="license" />
      </el-form-item>
      <el-form-item :label=" $t('emoji.fallbackSrc')">
        <el-input v-model="fallbackSrc" />
      </el-form-item>
      <el-form-item
        v-if="fallbackSrc && fallbackSrc.trim() !== ''"
        :label=" $t('emoji.fallbackSrcSha')">
        {{ pack.pack["fallback-src-sha256"] }}
      </el-form-item>
    </el-form>
    <div v-if="isLocal" class="pack-button-container">
      <div class="save-pack-button-container">
        <el-button type="primary" class="save-pack-button" @click="savePackMetadata">{{ $t('emoji.saveMetadata') }}</el-button>
        <el-button class="delete-pack-button" @click="deletePack">{{ $t('emoji.deletePack') }}</el-button>
      </div>
      <div class="download-pack-button-container">
        <el-link
          v-if="pack.pack['can-download']"
          :href="`//${host}/api/pleroma/emoji/packs/${name}/download_shared`"
          :underline="false"
          type="primary"
          target="_blank">
          <el-button class="download-archive">{{ $t('emoji.downloadPackArchive') }}</el-button>
        </el-link>
      </div>
    </div>
    <el-form v-if="!isLocal" :label-width="labelWidth" label-position="left" size="small" class="emoji-pack-metadata remote-pack-metadata">
      <el-form-item :label=" $t('emoji.sharePack')">
        <el-switch v-model="share" disabled />
      </el-form-item>
      <el-form-item v-if="homepage" :label=" $t('emoji.homepage')">
        <span>{{ homepage }}</span>
      </el-form-item>
      <el-form-item v-if="description" :label=" $t('emoji.description')">
        <span>{{ description }}</span>
      </el-form-item>
      <el-form-item v-if="license" :label=" $t('emoji.license')">
        <span>{{ license }}</span>
      </el-form-item>
      <el-form-item v-if="fallbackSrc" :label=" $t('emoji.fallbackSrc')">
        <span>{{ fallbackSrc }}</span>
      </el-form-item>
      <el-form-item
        v-if="fallbackSrc && fallbackSrc.trim() !== ''"
        :label=" $t('emoji.fallbackSrcSha')">
        {{ pack.pack["fallback-src-sha256"] }}
      </el-form-item>
      <el-form-item>
        <el-link
          v-if="pack.pack['can-download']"
          :href="pack.pack['fallback-src']"
          :underline="false"
          type="primary"
          target="_blank">
          <el-button class="download-archive">{{ $t('emoji.downloadPackArchive') }}</el-button>
        </el-link>
      </el-form-item>
    </el-form>
    <el-collapse v-model="showPackContent" class="contents-collapse">
      <el-collapse-item v-if="isLocal" :title=" $t('emoji.addNewEmoji')" name="addEmoji" class="no-background">
        <new-emoji-uploader :pack-name="name"/>
      </el-collapse-item>
      <el-collapse-item v-if="Object.keys(pack.files).length > 0" :title=" $t('emoji.manageEmoji')" name="manageEmoji" class="no-background">
        <single-emoji-editor
          v-for="(file, ename) in pack.files"
          :key="ename"
          :host="host"
          :pack-name="name"
          :name="ename"
          :file="file"
          :is-local="isLocal" />
      </el-collapse-item>
      <el-collapse-item v-if="!isLocal" :title=" $t('emoji.downloadPack')" name="downloadPack" class="no-background">
        <p>
          {{ $t('emoji.thisWillDownload') }} "{{ name }}" {{ $t('emoji.downloadToCurrentInstance') }}
          "{{ downloadSharedAs.trim() === '' ? name : downloadSharedAs }}" ({{ $t('emoji.canBeChanged') }}).
          {{ $t('emoji.willBeUsable') }}.
        </p>
        <div class="download-shared-pack">
          <el-input v-model="downloadSharedAs" :placeholder=" $t('emoji.downloadAsOptional')"/>
          <el-button type="primary" class="download-shared-pack-button" @click="downloadFromInstance(pack.pack['homepage'])">
            {{ isDesktop ? $t('emoji.downloadSharedPack') : $t('emoji.downloadSharedPackMobile') }}
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
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '90px'
      } else if (this.isTablet) {
        return '120px'
      } else {
        return '120px'
      }
    },
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
    downloadFromInstance(url) {
      const instanceAddress = `${new URL(url).protocol}//${new URL(url).hostname}`
      this.$store.dispatch(
        'DownloadFrom',
        { instanceAddress, packName: this.name, as: this.downloadSharedAs }
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

<style rel='stylesheet/scss' lang='scss'>
.download-archive {
  width: 250px
}
.download-pack-button-container {
  width: 265px;
  .el-link {
    width: inherit;
    span {
      width: inherit;
      .download-archive {
        width: inherit;
      }
    }
  }
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
.emoji-pack-metadata {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.has-background .el-collapse-item__header {
  background: #f6f6f6;
}
.no-background .el-collapse-item__header {
  background: white;
}
.pack-button-container {
  margin: 0 0 18px 120px;
}
.save-pack-button-container {
  margin-bottom: 8px;
  width: 265px;
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width:480px) {
  .delete-pack-button {
    width: 45%;
  }
  .download-pack-button-container {
    width: 100%;
  }
  .download-shared-pack {
    flex-direction: column;
  }
  .download-shared-pack-button {
    margin-left: 0;
    margin-top: 10px;
    padding: 10px;
  }
  .pack-button-container {
    width: 100%;
    margin: 0 0 22px 0;
  }
  .remote-pack-metadata {
    .el-form-item__content {
      line-height: 24px;
      margin-top: 4px;
    }
  }
  .save-pack-button {
    width: 54%;
  }
  .save-pack-button-container {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    button {
      padding: 10px 5px;
    }
    .el-button+.el-button {
      margin-left: 3px;
    }
  }
}
</style>
