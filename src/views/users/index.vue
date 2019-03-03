<template>
  <div class="users-container">
    <h1>Users</h1>
    <el-input placeholder="Search" class="search" @input="handleDebounceSearchInput"/>
    <el-table v-loading="loading" :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"/>
      <el-table-column prop="nickname" label="Name"/>
      <el-table-column label="Status">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.deactivated ? 'danger' : 'success'"
          >{{ scope.row.deactivated ? 'deactivated' : 'active' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions">
        <template slot-scope="scope">
          <el-button
            v-if="showDeactivatedButton(scope.row.id)"
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
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.$store.dispatch('SearchUsers', { query, page: 1, page_size: 2 })
    }, 500)
  },
  mounted: function() {
    this.$store.dispatch('FetchUsers', { page: 1, page_size: 2 })
  },
  methods: {
    handleDeactivate({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handlePageChange(page) {
      const searchQuery = this.$store.state.users.searchQuery
      if (searchQuery === '') {
        this.$store.dispatch('FetchUsers', { page, page_size: 2 })
      } else {
        this.$store.dispatch('SearchUsers', { query: searchQuery, page, page_size: 2 })
      }
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
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
}
</style>
