<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="mailer" :model="mailerData" :label-width="labelWidth">
      <setting :setting-group="mailer" :data="mailerData"/>
    </el-form>
    <el-divider class="divider"/>
    <el-form ref="emailNotifications" :model="emailNotificationsData" :label-width="labelWidth">
      <setting :setting-group="emailNotifications" :data="emailNotificationsData"/>
    </el-form>
    <el-form ref="userEmail" :model="userEmail" :label-width="labelWidth">
      <setting :setting-group="userEmail" :data="userEmailData"/>
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
  name: 'Mailer',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    emailNotifications() {
      return this.settings.description.find(setting => setting.key === ':email_notifications')
    },
    emailNotificationsData() {
      return _.get(this.settings.settings, [':pleroma', ':email_notifications']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
    },
    loading() {
      return this.$store.state.settings.loading
    },
    mailer() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.Mailer')
    },
    mailerData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Emails.Mailer']) || {}
    },
    userEmail() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.UserEmail')
    },
    userEmailData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Emails.UserEmail']) || {}
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
