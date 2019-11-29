<template>
  <div v-if="!loading">
    <el-form ref="endpointData" :model="endpointData" :label-width="labelWidth">
      <setting :setting-group="endpoint" :data="endpointData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="endpointMetricsExporter" :model="endpointMetricsExporterData" :label-width="labelWidth">
      <setting :setting-group="endpointMetricsExporter" :data="endpointMetricsExporterData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="remoteIp" :model="remoteIpData" :label-width="labelWidth">
      <setting :setting-group="remoteIp" :data="remoteIpData"/>
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
  name: 'Endpoint',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    endpoint() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Endpoint')
    },
    endpointData() {
      return this.settings.settings[':pleroma']['Pleroma.Web.Endpoint']
    },
    endpointMetricsExporter() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Endpoint.MetricsExporter')
    },
    endpointMetricsExporterData() {
      return this.settings.settings[':prometheus']['Pleroma.Web.Endpoint.MetricsExporter']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
    },
    remoteIp() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Plugs.RemoteIp')
    },
    remoteIpData() {
      return this.settings.settings[':pleroma']['Pleroma.Plugs.RemoteIp']
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
