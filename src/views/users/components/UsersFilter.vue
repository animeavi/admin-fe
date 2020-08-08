<template>
  <el-select
    v-model="value"
    :clearable="isDesktop"
    :placeholder="$t('usersFilter.inputPlaceholder')"
    multiple
    class="select-field"
    @change="toggleFilters">
    <el-option-group :label="$t('usersFilter.byAccountType')">
      <el-option value="local" label="Local">{{ $t('usersFilter.local') }}</el-option>
      <el-option value="external" label="External">{{ $t('usersFilter.external') }}</el-option>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byStatus')">
      <el-option value="active" label="Active">{{ $t('usersFilter.active') }}</el-option>
      <el-option value="need_approval" label="Need Approval">{{ $t('usersFilter.pending') }}</el-option>
      <el-option value="deactivated" label="Deactivated">{{ $t('usersFilter.deactivated') }}</el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      value: ['local', 'active']
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  created() {
    const currentFilters = this.$data.value.reduce((acc, filter) => ({ ...acc, [filter]: true }), {})
    this.$store.dispatch('ToggleUsersFilter', currentFilters)
  },
  methods: {
    removeOppositeFilters() {
      const filtersQuantity = Object.keys(this.$store.state.users.filters).length
      const currentFilters = this.$data.value.slice()
      const indexOfLocal = currentFilters.indexOf('local')
      const indexOfExternal = currentFilters.indexOf('external')
      const indexOfActive = currentFilters.indexOf('active')
      const indexOfDeactivated = currentFilters.indexOf('deactivated')
      if (currentFilters.length === filtersQuantity) {
        return []
      } else if (indexOfLocal > -1 && indexOfExternal > -1) {
        const filterToRemove = indexOfLocal > indexOfExternal ? indexOfExternal : indexOfLocal
        currentFilters.splice(filterToRemove, 1)
      } else if (indexOfActive > -1 && indexOfDeactivated > -1) {
        const filterToRemove = indexOfActive > indexOfDeactivated ? indexOfDeactivated : indexOfActive
        currentFilters.splice(filterToRemove, 1)
      }
      return currentFilters
    },
    toggleFilters() {
      this.$data.value = this.removeOppositeFilters()
      const currentFilters = this.$data.value.reduce((acc, filter) => ({ ...acc, [filter]: true }), {})
      this.$store.dispatch('ToggleUsersFilter', currentFilters)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.select-field {
  width: 350px;
}

@media only screen and (max-width:480px) {
  .select-field {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
