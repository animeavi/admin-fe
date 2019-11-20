<template>
  <div v-if="!loading">
    <el-form ref="metadata" :model="metadataData" :label-width="labelWidth">
      <setting :setting-group="metadata" :data="metadataData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="richMedia" :model="richMediaData" :label-width="labelWidth">
      <setting :setting-group="richMedia" :data="richMediaData"/>
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

export default {
  name: 'Metadata',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
    },
    metadata() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Metadata')
    },
    metadataData() {
      return this.settings.settings.pleroma['Pleroma.Web.Metadata']
    },
    richMedia() {
      return this.settings.description.find(setting => setting.key === ':rich_media')
    },
    richMediaData() {
      return this.settings.settings.pleroma[':rich_media']
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
