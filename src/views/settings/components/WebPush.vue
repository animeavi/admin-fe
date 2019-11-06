<template>
  <el-form v-if="!loading" ref="vapidDetails" :model="vapidDetails" :label-width="labelWidth">
    <el-form-item label="Subject">
      <el-input :value="vapidDetails.subject" @input="updateSetting($event, 'vapid_details', 'subject')"/>
      <p class="expl">A mailto link for the administrative contact. It’s best if this email is not a personal email address,
      but rather a group email so that if a person leaves an organization, is unavailable for an extended period,
      or otherwise can’t respond, someone else on the list can.</p>
    </el-form-item>
    <el-form-item label="Public key">
      <el-input :value="vapidDetails.public_key" @input="updateSetting($event, 'vapid_details', 'public_key')"/>
      <p class="expl">VAPID public key</p>
    </el-form-item>
    <el-form-item label="Private key">
      <el-input :value="vapidDetails.private_key" @input="updateSetting($event, 'vapid_details', 'private_key')"/>
      <p class="expl">VAPID private key</p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'WebPush',
  computed: {
    ...mapGetters([
      'vapidDetails'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
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
