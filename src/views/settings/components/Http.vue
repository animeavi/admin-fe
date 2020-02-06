<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="httpData" :model="httpData" :label-width="labelWidth">
      <setting :setting-group="http" :data="httpData"/>
    </el-form>
    <el-form ref="corsPlugData" :model="corsPlugData" :label-width="labelWidth">
      <el-form-item label="Cors plug config:" class="settings-input"/>
      <setting :setting-group="corsPlug" :data="corsPlugData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="httpSignatures" :model="httpSignaturesData" :label-width="labelWidth">
      <setting :setting-group="httpSignatures" :data="httpSignaturesData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="httpSecurityData" :model="httpSecurityData" :label-width="labelWidth">
      <setting :setting-group="httpSecurity" :data="httpSecurityData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="webCacheTtl" :model="webCacheTtlData" :label-width="labelWidth">
      <setting :setting-group="webCacheTtl" :data="webCacheTtlData"/>
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
  name: 'HTTP',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    corsPlug() {
      return this.settings.description.find(setting => setting.group === ':cors_plug')
    },
    corsPlugData() {
      return _.get(this.settings.settings, [':cors_plug']) || {}
    },
    http() {
      return this.settings.description.find(setting => setting.key === ':http')
    },
    httpData() {
      return _.get(this.settings.settings, [':pleroma', ':http']) || {}
    },
    httpSecurity() {
      return this.settings.description.find(setting => setting.key === ':http_security')
    },
    httpSecurityData() {
      return _.get(this.settings.settings, [':pleroma', ':http_security']) || {}
    },
    httpSignatures() {
      return this.settings.description.find(setting => setting.group === ':http_signatures')
    },
    httpSignaturesData() {
      return _.get(this.settings.settings, [':http_signatures']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
    },
    loading() {
      return this.settings.loading
    },
    webCacheTtl() {
      return this.settings.description.find(setting => setting.key === ':web_cache_ttl')
    },
    webCacheTtlData() {
      return _.get(this.settings.settings, [':pleroma', ':web_cache_ttl']) || {}
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
