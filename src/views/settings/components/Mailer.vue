<template>
  <div v-if="!loading">
    <el-form ref="mailer" :model="mailerData" :label-width="labelWidth">
      <setting :setting-group="mailer" :data="mailerData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="emailNotifications" :model="emailNotificationsData" :label-width="labelWidth">
      <setting :setting-group="emailNotifications" :data="emailNotificationsData"/>
    </el-form>
    <el-form ref="userEmail" :model="userEmail" :label-width="labelWidth">
      <setting :setting-group="userEmail" :data="userEmailData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Setting from './Setting'

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
      return this.settings.settings[':email_notifications']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.$store.state.settings.loading
    },
    mailer() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.Mailer')
    },
    mailerData() {
      return this.settings.settings['Pleroma.Emails.Mailer']
    },
    userEmail() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.UserEmail')
    },
    userEmailData() {
      return this.settings.settings['Pleroma.Emails.UserEmail']
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
