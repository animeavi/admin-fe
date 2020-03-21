<template>
  <el-form :label-width="labelWidth" :label-position="isMobile ? 'top' : 'right'" class="crontab">
    <el-form-item v-for="worker in workers" :key="worker" :label="worker" :data-search="setting.key" class="crontab-container">
      <el-input
        :value="data[worker]"
        :placeholder="getSuggestion(worker) || null"
        class="input setting-input"
        @input="update($event, worker)"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CrontabInput',
  props: {
    data: {
      type: Object,
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
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '100%'
      } else {
        return '380px'
      }
    },
    workers() {
      return this.setting.suggestions.map(worker => worker[1])
    }
  },
  methods: {
    getSuggestion(worker) {
      return this.setting.suggestions.find(suggestion => suggestion[1] === worker)[0]
    },
    update(value, worker) {
      const currentValue = this.$store.state.settings.settings[this.settingGroup.group][this.settingGroup.key][this.setting.key]
      const updatedValue = { ...currentValue, [worker]: value }
      const updatedValueWithType = Object.keys(currentValue).reduce((acc, key) => {
        if (key === worker) {
          return { ...acc, [key]: ['reversed_tuple', value] }
        } else {
          return { ...acc, [key]: ['reversed_tuple', currentValue[key]] }
        }
      }, {})

      this.$store.dispatch('UpdateSettings',
        { group: this.settingGroup.group, key: this.settingGroup.key, input: this.setting.key, value: updatedValueWithType, type: this.setting.type }
      )
      this.$store.dispatch('UpdateState',
        { group: this.settingGroup.group, key: this.settingGroup.key, input: this.setting.key, value: updatedValue }
      )
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
