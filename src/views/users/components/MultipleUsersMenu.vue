<template>
  <el-dropdown size="small" trigger="click" placement="bottom-start">
    <el-button v-if="isDesktop" class="actions-button">
      <span class="actions-button-container">
        <span>
          <i class="el-icon-edit" />
          {{ $t('users.moderateUsers') }}
        </span>
        <i class="el-icon-arrow-down el-icon--right"/>
      </span>
    </el-button>
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
        {{ $t('users.activateAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="deactivateMultipleUsers">
        {{ $t('users.deactivateAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="deleteMultipleUsers">
        {{ $t('users.deleteAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="requirePasswordReset">
        {{ $t('users.requirePasswordReset') }}
      </el-dropdown-item>
      <el-dropdown-item divided class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.forceNsfw') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('force_nsfw')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('force_nsfw')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.stripMedia') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('strip_media')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('strip_media')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.forceUnlisted') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('force_unlisted')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('force_unlisted')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.sandbox') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('sandbox')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('sandbox')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.disableRemoteSubscriptionForMultiple') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('disable_remote_subscription')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('disable_remote_subscription')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.disableAnySubscriptionForMultiple') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('disable_any_subscription')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('disable_any_subscription')">
              {{ $t('users.remove') }}
            </el-button>
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
      const applyAction = (users, dispatchAction) => {
        try {
          dispatchAction(users)
        } catch (err) {
          console.log(err)
          return
        }
        this.$message({
          type: 'success',
          message: this.$t('users.completed')
        })
        this.$emit('apply-action')
      }
      return {
        grantRight: (right) => () => {
          const filterUsersFn = user => user.local && !user.roles[right] && this.$store.state.user.id !== user.id
          const addRightFn = async(users) => await this.$store.dispatch('AddRight', { users, right })
          const filtered = this.selectedUsers.filter(filterUsersFn)

          applyAction(filtered, addRightFn)
        },
        revokeRight: (right) => () => {
          const filterUsersFn = user => user.local && user.roles[right] && this.$store.state.user.id !== user.id
          const deleteRightFn = async(users) => await this.$store.dispatch('DeleteRight', { users, right })
          const filtered = this.selectedUsers.filter(filterUsersFn)

          applyAction(filtered, deleteRightFn)
        },
        activate: () => {
          const filtered = this.selectedUsers.filter(user => user.deactivated && this.$store.state.user.id !== user.id)
          const activateUsersFn = async(users) => await this.$store.dispatch('ActivateUsers', users)

          applyAction(filtered, activateUsersFn)
        },
        deactivate: () => {
          const filtered = this.selectedUsers.filter(user => !user.deactivated && this.$store.state.user.id !== user.id)
          const deactivateUsersFn = async(users) => await this.$store.dispatch('DeactivateUsers', users)

          applyAction(filtered, deactivateUsersFn)
        },
        remove: () => {
          const filtered = this.selectedUsers.filter(user => this.$store.state.user.id !== user.id)
          const deleteAccountFn = async(user) => await this.$store.dispatch('DeleteUser', user)

          applyAction(filtered, deleteAccountFn)
        },
        addTag: (tag) => () => {
          const filtered = this.selectedUsers.filter(user =>
            tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
              ? user.local && !user.tags.includes(tag)
              : !user.tags.includes(tag))
          const addTagFn = async(users) => await this.$store.dispatch('AddTag', { users, tag })

          applyAction(filtered, addTagFn)
        },
        removeTag: (tag) => async() => {
          const filtered = this.selectedUsers.filter(user =>
            tag === 'disable_remote_subscription' || tag === 'disable_any_subscription'
              ? user.local && user.tags.includes(tag)
              : user.tags.includes(tag))
          const removeTagFn = async(users) => await this.$store.dispatch('RemoveTag', { users, tag })

          applyAction(filtered, removeTagFn)
        },
        requirePasswordReset: () => {
          this.selectedUsers.map(user => this.$store.dispatch('RequirePasswordReset', user))
        }
      }
    },
    grantRightToMultipleUsers(right) {
      const { grantRight } = this.mappers()
      this.confirmMessage(
        this.$t('users.grantRightConfirmation', { right }),
        grantRight(right)
      )
    },
    revokeRightFromMultipleUsers(right) {
      const { revokeRight } = this.mappers()
      this.confirmMessage(
        this.$t('users.revokeRightConfirmation', { right }),
        revokeRight(right)
      )
    },
    activateMultipleUsers() {
      const { activate } = this.mappers()
      this.confirmMessage(
        this.$t('users.activateMultipleUsersConfirmation'),
        activate
      )
    },
    deactivateMultipleUsers() {
      const { deactivate } = this.mappers()
      this.confirmMessage(
        this.$t('users.deactivateMultipleUsersConfirmation'),
        deactivate
      )
    },
    deleteMultipleUsers() {
      const { remove } = this.mappers()
      this.confirmMessage(
        this.$t('users.deleteMultipleUsersConfirmation'),
        remove
      )
    },
    requirePasswordReset() {
      const mailerEnabled = this.$store.state.user.nodeInfo.metadata.mailerEnabled

      if (!mailerEnabled) {
        this.$alert(this.$t('users.mailerMustBeEnabled'), 'Error', { type: 'error' })

        return
      }

      const { requirePasswordReset } = this.mappers()
      this.confirmMessage(
        this.$t('users.requirePasswordResetConfirmation'),
        requirePasswordReset
      )
    },
    addTagForMultipleUsers(tag) {
      const { addTag } = this.mappers()
      this.confirmMessage(
        this.$t('users.addTagForMultipleUsersConfirmation'),
        addTag(tag)
      )
    },
    removeTagFromMultipleUsers(tag) {
      const { removeTag } = this.mappers()
      this.confirmMessage(
        this.$t('users.removeTagFromMultipleUsersConfirmation'),
        removeTag(tag)
      )
    },
    confirmMessage(message, applyAction) {
      this.$confirm(message, {
        confirmButtonText: this.$t('users.ok'),
        cancelButtonText: this.$t('users.cancel'),
        type: 'warning'
      }).then(() => {
        applyAction()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('users.canceled')
        })
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .actions-button {
    text-align: left;
    width: 350px;
    padding: 10px;
  }
  .actions-button-container {
    display: flex;
    justify-content: space-between;
  }
  .el-dropdown {
    float: right;
  }
  .el-icon-edit {
    margin-right: 5px;
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
