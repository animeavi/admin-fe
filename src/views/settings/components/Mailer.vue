<template>
  <div>
    <el-form ref="mailer" :model="mailer" :label-width="labelWidth">
      <el-form-item label="Enabled">
        <el-switch :value="mailer.enabled" @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'enabled')"/>
        <p class="expl">Allows to enable or disable sending emails. Defaults to false.</p>
      </el-form-item>
      <el-form-item label="Adapter">
        <el-select :value="mailer.adapter" clearable @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'adapter')">
          <el-option
            v-for="item in adapterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <div class="line"/>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Sendmail'">
        <el-form-item label="CMD Path">
          <el-input :value="mailer.cmd_path" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'cmd_path')"/>
          <p class="expl">E. g. <span class="code">/usr/bin/sendmail"</span></p>
        </el-form-item>
        <el-form-item label="CMD Args">
          <el-input :value="mailer.cmd_args" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'cmd_args')"/>
          <p class="expl">E. g. <span class="code">-N delay,failure,success</span></p>
        </el-form-item>
        <el-form-item label="Qmail">
          <el-switch :value="mailer.qmail" @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'qmail')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.SMTP'">
        <el-form-item label="Relay">
          <el-input :value="mailer.relay" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'relay')"/>
          <p class="expl">E. g. <span class="code">smtp.avengers.com</span></p>
        </el-form-item>
        <el-form-item label="Username">
          <el-input :value="mailer.username" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'username')"/>
        </el-form-item>
        <el-form-item label="Password">
          <el-input :value="mailer.password" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'password')"/>
        </el-form-item>
        <el-form-item label="SSL">
          <el-switch :value="mailer.ssl" @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'ssl')"/>
        </el-form-item>
        <el-form-item label="TLS">
          <el-input :value="mailer.tls" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'tls')"/>
          <p class="expl">E.g. <span class="code">:always</span></p>
        </el-form-item>
        <el-form-item label="Auth">
          <el-input :value="mailer.auth" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'auth')"/>
          <p class="expl">E.g. <span class="code">:always</span></p>
        </el-form-item>
        <el-form-item label="Port">
          <el-input :value="mailer.port" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'port')"/>
        </el-form-item>
        <el-form-item label="DKIM">
          <editor v-model="editorContent" height="150" width="100%" lang="elixir" theme="chrome"/>
        </el-form-item>
        <el-form-item label="Retries">
          <el-input-number :value="mailer.retries" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'retries')"/>
        </el-form-item>
        <el-form-item label="No mx lookups">
          <el-switch :value="mailer.no_mx_lookups" @change="updateSetting($event, 'Pleroma.Emails.Mailer', 'no_mx_lookups')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Sendgrid'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Mandrill'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Mailgun'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
        <el-form-item label="Domain">
          <el-input :value="mailer.domain" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'domain')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Mailjet'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
        <el-form-item label="Secret">
          <el-input :value="mailer.secret" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'secret')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Postmark'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.SparkPost'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
        <el-form-item label="Endpoint">
          <el-input :value="mailer.endpoint" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'endpoint')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.AmazonSES'">
        <el-form-item label="Region">
          <el-input :value="mailer.region" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'region')"/>
        </el-form-item>
        <el-form-item label="Access key">
          <el-input :value="mailer.access_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'access_key')"/>
        </el-form-item>
        <el-form-item label="Secret">
          <el-input :value="mailer.secret" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'secret')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Dyn'">
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.SocketLabs'">
        <el-form-item label="Server ID">
          <el-input :value="mailer.server_id" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'server_id')"/>
        </el-form-item>
        <el-form-item label="API key">
          <el-input :value="mailer.api_key" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'api_key')"/>
        </el-form-item>
      </div>
      <div v-if="mailer.adapter === 'Swoosh.Adapters.Gmail'">
        <el-form-item label="Access token">
          <el-input :value="mailer.access_token" @input="updateSetting($event, 'Pleroma.Emails.Mailer', 'access_token')"/>
        </el-form-item>
      </div>
    </el-form>
    <el-form ref="emailNotifications" :model="emailNotifications" :label-width="labelWidth">
      <el-form-item label="Email notifications"/>
      <el-form-item label="Digest:"/>
      <el-form-item label="Active">
        <el-switch :value="emailNotifications.digest.active" @change="processNestedData($event, 'email_notifications', 'digest', 'active')"/>
        <p class="expl">Globally enable or disable digest emails.</p>
      </el-form-item>
      <el-form-item label="Schedule">
        <el-input :value="emailNotifications.digest.schedule" @input="processNestedData($event, 'email_notifications', 'digest', 'schedule')"/>
        <p class="expl">When to send digest email, in <a
          href="https://en.wikipedia.org/wiki/Cron"
          rel="nofollow noreferrer noopener"
          target="_blank">
          crontab format
        </a>.
        "0 0 * * 0" is the default, meaning "once a week at midnight on Sunday morning"</p>
      </el-form-item>
      <el-form-item label="Interval">
        <el-input-number :value="emailNotifications.digest.interval" :step="1" :min="0" size="large" @change="processNestedData($event, 'email_notifications', 'digest', 'interval')"/>
        <p class="expl">Minimum interval between digest emails to one user.</p>
      </el-form-item>
      <el-form-item label="Inactivity threshold">
        <el-input-number :value="emailNotifications.digest.inactivity_threshold" :step="1" :min="0" size="large" @change="processNestedData($event, 'email_notifications', 'digest', 'inactivity_threshold')"/>
        <p class="expl">Minimum user inactivity threshold.</p>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="userEmail" :model="userEmail" :label-width="labelWidth">
      <el-form-item label="Digest template styles:"/>
      <el-form-item label="Logo">
        <el-input :value="userEmail.logo" @input="updateSetting($event, 'Pleroma.Emails.UserEmail', 'logo')"/>
        <div class="upload-container">
          <p class="text">or</p>
          <el-upload
            :http-request="sendEmailLogo"
            :multiple="false"
            :show-file-list="false"
            action="/api/v1/media">
            <el-button size="small" type="primary">Click to upload</el-button>
          </el-upload>
        </div>
        <p class="expl">A path to a custom logo.</p>
      </el-form-item>
      <el-form-item label="Styling:"/>
      <el-form-item label="Link color">
        <el-input :value="userEmail.styling.link_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'link_color')"/>
      </el-form-item>
      <el-form-item label="Background color">
        <el-input :value="userEmail.styling.background_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'background_color')"/>
      </el-form-item>
      <el-form-item label="Content background color">
        <el-input :value="userEmail.styling.content_background_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'content_background_color')"/>
      </el-form-item>
      <el-form-item label="Header color">
        <el-input :value="userEmail.styling.header_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'header_color')"/>
      </el-form-item>
      <el-form-item label="Text color">
        <el-input :value="userEmail.styling.text_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'text_color')"/>
      </el-form-item>
      <el-form-item label="Text muted color">
        <el-input :value="userEmail.styling.text_muted_color" @input="processNestedData($event, 'Pleroma.Emails.UserEmail', 'styling', 'text_muted_color')"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { options } from './options'
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/elixir'
import 'default-passive-events'

export default {
  name: 'Mailer',
  components: {
    editor: AceEditor
  },
  computed: {
    ...mapGetters([
      'emailNotifications',
      'mailer',
      'userEmail'
    ]),
    editorContent: {
      get: function() {
        return this.mailer.dkim ? this.mailer.dkim[0] : ''
      },
      set: function(value) {
        this.updateSetting([value], 'Pleroma.Emails.Mailer', 'dkim')
      }
    },
    adapterOptions() {
      return options.adapterOptions
    },
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
    sendEmailLogo({ file }) {
      this.$store.dispatch('UploadMedia', { file, tab: 'Pleroma.Emails.UserEmail', inputName: 'logo' })
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
    onSubmit() {
      this.$store.dispatch('SubmitChanges')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
