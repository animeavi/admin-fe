<template>
  <div v-if="!loading">
    <el-form ref="uploadData" :model="uploadData" :label-width="labelWidth">
      <setting :setting-group="upload" :data="uploadData"/>
    </el-form>
    <el-form ref="uploadersLocal" :model="uploadersLocalData" :label-width="labelWidth">
      <setting :setting-group="uploadersLocal" :data="uploadersLocalData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadersS3" :model="uploadersS3Data" :label-width="labelWidth">
      <setting :setting-group="uploadersS3" :data="uploadersS3Data"/>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadFilterMogrify" :model="uploadFilterMogrifyData" :label-width="labelWidth">
      <setting :setting-group="uploadFilterMogrify" :data="uploadFilterMogrifyData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadAnonymizeFilename" :model="uploadAnonymizeFilenameData" :label-width="labelWidth">
      <setting :setting-group="uploadAnonymizeFilename" :data="uploadAnonymizeFilenameData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Upload',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '280px'
    },
    loading() {
      return this.settings.loading
    },
    upload() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload')
    },
    uploadData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload']) || {}
    },
    uploadersLocal() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Uploaders.Local')
    },
    uploadersLocalData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Uploaders.Local']) || {}
    },
    uploadersS3() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Uploaders.S3')
    },
    uploadersS3Data() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Uploaders.S3']) || {}
    },
    uploadFilterMogrify() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload.Filter.Mogrify')
    },
    uploadFilterMogrifyData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload.Filter.Mogrify']) || {}
    },
    uploadAnonymizeFilename() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Upload.Filter.AnonymizeFilename')
    },
    uploadAnonymizeFilenameData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Upload.Filter.AnonymizeFilename']) || {}
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
