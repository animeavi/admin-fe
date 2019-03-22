<template>
  <div class="users-container">
    <h1>Users</h1>
    <div class="search-container">
      <el-checkbox :value="showLocalUsersOnly" @change="handleLocalUsersCheckbox">Local users only</el-checkbox>
      <el-input placeholder="Search" class="search" @input="handleDebounceSearchInput"/>
    </div>
    <el-table v-loading="loading" :data="users" style="width: 100%">
      <el-table-column :min-width="width" prop="id" label="ID"/>
      <el-table-column prop="nickname" label="Name">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
          <el-tag v-if="isDesktop" type="info" size="mini">
            <span>{{ scope.row.local ? 'local' : 'external' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :min-width="width" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deactivated ? 'danger' : 'success'">
            <span v-if="isDesktop">{{ scope.row.deactivated ? 'deactivated' : 'active' }}</span>
            <i v-else :class="activationIcon(scope.row.deactivated)"/>
          </el-tag>
          <el-tag v-if="scope.row.roles.admin">
            <span>{{ isDesktop ? 'admin' : 'A' }}</span>
          </el-tag>
          <el-tag v-if="scope.row.roles.moderator">
            <span>{{ isDesktop ? 'moderator' : 'M' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions">
        <template slot-scope="scope">
          <el-dropdown size="small">
            <span class="el-dropdown-link">
              Moderation
              <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="showAdminAction(scope.row)" @click.native="toggleUserRight(scope.row, 'admin')">
                {{ scope.row.roles.admin ? 'Revoke Admin' : 'Grant Admin' }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showAdminAction(scope.row)" @click.native="toggleUserRight(scope.row, 'moderator')">
                {{ scope.row.roles.moderator ? 'Revoke Moderator' : 'Grant Moderator' }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showDeactivatedButton(scope.row.id)" :divided="showAdminAction(scope.row)" @click.native="handleDeactivation(scope.row)">
                {{ scope.row.deactivated ? 'Activate account' : 'Deactivate account' }}
              </el-dropdown-item>
              <el-dropdown-item v-if="showDeactivatedButton(scope.row.id)" @click.native="handleDeletion(scope.row)">
                Delete Account
              </el-dropdown-item>
              <el-dropdown-item :divided="showAdminAction(scope.row)" @click.native="toggleTag(scope.row, 'force_nsfw')">
                Force posts to be NSFW
                <i v-if="scope.row.tags.includes('force_nsfw')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'strip_media')">
                Force posts not to have media
                <i v-if="scope.row.tags.includes('strip_media')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'force_unlisted')">
                Force posts to be unlisted
                <i v-if="scope.row.tags.includes('force_unlisted')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toggleTag(scope.row, 'sandbox')">
                Force posts to be followers-only
                <i v-if="scope.row.tags.includes('sandbox')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.local" @click.native="toggleTag(scope.row, 'disable_remote_subscription')">
                Disallow following user from remote instances
                <i v-if="scope.row.tags.includes('disable_remote_subscription')" class="el-icon-circle-check"/>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.local" @click.native="toggleTag(scope.row, 'disable_any_subscription')">
                Disallow following user at all
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
