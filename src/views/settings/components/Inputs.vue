<template>
  <el-form-item :label="setting.label">
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
      :value="data[setting.key]"
      clearable
      @change="updateSetting($event, settingsGroup.key, setting.key)">
      <el-option
        v-for="option in setting.suggestions"
        :value="option"
        :key="option"/>
    </el-select>
    <el-select
      v-if="Array.isArray(setting.type) && (
      (setting.type.includes('list') && setting.type.includes('module')) || (setting.type.includes('module') && setting.type.includes('atom')))"
      :value="data[setting.key]"
      multiple
      filterable
      allow-create
      @change="updateSetting($event, settingsGroup.key, setting.key)">
      <el-option v-for="option in setting.suggestions" :key="option" :value="option"/>
    </el-select>
    <el-select
      v-if="Array.isArray(setting.type) && setting.type.includes('list') && setting.type.includes('string')"
      :value="data[setting.key]"
      multiple
      filterable
      allow-create
      @change="updateSetting($event, settingsGroup.key, setting.key)">
      <el-option v-for="option in setting.suggestions" :key="option" :value="option"/>
    </el-select>
    <editor
      v-if="Array.isArray(setting.type)
        && setting.type.includes('list')
        && (setting.type.includes('tuple')
      )"
      v-model="editorContent"
      height="150"
      width="100%"
      lang="elixir"
      theme="chrome"/>
    <el-input
      v-if="setting.type === 'tuple'"
      :placeholder="setting.key === ':ip' ? 'xxx.xxx.xxx.xx' : setting.suggestions[0]"
      :value="data[setting.key]"
      @input="updateSetting($event, settingsGroup.key, setting.key)"/>
    <el-input
      v-if="setting.type === 'atom'"
      :value="data[setting.key]"
      :placeholder="setting.suggestions[0]"
      @input="updateSetting($event, settingsGroup.key, setting.key)">
      <template slot="prepend">:</template>
    </el-input>
    <div v-if="editableKeyword(setting.type)">
      <div v-for="([key, value], index) in editableKeywordData(data)" :key="index" class="setting-input">
        <el-input :value="key" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', index)"/> :
        <el-select :value="value" multiple filterable allow-create class="value-input" @change="parseEditableKeyword($event, 'value', index)"/>
        <el-button icon="el-icon-minus" circle @click="deleteEditableKeywordRow(index)"/>
      </div>
      <el-button icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <p class="expl">{{ setting.description }}</p>
  </el-form-item>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/elixir'
import 'default-passive-events'

export default {
  name: 'Inputs',
  components: {
    editor: AceEditor
  },
  props: {
    settingsGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
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
    }
  },
  computed: {
    editorContent: {
      get: function() {
        return this.data[this.setting.key] ? this.data[this.setting.key][0] : ''
      },
      set: function(value) {
        this.processNestedData([value], this.settingsGroup.key, this.setting.key, this.data[this.setting.key])
      }
    }
  },
  methods: {
    addRowToEditableKeyword() {
      console.log(this.settingsGroup.key, this.setting.key)
      const updatedValue = this.editableKeywordData(this.data).reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, this.settingsGroup.key, this.setting.key)
    },
    deleteEditableKeywordRow(index) {
      const filteredValues = this.editableKeywordData(this.data).filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      console.log(updatedValue)
      this.updateSetting(updatedValue, this.settingsGroup.key, this.setting.key)
    },
    editableKeyword(type) {
      return Array.isArray(type)
        ? type.includes('keyword') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1
        : false
    },
    editableKeywordData(data) {
      return Object.keys(data).map(key => [key, data[key]])
    },
    parseEditableKeyword(value, inputType, index) {
      const updatedValue = this.editableKeywordData(this.data).reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'key' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      console.log(updatedValue)
      this.updateSetting(updatedValue, this.settingsGroup.key, this.setting.key)
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
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
