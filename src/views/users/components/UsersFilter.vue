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
          value: 'showLocalUsersOnly'
        }, {
          label: 'External',
          value: 'showExternalUsersOnly'
        }]
      }, {
        label: 'By status',
        options: [{
          label: 'Active',
          value: 'showActiveUsersOnly'
        }, {
          label: 'Deactivated',
          value: 'showDeactivatedUsersOnly'
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
    handleFilterToggle(filters) {
      const currentFilter = filters[filters.length - 1]
      this.$store.dispatch('ToggleUsersFilter', currentFilter)
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
