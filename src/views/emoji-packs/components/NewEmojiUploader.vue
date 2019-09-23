<template>
  <div>
    <h4>Add new emoji to the pack</h4>

    <el-row :gutter="20">
      <el-col :span="4" class="new-emoji-col">
        <el-input v-model="shortcode" placeholder="Shortcode" />
      </el-col>

      <el-col :span="8">
        <div>
          <h5>Upload a file</h5>
        </div>
        File name
        <el-input v-model="customFileName" size="mini" placeholder="Custom file name (optional)"/>
        <input ref="fileUpload" type="file" accept="image/*" >

        <div class="or">
          or
        </div>

        <div>
          <h5>Enter a URL</h5>
        </div>
        <el-input v-model="imageUploadURL" placeholder="Image URL" />

        <small>
          (If both are filled, the file is used)
        </small>
      </el-col>

      <el-col :span="4" class="new-emoji-col">
        <el-button :disabled="shortcode.trim() == ''" @click="upload">Upload</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
  .new-emoji-col {
    margin-top: 8em;
  }

  .or {
    margin: 1em;
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

  methods: {
    upload() {
      let file = null

      if (this.$refs.fileUpload.files.length > 0) {
        file = this.$refs.fileUpload.files[0]
      } else if (this.imageUploadURL.trim() !== '') {
        file = this.imageUploadURL
      }

      if (file !== null) {
        this.$store.dispatch('UpdateAndSavePackFile', {
          action: 'add',
          packName: this.packName,
          shortcode: this.shortcode,
          file: file,
          fileName: this.customFileName
        }).then(() => {
          this.shortcode = ''
          this.imageUploadURL = ''

          this.$store.dispatch('ReloadEmoji')
        })
      }
    }
  }
}
</script>
