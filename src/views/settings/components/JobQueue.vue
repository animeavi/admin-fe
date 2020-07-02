<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="obanQueuesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="obanQueues" :data="obanQueuesData"/>
    </el-form>
    <el-divider v-if="obanQueues" class="divider thick-line"/>
    <el-form :model="workersData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="workers" :data="workersData"/>
    </el-form>
    <el-divider v-if="workers" class="divider thick-line"/>
    <el-form :model="activityExpirationData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="activityExpiration" :data="activityExpirationData"/>
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
  name: 'JobQueue',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    activityExpiration() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.ActivityExpiration')
    },
    activityExpirationData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.ActivityExpiration']) || {}
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
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
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
    obanQueues() {
      return this.settings.description.find(setting => setting.key === 'Oban')
    },
    obanQueuesData() {
      return _.get(this.settings.settings, [':pleroma', 'Oban']) || {}
    },
    workers() {
      return this.settings.description.find(setting => setting.key === ':workers')
    },
    workersData() {
      return _.get(this.settings.settings, [':pleroma', ':workers']) || {}
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
