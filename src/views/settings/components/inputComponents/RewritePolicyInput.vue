<template>
  <div class="input">
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="rewritePolicyValue"
      :data-search="setting.key"
      multiple
      filterable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in rewritePolicyOptions(setting.suggestions)" :key="index" :value="option.value" :label="option.label" />
    </el-select>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes('dropdown'))"
      :value="data.value"
      :data-search="setting.key || setting.group"
      clearable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option
        v-for="(option, index) in authenticatorOptions(setting.suggestions)"
        :value="option.value"
        :label="option.label"
        :key="index"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'RewritePolicyInput',
  props: {
    data: {
      type: [Array, Object],
      default: function() {
        return {}
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    rewritePolicyValue() {
      return typeof this.data[this.setting.key] === 'string' ? [this.data[this.setting.key]] : this.data[this.setting.key]
    }
  },
  methods: {
    authenticatorOptions(suggestions) {
      return suggestions.map(element => {
        const label = element.split('Pleroma.Web.Auth.')[1]
          ? element.split('Pleroma.Web.Auth.')[1]
          : element
        return { value: element, label }
      })
    },
    renderMultipleSelect(type) {
      return Array.isArray(type) && this.setting.key !== ':backends' && this.setting.key !== ':args' && (
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('regex') && type.includes('string')) ||
        this.setting.key === ':args'
      )
    },
    rewritePolicyOptions(suggestions) {
      return suggestions.map(element => {
        const label = element.split('Pleroma.Web.ActivityPub.MRF.')[1]
          ? element.split('Pleroma.Web.ActivityPub.MRF.')[1]
          : element
        return { value: element, label }
      })
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
