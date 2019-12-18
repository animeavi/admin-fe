<template>
  <div>
    <div v-for="subSetting in setting.children" :key="subSetting.key">
      <el-select
        v-if="subSetting.type.includes('list') && subSetting.type.includes('atom')"
        :value="data[setting.key][subSetting.key]"
        multiple
        filterable
        allow-create
        @change="update($event, subSetting.key)">
        <el-option v-for="(option, index) in subSetting.suggestions" :key="index" :value="option"/>
      </el-select>
    </div>
  </div>
</template>

<script>
import Inputs from '../Inputs'

export default {
  name: 'SslOptionsInput',
  components: {
    Inputs
  },
  props: {
    customLabelWidth: {
      type: String,
      default: function() {
        return this.labelWidth
      },
      required: false
    },
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    nested: {
      type: Boolean,
      default: function() {
        return false
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
    settingParent: {
      type: Object,
      default: function() {
        return {}
      },
      required: false
    }
  },
  methods: {
    inputValue(key) {
      return this.data[this.setting.key][key]
    },
    update(value, key) {
      const updatedState = { ...this.data, [this.setting.key]: { ...this.data[this.setting.key], [key]: value }}

      this.$store.dispatch('UpdateSettings', { group: this.settingGroup.group, key: this.settingGroup.key, input: this.settingParent.key, value: updatedState, type: this.settingParent.type })
      this.$store.dispatch('UpdateState', { group: this.settingGroup.group, key: this.settingGroup.key, input: this.settingParent.key, value: updatedState })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
