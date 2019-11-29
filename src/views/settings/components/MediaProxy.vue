<template>
  <el-form v-if="!loading" ref="mediaProxy" :model="mediaProxyData" :label-width="labelWidth">
    <setting :setting-group="mediaProxy" :data="mediaProxyData"/>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Setting from './Setting'

export default {
  name: 'MediaProxy',
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
    mediaProxy() {
      return this.settings.description.find(setting => setting.key === ':media_proxy')
    },
    mediaProxyData() {
      return this.settings.settings[':pleroma'][':media_proxy']
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
