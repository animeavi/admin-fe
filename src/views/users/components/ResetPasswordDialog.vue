<template>
  <el-dialog
    v-loading="loading"
    :visible="dialogOpen"
    :title="$t('users.passwordResetTokenCreated')"
    custom-class="password-reset-token-dialog"
    @close="closeResetPasswordDialog">
    <div>
      <p class="password-reset-token">Password reset token was generated: {{ passwordResetToken }}</p>
      <p>You can also use this link to reset password:
        <a :href="passwordResetLink" target="_blank" class="reset-password-link">{{ passwordResetLink }}</a>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResetPasswordDialog',
  props: {
    resetPasswordDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogOpen() {
      return this.resetPasswordDialogOpen
    },
    loading() {
      return this.$store.state.users.loading
    },
    passwordResetLink() {
      return this.$store.state.users.passwordResetToken.link
    },
    passwordResetToken() {
      return this.$store.state.users.passwordResetToken.token
    }
  },
  methods: {
    closeResetPasswordDialog() {
      this.$emit('close-reset-token-dialog')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.password-reset-token-dialog {
  width: 50%
}

@media only screen and (max-width:480px) {
  .password-reset-token-dialog {
    width: 85%
  }
}
</style>
