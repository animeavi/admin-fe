<template>
  <el-select
    v-model="value"
    :clearable="isDesktop"
    :placeholder="$t('usersFilter.inputPlaceholder')"
    multiple
    class="select-field"
    @change="toggleFilters">
    <el-option-group :label="$t('usersFilter.byAccountType')">
      <el-option :label="$t('usersFilter.local')" value="local"/>
      <el-option :label="$t('usersFilter.external')" value="external"/>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byStatus')">
      <el-option :label="$t('usersFilter.active')" value="active"/>
      <el-option :label="$t('usersFilter.deactivated')" value="deactivated"/>
      <el-option :label="$t('usersFilter.pending')" value="need_approval"/>
      <el-option :label="$t('usersFilter.unconfirmed')" value="unconfirmed"/>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byActorType')">
      <el-option :label="$t('usersFilter.person')" value="Person"/>
      <el-option :label="$t('usersFilter.bot')" value="Service"/>
      <el-option :label="$t('usersFilter.application')" value="Application"/>
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
    this.$store.dispatch('ToggleUsersFilter', this.$data.value)
  },
  methods: {
    removeOppositeFilters() {
      const currentFilters = []
      const indexOfLocal = this.$data.value.indexOf('local')
      const indexOfExternal = this.$data.value.indexOf('external')
      const indexOfActive = this.$data.value.indexOf('active')
      const indexOfDeactivated = this.$data.value.indexOf('deactivated')
      const indexOfPending = this.$data.value.indexOf('need_approval')
      const indexOfUnconfirmed = this.$data.value.indexOf('unconfirmed')
      const indexOfPerson = this.$data.value.indexOf('Person')
      const indexOfService = this.$data.value.indexOf('Service')
      const indexOfApplication = this.$data.value.indexOf('Application')

      Math.max(indexOfLocal, indexOfExternal) > -1
        ? currentFilters.push(this.$data.value[Math.max(indexOfLocal, indexOfExternal)])
        : currentFilters

      Math.max(indexOfActive, indexOfDeactivated, indexOfPending, indexOfUnconfirmed) > -1
        ? currentFilters.push(this.$data.value[Math.max(indexOfActive, indexOfDeactivated, indexOfPending, indexOfUnconfirmed)])
        : currentFilters

      const actorTypeFilters = [indexOfPerson, indexOfService, indexOfApplication].reduce((acc, index) => {
        if (index > -1) {
          currentFilters.push(this.$data.value[index])
          acc.push(this.$data.value[index])
        }
        return acc
      }, [])

      return [
        currentFilters,
        currentFilters.filter(filter => !actorTypeFilters.includes(filter)),
        actorTypeFilters
      ]
    },
    toggleFilters() {
      const [allFilters, filters, actorTypeFilters] = this.removeOppositeFilters()

      this.$data.value = allFilters
      this.$store.dispatch('ToggleUsersFilter', filters)
      this.$store.dispatch('ToggleActorTypeFilter', actorTypeFilters)
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
