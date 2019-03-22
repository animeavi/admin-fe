<template>
  <div class="users-container">
    <h1>Users</h1>
    <div class="search-container">
      <el-checkbox :value="showLocalUsersOnly" @change="handleLocalUsersCheckbox">Local users only</el-checkbox>
      <el-input placeholder="Search" class="search" @input="handleDebounceSearchInput"/>
    </div>
    <el-table v-loading="loading" :data="users" style="width: 100%">
      <el-table-column :min-width="width" prop="id" label="ID"/>
      <el-table-column prop="nickname" label="Name"/>
      <el-table-column :min-width="width" label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deactivated ? 'danger' : 'success'">
            <span v-if="isDesktop">{{ scope.row.deactivated ? 'deactivated' : 'active' }}</span>
            <i v-else :class="activationIcon(scope.row.deactivated)"/>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions">
        <template slot-scope="scope">
          <el-button
            v-if="showDeactivatedButton(scope.row.id)"
            class="toggle-activation"
            type="text"
            size="small"
            @click="handleDeactivate(scope.row)"
          >{{ scope.row.deactivated ? 'Activate' : 'Deactivate' }}</el-button>
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
      return this.isMobile ? 60 : false
    },
    rowStyle(id) {
      return {
        'data-user-id': id
      }
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
    handleDeactivate({ nickname }) {
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
    handleLocalUsersCheckbox(e) {
      this.$store.dispatch('ToggleLocalUsersFilter', e)
    },
    activationIcon(status) {
      return status ? 'el-icon-error' : 'el-icon-success'
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
  }
}
</style>
