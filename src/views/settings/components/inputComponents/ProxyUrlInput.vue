<template>
  <div class="setting-input">
    <el-input
      :value="data.host"
      placeholder="host (e.g. localhost or 127.0.0.1)"
      class="proxy-url-value-input"
      @input="updateProxyUrl($event, 'host')"/> :
    <el-input
      :value="data.port"
      placeholder="port (e.g 9020 or 3090)"
      class="proxy-url-value-input"
      @input="updateProxyUrl($event, 'port')"/>
    <el-checkbox :value="data.socks5" class="name-input" @change="updateProxyUrl($event, 'socks5')">Socks5</el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ProxyUrlInput',
  props: {
    data: {
      type: Object || Array,
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
    updateProxyUrl(value, inputType) {
      let data
      if (inputType === 'socks5') {
        data = { ...this.data, socks5: value }
      } else if (inputType === 'host') {
        data = { ...this.data, host: value }
      } else {
        data = { ...this.data, port: value }
      }
      this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const assembledData = value.socks5
        ? [':socks5', value.host, value.port]
        : `${value.host}:${value.port}`
      this.$store.dispatch('UpdateSettings', { group, key, input, value: assembledData, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
