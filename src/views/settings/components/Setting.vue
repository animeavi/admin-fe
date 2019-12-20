<template>
  <div v-if="!loading">
    <el-form-item v-if="settingGroup.description" class="description-container">
      <p class="description">{{ settingGroup.description }}</p>
    </el-form-item>
    <div v-if="settingGroup.key === 'Pleroma.Emails.Mailer'">
      <div v-for="setting in settingGroup.children.filter(setting => !setting.group)" :key="setting.key">
        <inputs
          :setting-group="settingGroup"
          :setting="setting"
          :data="data"/>
      </div>
      <div
        v-for="setting in emailAdapterChildren"
        :key="setting.key">
        <inputs
          :setting-group="settingGroup"
          :setting="setting"
          :data="data"/>
      </div>
    </div>
    <div v-else>
      <div v-for="setting in settingGroup.children" :key="setting.key">
        <div v-if="!compound(setting)">
          <inputs
            :setting-group="settingGroup"
            :setting="setting"
            :data="data"
            :nested="false"/>
        </div>
        <div v-if="compound(setting)">
          <el-form-item :label="`${setting.label}:`"/>
          <div v-for="subSetting in setting.children" :key="subSetting.key">
            <inputs
              :setting-group="settingGroup"
              :setting-parent="setting"
              :setting="subSetting"
              :data="data[setting.key]"
              :nested="true"/>
          </div>
          <div v-if="!setting.children">
            <inputs :setting-group="settingGroup" :setting="setting" :data="data[setting.key]" :nested="true"/>
          </div>
          <div class="line"/>
        </div>
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
    settingGroup: {
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
    emailAdapterChildren() {
      const adapter = this.$store.state.settings.settings[':pleroma']['Pleroma.Emails.Mailer'][':adapter']
      return this.settingGroup.children.filter(child => child.group && child.group.includes(adapter))
    },
    loading() {
      return this.$store.state.settings.loading
    }
  },
  methods: {
    compound({ type, key, children }) {
      return type === 'keyword' ||
        type === 'map' ||
        type.includes('keyword') ||
        key === ':replace'
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
