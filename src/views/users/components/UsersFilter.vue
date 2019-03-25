<template>
  <el-select
    v-model="value"
    :collapse-tags="isMobile"
    multiple
    clearable
    placeholder="Select filter"
    class="select-field"
    @change="toggleFilters">
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
          value: 'localUsersOnly'
        }, {
          label: 'External',
          value: 'externalUsersOnly'
        }]
      }, {
        label: 'By status',
        options: [{
          label: 'Active',
          value: 'activeUsersOnly'
        }, {
          label: 'Deactivated',
          value: 'deactivatedUsersOnly'
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
    toggleFilters() {
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
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .select-field {
    width: 48%;
  }
}
</style>
