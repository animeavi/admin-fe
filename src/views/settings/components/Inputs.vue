<template>
  <el-form-item :label="setting.label">
    <el-input
      v-if="setting.type === 'string'"
      :value="data[setting.key]"
      :placeholder="setting.suggestions[0]"
      @input="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-switch
      v-if="setting.type === 'boolean'"
      :value="data[setting.key]"
      @change="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-input-number
      v-if="setting.type === 'integer'"
      :value="data[setting.key]"
      :placeholder="setting.suggestions[0].toString()"
      :min="0"
      size="large"
      class="top-margin"
      @change="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes(false))"
      :value="data[setting.key]"
      clearable
      @change="updateSetting($event, settingGroup.key, setting.key)">
      <el-option
        v-for="(option, index) in setting.suggestions"
        :value="option"
        :key="index"/>
    </el-select>
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="data[setting.key]"
      multiple
      filterable
      allow-create
      @change="updateSetting($event, settingGroup.key, setting.key)">
      <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
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
      @input="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-input
      v-if="setting.type === 'atom'"
      :value="data[setting.key]"
      :placeholder="setting.suggestions[0]"
      @input="updateSetting($event, settingGroup.key, setting.key)">
      <template slot="prepend">:</template>
    </el-input>
    <div v-if="editableKeywordWithSelect(setting.type)">
      <div v-for="([key, value], index) in editableKeywordData(data)" :key="index" class="setting-input">
        <el-input :value="key" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', index)"/> :
        <el-select :value="value" multiple filterable allow-create class="value-input" @change="parseEditableKeyword($event, 'value', index)"/>
        <el-button icon="el-icon-minus" circle @click="deleteEditableKeywordRow(index)"/>
      </div>
      <el-button icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-if="editableKeywordWithInteger(setting.type)">
      <div v-for="([key, value], index) in editableKeywordData(data)" :key="index" class="setting-input">
        <el-input :value="key" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', index)"/> :
        <el-input-number :value="value" :min="0" size="large" class="value-input" @change="parseEditableKeyword($event, 'value', index)"/>
        <el-button icon="el-icon-minus" circle @click="deleteEditableKeywordRow(index)"/>
      </div>
      <el-button icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-if="setting.key === ':prune'">
      <el-radio-group v-model="prune">
        <el-radio label=":disabled">Disabled</el-radio>
        <el-radio label=":maxlen">Limit-based</el-radio>
        <el-radio label=":maxage">Time-based</el-radio>
      </el-radio-group>
      <el-form-item v-if="prune === ':maxlen'" label="max length" label-width="100" label-position="left">
        <el-input-number
          :value="data[setting.key][':maxlen']"
          :min="0"
          placeholder="1500"
          size="large"
          class="top-margin"
          @change="updateSetting($event, settingGroup.key, setting.key)"/>
      </el-form-item>
      <el-form-item v-if="prune === ':maxage'" label="max age" label-width="100" label-position="left">
        <el-input-number
          :value="data[setting.key][':maxage']"
          :min="0"
          placeholder="3600"
          size="large"
          class="top-margin"
          @change="updateSetting($event, settingGroup.key, setting.key)"/>
      </el-form-item>
    </div>
    <div v-if="settingGroup.key === ':rate_limit'">
      <div v-if="!rateLimitAuthUsers">
        <el-input :value="rateLimitAllUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'oneLimit', rateLimitAllUsers)"/> :
        <el-input :value="rateLimitAllUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'oneLimit', rateLimitAllUsers)"/>
        <div class="limit-button-container">
          <el-button icon="el-icon-plus" circle @click="toggleLimits([{ 'tuple': [null, null] }, { 'tuple': [null, null] }], setting.key)"/>
          <p class="expl limit-expl">Set different limits for unauthenticated and authenticated users</p>
        </div>
      </div>
      <div v-if="rateLimitAuthUsers">
        <el-form-item label="Authenticated users:">
          <el-input :value="rateLimitAuthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/> :
          <el-input :value="rateLimitAuthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
        </el-form-item>
        <el-form-item label="Unauthenticated users:">
          <el-input :value="rateLimitUnauthUsers[0]" placeholder="scale" class="scale-input" @input="parseRateLimiter($event, setting.key, 'scale', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/> :
          <el-input :value="rateLimitUnauthUsers[1]" placeholder="limit" class="limit-input" @input="parseRateLimiter($event, setting.key, 'limit', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
        </el-form-item>
        <div class="limit-button-container">
          <el-button icon="el-icon-minus" circle @click="toggleLimits({ 'tuple': [null, null] }, setting.key)"/>
          <p class="expl limit-expl">Set limit for all users</p>
        </div>
      </div>
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
  computed: {
    editorContent: {
      get: function() {
        return this.data[this.setting.key] ? this.data[this.setting.key][0] : ''
      },
      set: function(value) {
        this.processNestedData([value], this.settingGroup.key, this.setting.key, this.data[this.setting.key])
      }
    },
    prune() {
      return this.data[this.setting.key] === ':disabled'
        ? ':disabled'
        : Object.keys(this.data[this.setting.key])[0]
    },
    rateLimitAllUsers() {
      return this.data[this.setting.key] ? Object.entries(this.data[this.setting.key])[0] : [null, null]
    },
    rateLimitAuthUsers() {
      return Array.isArray(this.data[this.setting.key])
        ? Object.entries(this.data[this.setting.key][1])[0]
        : false
    },
    rateLimitUnauthUsers() {
      return Array.isArray(this.data[this.setting.key])
        ? Object.entries(this.data[this.setting.key][0])[0]
        : false
    }
  },
  methods: {
    addRowToEditableKeyword() {
      console.log(this.settingGroup.key, this.setting.key)
      const updatedValue = this.editableKeywordData(this.data).reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, this.settingGroup.key, this.setting.key)
    },
    deleteEditableKeywordRow(index) {
      const filteredValues = this.editableKeywordData(this.data).filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      console.log(updatedValue)
      this.updateSetting(updatedValue, this.settingGroup.key, this.setting.key)
    },
    editableKeywordWithInteger(type) {
      return Array.isArray(type)
        ? type.includes('keyword') && type.includes('integer')
        : false
    },
    editableKeywordWithSelect(type) {
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
      this.updateSetting(updatedValue, this.settingGroup.key, this.setting.key)
    },
    parseRateLimiter(value, input, typeOfInput, typeOfLimit, currentValue) {
      if (typeOfLimit === 'oneLimit') {
        const valueToSend = typeOfInput === 'scale' ? { 'tuple': [value, currentValue[1]] } : { 'tuple': [currentValue[0], value] }
        this.updateSetting(valueToSend, 'rate_limit', input)
      } else if (typeOfLimit === 'authUserslimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [value, currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [currentValue[1][0], value] }]
        this.updateSetting(valueToSend, 'rate_limit', input)
      } else if (typeOfLimit === 'unauthUsersLimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [value, currentValue[0][1]] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], value] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
        this.updateSetting(valueToSend, 'rate_limit', input)
      }
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
    },
    renderMultipleSelect(type) {
      return Array.isArray(type) && (
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('list') && type.includes('module')) ||
        (type.includes('module') && type.includes('atom'))
      )
    },
    toggleAtomTuple(value, tab, input) {
      console.log(value)
    },
    toggleLimits(value, input) {
      this.updateSetting(value, 'rate_limit', input)
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
