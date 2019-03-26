<template>
  <el-select
    v-model="value"
    :collapse-tags="isMobile"
    :clearable="isDesktop"
    :placeholder="$t('usersFilter.inputPlaceholder')"
    multiple
    class="select-field"
    @change="toggleFilters">
    <el-option-group :label="$t('usersFilter.byUserType')">
      <el-option value="local">{{ $t('usersFilter.local') }}</el-option>
      <el-option value="external">{{ $t('usersFilter.external') }}</el-option>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byStatus')">
      <el-option value="active">{{ $t('usersFilter.active') }}</el-option>
      <el-option value="deactivated">{{ $t('usersFilter.deactivated') }}</el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      value: []
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
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
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
