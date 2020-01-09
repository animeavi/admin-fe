<template>
  <div>
    <el-select
      v-if="setting.key === ':backends'"
      :value="data.value"
      multiple
      filterable
      allow-create
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option value=":console" label="console"/>
      <el-option value=":ex_syslogger" label="ExSyslogger"/>
      <el-option value="Quack.Logger" label="Quack.Logger"/>
    </el-select>
    <el-select
      v-if="setting.key === ':args'"
      :value="data[setting.key]"
      multiple
      filterable
      allow-create
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option value="strip" label="strip"/>
      <el-option value="auto-orient" label="auto-orient"/>
      <el-option value="implode" label="implode"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelect',
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
