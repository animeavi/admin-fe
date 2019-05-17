<template>
  <el-dropdown size="small" trigger="click">
    <el-button v-if="isDesktop" icon="el-icon-edit" class="actions-button"/>
    <el-dropdown-menu v-if="showDropdownForMultipleUsers" slot="dropdown">
      <el-dropdown-item
        @click.native="grantRightToMultipleUsers('admin')">
        {{ $t('users.grantAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="revokeRightFromMultipleUsers('admin')">
        {{ $t('users.revokeAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="grantRightToMultipleUsers('moderator')">
        {{ $t('users.grantModerator') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="revokeRightFromMultipleUsers('moderator')">
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
    <el-dropdown-menu v-else slot="dropdown">
      <el-dropdown-item>
        {{ $t('users.selectUsers') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
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
  computed: {
    showDropdownForMultipleUsers() {
      return this.$props.selectedUsers.length > 0
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    mappers() {
      return {
        grantRight: (right) => () => this.selectedUsers
          .filter(user => user.local && !user.roles[right] && this.$store.state.user.id !== user.id)
          .map(user => this.$store.dispatch('ToggleRight', { user, right })),
        revokeRight: (right) => () => this.selectedUsers
          .filter(user => user.local && user.roles[right] && this.$store.state.user.id !== user.id)
          .map(user => this.$store.dispatch('ToggleRight', { user, right })),
        activate: () => this.selectedUsers
          .filter(user => user.deactivated && this.$store.state.user.id !== user.id)
          .map(user => this.$store.dispatch('ToggleUserActivation', user.nickname)),
        deactivate: () => this.selectedUsers
          .filter(user => !user.deactivated && this.$store.state.user.id !== user.id)
          .map(user => this.$store.dispatch('ToggleUserActivation', user.nickname)),
        remove: () => this.selectedUsers
          .filter(user => this.$store.state.user.id !== user.id)
          .map(user => this.$store.dispatch('DeleteUser', user)),
        addTag: (tag) => () => {
          const users = this.selectedUsers
            .filter(user => tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
              ? user.local && !user.tags.includes(tag)
              : !user.tags.includes(tag))
          this.$store.dispatch('AddTag', { users, tag })
        },
        removeTag: (tag) => () => {
          const users = this.selectedUsers
            .filter(user => tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
              ? user.local && user.tags.includes(tag)
              : user.tags.includes(tag))
          this.$store.dispatch('RemoveTag', { users, tag })
        }
      }
    },
    grantRightToMultipleUsers(right) {
      const { grantRight } = this.mappers()
      this.confirmMessage(
        `Are you sure you want to grant ${right} rights to all selected users?`,
        grantRight(right)
      )
    },
    revokeRightFromMultipleUsers(right) {
      const { revokeRight } = this.mappers()
      this.confirmMessage(
        `Are you sure you want to revoke ${right} rights from all selected users?`,
        revokeRight(right)
      )
    },
    activateMultipleUsers() {
      const { activate } = this.mappers()
      this.confirmMessage(
        'Are you sure you want to activate accounts of all selected users?',
        activate
      )
    },
    deactivateMultipleUsers() {
      const { deactivate } = this.mappers()
      this.confirmMessage(
        'Are you sure you want to deactivate accounts of all selected users?',
        deactivate
      )
    },
    deleteMultipleUsers() {
      const { remove } = this.mappers()
      this.confirmMessage(
        'Are you sure you want to delete accounts of all selected users?',
        remove
      )
    },
    addTagForMultipleUsers(tag) {
      const { addTag } = this.mappers()
      this.confirmMessage(
        'Are you sure you want to apply tag to all selected users?',
        addTag(tag)
      )
    },
    removeTagFromMultipleUsers(tag) {
      const { removeTag } = this.mappers()
      this.confirmMessage(
        'Are you sure you want to remove tag from all selected users?',
        removeTag(tag)
      )
    },
    confirmMessage(message, applyAction) {
      this.$confirm(message, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        applyAction()
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
  .actions-button {
    margin-left: 15px;
  }
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
