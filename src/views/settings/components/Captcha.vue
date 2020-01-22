<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="captchaData" :model="captchaData" :label-width="labelWidth">
      <setting :setting-group="captcha" :data="captchaData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="kocaptchaData" :model="kocaptchaData" :label-width="labelWidth">
      <setting :setting-group="kocaptcha" :data="kocaptchaData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Captcha',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    captcha() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Captcha')
    },
    captchaData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Captcha']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    kocaptcha() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Captcha.Kocaptcha')
    },
    kocaptchaData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Captcha.Kocaptcha']) || {}
    },
    labelWidth() {
      return this.isMobile ? '100px' : '280px'
    },
    loading() {
      return this.settings.loading
    }
  },
  methods: {
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
