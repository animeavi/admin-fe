<template>
  <div v-if="!loading">
    <el-form ref="obanQueuesData" :model="obanQueuesData" :label-width="labelWidth">
      <setting :setting-group="obanQueues" :data="obanQueuesData"/>
    </el-form>
    <el-form ref="workersData" :model="workersData" :label-width="labelWidth">
      <setting :setting-group="workers" :data="workersData"/>
    </el-form>
    <el-form ref="activityExpiration" :model="activityExpirationData" :label-width="labelWidth">
      <setting :setting-group="activityExpiration" :data="activityExpirationData"/>
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
    labelWidth() {
      return this.isMobile ? '100px' : '280px'
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
