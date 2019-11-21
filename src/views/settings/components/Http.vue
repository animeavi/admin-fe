<template>
  <div v-if="!loading">
    <el-form ref="httpData" :model="httpData" :label-width="labelWidth">
      <setting :setting-group="http" :data="httpData"/>
    </el-form>
    <el-form ref="corsPlugData" :model="corsPlugData" :label-width="labelWidth">
      <el-form-item label="Cors plug config:"/>
      <setting :setting-group="corsPlug" :data="corsPlugData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="httpSignatures" :model="httpSignaturesData" :label-width="labelWidth">
      <setting :setting-group="httpSignatures" :data="httpSignaturesData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="httpSecurityData" :model="httpSecurityData" :label-width="labelWidth">
      <setting :setting-group="httpSecurity" :data="httpSecurityData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Setting from './Setting'

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
      return this.settings.settings.cors_plug
    },
    http() {
      return this.settings.description.find(setting => setting.key === ':http')
    },
    httpData() {
      return this.settings.settings.pleroma[':http']
    },
    httpSecurity() {
      return this.settings.description.find(setting => setting.key === ':http_security')
    },
    httpSecurityData() {
      return this.settings.settings.pleroma[':http_security']
    },
    httpSignatures() {
      return this.settings.description.find(setting => setting.group === ':http_signatures')
    },
    httpSignaturesData() {
      return this.settings.settings.http_signatures
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
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
