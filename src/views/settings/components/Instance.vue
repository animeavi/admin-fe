<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="instanceData" :model="instanceData" :label-width="labelWidth">
      <setting :setting-group="instance" :data="instanceData"/>
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
  name: 'Instance',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    adminToken() {
      return this.settings.description.find(setting => setting.children && setting.children[0].key === ':admin_token')
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
