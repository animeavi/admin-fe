<template>
  <div class="users-container">
    <h1>{{ $t('users.users') }}</h1>
    <div class="search-container">
      <el-checkbox :value="showLocalUsersOnly" @change="handleLocalUsersCheckbox">{{ $t('users.localUsersOnly') }}</el-checkbox>
      <el-input :placeholder="$t('users.search')" class="search" @input="handleDebounceSearchInput"/>
    </div>
    <el-table v-loading="loading" :data="users" style="width: 100%">
      <el-table-column :min-width="width" :label="$t('users.id')" prop="id" />
      <el-table-column :label="$t('users.name')" prop="nickname">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
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
          <el-dropdown size="small">
            <span class="el-dropdown-link">
              {{ $t('users.moderation') }}
              <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="showAdminAction(scope.row)" @click.native="toggleUserRight(scope.row, 'admin')">
                {{ scope.row.roles.admin ? $t('users.revokeAdmin') : $t('users.grantAdmin') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showAdminAction(scope.row)" @click.native="toggleUserRight(scope.row, 'moderator')">
                {{ scope.row.roles.moderator ? $t('users.revokeModerator') : $t('users.grantModerator') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showDeactivatedButton(scope.row.id)" :divided="showAdminAction(scope.row)" @click.native="handleDeactivation(scope.row)">
                {{ scope.row.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showDeactivatedButton(scope.row.id)" @click.native="handleDeletion(scope.row)">
                {{ $t('users.deleteAccount') }}
              </el-dropdown-item>
              <el-dropdown-item :divided="showAdminAction(scope.row)" @click.native="toggleTag(scope.row, 'force_nsfw')">
                {{ $t('users.forceNsfw') }}
                <i v-if="scope.row.tags.includes('force_nsfw')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'strip_media')">
                {{ $t('users.stripMedia') }}
                <i v-if="scope.row.tags.includes('strip_media')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'force_unlisted')">
                {{ $t('users.forceUnlisted') }}
                <i v-if="scope.row.tags.includes('force_unlisted')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'sandbox')">
                {{ $t('users.sandbox') }}
                <i v-if="scope.row.tags.includes('sandbox')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.local" @click.native="toggleTag(scope.row, 'disable_remote_subscription')">
                {{ $t('users.disableRemoteSubscription') }}
                <i v-if="scope.row.tags.includes('disable_remote_subscription')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.local" @click.native="toggleTag(scope.row, 'disable_any_subscription')">
                {{ $t('users.disableAnySubscription') }}
                <i v-if="scope.row.tags.includes('disable_any_subscription')" class="el-icon-circle-check"/>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
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

export default {
  name: 'Users',
  computed: {
    loading() {
      return this.$store.state.users.loading
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
    showLocalUsersOnly() {
      return this.$store.state.users.showLocalUsersOnly
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
    handleDeactivation({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handlePageChange(page) {
      const searchQuery = this.$store.state.users.searchQuery
      if (searchQuery === '') {
        this.$store.dispatch('FetchUsers', { page })
      } else {
        this.$store.dispatch('SearchUsers', { query: searchQuery, page })
      }
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    showAdminAction({ local, id }) {
      return local && this.showDeactivatedButton(id)
    },
    handleLocalUsersCheckbox(e) {
      this.$store.dispatch('ToggleLocalUsersFilter', e)
    },
    activationIcon(status) {
      return status ? 'el-icon-error' : 'el-icon-success'
    },
    toggleUserRight(user, right) {
      this.$store.dispatch('ToggleRight', { user, right })
    },
    handleDeletion(user) {
      this.$store.dispatch('DeleteUser', user)
    },
    toggleTag(user, tag) {
      this.$store.dispatch('ToggleTag', { user, tag })
    },
    getFirstLetter(str) {
      return str.charAt(0).toUpperCase()
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.users-container {
  h1 {
    margin-left: 15px;
  }

  .pagination {
    margin: 25px 0;
    text-align: center;
  }

  .search {
    width: 300px;
    margin-bottom: 21.5px;
    margin-right: 15px;
    float: right;
  }
  .search-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-left: 15px;
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .users-container {
    h1 {
      margin-left: 7px;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .search {
      width: 50%;
      margin-bottom: 21.5px;
      margin-right: 7px;
      float: right;
    }
    .search-container {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-left: 7px;
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
