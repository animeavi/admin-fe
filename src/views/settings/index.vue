<template>
  <div class="settings-container">
    <div v-if="isDesktop">
      <div class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <div>
          <el-tooltip v-if="needReboot" :content="$t('settings.restartApp')" placement="bottom-end">
            <el-button type="warning" class="settings-reboot-button" @click="restartApp">
              <span>
                <i class="el-icon-refresh"/>
                {{ $t('settings.instanceReboot') }}
              </span>
            </el-button>
          </el-tooltip>
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
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            placeholder="Search"
            prefix-icon="el-icon-search"
            class="settings-search-input"
            @select="handleSearchSelect"/>
        </div>
      </div>
      <el-tabs v-model="activeTab" tab-position="left">
        <el-tab-pane
          v-for="(value, componentName) in tabs"
          :label="$t(value.label)"
          :disabled="configDisabled"
          :key="componentName"
          :name="componentName"
          lazy>
          <component :is="componentName"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isMobile || isTablet">
      <div class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <el-button v-if="needReboot" class="settings-reboot-button" @click="restartApp">
          <span>
            <i class="el-icon-refresh"/>
            {{ $t('settings.instanceReboot') }}
          </span>
        </el-button>
      </div>
      <div class="nav-container">
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
      <div class="settings-search-input-container"/>
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
import { tabs } from './components/tabs'
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
      ],
      searchQuery: ''
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
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    needReboot() {
      return this.$store.state.settings.needReboot
    },
    searchData() {
      return this.$store.state.settings.searchData
    },
    tabs() {
      return tabs
    }
  },
  mounted: function() {
    this.$store.dispatch('FetchSettings')
  },
  methods: {
    async restartApp() {
      try {
        await this.$store.dispatch('RestartApplication')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.restartSuccess')
      })
    },
    async handleSearchSelect(selectedValue) {
      const tab = Object.keys(this.tabs).find(tab => {
        return this.tabs[tab].settings.includes(selectedValue.group)
      })
      await this.$store.dispatch('SetActiveTab', tab)
      const selectedSetting = document.querySelector(`[data-search="${selectedValue.key}"]`)
      selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    querySearch(queryString, cb) {
      const results = this.searchData.filter(searchObj => searchObj.search.find(el => el.includes(queryString.toLowerCase())))
        .map(searchObj => {
          return { value: `${searchObj.label} in ${searchObj.groupLabel}`, group: searchObj.groupKey, key: searchObj.key }
        })
      cb(results)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import './styles/main';
@include settings
</style>
