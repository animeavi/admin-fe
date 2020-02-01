<template>
  <div class="settings-container">
    <h1>{{ $t('settings.settings') }}</h1>
    <el-tabs v-model="activeTab" :tab-position="tabPosition">
      <el-tab-pane :label="$t('settings.activityPub')" :disabled="confidDisabled" lazy>
        <activity-pub/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.auth')" :disabled="confidDisabled" lazy>
        <authentication/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.autoLinker')" :disabled="confidDisabled" lazy>
        <auto-linker/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.esshd')" :disabled="confidDisabled" lazy>
        <esshd/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.captcha')" :disabled="confidDisabled" lazy>
        <captcha/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.frontend')" :disabled="confidDisabled" lazy>
        <frontend/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.gopher')" :disabled="confidDisabled" lazy>
        <gopher/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.http')" :disabled="confidDisabled" lazy>
        <http/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.instance')" :disabled="confidDisabled" name="instance">
        <instance/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.jobQueue')" :disabled="confidDisabled" lazy>
        <job-queue/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.logger')" :disabled="confidDisabled" lazy>
        <logger/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mailer')" :disabled="confidDisabled" lazy>
        <mailer/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mediaProxy')" :disabled="confidDisabled" lazy>
        <media-proxy/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.metadata')" :disabled="confidDisabled" lazy>
        <metadata/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mrf')" :disabled="confidDisabled" lazy>
        <mrf/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.rateLimiters')" :disabled="confidDisabled" lazy>
        <rate-limiters/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.relays')" lazy name="relays">
        <relays/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.webPush')" :disabled="confidDisabled" lazy>
        <web-push/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.upload')" :disabled="confidDisabled" lazy>
        <upload/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.other')" :disabled="confidDisabled" lazy>
        <other/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ActivityPub, Authentication, AutoLinker, Captcha, Esshd, Frontend, Gopher, Http, Instance, JobQueue, Logger, Mailer, MediaProxy, Metadata, Mrf, Other, RateLimiters, Relays, Upload, WebPush } from './components'

export default {
  components: {
    ActivityPub,
    Authentication,
    AutoLinker,
    Captcha,
    Esshd,
    Frontend,
    Gopher,
    Http,
    Instance,
    JobQueue,
    Logger,
    Mailer,
    MediaProxy,
    Metadata,
    Mrf,
    Other,
    RateLimiters,
    Relays,
    Upload,
    WebPush
  },
  computed: {
    activeTab: {
      get() {
        return this.$store.state.settings.activeTab
      },
      set(tab) {
        this.$store.dispatch('SetActiveTab', tab)
      }
    },
    confidDisabled() {
      return this.$store.state.settings.configDisabled
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    tabPosition() {
      return this.isMobile ? 'top' : 'left'
    }
  },
  mounted: function() {
    this.$store.dispatch('FetchSettings')
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .settings-container {
    .el-tabs {
      margin-top: 20px
    }
    h1 {
      margin: 22px 0 0 15px;
    }
  }
</style>
