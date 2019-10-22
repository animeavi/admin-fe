<template>
  <el-form label-width="130px" label-position="left" size="small">
    <el-form-item :label="$t('settings.shortcode')">
      <el-input v-model="shortcode" :placeholder="$t('settings.required')"/>
    </el-form-item>
    <el-form-item :label="$t('settings.customFilename')">
      <el-input v-model="customFileName" :placeholder="$t('settings.optional')"/>
    </el-form-item>
    <el-form-item :label="$t('settings.uploadFile')">
      <div class="upload-file-url">
        <el-input v-model="imageUploadURL" :placeholder="$t('settings.url')"/>
        <el-button :disabled="shortcodePresent" type="primary" class="upload-button" @click="uploadEmoji">{{ $t('settings.upload') }}</el-button>
      </div>
      <div class="upload-container">
        <p class="text">or</p>
        <el-upload
          :http-request="uploadEmoji"
          :multiple="false"
          :show-file-list="false"
          action="add">
          <el-button :disabled="shortcodePresent" type="primary">{{ $t('settings.clickToUpload') }}</el-button>
        </el-upload>
      </div>
    </el-form-item>
  </el-form>
</template>

<style>
.add-new-emoji {
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.text {
  line-height: 20px;
  margin-right: 15px
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
  justify-content: space-between
}
</style>

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
    shortcodePresent() {
      return this.shortcode.trim() === ''
    }
  },
  methods: {
    uploadEmoji({ file }) {
      this.$store.dispatch('UpdateAndSavePackFile', {
        action: 'add',
        packName: this.packName,
        shortcode: this.shortcode,
        file: file || this.imageUploadURL,
        fileName: this.customFileName
      }).then(() => {
        this.shortcode = ''
        this.imageUploadURL = ''
        this.customFileName = ''

        this.$store.dispatch('ReloadEmoji')
      })
    }
  }
}
</script>
