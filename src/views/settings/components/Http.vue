<template>
  <div>
    <el-form ref="http" :model="http" :label-width="labelWidth">
      <el-form-item label="HTTP settings:"/>
      <el-form-item label="Proxy url">
        <el-input :value="http.proxy_url" @input="updateSetting($event, 'http', 'proxy_url')"/>
      </el-form-item>
      <el-form-item label="Send user agent">
        <el-switch :value="http.send_user_agent" @change="updateSetting($event, 'http', 'send_user_agent')"/>
      </el-form-item>
      <el-form-item label="Adapter:"/>
      <el-form-item label="Versions">
        <el-select :value="http.adapter.versions || []" multiple filterable allow-create @change="processNestedData($event, 'http', 'adapter', 'versions')">
          <el-option value=":tlsv1"/>
          <el-option value=":'tlsv1.1'"/>
          <el-option value=":'tlsv1.2'"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="corsPlugMaxAge" :model="corsPlugMaxAge" :label-width="labelWidth">
      <el-form-item label="Cors plug config:"/>
      <el-form-item label="Max age (days)">
        <el-input-number :value="corsPlugMaxAge.value / 86400" :step="1" :min="0" size="large" @change="updateSetting($event * 86400, 'max_age', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="corsPlugMethods" :model="corsPlugMethods" :label-width="labelWidth">
      <el-form-item label="Methods">
        <el-select :value="corsPlugMethods.value || []" multiple filterable allow-create @change="updateSetting($event, 'methods', 'value')">
          <el-option value="POST"/>
          <el-option value="PUT"/>
          <el-option value="DELETE"/>
          <el-option value="GET"/>
          <el-option value="PATCH"/>
          <el-option value="OPTIONS"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="corsPlugExpose" :model="corsPlugExpose" :label-width="labelWidth">
      <el-form-item label="Expose">
        <el-select :value="corsPlugExpose.value || []" multiple filterable allow-create @change="updateSetting($event, 'expose', 'value')">
          <el-option value="Link"/>
          <el-option value="X-RateLimit-Reset"/>
          <el-option value="X-RateLimit-Limit"/>
          <el-option value="X-RateLimit-Remaining"/>
          <el-option value="X-Request-Id"/>
          <el-option value="Idempotency-Key"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="corsPlugCredentials" :model="corsPlugCredentials" :label-width="labelWidth">
      <el-form-item label="Credentials">
        <el-switch :value="corsPlugCredentials.value" @change="updateSetting($event, 'credentials', 'value')"/>
      </el-form-item>
    </el-form>
    <el-form ref="corsPlugHeaders" :model="corsPlugHeaders" :label-width="labelWidth">
      <el-form-item label="Headers">
        <el-select :value="corsPlugHeaders.value || []" multiple filterable allow-create @change="updateSetting($event, 'headers', 'value')">
          <el-option value="Authorization"/>
          <el-option value="Content-Type"/>
          <el-option value="Idempotency-Key"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="httpSecurity" :model="httpSecurity" :label-width="labelWidth">
      <el-form-item label="HTTP security:"/>
      <el-form-item label="Security policy">
        <el-switch :value="httpSecurity.enabled" @change="updateSetting($event, 'http_security', 'enabled')"/>
        <p class="expl">Whether the managed content security policy is enabled</p>
      </el-form-item>
      <el-form-item label="STS">
        <el-switch :value="httpSecurity.sts" @change="updateSetting($event, 'http_security', 'sts')"/>
        <p class="expl">Whether to additionally send a <span class="code">Strict-Transport-Security header</span></p>
      </el-form-item>
      <el-form-item label="STS max age (days)">
        <el-input-number :value="httpSecurity.sts_max_age / 86400" :step="1" :min="0" size="large" @change="updateSetting($event * 86400, 'http_security', 'sts_max_age')"/>
        <p class="expl">The maximum age for the <span class="code">Strict-Transport-Security</span> header if sent</p>
      </el-form-item>
      <el-form-item label="CT max age (days)">
        <el-input-number :value="httpSecurity.ct_max_age / 86400" :step="1" :min="0" size="large" @change="updateSetting($event * 86400, 'http_security', 'ct_max_age')"/>
        <p class="expl">The maximum age for the <span class="code">Expect-CT</span> header if sent</p>
      </el-form-item>
      <el-form-item label="Referrer policy">
        <el-select :value="httpSecurity.referrer_policy" clearable @change="updateSetting($event, 'http_security', 'referrer_policy')">
          <el-option label="same-origin" value="same-origin"/>
          <el-option label="no-referrer" value="no-referrer"/>
        </el-select>
        <p class="expl">The referrer policy to use</p>
      </el-form-item>
      <el-form-item label="Report URI">
        <el-input :value="httpSecurity.report_uri" @input="updateSetting($event, 'http_security', 'report_uri')"/>
        <p class="expl">Adds the specified url to <span class="code">report-uri</span> and <span class="code">report-to</span> group in CSP header</p>
      </el-form-item>
    </el-form>
    <el-form ref="hackneyPools" :model="hackneyPools" :label-width="labelWidth">
      <div class="line"/>
      <el-form-item label="Hackney pools:"/>
      <el-form-item label="Federation:"/>
      <el-form-item label="Max connections">
        <el-input-number :value="hackneyPools.federation.max_connections" :step="1" :min="0" size="large" @change="processNestedData($event, 'hackney_pools', 'federation', 'max_connections')"/>
        <p class="expl">You may want this pool <span class="code">max_connections</span> to be at least equal to the number of federator jobs + retry queue jobs.</p>
      </el-form-item>
      <el-form-item label="Timeout (s)">
        <el-input-number :value="hackneyPools.federation.timeout / 1000" :step="10" :min="0" size="large" @change="processNestedData($event * 1000, 'hackney_pools', 'federation', 'timeout')"/>
        <p class="expl">For the federation jobs</p>
      </el-form-item>
      <el-form-item label="Media:"/>
      <el-form-item label="Max connections">
        <el-input-number :value="hackneyPools.media.max_connections" :step="1" :min="0" size="large" @change="processNestedData($event, 'hackney_pools', 'media', 'max_connections')"/>
      </el-form-item>
      <el-form-item label="Timeout (s)">
        <el-input-number :value="hackneyPools.media.timeout / 1000" :step="10" :min="0" size="large" @change="processNestedData($event * 1000, 'hackney_pools', 'media', 'timeout')"/>
        <p class="expl">For rich media, media proxy</p>
      </el-form-item>
      <el-form-item label="Upload:"/>
      <el-form-item label="Max connections">
        <el-input-number :value="hackneyPools.upload.max_connections" :step="1" :min="0" size="large" @change="processNestedData($event, 'hackney_pools', 'upload', 'max_connections')"/>
      </el-form-item>
      <el-form-item label="Timeout (s)">
        <el-input-number :value="hackneyPools.upload.timeout / 1000" :step="10" :min="0" size="large" @change="processNestedData($event * 1000, 'hackney_pools', 'upload', 'timeout')"/>
        <p class="expl">For uploaded media (if using a remote uploader and <span class="code">proxy_remote: true</span>)</p>
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
  name: 'HTTP',
  computed: {
    ...mapGetters([
      'corsPlugCredentials',
      'corsPlugExpose',
      'corsPlugHeaders',
      'corsPlugMaxAge',
      'corsPlugMethods',
      'hackneyPools',
      'http',
      'httpSecurity',
      'metricsExporter'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
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
