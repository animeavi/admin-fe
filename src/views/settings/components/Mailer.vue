<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="mailer" :model="mailerData" :label-width="labelWidth">
      <setting :setting-group="mailer" :data="mailerData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="swoosh" :model="swooshData" :label-width="labelWidth">
      <setting :setting-group="swoosh" :data="swooshData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
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
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
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
    swoosh() {
      return this.settings.description.find(setting => setting.group === ':swoosh')
    },
    swooshData() {
      return _.get(this.settings.settings, [':swoosh']) || {}
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
