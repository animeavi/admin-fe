<template>
  <el-select
    v-model="filter"
    :placeholder="$t('reportsFilter.inputPlaceholder')"
    clearable
    class="select-field"
    @change="toggleFilters">
    <el-option value="open">{{ $t('reportsFilter.open') }}</el-option>
    <el-option value="closed">{{ $t('reportsFilter.closed') }}</el-option>
    <el-option value="resolved">{{ $t('reportsFilter.resolved') }}</el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      filter: []
    }
  },
  methods: {
    toggleFilters() {
      this.$store.dispatch('ToggleReportsFilter', this.$data.filter)
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
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
