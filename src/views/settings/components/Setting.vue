<template>
  <div v-if="!loading">
    <el-form-item v-if="settingsGroup.description" class="options-paragraph-container">
      <p class="options-paragraph">{{ settingsGroup.description }}</p>
    </el-form-item>
    <div v-for="setting in settingsGroup.children" :key="setting.key">
      <div v-if="!compound(setting.type)">
        <inputs :settings-group="settingsGroup" :setting="setting" :data="data"/>
      </div>
      <div v-if="compound(setting.type)">
        <el-form-item :label="`${setting.label}:`"/>
        <div v-for="subSetting in setting.children" :key="subSetting.key">
          <inputs :settings-group="setting" :setting="subSetting" :data="data[setting.key]"/>
        </div>
        <div class="line"/>
      </div>
    </div>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import Inputs from './Inputs'
import 'brace/mode/elixir'
import 'default-passive-events'

export default {
  name: 'Setting',
  components: {
    editor: AceEditor,
    Inputs
  },
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
    compound(type) {
      return ['map', 'keyword'].includes(type) || type.includes('keyword')
    },
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
