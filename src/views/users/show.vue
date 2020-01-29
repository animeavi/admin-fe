<template>
  <main v-if="!userProfileLoading">
    <header class="user-page-header">
      <div class="avatar-name-container">
        <el-avatar :src="user.avatar" size="large" />
        <h1>{{ user.display_name }}</h1>
      </div>
      <moderation-dropdown
        :user="user"
        :page="'userPage'"
        @open-reset-token-dialog="openResetPasswordDialog"/>
    </header>
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
    <el-row>
      <el-col :span="8">
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
        </el-card>
      </el-col>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="18">
          <h2 class="recent-statuses">{{ $t('userProfile.recentStatuses') }}</h2>
        </el-col>
        <el-col :span="6" class="show-private">
          <el-checkbox v-model="showPrivate" @change="onTogglePrivate">
            {{ $t('userProfile.showPrivateStatuses') }}
          </el-checkbox>
        </el-col>
      </el-row>
      <el-col :span="16">
        <el-timeline v-if="!statusesLoading" class="statuses">
          <el-timeline-item v-for="status in statuses" :key="status.id">
            <status :status="status" :user-id="user.id" :godmode="showPrivate"/>
          </el-timeline-item>
          <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
        </el-timeline>
      </el-col>
    </el-row>
  </main>
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from './components/ModerationDropdown'

export default {
  name: 'UsersShow',
  components: { ModerationDropdown, Status },
  data() {
    return {
      showPrivate: false,
      resetPasswordDialogOpen: false
    }
  },
  computed: {
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
    }
  },
  mounted: function() {
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
.avatar-name-container {
  display: flex;
  align-items: center;
}
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
.el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: transparent;
}
.poll ul {
  list-style-type: none;
  padding: 0;
  width: 30%;
}
.image {
  width: 20%;
  img {
    width: 100%;
  }
}
.no-statuses {
  margin-left: 28px;
  color: #606266;
}
.recent-statuses-header {
  margin-top: 10px;
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
.recent-statuses {
  margin-left: 28px;
}
.user-page-header {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  h1 {
    display: inline
  }
}
.user-profile-card {
  margin: 0 20px;
}
.user-profile-table {
  margin: 0;
}
.user-profile-tag {
  margin: 0 4px 4px 0;
}
</style>
