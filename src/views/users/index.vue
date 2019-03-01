<template>
  <div class="users-container">
    <h1>Users</h1>
    <el-input placeholder="Search" class="search" @input="handleDebounceSearchInput"/>
    <el-table v-loading="loading" :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"/>
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
            v-if="scope.row.deactivated"
            type="text"
            size="small"
            @click="handleDeactivate(scope.row)"
          >Activate</el-button>
          <el-button v-else type="text" size="small" @click="handleDeactivate(scope.row)">Deactivate</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!loading" class="pagination">
      <el-pagination
        :total="usersCount"
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
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.$store.dispatch('SearchUsers', query)
    }, 500)
  },
  mounted: function() {
    this.$store.dispatch('FetchUsers')
  },
  methods: {
    handleDeactivate({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchUsers', page)
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
    margin: 25px 0 0;
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
