<template>
  <div v-if="!loading">
    <el-form ref="instanceData" :model="instanceData" :label-width="labelWidth">
      <setting :setting-group="instance" :data="instanceData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="uriSchemes" :model="uriSchemesData" :label-width="labelWidth">
      <setting :setting-group="uriSchemes" :data="uriSchemesData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="adminToken" :model="adminTokenData" :label-width="labelWidth">
      <setting :setting-group="adminToken" :data="adminTokenData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="scheduledActivity" :model="scheduledActivityData" :label-width="labelWidth">
      <setting :setting-group="scheduledActivity" :data="scheduledActivityData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="fetchInitialPosts" :model="fetchInitialPostsData" :label-width="labelWidth">
      <setting :setting-group="fetchInitialPosts" :data="fetchInitialPostsData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="manifest" :model="manifestData" :label-width="labelWidth">
      <setting :setting-group="manifest" :data="manifestData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="suggestions" :model="suggestionsData" :label-width="labelWidth">
      <el-form-item label="Suggestions:"/>
      <setting :setting-group="suggestions" :data="suggestionsData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="pleromaUser" :model="pleromaUserData" :label-width="labelWidth">
      <setting :setting-group="pleromaUser" :data="pleromaUserData"/>
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
  name: 'Instance',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    adminToken() {
      return this.settings.description.find(setting => setting.description === `Allows to set a token that can be used to authenticate with the admin api without using an actual user by giving it as the 'admin_token' parameter`)
    },
    adminTokenData() {
      return _.get(this.settings.settings, [':pleroma', ':admin_token']) || {}
    },
    fetchInitialPosts() {
      return this.settings.description.find(setting => setting.key === ':fetch_initial_posts')
    },
    fetchInitialPostsData() {
      return _.get(this.settings.settings, [':pleroma', ':fetch_initial_posts']) || {}
    },
    instance() {
      return this.settings.description.find(setting => setting.key === ':instance')
    },
    instanceData() {
      return _.get(this.settings.settings, [':pleroma', ':instance']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '280px'
    },
    loading() {
      return this.settings.loading
    },
    manifest() {
      return this.settings.description.find(setting => setting.key === ':manifest')
    },
    manifestData() {
      return _.get(this.settings.settings, [':pleroma', ':manifest']) || {}
    },
    pleromaUser() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.User')
    },
    pleromaUserData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.User']) || {}
    },
    scheduledActivity() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.ScheduledActivity')
    },
    scheduledActivityData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.ScheduledActivity']) || {}
    },
    suggestions() {
      return this.$store.state.settings.description.find(setting => setting.key === ':suggestions')
    },
    suggestionsData() {
      return _.get(this.settings.settings, [':pleroma', ':suggestions']) || {}
    },
    uriSchemes() {
      return this.$store.state.settings.description.find(setting => setting.key === ':uri_schemes')
    },
    uriSchemesData() {
      return _.get(this.settings.settings, [':pleroma', ':uri_schemes']) || {}
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
