<template>
  <main v-if="!userProfileLoading">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container">
        <el-avatar :src="user.avatar" size="large" />
        <h1>{{ user.display_name }}</h1>
      </div>
      <div class="left-header-container">
        <moderation-dropdown
          :user="user"
          :page="'userPage'"
          @open-reset-token-dialog="openResetPasswordDialog"/>
        <reboot-button/>
      </div>
    </header>
    <div v-if="isMobile" class="user-page-header-container">
      <header class="user-page-header">
        <div class="avatar-name-container">
          <el-avatar :src="user.avatar" size="large" />
          <h1>{{ user.display_name }}</h1>
        </div>
        <reboot-button/>
      </header>
      <moderation-dropdown
        :user="user"
        :page="'userPage'"
        @open-reset-token-dialog="openResetPasswordDialog"/>
    </div>
    <el-dialog
      v-loading="loading"
      :visible.sync="resetPasswordDialogOpen"
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
    <div class="user-profile-container">
      <el-card class="user-profile-card">
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table--medium">
          <table class="user-profile-table">
            <tbody>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.nickname') }}</td>
                <td>
                  {{ user.nickname }}
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="name-col">ID</td>
                <td class="value-col">
                  {{ user.id }}
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.tags') }}</td>
                <td>
                  <el-tag v-for="tag in user.tags" :key="tag" class="user-profile-tag">{{ tag }}</el-tag>
                  <span v-if="user.tags.length === 0">—</span>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.roles') }}</td>
                <td>
                  <el-tag v-if="user.roles.admin" class="user-profile-tag">
                    {{ $t('users.admin') }}
                  </el-tag>
                  <el-tag v-if="user.roles.moderator" class="user-profile-tag">
                    {{ $t('users.moderator') }}
                  </el-tag>
                  <span v-if="!user.roles.moderator && !user.roles.admin">—</span>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.localUppercase') }}</td>
                <td>
                  <el-tag v-if="user.local" type="info">{{ $t('userProfile.local') }}</el-tag>
                  <el-tag v-if="!user.local" type="info">{{ $t('userProfile.external') }}</el-tag>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>{{ $t('userProfile.activeUppercase') }}</td>
                <td>
                  <el-tag v-if="!user.deactivated" type="success">{{ $t('userProfile.active') }}</el-tag>
                  <el-tag v-if="user.deactivated" type="danger">{{ $t('userProfile.deactivated') }}</el-tag>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-button icon="el-icon-lock" class="security-setting-button" @click="securitySettingsModalVisible = true">
          {{ $t('userProfile.securitySettings.securitySettings') }}
        </el-button>
        <SecuritySettingsModal
          :user="user"
          :visible="securitySettingsModalVisible"
          @close="securitySettingsModalVisible = false" />
      </el-card>
      <div class="recent-statuses-container">
        <h2 class="recent-statuses">{{ $t('userProfile.recentStatuses') }}</h2>
        <el-checkbox v-model="showPrivate" class="show-private-statuses" @change="onTogglePrivate">
          {{ $t('statuses.showPrivateStatuses') }}
        </el-checkbox>
        <el-timeline v-if="!statusesLoading" class="statuses">
          <el-timeline-item v-for="status in statuses" :key="status.id">
            <status :status="status" :account="status.account" :show-checkbox="false" :user-id="user.id" :godmode="showPrivate"/>
          </el-timeline-item>
          <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
        </el-timeline>
      </div>
    </div>
  </main>
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from './components/ModerationDropdown'
import SecuritySettingsModal from './components/SecuritySettingsModal'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'UsersShow',
  components: { ModerationDropdown, RebootButton, Status, SecuritySettingsModal },
  data() {
    return {
      showPrivate: false,
      resetPasswordDialogOpen: false,
      securitySettingsModalVisible: false
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    loading() {
      return this.$store.state.users.loading
    },
    passwordResetLink() {
      return this.$store.state.users.passwordResetToken.link
    },
    passwordResetToken() {
      return this.$store.state.users.passwordResetToken.token
    },
    statuses() {
      return this.$store.state.userProfile.statuses
    },
    statusesLoading() {
      return this.$store.state.userProfile.statusesLoading
    },
    user() {
      return this.$store.state.userProfile.user
    },
    userProfileLoading() {
      return this.$store.state.userProfile.userProfileLoading
    },
    userCredentials() {
      return this.$store.state.userProfile.userCredentials
    }
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchUserProfile', { userId: this.$route.params.id, godmode: false })
  },
  methods: {
    closeResetPasswordDialog() {
      this.resetPasswordDialogOpen = false
      this.$store.dispatch('RemovePasswordToken')
    },
    onTogglePrivate() {
      this.$store.dispatch('FetchUserProfile', { userId: this.$route.params.id, godmode: this.showPrivate })
    },
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
header {
  align-items: center;
  display: flex;
  margin: 22px 0;
  padding-left: 15px;
  h1 {
    margin: 0 0 0 10px;
  }
}
table {
  margin: 10px 0 0 15px;
  .name-col {
    width: 150px;
  }
}
.avatar-name-container {
  display: flex;
  align-items: center;
}

.el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: transparent;
}
.image {
  width: 20%;
  img {
    width: 100%;
  }
}
.left-header-container {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.no-statuses {
  margin-left: 28px;
  color: #606266;
}
.poll ul {
  list-style-type: none;
  padding: 0;
  width: 30%;
}
.reboot-button {
  padding: 10px;
  margin-left: 10px;
}
.recent-statuses-container {
  display: flex;
  flex-direction: column;
  width: 67%;
}
.recent-statuses-header {
  margin-top: 10px;
}
.security-setting-button {
  margin-top: 20px;
  width: 100%;
}
.statuses {
  padding: 0 20px 0 0;
}
.show-private {
  width: 200px;
  text-align: left;
  line-height: 67px;
  margin-right: 20px;
}
.show-private-statuses {
  margin-left: 28px;
  margin-bottom: 20px;
}
.recent-statuses {
  margin-left: 28px;
}
.user-page-header {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 0 20px;
  align-items: center;
  h1 {
    display: inline
  }
}
.user-profile-card {
  margin: 0 20px;
  width: 30%;
  height: fit-content;
}
.user-profile-container {
  display: flex;
}
.user-profile-table {
  margin: 0;
}
.user-profile-tag {
  margin: 0 4px 4px 0;
}

@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .recent-statuses {
    margin: 20px 10px 15px 10px;
  }
  .recent-statuses-container {
    width: 100%;
    margin: 0 10px;
  }
  .show-private-statuses {
    margin: 0 10px 20px 10px;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 15px 10px;
  }
  .user-page-header-container {
    .el-dropdown {
      width: 95%;
      margin: 0 15px 15px 10px;
    }
  }
  .user-profile-card {
    margin: 0 10px;
    width: 95%;
    td {
      width: 80px;
    }
  }
  .user-profile-container {
    flex-direction: column;
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .recent-statuses {
    margin: 20px 10px 15px 0;
  }
  .recent-statuses-container {
    width: 97%;
    margin: 0 20px;
  }
  .show-private-statuses {
    margin: 0 10px 20px 0;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 20px 20px;
  }
  .user-profile-card {
    margin: 0 20px;
    width: fit-content;
  }
  .user-profile-container {
    flex-direction: column;
  }
}
</style>
