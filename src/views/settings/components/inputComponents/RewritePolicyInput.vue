<template>
  <div class="input">
    <el-select
      v-if="isMobile"
      :value="rewritePolicyValue"
      :data-search="setting.key"
      multiple
      filterable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in rewritePolicyOptions(setting.suggestions)" :key="index" :value="option.value" :label="option.label" />
    </el-select>
    <el-select
      v-else
      :value="rewritePolicyValue"
      :data-search="setting.key"
      multiple
      filterable
      allow-create
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'RewritePolicyInput',
  props: {
    data: {
      type: [String, Array],
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
      return typeof this.data === 'string' ? [this.data] : this.data
    }
  },
  methods: {
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
