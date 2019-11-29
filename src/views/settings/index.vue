<template>
  <div class="settings-container">
    <h1>{{ $t('settings.settings') }}</h1>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane :label="$t('settings.activityPub')">
        <activity-pub/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.auth')">
        <authentication/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.autoLinker')">
        <auto-linker/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.esshd')">
        <esshd/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.captcha')">
        <captcha/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.database')">
        <database/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.endpoint')">
        <endpoint/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.emojiPacks')">
        <emoji-packs/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.frontend')">
        <frontend/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.gopher')">
        <gopher/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.http')">
        <http/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.instance')">
        <instance/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.jobQueue')">
        <job-queue/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.logger')">
        <logger/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mailer')">
        <mailer/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mediaProxy')">
        <media-proxy/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.metadata')">
        <metadata/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.mrf')">
        <mrf/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.rateLimiters')">
        <rate-limiters/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.relays')">
        <relays/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.upload')">
        <upload/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.webPush')">
        <web-push/>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.other')">
        <other/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ActivityPub, Authentication, AutoLinker, Captcha, Database, Endpoint, Esshd, Frontend, Gopher, Http, Instance, JobQueue, Logger, Mailer, MediaProxy, Metadata, Mrf, Other, RateLimiters, Relays, Upload, WebPush } from './components'
import EmojiPacks from '../emojiPacks/index'

export default {
  components: { ActivityPub, Authentication, AutoLinker, Captcha, Database, Endpoint, EmojiPacks, Esshd, Frontend, Gopher, Http, Instance, JobQueue, Logger, Mailer, MediaProxy, Metadata, Mrf, Other, RateLimiters, Relays, Upload, WebPush },
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
