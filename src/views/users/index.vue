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
        prop="fullname"
        label="Name" />
      <el-table-column
        fixed="right"
        label="Operations"
        width="120">
        <template>
          <el-button type="text" size="small" @click="handleRevoke">Disable user</el-button>
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
    handleRevoke() {

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
