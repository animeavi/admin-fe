<template>
  <el-select
    :value="data.value"
    multiple
    filterable
    allow-create
    @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
    <el-option value=":console" label="console"/>
    <el-option value=":ex_syslogger" label="ExSyslogger"/>
    <el-option value="Quack.Logger" label="Quack.Logger"/>
  </el-select>
</template>

<script>
export default {
  name: 'BackendsLoggerInput',
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
    updateSetting(value, group, key, input, type) {
      const updatedValue = () => {
        const index = value.findIndex(el => el === ':ex_syslogger')
        const updatedArray = value.slice()
        if (index !== -1) {
          updatedArray[index] = ['ExSyslogger', ':ex_syslogger']
        }
        return updatedArray
      }

      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedValue(), type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
