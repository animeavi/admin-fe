<template>
  <el-dropdown :hide-on-click="false" size="small" trigger="click">
    <div>
      <span v-if="page === 'users'" class="el-dropdown-link">
        {{ $t('users.moderation') }}
        <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
      </span>
      <el-button v-if="page === 'userPage'" class="moderate-user-button">
        <span class="moderate-user-button-container">
          <span>
            <i class="el-icon-edit" />
            {{ $t('users.moderateUser') }}
          </span>
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
      </el-button>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="showAdminAction(user)"
        @click.native="toggleUserRight(user, 'admin')">
        {{ user.roles.admin ? $t('users.revokeAdmin') : $t('users.grantAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showAdminAction(user)"
        @click.native="toggleUserRight(user, 'moderator')">
        {{ user.roles.moderator ? $t('users.revokeModerator') : $t('users.grantModerator') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(user.id)"
        :divided="showAdminAction(user)"
        @click.native="toggleActivation(user)">
        {{ user.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(user.id)"
        @click.native="handleDeletion(user)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.confirmation_pending"
        divided
        @click.native="handleEmailConfirmation(user)">
        {{ $t('users.confirmAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.confirmation_pending"
        @click.native="handleConfirmationResend(user)">
        {{ $t('users.resendConfirmation') }}
      </el-dropdown-item>
      <el-dropdown-item
        :divided="showAdminAction(user)"
        :class="{ 'active-tag': user.tags.includes('force_nsfw') }"
        @click.native="toggleTag(user, 'force_nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="user.tags.includes('force_nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('strip_media') }"
        @click.native="toggleTag(user, 'strip_media')">
        {{ $t('users.stripMedia') }}
        <i v-if="user.tags.includes('strip_media')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('force_unlisted') }"
        @click.native="toggleTag(user, 'force_unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="user.tags.includes('force_unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('sandbox') }"
        @click.native="toggleTag(user, 'sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="user.tags.includes('sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        :class="{ 'active-tag': user.tags.includes('disable_remote_subscription') }"
        @click.native="toggleTag(user, 'disable_remote_subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="user.tags.includes('disable_remote_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        :class="{ 'active-tag': user.tags.includes('disable_any_subscription') }"
        @click.native="toggleTag(user, 'disable_any_subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="user.tags.includes('disable_any_subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        divided
        @click.native="getPasswordResetToken(user.nickname)">
        {{ $t('users.getPasswordResetToken') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        @click.native="requirePasswordReset(user)">
        {{ $t('users.requirePasswordReset') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ModerationDropdown',
  props: {
    user: {
      type: Object,
      default: function() {
        return {}
      }
    },
    page: {
      type: String,
      default: 'users'
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    getPasswordResetToken(nickname) {
      this.$emit('open-reset-token-dialog')
      this.$store.dispatch('GetPasswordResetToken', nickname)
    },
    handleConfirmationResend(user) {
      this.$store.dispatch('ResendConfirmationEmail', [user])
    },
    handleDeletion(user) {
      this.$store.dispatch('DeleteUsers', [user])
    },
    handleEmailConfirmation(user) {
      this.$store.dispatch('ConfirmUsersEmail', [user])
    },
    requirePasswordReset(user) {
      const mailerEnabled = this.$store.state.user.nodeInfo.metadata.mailerEnabled
      if (!mailerEnabled) {
        this.$alert(this.$t('users.mailerMustBeEnabled'), 'Error', { type: 'error' })
        return
      }
      this.$store.dispatch('RequirePasswordReset', [user])
    },
    showAdminAction({ local, id }) {
      return local && this.showDeactivatedButton(id)
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleActivation(user) {
      user.deactivated
        ? this.$store.dispatch('ActivateUsers', [user])
        : this.$store.dispatch('DeactivateUsers', [user])
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag })
        : this.$store.dispatch('AddTag', { users: [user], tag })
    },
    toggleUserRight(user, right) {
      user.roles[right]
        ? this.$store.dispatch('DeleteRight', { users: [user], right })
        : this.$store.dispatch('AddRight', { users: [user], right })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .moderate-user-button {
    text-align: left;
    width: 200px;
    padding: 10px;
  }
  .moderate-user-button-container {
    display: flex;
    justify-content: space-between;
  }
</style>
