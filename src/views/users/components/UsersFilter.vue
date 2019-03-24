<template>
  <el-select
    v-model="value"
    :collapse-tags="isMobile"
    multiple
    placeholder="Select filter"
    class="select-field"
    @change="handleFilterToggle"
    @remove-tag="handleFilterToggle">
    <el-option-group
      v-for="group in filters"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      filters: [{
        label: 'By user type',
        options: [{
          label: 'Local',
          value: 'userType/showLocalUsersOnly'
        }, {
          label: 'External',
          value: 'userType/showExternalUsersOnly'
        }]
      }, {
        label: 'By status',
        options: [{
          label: 'Active',
          value: 'userStatus/showActiveUsersOnly'
        }, {
          label: 'Deactivated',
          value: 'userStatus/showDeactivatedUsersOnly'
        }]
      }],
      value: []
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  methods: {
    handleFilterToggle(value) {
      const reversed = value.reverse()
      const userTypeFilter = reversed.find(filter => filter.includes('userType'))
      const userStatusFilter = reversed.find(filter => filter.includes('userStatus'))
      const filters = [userTypeFilter, userStatusFilter].filter(item => item)
      this.$data.value = filters
      const filtersWithoutGroupnames = filters.reduce((acc, item) => {
        const filter = item.split('/')[1]
        acc.push(filter)
        return acc
      }, [])
      this.$store.dispatch('ToggleUsersFilter', filtersWithoutGroupnames)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.select-field {
  width: 350px;
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .select-field {
    width: 48%;
  }
}
</style>
