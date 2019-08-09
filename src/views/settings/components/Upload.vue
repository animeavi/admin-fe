<template>
  <div>
    <el-form ref="upload" :model="upload" :label-width="labelWidth">
      <el-form-item label="Uploader">
        <el-input :value="upload.uploader" @input="updateSetting($event, 'Pleroma.Upload', 'uploader')"/>
      </el-form-item>
      <el-form-item label="Filters">
        <el-select :value="upload.filters || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.Upload', 'filters')"/>
      </el-form-item>
      <el-form-item label="Link name">
        <el-switch :value="upload.link_name" @change="updateSetting($event, 'Pleroma.Upload', 'link_name')"/>
        <p class="expl">When enabled Pleroma will add a name parameter to the url of the upload, for example
        <span class="code">https://instance.tld/media/corndog.png?name=corndog.png</span></p>
      </el-form-item>
      <el-form-item label="Base URL">
        <el-input :value="upload.base_url" @input="updateSetting($event, 'Pleroma.Upload', 'base_url')"/>
        <p class="expl">The base URL to access a user-uploaded file. Useful when you want to proxy the media files via another host</p>
      </el-form-item>
      <el-form-item label="Proxy remote">
        <el-switch :value="upload.proxy_remote" @change="updateSetting($event, 'Pleroma.Upload', 'proxy_remote')"/>
        <p class="expl">If you're using a remote uploader, Pleroma will proxy media requests instead of redirecting to it</p>
      </el-form-item>
      <div class="line"/>
      <el-form-item label="Proxy options:"/>
      <el-form-item label="Redirect on failure">
        <el-switch :value="upload.proxy_opts.redirect_on_failure" @change="processNestedData($event, 'Pleroma.Upload', 'proxy_opts', 'redirect_on_failure')"/>
        <p class="expl">Redirects the client to the real remote URL if there's any HTTP errors.
        Any error during body processing will not be redirected as the response is chunked</p>
      </el-form-item>
      <el-form-item label="Max body length (MB)">
        <el-input-number :value="upload.proxy_opts.max_body_length / 1048576" :step="1" :min="0" size="large" @change="processNestedData($event * 1048576, 'Pleroma.Upload', 'proxy_opts', 'max_body_length')"/>
        <p class="expl">Limits the content length to be approximately the specified length</p>
      </el-form-item>
      <el-form-item label="Max read duration (s)">
        <el-input-number :value="upload.proxy_opts.max_read_duration" :step="1" :min="0" size="large" @change="processNestedData($event, 'Pleroma.Upload', 'proxy_opts', 'max_read_duration')"/>
        <p class="expl">The total time the connection is allowed to read from the remote upstream</p>
      </el-form-item>
      <el-form-item label="Inline content types">
        <el-select :value="inlineContentTypes" @change="processNestedData($event, 'Pleroma.Upload', 'proxy_opts', 'inline_content_types')">
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
        <el-select :value="whitelistedContentTypes" multiple @change="processNestedData($event, 'Pleroma.Upload', 'proxy_opts', 'inline_content_types')">
          <el-option
            v-for="item in whitelistedContentTypesOptions"
            :label="item.label"
            :key="item.value"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Request headers">
        <el-select :value="upload.proxy_opts.req_headers || []" multiple filterable allow-create @change="processNestedData($event, 'Pleroma.Upload', 'proxy_opts', 'req_headers')"/>
        <p class="expl"><span class="code">resp_headers</span> additional headers</p>
      </el-form-item>
      <el-form-item label="HTTP:"/>
      <el-form-item label="Follow redirect">
        <el-switch :value="http.follow_redirect" @change="processHttpSettings($event, 'Pleroma.Upload', 'proxy_opts', 'http', 'follow_redirect')"/>
      </el-form-item>
      <el-form-item label="Pool">
        <el-select :value="http.pool" @change="processHttpSettings($event, 'Pleroma.Upload', 'proxy_opts', 'http', 'pool')">
          <el-option
            v-for="item in hackneyPoolsOptions"
            :label="item.label"
            :key="item.value"
            :value="item.value"/>
        </el-select>
        <p class="expl">{{ getPoolExpl(http.pool) }}</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadersLocal" :model="uploadersLocal" :label-width="labelWidth">
      <el-form-item label="Uploaders.Local:"/>
      <el-form-item label="Directory for user-uploads">
        <el-input :value="uploadersLocal.uploads" @input="updateSetting($event, 'Pleroma.Uploaders.Local', 'uploads')"/>
        <p class="expl">Which directory to store the user-uploads in, relative to pleroma’s working directory</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadFilterMogrify" :model="uploadFilterMogrify" :label-width="labelWidth">
      <el-form-item label="Actions for Mogrify">
        <el-select :value="uploadFilterMogrify.args || []" multiple filterable allow-create @change="updateSetting($event, 'Pleroma.Upload.Filter.Mogrify', 'args')">
          <el-option
            v-for="item in mogrifyActionsOptions"
            :label="item.label"
            :key="item.value"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadAnonymizeFilename" :model="uploadAnonymizeFilename" :label-width="labelWidth">
      <el-form-item label="Anonymize filename">
        <el-input :value="uploadAnonymizeFilename.text" @input="updateSetting($event, 'Pleroma.Upload.Filter.AnonymizeFilename', 'text')"/>
        <p class="expl">Text to replace filenames in links. If empty, <span class="code">{random}.extension</span> will be used</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadS3" :model="uploadS3" :label-width="labelWidth">
      <el-form-item label="S3 Config:"/>
      <el-form-item label="Bucket">
        <el-input :value="uploadS3.bucket" @input="updateSetting($event, 'Pleroma.Uploaders.S3', 'bucket')"/>
        <p class="expl">S3 bucket name</p>
      </el-form-item>
      <el-form-item label="Public endpoint">
        <el-input :value="uploadS3.public_endpoint" @input="updateSetting($event, 'Pleroma.Uploaders.S3', 'public_endpoint')"/>
        <p class="expl">S3 endpoint that the user finally accesses</p>
      </el-form-item>
      <el-form-item label="Truncated namespace">
        <el-input :value="uploadS3.truncated_namespace" @input="updateSetting($event, 'Pleroma.Uploaders.S3', 'truncated_namespace')"/>
        <p class="expl">If you use S3 compatible service such as Digital Ocean Spaces or CDN, set folder name or "" etc.
        For example, when using CDN to S3 virtual host format, set "".
        At this time, write CNAME to CDN in <span class="code">public_endpoint</span>.
        </p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="uploadMDII" :model="uploadMDII" :label-width="labelWidth">
      <el-form-item label="Uploaders.MDII Config:"/>
      <el-form-item label="CGI">
        <el-input :value="uploadMDII.cgi" @input="updateSetting($event, 'Pleroma.Uploaders.MDII', 'cgi')"/>
      </el-form-item>
      <el-form-item label="Files">
        <el-input :value="uploadMDII.files" @input="updateSetting($event, 'Pleroma.Uploaders.MDII', 'files')"/>
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
import { options } from './options'

