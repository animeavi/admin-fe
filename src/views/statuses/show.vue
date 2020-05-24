<template>
  <div v-if="!loading" class="status-show-container">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container">
        <router-link :to="{ name: 'UsersShow', params: { id: user.id }}">
          <div class="avatar-name-header">
            <el-avatar v-if="accountExists(user, 'avatar')" :src="user.avatar" size="large" />
            <h1 v-if="accountExists(user, 'display_name')">{{ user.display_name }}</h1>
          </div>
        </router-link>
        <a v-if="accountExists(user, 'url')" :href="user.url" target="_blank" class="account">
          <i class="el-icon-top-right" title="Open user in instance"/>
        </a>
      </div>
      <div class="left-header-container">
        <moderation-dropdown
          :user="user"
          :page="'statusPage'"
          :status-id="status.id"
          @open-reset-token-dialog="openResetPasswordDialog"/>
        <reboot-button/>
      </div>
    </header>
    <div v-if="isMobile" class="user-page-header-container">
      <header class="user-page-header">
        <div class="avatar-name-container">
          <el-avatar v-if="accountExists(user, 'avatar')" :src="user.avatar" size="large" />
          <h1 v-if="accountExists(user, 'display_name')">{{ user.display_name }}</h1>
        </div>
        <reboot-button/>
      </header>
      <moderation-dropdown
        :user="user"
        :page="'userPage'"
        @open-reset-token-dialog="openResetPasswordDialog"/>
    </div>
    <reset-password-dialog
      :reset-password-dialog-open="resetPasswordDialogOpen"
      @close-reset-token-dialog="closeResetPasswordDialog"/>
    <div class="status-container">
      <status :status="status" :account="user" :show-checkbox="false" :godmode="showPrivate"/>
    </div>
    <div class="recent-statuses-container-show">
      <h2 class="recent-statuses">{{ $t('userProfile.recentStatuses') }} by {{ user.display_name }}</h2>
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
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from '../users/components/ModerationDropdown'
import RebootButton from '@/components/RebootButton'
import ResetPasswordDialog from '@/views/users/components/ResetPasswordDialog'

export default {
  name: 'StatusShow',
  components: { ModerationDropdown, RebootButton, ResetPasswordDialog, Status },
  data() {
    return {
      showPrivate: false,
      resetPasswordDialogOpen: false
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
      return this.$store.state.status.loading
    },
    status() {
      return this.$store.state.status.fetchedStatus
    },
    statuses() {
      return this.$store.state.userProfile.statuses
    },
    statusesLoading() {
      return this.$store.state.userProfile.statusesLoading
    },
    user() {
      return this.$store.state.status.statusAuthor
    }
  },
  beforeMount: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchStatus', this.$route.params.id)
  },
  methods: {
    accountExists(account, key) {
      return account[key]
    },
    closeResetPasswordDialog() {
      this.resetPasswordDialogOpen = false
      this.$store.dispatch('RemovePasswordToken')
    },
    onTogglePrivate() {
      this.$store.dispatch('FetchUserStatuses', { userId: this.user.id, godmode: this.showPrivate })
    },
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.avatar-name-container {
  display: flex;
  align-items: center;
  .el-icon-top-right {
    font-size: 2em;
    line-height: 36px;
    color: #606266;
  }
}
.avatar-name-header {
  display: flex;
  height: 40px;
  align-items: center;
}
.no-statuses {
  margin-left: 28px;
  color: #606266;
}
.password-reset-token {
  margin: 0 0 14px 0;
}
.password-reset-token-dialog {
  width: 50%
}
.reboot-button {
  padding: 10px;
  margin-left: 6px;
}

.recent-statuses-container-show {
  display: flex;
  flex-direction: column;
  .el-timeline-item {
    margin-left: 20px;
  }
  .recent-statuses {
    margin-left: 20px;
  }
  .show-private-statuses {
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
.reset-password-link {
  text-decoration: underline;
}
.status-container {
  margin: 0 15px 0 20px;
}
.statuses {
  padding: 0 20px 0 0;
}
.user-page-header {
  display: flex;
  justify-content: space-between;
  margin: 22px 15px 22px 20px;
  align-items: center;
  h1 {
    display: inline;
    margin: 0 0 0 10px;
  }
}

@media only screen and (min-width: 1824px) {
  .status-show-container {
    max-width: 1824px;
    margin: auto;
  }
}

@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
  .left-header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .password-reset-token-dialog {
    width: 85%
  }
  .recent-statuses {
    margin: 20px 10px 15px 10px;
  }
  .recent-statuses-container-show {
    width: 100%;
    margin: 0 0 0 15px;
  }
  .show-private-statuses {
    margin: 0 10px 20px 10px;
  }
  .status-container {
    margin: 0 10px;
  }
  .statuses {
    padding-right: 10px;
    margin-left: 8px;
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
}
@media only screen and (max-width:801px) and (min-width: 481px) {
  .recent-statuses {
    margin: 20px 10px 15px 0;
  }
  .recent-statuses-container-show {
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
}
</style>
