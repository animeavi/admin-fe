<template>
  <el-select
    v-model="value"
    :collapse-tags="isMobile"
    :clearable="isDesktop"
    :placeholder="$t('usersFilter.inputPlaceholder')"
    multiple
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
        label: this.$i18n.t('usersFilter.byUserType'),
        options: [{
          label: this.$i18n.t('usersFilter.local'),
          value: 'local'
        }, {
          label: this.$i18n.t('usersFilter.external'),
          value: 'external'
        }]
      }, {
        label: this.$i18n.t('usersFilter.byStatus'),
        options: [{
          label: this.$i18n.t('usersFilter.active'),
          value: 'active'
        }, {
          label: this.$i18n.t('usersFilter.deactivated'),
          value: 'deactivated'
        }]
      }],
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