export default {
  name: 'Upload',
  computed: {
    ...mapGetters([
      'uploadAnonymizeFilenameConfig',
      'uploadConfig',
      'uploadFilterMogrifyConfig',
      'uploadersLocalConfig',
      'uploadMDIIConfig',
      'uploadS3Config'
    ]),
    inlineContentTypes() {
      return Array.isArray(this.upload.proxy_opts.inline_content_types) ? 'whitelistedTypeArray' : this.upload.proxy_opts.inline_content_types
    },
    http() {
      return this.upload.proxy_opts.http || {}
    },
    upload() {
      return this.uploadConfig
    },
    uploadersLocal() {
      return this.uploadersLocalConfig
    },
    uploadAnonymizeFilename() {
      return this.uploadAnonymizeFilenameConfig
    },
    uploadFilterMogrify() {
      return this.uploadFilterMogrifyConfig
    },
    uploadMDII() {
      return this.uploadMDIIConfig
    },
    uploadS3() {
      return this.uploadS3Config
    },
    hackneyPoolsOptions() {
      return options.hackneyPoolsOptions
    },
    whitelistedContentTypes() {
      return Array.isArray(this.upload.proxy_opts.inline_content_types) ? this.upload.proxy_opts.inline_content_types : []
    },
    whitelistedContentTypesOptions() {
      return options.whitelistedContentTypesOptions
    },
    mogrifyActionsOptions() {
      return options.mogrifyActionsOptions
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    getPoolExpl(value) {
      const pool = this.hackneyPoolsOptions.find(el => el.value === value)
      return pool ? 'Max connections: ' + pool.max_connections + ', timeout: ' + pool.timeout : ''
    },
    processHttpSettings(value, tab, section, httpSection, input) {
      const updatedValue = { ...this.uploadConfig[section][httpSection], ...{ [input]: value }}
      this.processNestedData(updatedValue, tab, section, httpSection)
    },
    processNestedData(value, tab, section, input) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][section], ...{ [input]: value }}
      this.updateSetting(updatedValue, tab, section)
    },
    updateInlineContentTypes() {
      if (this.$data.inlineContentTypes === 'whitelistedTypeArray') {
        this.processNestedData(this.$data.whitelistedContentTypes, 'Pleroma.Upload', 'proxy_opts', 'inline_content_types')
      } else {
        this.processNestedData(this.$data.inlineContentTypes, 'Pleroma.Upload', 'proxy_opts', 'inline_content_types')
      }
    },
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
