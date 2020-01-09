<template>
  <div>
    <div v-for="subSetting in setting.children" :key="subSetting.key">
      <el-form-item :label="subSetting.label" :label-width="customLabelWidth">
        <el-select
          v-if="subSetting.type.includes('list') && subSetting.type.includes('atom')"
          :value="subSettingValue(subSetting)"
          multiple
          filterable
          allow-create
          @change="update($event, subSetting.key)">
          <el-option v-for="(option, index) in subSetting.suggestions" :key="index" :value="option"/>
        </el-select>
        <p class="expl">{{ subSetting.description }}</p>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SslOptionsInput',
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
    subSettingValue(subSetting) {
      return this.data && this.data[this.setting.key] ? this.data[this.setting.key][subSetting.key] : []
    },
    update(value, childKey) {
      const [group, key, parentKey, input] = [this.settingGroup.group, this.settingGroup.key, this.setting.key, this.settingParent.key]
      const { updatedSettings, description } = this.$store.state.settings
      const type = description
        .find(element => element.group === group && element.key === key).children
        .find(child => child.key === ':adapter').children.find(child => child.key === ':ssl_options').children
        .find(child => child.key === childKey).type

      const updatedState = { ...this.data, [parentKey]: { ...this.data[parentKey], [childKey]: value }}
      const updatedSetting = !updatedSettings[group] || !updatedSettings[group][key]
        ? { [parentKey]: ['keyword', { [childKey]: [type, value] }] }
        : { ...updatedSettings[group][key][parentKey], [parentKey]: { ...updatedSettings[group][key][parentKey], [childKey]: [type, value] }}

      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedSetting, type: this.settingParent.type })
      this.$store.dispatch('UpdateState', { group, key, input, value: updatedState })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
