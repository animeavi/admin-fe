<template>
  <el-form v-if="!loading" ref="mediaProxy" :model="mediaProxy" :label-width="labelWidth">
    <el-form-item label="Enabled">
      <el-switch :value="mediaProxy.enabled" @change="updateSetting($event, 'media_proxy', 'enabled')"/>
      <p class="expl">Enables proxying of remote media to the instance’s proxy</p>
    </el-form-item>
    <el-form-item label="Base URL">
      <el-input :value="mediaProxy.base_url" @input="updateSetting($event, 'media_proxy', 'base_url')"/>
      <p class="expl">The base URL to access a user-uploaded file. Useful when you want to proxy the media files via another host/CDN fronts.</p>
    </el-form-item>
    <div class="line"/>
    <el-form-item label="Proxy options:"/>
    <el-form-item label="Redirect on failure">
      <el-switch :value="mediaProxy.proxy_opts.redirect_on_failure" @change="processNestedData($event, 'media_proxy', 'proxy_opts', 'redirect_on_failure')"/>
      <p class="expl">Redirects the client to the real remote URL if there's any HTTP errors. Any error during body processing will not be redirected as the response is chunked</p>
    </el-form-item>
    <el-form-item label="Max body length (MB)">
      <el-input-number :value="mediaProxy.proxy_opts.max_body_length / 1048576" :step="1" :min="0" size="large" @change="processNestedData($event * 1048576, 'media_proxy', 'proxy_opts', 'max_body_length')"/>
      <p class="expl">Limits the content length to be approximately the specified length</p>
    </el-form-item>
    <el-form-item label="Max read duration (s)">
      <el-input-number :value="mediaProxy.proxy_opts.max_read_duration" :step="1" :min="0" size="large" @change="processNestedData($event, 'media_proxy', 'proxy_opts', 'max_read_duration')"/>
      <p class="expl">The total time the connection is allowed to read from the remote upstream</p>
    </el-form-item>
    <el-form-item label="Inline content types">
      <el-select :value="inlineContentTypes" clearable @change="processNestedData($event, 'media_proxy', 'proxy_opts', 'inline_content_types')">
        <el-option :value="true" label="True"/>
        <el-option :value="false" label="False"/>
        <el-option value="whitelistedTypeArray" label="List of whitelisted content types"/>
        <el-option value="keepUserAgent" label="Forward client's user-agent to the upstream"/>
      </el-select>
      <p v-if="inlineContentTypes === true" class="expl">Will not alter <span class="code">content-disposition</span> (up to the upstream)</p>
      <p v-if="!inlineContentTypes" class="expl">Will add <span class="code">content-disposition: attachment</span> to any request</p>
      <p v-if="inlineContentTypes === 'keepUserAgent'" class="expl">
        Will forward the client's user-agent to the upstream. This may be useful if the upstream is
        doing content transformation (encoding, …) depending on the request.
      </p>
    </el-form-item>
    <el-form-item v-if="inlineContentTypes === 'whitelistedTypeArray'" label="Whitelisted content types">
      <el-select :value="whitelistedContentTypes" multiple filterable allow-create @change="processNestedData($event, 'media_proxy', 'proxy_opts', 'inline_content_types')">
        <el-option
          v-for="item in whitelistedContentTypesOptions"
          :label="item.label"
          :key="item.value"
          :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Request headers">
      <el-select :value="mediaProxy.proxy_opts.req_headers || []" multiple filterable allow-create @change="processNestedData($event, 'media_proxy', 'proxy_opts', 'req_headers')"/>
      <p class="expl"><span class="code">resp_headers</span> additional headers</p>
    </el-form-item>
    <el-form-item label="HTTP:"/>
    <el-form-item label="Follow redirect">
      <el-switch :value="http.follow_redirect" @change="processHttpSettings($event, 'media_proxy', 'proxy_opts', 'http', 'follow_redirect')"/>
    </el-form-item>
    <el-form-item label="Pool">
      <el-select :value="http.pool" clearable @change="processHttpSettings($event, 'media_proxy', 'proxy_opts', 'http', 'pool')">
        <el-option
          v-for="item in hackneyPoolsOptions"
          :label="item.label"
          :key="item.value"
          :value="item.value"/>
      </el-select>
      <p class="expl">{{ getPoolExpl(http.pool) }}</p>
    </el-form-item>
    <div class="line"/>
    <el-form-item label="Whitelist">
      <el-select :value="mediaProxy.whitelist || []" multiple filterable allow-create @change="updateSetting($event, 'media_proxy', 'whitelist')"/>
      <p class="expl">List of domains to bypass the mediaproxy</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import { options } from './options'

export default {
  name: 'MediaProxy',
  computed: {
    ...mapGetters([
      'mediaProxy'
    ]),
    inlineContentTypes() {
      return Array.isArray(this.mediaProxy.proxy_opts.inline_content_types) ? 'whitelistedTypeArray' : this.mediaProxy.proxy_opts.inline_content_types
    },
    http() {
      return this.mediaProxy.proxy_opts.http || {}
    },
    reqHeadersOptions() {
      return this.mediaProxySettings.reqHeadersOptions
    },
    hackneyPoolsOptions() {
      return options.hackneyPoolsOptions
    },
    whitelistedContentTypes() {
      return Array.isArray(this.mediaProxy.proxy_opts.inline_content_types) ? this.mediaProxy.proxy_opts.inline_content_types : []
    },
    whitelistedContentTypesOptions() {
      return options.whitelistedContentTypesOptions
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
    getPoolExpl(value) {
      const pool = this.hackneyPoolsOptions.find(el => el.value === value)
      return pool ? 'Max connections: ' + pool.max_connections + ', timeout: ' + pool.timeout : ''
    },
    processHttpSettings(value, tab, section, httpSection, input) {
      const updatedValue = { ...this.mediaProxy[section][httpSection], ...{ [input]: value }}
      this.processNestedData(updatedValue, tab, section, httpSection)
    },
    processNestedData(value, tab, section, input) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][section], ...{ [input]: value }}
      this.updateSetting(updatedValue, tab, section)
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
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
