<template>
  <div class="settings-container">
    <h1>{{ $t('settings.settings') }}</h1>
    <el-tabs v-model="activeTab" :tab-position="tabPosition">
      <el-tab-pane :label="$t('settings.activityPub')" :disabled="configDisabled" lazy>
        <activity-pub/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.auth')" :disabled="configDisabled" lazy>
        <authentication/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.autoLinker')" :disabled="configDisabled" lazy>
        <auto-linker/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.esshd')" :disabled="configDisabled" lazy>
        <esshd/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.captcha')" :disabled="configDisabled" lazy>
        <captcha/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.frontend')" :disabled="configDisabled" lazy>
        <frontend/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.gopher')" :disabled="configDisabled" lazy>
        <gopher/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.http')" :disabled="configDisabled" lazy>
        <http/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.instance')" :disabled="configDisabled" name="instance">
        <instance/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.jobQueue')" :disabled="configDisabled" lazy>
        <job-queue/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.logger')" :disabled="configDisabled" lazy>
        <logger/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mailer')" :disabled="configDisabled" lazy>
        <mailer/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mediaProxy')" :disabled="configDisabled" lazy>
        <media-proxy/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.metadata')" :disabled="configDisabled" lazy>
        <metadata/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mrf')" :disabled="configDisabled" lazy>
        <mrf/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.rateLimiters')" :disabled="configDisabled" lazy>
        <rate-limiters/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.relays')" lazy name="relays">
        <relays/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.webPush')" :disabled="configDisabled" lazy>
        <web-push/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.upload')" :disabled="configDisabled" lazy>
        <upload/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.other')" :disabled="configDisabled" lazy>
        <other/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
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
} from './components'

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
    configDisabled() {
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
  @media only screen and (min-width: 1824px) {
    .settings-container {
      max-width: 1824px;
      margin: auto;
    }
  }
</style>
