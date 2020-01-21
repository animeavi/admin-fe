<template>
  <div class="settings-container">
    <h1>{{ $t('settings.settings') }}</h1>
    <el-tabs v-model="activeTab" :tab-position="tabPosition">
      <el-tab-pane :label="$t('settings.activityPub')" lazy>
        <activity-pub/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.auth')" lazy>
        <authentication/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.autoLinker')" lazy>
        <auto-linker/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.esshd')" lazy>
        <esshd/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.captcha')" lazy>
        <captcha/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.emojiPacks')" lazy>
        <emoji-packs/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.frontend')" lazy>
        <frontend/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.gopher')" lazy>
        <gopher/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.http')" lazy>
        <http/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.instance')" name="instance">
        <instance/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.jobQueue')" lazy>
        <job-queue/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.logger')" lazy>
        <logger/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mailer')" lazy>
        <mailer/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mediaProxy')" lazy>
        <media-proxy/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.metadata')" lazy>
        <metadata/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mrf')" lazy>
        <mrf/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.rateLimiters')" lazy>
        <rate-limiters/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.relays')" lazy>
        <relays/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.webPush')" lazy>
        <web-push/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.upload')" lazy>
        <upload/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.other')" lazy>
        <other/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ActivityPub, Authentication, AutoLinker, Captcha, Esshd, Frontend, Gopher, Http, Instance, JobQueue, Logger, Mailer, MediaProxy, Metadata, Mrf, Other, RateLimiters, Relays, Upload, WebPush } from './components'
import EmojiPacks from '../emojiPacks/index'

export default {
  components: { ActivityPub, Authentication, AutoLinker, Captcha, EmojiPacks, Esshd, Frontend, Gopher, Http, Instance, JobQueue, Logger, Mailer, MediaProxy, Metadata, Mrf, Other, RateLimiters, Relays, Upload, WebPush },
  data() {
    return {
      activeTab: 'instance'
    }
  },
  computed: {
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
