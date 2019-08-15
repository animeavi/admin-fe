<template>
  <div>
    <el-form ref="activityPub" :model="activityPub" :label-width="labelWidth">
      <el-form-item label="Accept blocks">
        <el-switch :value="activityPub.accept_blocks" @change="updateSetting($event, 'activitypub', 'accept_blocks')"/>
        <p class="expl">Whether to accept incoming block activities from other instances</p>
      </el-form-item>
      <el-form-item label="Unfollow blocked">
        <el-switch :value="activityPub.unfollow_blocked" @change="updateSetting($event, 'activitypub', 'unfollow_blocked')"/>
        <p class="expl">Whether blocks result in people getting unfollowed</p>
      </el-form-item>
      <el-form-item label="Outgoing blocks">
        <el-switch :value="activityPub.outgoing_blocks" @change="updateSetting($event, 'activitypub', 'outgoing_blocks')"/>
        <p class="expl">Whether to federate blocks to other instances</p>
      </el-form-item>
      <el-form-item label="Follow handshake timeout">
        <el-input-number
          :value="activityPub.follow_handshake_timeout"
          :step="100"
          :min="0"
          size="large"
          class="top-margin"
          @change="updateSetting($event, 'activitypub', 'follow_handshake_timeout')"/>
      </el-form-item>
      <el-form-item label="Sign object fetches">
        <el-switch :value="activityPub.sign_object_fetches" @change="updateSetting($event, 'activitypub', 'sign_object_fetches')"/>
        <p class="expl">Sign object fetches with HTTP signatures</p>
      </el-form-item>
    </el-form>
    <el-form ref="user" :model="user" :label-width="labelWidth">
      <el-form-item label="Deny follow blocked">
        <el-switch :value="user.deny_follow_blocked" @change="updateSetting($event, 'user', 'deny_follow_blocked')"/>
        <p class="expl">Whether to disallow following an account that has blocked the user in question</p>
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
  name: 'ActivityPub',
  computed: {
    ...mapGetters([
      'activityPub',
      'user'
    ]),
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
