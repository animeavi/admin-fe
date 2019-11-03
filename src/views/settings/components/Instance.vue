<template>
  <div>
    <el-form ref="instanceData" :model="instanceData" :label-width="labelWidth">
      <setting :settings-group="instance" :data="instanceData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="uriSchemesData" :model="uriSchemesData" :label-width="labelWidth">
      <setting :settings-group="uriSchemes" :data="uriSchemesData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="adminTokenData" :model="adminTokenData" :label-width="labelWidth">
      <setting :settings-group="adminToken" :data="adminTokenData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="scheduledActivityData" :model="scheduledActivityData" :label-width="labelWidth">
      <setting :settings-group="scheduledActivity" :data="scheduledActivityData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="fetchInitialPostsData" :model="fetchInitialPostsData" :label-width="labelWidth">
      <setting :settings-group="fetchInitialPosts" :data="fetchInitialPostsData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="suggestionsData" :model="suggestionsData" :label-width="labelWidth">
      <el-form-item label="Suggestions:"/>
      <setting :settings-group="suggestions" :data="suggestionsData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="pleromaUserData" :model="pleromaUserData" :label-width="labelWidth">
      <setting :settings-group="pleromaUser" :data="pleromaUserData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import { options } from './options'
import Setting from './Setting'

export default {
  name: 'Instance',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'adminTokenData',
      'fetchInitialPostsData',
      'instanceData',
      'pleromaUserData',
      'scheduledActivityData',
      'suggestionsData',
      'uriSchemesData'
    ]),
    adminToken() {
      return this.$store.state.settings.description.find(setting => setting.description === `Allows to set a token that can be used to authenticate with the admin api without using an actual user by giving it as the 'admin_token' parameter`)
    },
    fetchInitialPosts() {
      return this.$store.state.settings.description.find(setting => setting.key === ':fetch_initial_posts')
    },
    instance() {
      return this.$store.state.settings.description.find(setting => setting.key === ':instance')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    pleromaUser() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.User')
    },
    scheduledActivity() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.ScheduledActivity')
    },
    suggestions() {
      return this.$store.state.settings.description.find(setting => setting.key === ':suggestions')
    },
    uriSchemes() {
      return this.$store.state.settings.description.find(setting => setting.key === ':uri_schemes')
    }
  },
  methods: {
    getRewritePolicyExpl(value) {
      const policy = options.rewritePolicyOptions.find(el => el.value === value)
      return policy.expl
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
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
