<template>
  <div class="users-container">
    <h1>
      {{ $t('users.users') }}
      <span class="user-count">({{ normalizedUsersCount }})</span>
    </h1>
    <div class="filter-container">
      <users-filter/>
      <el-input :placeholder="$t('users.search')" v-model="search" class="search" @input="handleDebounceSearchInput"/>
    </div>
    <div class="actions-container">
      <el-button class="actions-button create-account" @click="dialogFormVisible = true">
        <span>
          <i class="el-icon-plus" />
          {{ $t('users.createAccount') }}
        </span>
      </el-button>
      <multiple-users-menu
        :selected-users="selectedUsers"
        @apply-action="clearSelection"/>
    </div>
    <new-account-dialog
      :dialog-form-visible="dialogFormVisible"
      @createNewAccount="createNewAccount"
      @closeWindow="dialogFormVisible = false"/>
    <el-table
      v-loading="loading"
      ref="usersTable"
      :data="users"
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="isDesktop"
        type="selection"
        reserve-selection
        width="44"
        align="center"/>
      <el-table-column :min-width="width" :label="$t('users.id')" prop="id" />
      <el-table-column :label="$t('users.name')" prop="nickname">
        <template slot-scope="scope">
          <router-link :to="{ name: 'UsersShow', params: { id: scope.row.id }}">{{ scope.row.nickname }}</router-link>
          <el-tag v-if="isDesktop" type="info" size="mini">
            <span>{{ scope.row.local ? $t('users.local') : $t('users.external') }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :min-width="width" :label="$t('users.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deactivated ? 'danger' : 'success'">
            <span v-if="isDesktop">{{ scope.row.deactivated ? $t('users.deactivated') : $t('users.active') }}</span>
            <i v-else :class="activationIcon(scope.row.deactivated)"/>
          </el-tag>
          <el-tag v-if="scope.row.roles.admin">
            <span>{{ isDesktop ? $t('users.admin') : getFirstLetter($t('users.admin')) }}</span>
          </el-tag>
          <el-tag v-if="scope.row.roles.moderator">
            <span>{{ isDesktop ? $t('users.moderator') : getFirstLetter($t('users.moderator')) }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('users.actions')" fixed="right">
        <template slot-scope="scope">
          <el-dropdown size="small" trigger="click">
            <span class="el-dropdown-link">
              {{ $t('users.moderation') }}
              <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="showAdminAction(scope.row)"
                @click.native="toggleUserRight(scope.row, 'admin')">
                {{ scope.row.roles.admin ? $t('users.revokeAdmin') : $t('users.grantAdmin') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="showAdminAction(scope.row)"
                @click.native="toggleUserRight(scope.row, 'moderator')">
                {{ scope.row.roles.moderator ? $t('users.revokeModerator') : $t('users.grantModerator') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="showDeactivatedButton(scope.row.id)"
                :divided="showAdminAction(scope.row)"
                @click.native="handleDeactivation(scope.row)">
                {{ scope.row.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="showDeactivatedButton(scope.row.id)"
                @click.native="handleDeletion(scope.row)">
                {{ $t('users.deleteAccount') }}
              </el-dropdown-item>
              <el-dropdown-item
                :divided="showAdminAction(scope.row)"
                :class="{ 'active-tag': scope.row.tags.includes('force_nsfw') }"
                @click.native="toggleTag(scope.row, 'force_nsfw')">
                {{ $t('users.forceNsfw') }}
                <i v-if="scope.row.tags.includes('force_nsfw')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': scope.row.tags.includes('strip_media') }"
                @click.native="toggleTag(scope.row, 'strip_media')">
                {{ $t('users.stripMedia') }}
                <i v-if="scope.row.tags.includes('strip_media')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': scope.row.tags.includes('force_unlisted') }"
                @click.native="toggleTag(scope.row, 'force_unlisted')">
                {{ $t('users.forceUnlisted') }}
                <i v-if="scope.row.tags.includes('force_unlisted')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': scope.row.tags.includes('sandbox') }"
                @click.native="toggleTag(scope.row, 'sandbox')">
                {{ $t('users.sandbox') }}
                <i v-if="scope.row.tags.includes('sandbox')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.local"
                :class="{ 'active-tag': scope.row.tags.includes('disable_remote_subscription') }"
                @click.native="toggleTag(scope.row, 'disable_remote_subscription')">
                {{ $t('users.disableRemoteSubscription') }}
                <i v-if="scope.row.tags.includes('disable_remote_subscription')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.local"
                :class="{ 'active-tag': scope.row.tags.includes('disable_any_subscription') }"
                @click.native="toggleTag(scope.row, 'disable_any_subscription')">
                {{ $t('users.disableAnySubscription') }}
                <i v-if="scope.row.tags.includes('disable_any_subscription')" class="el-icon-check"/>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="users.length === 0" class="no-users-message">
      <p>There are no users to display</p>
    </div>
    <div v-if="!loading" class="pagination">
      <el-pagination
        :total="usersCount"
        :current-page="currentPage"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import numeral from 'numeral'
import UsersFilter from './components/UsersFilter'
import MultipleUsersMenu from './components/MultipleUsersMenu'
import NewAccountDialog from './components/NewAccountDialog'

export default {
  name: 'Users',
  components: {
    UsersFilter,
    MultipleUsersMenu,
    NewAccountDialog
  },
  data() {
    return {
      search: '',
      selectedUsers: [],
      dialogFormVisible: false
    }
  },
  computed: {
    loading() {
      return this.$store.state.users.loading
    },
    normalizedUsersCount() {
      return numeral(this.$store.state.users.totalUsersCount).format('0a')
    },
    users() {
      return this.$store.state.users.fetchedUsers
    },
    usersCount() {
      return this.$store.state.users.totalUsersCount
    },
    pageSize() {
      return this.$store.state.users.pageSize
    },
    currentPage() {
      return this.$store.state.users.currentPage
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    width() {
      return this.isMobile ? 55 : false
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.$store.dispatch('SearchUsers', { query, page: 1 })
    }, 500)
  },
  mounted: function() {
    this.$store.dispatch('FetchUsers', { page: 1 })
  },
  methods: {
    activationIcon(status) {
      return status ? 'el-icon-error' : 'el-icon-success'
    },
    clearSelection() {
      this.$refs.usersTable.clearSelection()
    },
    createNewAccount(accountData) {
      this.$store.dispatch('CreateNewAccount', accountData)
    },
    getFirstLetter(str) {
      return str.charAt(0).toUpperCase()
    },
    handleDeactivation({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handleDeletion(user) {
      this.$store.dispatch('DeleteUser', user)
    },
    handlePageChange(page) {
      const searchQuery = this.$store.state.users.searchQuery
      if (searchQuery === '') {
        this.$store.dispatch('FetchUsers', { page })
      } else {
        this.$store.dispatch('SearchUsers', { query: searchQuery, page })
      }
    },
    handleSelectionChange(value) {
      this.$data.selectedUsers = value
    },
    showAdminAction({ local, id }) {
      return local && this.showDeactivatedButton(id)
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag })
        : this.$store.dispatch('AddTag', { users: [user], tag })
    },
    toggleUserRight(user, right) {
      this.$store.dispatch('ToggleRight', { user, right })
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
.actions-container {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  margin: 0 15px 10px 15px;
}
.active-tag {
  color: #409EFF;
  font-weight: 700;
  .el-icon-check {
    color: #409EFF;
    float: right;
    margin: 7px 0 0 15px;
  }
}
.el-dropdown-link:hover {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-plus {
  margin-right: 5px;
}
.users-container {
  h1 {
    margin: 22px 0 0 15px;
  }

  .pagination {
    margin: 25px 0;
    text-align: center;
  }

  .search {
    width: 350px;
    float: right;
  }
  .filter-container {
    display: flex;
    height: 36px;
    justify-content: space-between;
    align-items: center;
    margin: 22px 15px 15px 15px
  }
  .user-count {
    color: gray;
    font-size: 28px;
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .users-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .actions-container {
      display: flex;
      flex-direction: column;
      margin: 0 10px 7px 10px
    }
    .create-account {
      width: 100%;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .search {
      width: 100%;
    }
    .filter-container {
      display: flex;
      height: 82px;
      flex-direction: column;
      margin: 0 10px
    }
    .el-tag {
      width: 30px;
      display: inline-block;
      margin-bottom: 4px;
      font-weight: bold;
      &.el-tag--success {
        padding-left: 8px;
      }
      &.el-tag--danger {
        padding-left: 8px;
      }
    }
  }
}
</style>