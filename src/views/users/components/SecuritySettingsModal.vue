<template>
  <el-dialog
    :before-close="close"
    :title="$t('userProfile.securitySettings.securitySettings')"
    :visible="visible"
    class="security-settings-modal">
    <el-row>
      <p>
        <label>
          {{ $t('userProfile.securitySettings.email') }}
        </label>
      </p>
    </el-row>
    <el-row>
      <el-input
        :placeholder="$t('userProfile.securitySettings.inputNewEmail')"
        v-model="emailForm.newEmail" />
    </el-row>
    <br>
    <el-row type="flex" justify="end">
      <el-button
        :loading="emailForm.isLoading"
        :disabled="!emailForm.newEmail || emailForm.newEmail === userCredentials.email"
        type="primary"
        @click="updateEmail()">
        {{ $t('userProfile.securitySettings.submit') }}
      </el-button>
    </el-row>
    <el-row>
      <p>
        <label>
          {{ $t('userProfile.securitySettings.password') }}
        </label>
      </p>
    </el-row>
    <el-row>
      <el-input
        :placeholder="$t('userProfile.securitySettings.inputNewPassword')"
        v-model="passwordForm.newPassword"
        show-password />
      <small class="form-text">
        {{ $t('userProfile.securitySettings.passwordLengthNotice', { minLength: 8 }) }}
      </small>
      <br>
      <el-alert
        :closable="false"
        type="warning"
        show-icon>
        <p>{{ $t('userProfile.securitySettings.passwordChangeWarning1') }}</p>
        <p>{{ $t('userProfile.securitySettings.passwordChangeWarning2') }}</p>
      </el-alert>
    </el-row>
    <br>
    <el-row type="flex" justify="end">
      <el-button
        :loading="passwordForm.isLoading"
        :disabled="passwordForm.newPassword.length < 8"
        type="primary"
        @click="updatePassword()">
        {{ $t('userProfile.securitySettings.submit') }}
      </el-button>
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  name: 'SecuritySettingsModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      emailForm: {
        newEmail: '',
        isLoading: false
      },
      passwordForm: {
        newPassword: '',
        isLoading: false
      }
    }
  },
  computed: {
    userCredentials() {
      return this.$store.state.userProfile.userCredentials
    }
  },
  mounted: async function() {
    await this.$store.dispatch('FetchUserCredentials', { nickname: this.user.nickname })
    this.emailForm.newEmail = this.userCredentials.email
  },
  methods: {
    async updateEmail() {
      const credentials = { email: this.emailForm.newEmail }
      this.emailForm.isLoading = true
      await this.$store.dispatch('UpdateUserCredentials', { nickname: this.user.nickname, credentials })
      this.emailForm.isLoading = false
      this.$notify.success({
        title: this.$t('userProfile.securitySettings.success'),
        message: this.$t('userProfile.securitySettings.emailUpdated'),
        duration: 2000
      })
    },
    async updatePassword() {
      const credentials = { password: this.passwordForm.newPassword }
      this.passwordForm.isLoading = true
      await this.$store.dispatch('UpdateUserCredentials', { nickname: this.user.nickname, credentials })
      this.passwordForm.isLoading = false
      this.passwordForm.newPassword = ''
      this.$notify.success({
        title: this.$t('userProfile.securitySettings.success'),
        message: this.$t('userProfile.securitySettings.passwordUpdated'),
        duration: 2000
      })
    },
    close() {
      this.$emit('close', true)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@media all and (max-width: 800px) {
  .security-settings-modal {
    .el-dialog {
      width: 90%;
    }
  }
}

.security-settings-modal {
  .el-alert .el-alert__description {
    word-break: break-word;
    font-size: 1em;
  }

  .form-text {
    display: block;
    margin-top: .25rem;
    color: #909399;
  }
}
</style>
