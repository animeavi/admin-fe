<template>
  <div class="crontab">
    <el-form-item v-for="worker in workers" :key="worker" :label="worker" :label-width="labelWidth" class="crontab-container">
      <span slot="label" class="crontab-label">
        {{ worker }}
      </span>
      <el-input
        :value="data[worker]"
        :placeholder="getSuggestion(worker) || null"
        class="input setting-input crontab-input"
        @input="update($event, worker)"/>
    </el-form-item>
  </div>
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
        return '120px'
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
      const updatedValue = {
        ...this.$store.state.settings.settings[this.settingGroup.group][this.settingGroup.key][this.setting.key],
        [worker]: value
      }
      this.$store.dispatch('UpdateSettings',
        { group: this.settingGroup.group, key: this.settingGroup.key, input: this.setting.key, value: updatedValue, type: 'reversed_tuple' }
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
