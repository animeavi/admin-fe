<template>
  <div>
    <el-form ref="captcha" :model="captcha" :label-width="labelWidth">
      <el-form-item label="Enabled">
        <el-switch :value="captcha.enabled" @change="updateSetting($event, 'Pleroma.Captcha', 'enabled')"/>
        <p class="expl">Whether the captcha should be shown on registration</p>
      </el-form-item>
      <el-form-item label="Valid for (s)">
        <el-input-number :value="captcha.seconds_valid" :step="1" :min="0" size="large" @change="updateSetting($event, 'Pleroma.Captcha', 'seconds_valid')"/>
        <p class="expl">The time in seconds for which the captcha is valid</p>
      </el-form-item>
      <el-form-item label="Method">
        <el-select :value="captcha.method" placeholder="Select" @change="updateSetting($event, 'Pleroma.Captcha', 'method')">
          <el-option label="Pleroma.Captcha.Kocaptcha" value="Pleroma.Captcha.Kocaptcha"/>
        </el-select>
        <p class="expl">The method/service to use for captcha</p>
      </el-form-item>
    </el-form>
    <el-form ref="kocaptcha" :model="kocaptcha" :label-width="labelWidth">
      <el-form-item label="Kocaptcha Endpoint">
        <el-input :value="kocaptcha.endpoint" @input="updateSetting($event, 'Pleroma.Captcha.Kocaptcha', 'endpoint')"/>
        <p class="expl">Kocaptcha is a captcha service with a single API endpoint, the source code is
          <a href="https://github.com/koto-bank/kocaptcha" rel="nofollow noreferrer noopener" target="_blank">here</a>.
          The default endpoint <span class="code">'https://captcha.kotobank.ch'</span> is hosted by the developer.
        </p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'

export default {
  name: 'Captcha',
  computed: {
    ...mapGetters([
      'captchaConfig',
      'kocaptchaConfig'
    ]),
    captcha() {
      return this.captchaConfig
    },
    kocaptcha() {
      return this.kocaptchaConfig
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    }
  },
  methods: {
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
