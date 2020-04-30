<template>
  <div v-if="!loading">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container">
        <el-avatar v-if="accountExists(user, 'avatar')" :src="user.avatar" size="large" />
        <h1 v-if="accountExists(user, 'display_name')">{{ user.display_name }}</h1>
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
    <div class="status-container">
      <status :status="status" :account="user" :show-checkbox="false" :godmode="showPrivate"/>
    </div>
  </div>
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from '../users/components/ModerationDropdown'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'UsersShow',
  components: { ModerationDropdown, RebootButton, Status },
  data() {
    return {
      showPrivate: true,
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
    user() {
      return this.$store.state.status.fetchedStatus.account
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
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.avatar-name-container {
  display: flex;
  align-items: center;
}
.status-container {
  margin: 0 15px 0 20px;
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
@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .left-header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
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
  .user-page-header {
    padding: 0;
    margin: 7px 15px 20px 20px;
  }
}
</style>
