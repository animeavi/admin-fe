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
    <el-dropdown-item divided class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.forceNsfw') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('force_nsfw')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('force_nsfw')">remove</el-button>
        </el-button-group>
      </div>
    </el-dropdown-item>
    <el-dropdown-item class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.stripMedia') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('strip_media')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('strip_media')">remove</el-button>
        </el-button-group>
      </div>
    </el-dropdown-item>
    <el-dropdown-item class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.forceUnlisted') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('force_unlisted')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('force_unlisted')">remove</el-button>
        </el-button-group>
      </div>
    </el-dropdown-item>
    <el-dropdown-item class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.sandbox') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('sandbox')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('sandbox')">remove</el-button>
        </el-button-group>
      </div>
    </el-dropdown-item>
    <el-dropdown-item class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.disableRemoteSubscription') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('disable_remote_subscription')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('disable_remote_subscription')">remove</el-button>
        </el-button-group>
      </div>
    </el-dropdown-item>
    <el-dropdown-item class="no-hover">
      <div class="tag-container">
        <span class="tag-text">{{ $t('users.disableAnySubscription') }}</span>
        <el-button-group class="tag-button-group">
          <el-button size="mini" @click.native="addTagForMultipleUsers('disable_any_subscription')">apply</el-button>
          <el-button size="mini" @click.native="removeTagFromMultipleUsers('disable_any_subscription')">remove</el-button>
        </el-button-group>
      </div>
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
    addTagForMultipleUsers(tag) {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
          ? user.local && !user.tags.includes(tag)
          : !user.tags.includes(tag)
        ).map(user => this.$store.dispatch('ToggleTag', { user, tag }))
      this.confirmMessage(
        'Are you sure you want to apply tag to all selected users?',
        mapSelectedUsers
      )
    },
    removeTagFromMultipleUsers(tag) {
      const mapSelectedUsers = () => this.selectedUsers
        .filter(user => tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
          ? user.local && user.tags.includes(tag)
          : user.tags.includes(tag)
        ).map(user => this.$store.dispatch('ToggleTag', { user, tag }))
      this.confirmMessage(
        'Are you sure you want to remove tag from all selected users?',
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
        this.$emit('apply-action')
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

<style rel='stylesheet/scss' lang='scss' scoped>
  .tag-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tag-text {
    padding-right: 20px;
  }
  .no-hover:hover {
    color: #606266;
    background-color: white;
    cursor: auto;
  }
</style>
