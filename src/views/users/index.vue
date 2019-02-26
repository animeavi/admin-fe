<template>
  <div class="users-container">
    <h1>Users</h1>
    <el-table
      v-loading="loading"
      :data="users"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="100" />
      <el-table-column
        prop="nickname"
        label="Name" />
      <el-table-column
        label="Status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deactivated ? 'danger' : 'success'">
            {{ scope.row.deactivated ? 'deactivated' : 'active' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions">
        <template slot-scope="scope">
          <el-button v-if="scope.row.deactivated" type="text" size="small" @click="handleDeactivate(scope.row)">Activate</el-button>
          <el-button v-else type="text" size="small" @click="handleDeactivate(scope.row)">Deactivate</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'Users',
  computed: {
    loading() {
      return this.$store.state.users.loading
    },
    users() {
      return this.$store.state.users.fetchedUsers
    }
  },
  mounted: function() {
    this.$store.dispatch('FetchUsers')
  },
  methods: {
    handleDeactivate({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.users-container {
  h1 {
    margin-left: 15px;
  }
}

</style>
