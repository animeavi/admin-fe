<template>
  <el-form :label-position="isMobile ? 'top' : 'left'" label-width="130px" size="small" class="new-emoji-uploader-form">
    <el-form-item :label="$t('emoji.shortcode')">
      <el-input v-model="shortcode" :placeholder="$t('emoji.optional')"/>
    </el-form-item>
    <el-form-item :label="$t('emoji.customFilename')">
      <el-input v-model="customFileName" :placeholder="$t('emoji.optional')"/>
    </el-form-item>
    <el-form-item :label="$t('emoji.uploadFile')">
      <div class="upload-file-url">
        <el-input v-model="imageUploadURL" :placeholder="$t('emoji.url')"/>
        <el-button type="primary" class="upload-button" @click="uploadEmoji">{{ $t('emoji.upload') }}</el-button>
      </div>
      <div class="upload-container">
        <p class="text">or</p>
        <el-upload
          :http-request="uploadEmoji"
          :multiple="false"
          :show-file-list="false"
          action="add">
          <el-button type="primary">{{ $t('emoji.clickToUpload') }}</el-button>
        </el-upload>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    packName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      shortcode: '',
      imageUploadURL: '',
      customFileName: ''
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  methods: {
    async uploadEmoji({ file }) {
      try {
        this.$store.dispatch('AddNewEmojiFile', {
          packName: this.packName,
          file: file || this.imageUploadURL,
          shortcode: this.shortcode,
          filename: this.customFileName
        })
      } catch (e) {
        return
      }
      this.shortcode = ''
      this.imageUploadURL = ''
      this.customFileName = ''

      this.$store.dispatch('ReloadEmoji')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.add-new-emoji {
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.text {
  line-height: 20px;
  margin-right: 15px;
}
.upload-container {
  display: flex;
  align-items: baseline;
}
.upload-button {
  margin-left: 10px;
}
.upload-file-url {
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width:480px) {
  .new-emoji-uploader-form {
    label.el-form-item__label {
      padding: 0;
    }
  }
}
</style>
