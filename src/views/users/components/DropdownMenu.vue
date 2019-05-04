<template>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item
      @click.native="grantRightToMultipleUsers('admin')">
      {{ $t('users.grantAdmin') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="revokeRightToMultipleUsers('admin')">
      {{ $t('users.revokeAdmin') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="grantRightToMultipleUsers('moderator')">
      {{ $t('users.grantModerator') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="revokeRightToMultipleUsers('moderator')">
      {{ $t('users.revokeModerator') }}
    </el-dropdown-item>
    <el-dropdown-item
      divided
      @click.native="activateMultipleUsers">
      {{ $t('users.activateAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="deactivateMultipleUsers">
      {{ $t('users.deactivateAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="deleteMultipleUsers">
      {{ $t('users.deleteAccount') }}
    </el-dropdown-item>
    <el-dropdown-item
      divided
      @click.native="toggleTagForMultipleUsers('force_nsfw')">
      {{ $t('users.forceNsfw') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('strip_media')">
      {{ $t('users.stripMedia') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('force_unlisted')">
      {{ $t('users.forceUnlisted') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('sandbox')">
      {{ $t('users.sandbox') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('disable_remote_subscription')">
      {{ $t('users.disableRemoteSubscription') }}
    </el-dropdown-item>
    <el-dropdown-item
      @click.native="toggleTagForMultipleUsers('disable_any_subscription')">
      {{ $t('users.disableAnySubscription') }}
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<script>
export default {
  props: {
    selectedUsers: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    grantRightToMultipleUsers(right) {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => user.local && !user.roles[right] && this.$store.state.user.id !== user.id)
        .map(user => this.$store.dispatch('ToggleRight', { user, right }))
      this.confirmMessage(
        'Are you sure you want to grant ' + right + ' rights to all selected users?',
        mapSelectedUsers
      )
    },
    revokeRightToMultipleUsers(right) {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => user.local && user.roles[right] && this.$store.state.user.id !== user.id)
        .map(user => this.$store.dispatch('ToggleRight', { user, right }))
      this.confirmMessage(
        'Are you sure you want to revoke ' + right + ' rights from all selected users?',
        mapSelectedUsers
      )
    },
    activateMultipleUsers() {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => user.deactivated && this.$store.state.user.id !== user.id)
        .map(user => this.$store.dispatch('ToggleUserActivation', user.nickname))
      this.confirmMessage(
        'Are you sure you want to activate accounts of all selected users?',
        mapSelectedUsers
      )
    },
    deactivateMultipleUsers() {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => !user.deactivated && this.$store.state.user.id !== user.id)
        .map(user => this.$store.dispatch('ToggleUserActivation', user.nickname))
      this.confirmMessage(
        'Are you sure you want to deactivate accounts of all selected users?',
        mapSelectedUsers
      )
    },
    deleteMultipleUsers() {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => this.$store.state.user.id !== user.id)
        .map(user => this.$store.dispatch('DeleteUser', user))
      this.confirmMessage(
        'Are you sure you want to delete accounts of all selected users?',
        mapSelectedUsers
      )
    },
    toggleTagForMultipleUsers(tag) {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
          ? user.local : user
        ).map(user => this.$store.dispatch('ToggleTag', { user, tag }))
      this.confirmMessage(
        'Are you sure you want to apply tag to all selected users?',
        mapSelectedUsers
      )
    },
    confirmMessage(message, mapSelectedUsers) {
      this.$confirm(message, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        mapSelectedUsers()
        this.$message({
          type: 'success',
          message: 'Completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    }
  }
}
</script>
