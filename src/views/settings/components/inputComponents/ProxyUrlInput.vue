<template>
  <div :data-search="setting.key" class="proxy-url-input">
    <el-input
      :value="proxyUrlData.host"
      placeholder="host (e.g. localhost or 127.0.0.1)"
      class="proxy-url-host-input"
      @input="updateProxyUrl($event, 'host')"/>
    <span v-if="isDesktop">:</span>
    <el-input
      :value="proxyUrlData.port"
      placeholder="port (e.g 9020 or 3090)"
      class="proxy-url-value-input"
      @input="updateProxyUrl($event, 'port')"/>
    <div class="socks5-checkbox-container">
      <el-checkbox :value="proxyUrlData.socks5" @change="updateProxyUrl($event, 'socks5')"/>
      <span class="socks5-checkbox">Socks5</span>
    </div>
  </div>
</template>

<script>
import { processNested } from '@/store/modules/normalizers'

export default {
  name: 'ProxyUrlInput',
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
    },
    parents: {
      type: Array,
      default: function() {
        return []
      },
      required: false
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    },
    proxyUrlData() {
      return Object.keys(this.data).length === 0 ? { socks5: false, host: null, port: null } : this.data
    }
  },
  methods: {
    updateProxyUrl(value, inputType) {
      let data
      if (inputType === 'socks5') {
        data = { ...this.proxyUrlData, socks5: value }
      } else if (inputType === 'host') {
        data = { ...this.proxyUrlData, host: value }
      } else {
        data = { ...this.proxyUrlData, port: value }
      }
      this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const assembledData = value.socks5
        ? [':socks5', value.host, value.port]
        : `${value.host}:${value.port}`
      if (this.parents.length > 0) {
        const { valueForState,
          valueForUpdatedSettings,
          setting } = processNested(value, assembledData, group, key, this.parents.reverse(), this.settings, this.updatedSettings)

        this.$store.dispatch('UpdateSettings',
          { group, key, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
        this.$store.dispatch('UpdateState',
          { group, key, input: setting.key, value: valueForState })
      } else {
        this.$store.dispatch('UpdateSettings', { group, key, input, value: assembledData, type })
        this.$store.dispatch('UpdateState', { group, key, input, value })
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
