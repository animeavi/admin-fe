<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="pleromaAuthenticatorData" :model="pleromaAuthenticatorData" :label-width="labelWidth">
      <setting :setting-group="pleromaAuthenticator" :data="pleromaAuthenticatorData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="authData" :model="authData" :label-width="labelWidth">
      <setting :setting-group="auth" :data="authData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="ldapData" :model="ldapData" :label-width="labelWidth">
      <setting :setting-group="ldap" :data="ldapData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="oauth2" :model="oauth2Data" :label-width="labelWidth">
      <setting :setting-group="oauth2" :data="oauth2Data"/>
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
  name: 'Authentication',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    auth() {
      return this.settings.description.find(setting => setting.key === ':auth')
    },
    authData() {
      return _.get(this.settings.settings, [':pleroma', ':auth']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
    },
    ldap() {
      return this.settings.description.find(setting => setting.key === ':ldap')
    },
    ldapData() {
      return _.get(this.settings.settings, [':pleroma', ':ldap']) || {}
    },
    loading() {
      return this.settings.loading
    },
    oauth2() {
      return this.settings.description.find(setting => setting.key === ':oauth2')
    },
    oauth2Data() {
      return _.get(this.settings.settings, [':pleroma', ':oauth2']) || {}
    },
    pleromaAuthenticator() {
      return this.settings.description.find(setting => setting.children && setting.children[0].key === 'Pleroma.Web.Auth.Authenticator')
    },
    pleromaAuthenticatorData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Web.Auth.Authenticator']) || {}
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
