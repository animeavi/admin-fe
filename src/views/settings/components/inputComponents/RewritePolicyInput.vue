<template>
  <div class="input">
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="inputValue"
      :data-search="setting.key"
      multiple
      filterable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in options(setting.suggestions)" :key="index" :value="option.value" :label="option.label" />
    </el-select>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes('dropdown'))"
      :value="inputValue"
      :data-search="setting.key || setting.group"
      clearable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option
        v-for="(option, index) in options(setting.suggestions)"
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
    inputValue() {
      if (this.setting.key === 'Pleroma.Web.Auth.Authenticator') {
        return this.data.value
      } else if (this.setting.key === ':rewrite_policy') {
        return typeof this.data[this.setting.key] === 'string'
          ? [this.data[this.setting.key]]
          : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  methods: {
    options(suggestions) {
      let prefix

      switch (this.setting.key) {
        case ':rewrite_policy':
          prefix = 'Pleroma.Web.ActivityPub.MRF.'
          break
        case 'Pleroma.Web.Auth.Authenticator':
          prefix = 'Pleroma.Web.Auth.'
          break
        case ':method':
          prefix = 'Pleroma.Captcha.'
          break
        default:
          prefix = ''
      }

      return suggestions.map(element => {
        const label = element.split(prefix)[1]
          ? element.split(prefix)[1]
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
