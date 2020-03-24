<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form ref="instanceData" :model="instanceData" :label-width="labelWidth">
      <setting :setting-group="instance" :data="instanceData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="adminToken" :model="adminTokenData" :label-width="labelWidth">
      <setting :setting-group="adminToken" :data="adminTokenData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="scheduledActivity" :model="scheduledActivityData" :label-width="labelWidth">
      <setting :setting-group="scheduledActivity" :data="scheduledActivityData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="fetchInitialPosts" :model="fetchInitialPostsData" :label-width="labelWidth">
      <setting :setting-group="fetchInitialPosts" :data="fetchInitialPostsData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="manifest" :model="manifestData" :label-width="labelWidth">
      <setting :setting-group="manifest" :data="manifestData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="pleromaUser" :model="pleromaUserData" :label-width="labelWidth">
      <setting :setting-group="pleromaUser" :data="pleromaUserData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="uriSchemes" :model="uriSchemesData" :label-width="labelWidth">
      <setting :setting-group="uriSchemes" :data="uriSchemesData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="feed" :model="feedData" :label-width="labelWidth">
      <setting :setting-group="feed" :data="feedData"/>
    </el-form>
    <el-form ref="streamer" :model="streamerData" :label-width="labelWidth">
      <setting :setting-group="streamer" :data="streamerData"/>
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
    feed() {
      return this.settings.description.find(setting => setting.key === ':feed')
    },
    feedData() {
      return _.get(this.settings.settings, [':pleroma', ':feed']) || {}
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
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'sidebar-opened' : 'sidebar-closed'
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
    streamer() {
      return this.$store.state.settings.description.find(setting => setting.key === ':streamer')
    },
    streamerData() {
      return _.get(this.settings.settings, [':pleroma', ':streamer']) || {}
    },
    uriSchemes() {
      return this.settings.description.find(setting => setting.key === ':uri_schemes')
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
