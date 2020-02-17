<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="teslaAdapter" :model="teslaAdapterData" :label-width="labelWidth">
      <setting :setting-group="teslaAdapter" :data="teslaAdapterData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mimeTypes" :model="mimeTypesData" :label-width="labelWidth">
      <setting :setting-group="mimeTypes" :data="mimeTypesData"/>
    </el-form>
    <el-form ref="remoteIp" :model="remoteIpData" :label-width="labelWidth">
      <setting :setting-group="remoteIp" :data="remoteIpData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Other',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    loading() {
      return this.settings.loading
    },
    mimeTypes() {
      return this.settings.description.find(setting => setting.group === ':mime')
    },
    mimeTypesData() {
      return _.get(this.settings.settings, [':mime']) || {}
    },
    remoteIp() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Plugs.RemoteIp')
    },
    remoteIpData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Plugs.RemoteIp']) || {}
    },
    teslaAdapter() {
      return this.settings.description.find(setting => setting.group === ':tesla')
    },
    teslaAdapterData() {
      return _.get(this.settings.settings, [':tesla']) || {}
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
