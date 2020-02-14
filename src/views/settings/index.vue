<template>
  <div class="settings-container">
    <div v-if="isDesktop">
      <div class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <el-link
          :underline="false"
          href="https://docs-develop.pleroma.social/backend/administration/CLI_tasks/config/"
          target="_blank">
          <el-button class="settings-docs-button">
            <span>
              <i class="el-icon-document"/>
              {{ $t('settings.seeDocs') }}
            </span>
          </el-button>
        </el-link>
      </div>
      <el-tabs v-model="activeTab" tab-position="left">
        <el-tab-pane :label="$t('settings.activityPub')" :disabled="configDisabled" name="activityPub" lazy>
          <activity-pub/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.auth')" :disabled="configDisabled" name="auth" lazy>
          <authentication/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.autoLinker')" :disabled="configDisabled" name="autoLinker" lazy>
          <auto-linker/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.esshd')" :disabled="configDisabled" name="esshd" lazy>
          <esshd/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.captcha')" :disabled="configDisabled" name="captcha" lazy>
          <captcha/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.frontend')" :disabled="configDisabled" name="frontend" lazy>
          <frontend/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.gopher')" :disabled="configDisabled" name="gopher" lazy>
          <gopher/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.http')" :disabled="configDisabled" name="http" lazy>
          <http/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.instance')" :disabled="configDisabled" name="instance">
          <instance/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.jobQueue')" :disabled="configDisabled" name="jobQueue" lazy>
          <job-queue/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.logger')" :disabled="configDisabled" name="logger" lazy>
          <logger/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.mailer')" :disabled="configDisabled" name="mailer" lazy>
          <mailer/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.mediaProxy')" :disabled="configDisabled" name="mediaProxy" lazy>
          <media-proxy/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.metadata')" :disabled="configDisabled" name="metadata" lazy>
          <metadata/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.mrf')" :disabled="configDisabled" name="mrf" lazy>
          <mrf/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.rateLimiters')" :disabled="configDisabled" name="rateLimiters" lazy>
          <rate-limiters/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.relays')" lazy name="relays">
          <relays/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.webPush')" :disabled="configDisabled" name="webPush" lazy>
          <web-push/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.upload')" :disabled="configDisabled" name="upload" lazy>
          <upload/>
        </el-tab-pane>
        <el-tab-pane :label="$t('settings.other')" :disabled="configDisabled" name="other" lazy>
          <other/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isMobile">
      <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
      <div class="settings-header-container">
        <el-select v-model="activeTab" class="settings-menu" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="configDisabled"/>
        </el-select>
        <el-link
          :underline="false"
          href="https://docs-develop.pleroma.social/backend/administration/CLI_tasks/config/"
          target="_blank">
          <el-button class="settings-docs-button">
            <span>
              <i class="el-icon-document"/>
              {{ $t('settings.seeDocs') }}
            </span>
          </el-button>
        </el-link>
      </div>
      <activity-pub v-if="activeTab === 'activityPub'"/>
      <authentication v-if="activeTab === 'auth'"/>
      <auto-linker v-if="activeTab === 'autoLinker'"/>
      <esshd v-if="activeTab === 'esshd'"/>
      <captcha v-if="activeTab === 'captcha'"/>
      <frontend v-if="activeTab === 'frontend'"/>
      <gopher v-if="activeTab === 'gopher'"/>
      <http v-if="activeTab === 'http'"/>
      <instance v-if="activeTab === 'instance'"/>
      <job-queue v-if="activeTab === 'jobQueue'"/>
      <logger v-if="activeTab === 'logger'"/>
      <mailer v-if="activeTab === 'mailer'"/>
      <media-proxy v-if="activeTab === 'mediaProxy'"/>
      <metadata v-if="activeTab === 'metadata'"/>
      <mrf v-if="activeTab === 'mrf'"/>
      <rate-limiters v-if="activeTab === 'rateLimiters'"/>
      <relays v-if="activeTab === 'relays'"/>
      <web-push v-if="activeTab === 'webPush'"/>
      <upload v-if="activeTab === 'upload'"/>
      <other v-if="activeTab === 'other'"/>
    </div>
  </div>
</template>

<script>
import i18n from '@/lang'
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
  data() {
    return {
      options: [
        { value: 'activityPub', label: i18n.t('settings.activityPub') },
        { value: 'auth', label: i18n.t('settings.auth') },
        { value: 'autoLinker', label: i18n.t('settings.autoLinker') },
        { value: 'esshd', label: i18n.t('settings.esshd') },
        { value: 'captcha', label: i18n.t('settings.captcha') },
        { value: 'frontend', label: i18n.t('settings.frontend') },
        { value: 'gopher', label: i18n.t('settings.gopher') },
        { value: 'http', label: i18n.t('settings.http') },
        { value: 'instance', label: i18n.t('settings.instance') },
        { value: 'jobQueue', label: i18n.t('settings.jobQueue') },
        { value: 'logger', label: i18n.t('settings.logger') },
        { value: 'mailer', label: i18n.t('settings.mailer') },
        { value: 'mediaProxy', label: i18n.t('settings.mediaProxy') },
        { value: 'metadata', label: i18n.t('settings.metadata') },
        { value: 'mrf', label: i18n.t('settings.mrf') },
        { value: 'rateLimiters', label: i18n.t('settings.rateLimiters') },
        { value: 'relays', label: i18n.t('settings.relays') },
        { value: 'webPush', label: i18n.t('settings.webPush') },
        { value: 'upload', label: i18n.t('settings.upload') },
        { value: 'other', label: i18n.t('settings.other') }
      ]
    }
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
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
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
}
.settings-docs-button {
  width: 163px;
  text-align: left;
  padding: 10px;
}
.settings-header {
  margin: 0;
}
.settings-header-container {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  margin: 22px 30px 15px 15px;
}

@media only screen and (min-width: 1824px) {
  .settings-container {
    max-width: 1824px;
    margin: auto;
  }
}
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  .settings-header {
    margin: 7px 10px 15px 10px;
  }
  .settings-header-container {
    margin: 15px;
  }
  .settings-menu {
    width: 45%;
  }
}
</style>
