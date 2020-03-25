<template>
  <el-dialog
    :before-close="close"
    :title="$t('userProfile.securitySettings.securitySettings')"
    :visible="visible"
    class="security-settings-modal">
    <el-form :model="securitySettingsForm" :label-width="getLabelWidth">
      <el-form-item :label="$t('userProfile.securitySettings.email')">
        <el-input v-model="securitySettingsForm.newEmail" :placeholder="$t('userProfile.securitySettings.inputNewEmail')"/>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="securitySettingsForm.isEmailLoading"
          :disabled="!securitySettingsForm.newEmail || securitySettingsForm.newEmail === userCredentials.email"
          type="primary"
          class="security-settings-submit-button"
          @click="updateEmail()">
          {{ $t('userProfile.securitySettings.submit') }}
        </el-button>
      </el-form-item>
      <el-form-item :label="$t('userProfile.securitySettings.password')" class="password-input">
        <el-input v-model="securitySettingsForm.newPassword" :placeholder="$t('userProfile.securitySettings.inputNewPassword')"/>
        <small class="form-text">
          {{ $t('userProfile.securitySettings.passwordLengthNotice', { minLength: 8 }) }}
        </small>
      </el-form-item>
      <el-alert
        :closable="false"
        type="warning"
        show-icon
        class="password-alert">
        <p>{{ $t('userProfile.securitySettings.passwordChangeWarning1') }}</p>
        <p>{{ $t('userProfile.securitySettings.passwordChangeWarning2') }}</p>
      </el-alert>
      <el-form-item>
        <el-button
          :loading="securitySettingsForm.isPasswordLoading"
          :disabled="securitySettingsForm.newPassword.length < 8"
          type="primary"
          class="security-settings-submit-button"
          @click="updatePassword()">
          {{ $t('userProfile.securitySettings.submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'

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
      securitySettingsForm: {
        newEmail: '',
        newPassword: '',
        isEmailLoading: false,
        isPasswordLoading: false
      }
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    getLabelWidth() {
      return this.isDesktop ? '120px' : '85px'
    },
    userCredentials() {
      return this.$store.state.userProfile.userCredentials
    }
  },
  mounted: async function() {
    await this.$store.dispatch('FetchUserCredentials', { nickname: this.user.nickname })
    this.securitySettingsForm.newEmail = this.userCredentials.email
  },
  methods: {
    async updateEmail() {
      const credentials = { email: this.securitySettingsForm.newEmail }
      this.securitySettingsForm.isEmailLoading = true
      await this.$store.dispatch('UpdateUserCredentials', { nickname: this.user.nickname, credentials })
      this.securitySettingsForm.isEmailLoading = false
      Message({
        message: this.$t('userProfile.securitySettings.emailUpdated'),
        type: 'success',
        duration: 5 * 1000
      })
    },
    async updatePassword() {
      const credentials = { password: this.securitySettingsForm.newPassword }
      this.securitySettingsForm.isPasswordLoading = true
      await this.$store.dispatch('UpdateUserCredentials', { nickname: this.user.nickname, credentials })
      this.securitySettingsForm.isPasswordLoading = false
      this.securitySettingsForm.newPassword = ''
      Message({
        message: this.$t('userProfile.securitySettings.passwordUpdated'),
        type: 'success',
        duration: 5 * 1000
      })
    },
    close() {
      this.$emit('close', true)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.security-settings-container {
  display: flex;
  label {
    width: 15%;
    height: 36px;
  }
}
.security-settings-modal {
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .password-alert {
    margin-bottom: 15px;
  }
  .password-input {
    margin-bottom: 0;
  }
}
.security-settings-submit-button {
  float: right;
}

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
