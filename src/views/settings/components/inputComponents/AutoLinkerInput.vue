<template>
  <div>
    <div v-if="setting.key === ':class' || setting.key === ':rel'">
      <el-switch :value="autoLinkerBooleanValue(setting.key)" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input v-if="autoLinkerBooleanValue(setting.key)" :value="autoLinkerStringValue(setting.key)" @input="processTwoTypeValue($event, setting.key)"/>
    </div>
    <div v-if="setting.key === ':truncate'">
      <el-switch :value="autoLinkerBooleanValue(setting.key)" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input-number v-if="autoLinkerBooleanValue(setting.key)" :value="autoLinkerIntegerValue(setting.key)" @input="processTwoTypeValue($event, setting.key)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoLinkerInput',
  props: {
    data: {
      type: [Object, Array],
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
  methods: {
    autoLinkerBooleanValue(key) {
      const value = this.data[this.setting.key]
      return typeof value === 'string' || typeof value === 'number'
    },
    autoLinkerIntegerValue(key) {
      const value = this.data[this.setting.key]
      return value || 0
    },
    autoLinkerStringValue(key) {
      const value = this.data[this.setting.key]
      return value || ''
    },
    processTwoTypeValue(value, input) {
      if (value === true) {
        const data = input === ':truncate' ? 0 : ''
        this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else {
        this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      }
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
