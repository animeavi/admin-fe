<template>
  <div v-if="!loading">
    <el-form-item v-if="settingsGroup.description" class="options-paragraph-container">
      <p class="options-paragraph">{{ settingsGroup.description }}</p>
    </el-form-item>
    <div v-for="setting in settingsGroup.children" :key="setting.key">
      <el-form-item :label="setting.key">
        <el-input
          v-if="setting.type === 'string'"
          :value="data[setting.key]"
          :placeholder="setting.suggestions[0]"
          @input="updateSetting($event, settingsGroup.key, setting.key)"/>
        <el-switch
          v-if="setting.type === 'boolean'"
          :value="data[setting.key]"
          @change="updateSetting($event, settingsGroup.key, setting.key)"/>
        <el-input-number
          v-if="setting.type === 'integer'"
          :value="data[setting.key]"
          :placeholder="setting.suggestions[0].toString()"
          :step="100"
          :min="0"
          size="large"
          class="top-margin"
          @change="updateSetting($event, settingsGroup.key, setting.key)"/>
        <el-select
          v-if="setting.type === 'module'"
          :value="data.value"
          clearable
          @change="updateSetting($event, settingsGroup.children[0].key, 'value')">
          <el-option
            v-for="option in settingsGroup.children[0].suggestions"
            :value="option"
            :key="option"/>
        </el-select>
        <el-select
          v-if="Array.isArray(setting.type)
            && setting.type.includes('list')
          && (setting.type.includes('module') || setting.type.includes('string'))"
          :value="data[setting.key]"
          multiple
          filterable
          allow-create
          @change="updateSetting($event, settingsGroup.key, setting.key)">
          <el-option v-for="option in setting.suggestions[0]" :key="option" :value="option"/>
        </el-select>
        <p class="expl">{{ setting.description }}</p>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  props: {
    settingsGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
