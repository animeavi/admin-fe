<template>
  <div>
    <el-form ref="pleromaAuthenticatorData" :model="pleromaAuthenticatorData" :label-width="labelWidth">
      <setting :settings-group="pleromaAuthenticator" :data="pleromaAuthenticatorData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="authData" :model="authData" :label-width="labelWidth">
      <setting :settings-group="auth" :data="authData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="ldapData" :model="ldapData" :label-width="labelWidth">
      <setting :settings-group="ldap" :data="ldapData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="oauth2" :model="oauth2Data" :label-width="labelWidth">
      <setting :settings-group="oauth2" :data="oauth2Data"/>
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
  name: 'Authentication',
  components: { Setting },
  computed: {
    ...mapGetters([
      'pleromaAuthenticatorData',
      'ldapData',
      'authData',
      'oauth2Data'
      // 'facebook',
      // 'google',
      // 'twitter',
      // 'microsoft'
    ]),
    auth() {
      return this.$store.state.settings.description.find(setting => setting.key === ':auth')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    ldap() {
      return this.$store.state.settings.description.find(setting => setting.key === ':ldap')
    },
    oauth2() {
      return this.$store.state.settings.description.find(setting => setting.key === ':oauth2')
    },
    pleromaAuthenticator() {
      return this.$store.state.settings.description.find(setting => setting.description === 'Authenticator')
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
