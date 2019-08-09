<template>
  <div>
    <el-form ref="queues" :model="queues" :label-width="labelWidth">
      <el-form-item label="Job queues:"/>
      <el-form-item label="Outgoing federation">
        <el-input-number :value="queues.federator_outgoing" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'federator_outgoing')"/>
      </el-form-item>
      <el-form-item label="Incoming federation">
        <el-input-number :value="queues.federator_incoming" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'federator_incoming')"/>
      </el-form-item>
      <el-form-item label="Email sender">
        <el-input-number :value="queues.mailer" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'mailer')"/>
      </el-form-item>
      <el-form-item label="Transmogrifier">
        <el-input-number :value="queues.transmogrifier" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'transmogrifier')"/>
      </el-form-item>
      <el-form-item label="Web push notifications">
        <el-input-number :value="queues.web_push" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'web_push')"/>
      </el-form-item>
      <el-form-item label="Scheduled activities">
        <el-input-number :value="queues.scheduled_activities" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'scheduled_activities')"/>
      </el-form-item>
      <el-form-item label="Background">
        <el-input-number :value="queues.background" :step="1" :min="0" size="large" @change="updateSetting($event, 'queues', 'background')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="retryQueue" :model="retryQueue" :label-width="labelWidth">
      <el-form-item label="Retry queue:"/>
      <el-form-item label="Enabled">
        <el-switch :value="retryQueue.enabled" @change="updateSetting($event, 'Pleroma.Web.Federator.RetryQueue', 'enabled')"/>
        <p class="expl">If set to true, failed federation jobs will be retried</p>
      </el-form-item>
      <el-form-item label="Max jobs">
        <el-input-number :value="retryQueue.max_jobs" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Web.Federator.RetryQueue', 'max_jobs')"/>
        <p class="expl">The maximum amount of parallel federation jobs running at the same time.</p>
      </el-form-item>
      <el-form-item label="Initial timeout (s)">
        <el-input-number :value="retryQueue.initial_timeout" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Web.Federator.RetryQueue', 'initial_timeout')"/>
        <p class="expl">The initial timeout in seconds</p>
      </el-form-item>
      <el-form-item label="Max retries">
        <el-input-number :value="retryQueue.max_retries" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Web.Federator.RetryQueue', 'max_retries')"/>
        <p class="expl">The maximum number of times a federation job is retried</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'JobQueue',
  computed: {
    ...mapGetters([
      'queuesConfig',
      'retryQueueConfig'
    ]),
    queues() {
      return this.queuesConfig
    },
    retryQueue() {
      return this.retryQueueConfig
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
    onSubmit() {
      this.$store.dispatch('SubmitChanges')
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
