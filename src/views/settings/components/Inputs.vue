<template>
  <el-form-item :label="setting.label" :label-width="customLabelWidth">
    <el-input
      v-if="setting.type === 'string'"
      :value="inputValue"
      :placeholder="setting.suggestions ? setting.suggestions[0] : null"
      @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
    <el-switch
      v-if="setting.type === 'boolean'"
      :value="inputValue"
      @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
    <el-input-number
      v-if="setting.type === 'integer'"
      :value="inputValue"
      :placeholder="setting.suggestions ? setting.suggestions[0].toString() : null"
      :min="0"
      size="large"
      class="top-margin"
      @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes(false))"
      :value="inputValue"
      clearable
      @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
      <el-option
        v-for="(option, index) in setting.suggestions"
        :value="option"
        :key="index"/>
    </el-select>
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="setting.key === ':rewrite_policy' ? rewritePolicyValue : inputValue"
      multiple
      filterable
      allow-create
      @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
      <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
    </el-select>
    <editor
      v-if="setting.key === ':dispatch'"
      v-model="editorContent"
      height="150"
      width="100%"
      lang="elixir"
      theme="chrome"/>
    <el-input
      v-if="setting.key === ':ip'"
      :value="inputValue"
      placeholder="xxx.xxx.xxx.xx"
      @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
    <el-input
      v-if="setting.type === 'atom'"
      :value="inputValue"
      :placeholder="setting.suggestions[0] ? setting.suggestions[0].substr(1) : ''"
      @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
      <template slot="prepend">:</template>
    </el-input>
    <div v-if="editableKeywordWithInput(setting.key)">
      <div v-for="([key, value], index) in editableKeywordData(data)" :key="index" class="setting-input">
        <el-input :value="key" placeholder="pattern" class="name-input" @input="parseEditableKeyword($event, 'key', index)"/> :
        <el-input :value="value" placeholder="replacement" class="value-input" @input="parseEditableKeyword($event, 'value', index)"/>
        <el-button icon="el-icon-minus" circle @click="deleteEditableKeywordRow(index)"/>
      </div>
      <el-button icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
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
          @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key)"/>
      </el-form-item>
      <el-form-item v-if="prune === ':maxage'" label="max age" label-width="100" label-position="left">
        <el-input-number
          :value="data[setting.key][':maxage']"
          :min="0"
          placeholder="3600"
          size="large"
          class="top-margin"
          @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key)"/>
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
    <div v-if="setting.key === ':proxy_url'" class="setting-input">
      <el-checkbox v-model="proxyUrlTypeSocks5" class="name-input" border>Socks5</el-checkbox>
      <el-input
        :value="proxyUrlData"
        :placeholder="setting.suggestions ? setting.suggestions[0] : ''"
        class="value-input"
        @input="updateSetting($event, settingGroup.group, settingGroup.key, setting.key)"/>
    </div>
    <!-- special inputs -->
    <auto-linker-input v-if="settingGroup.group === ':auto_linker'" :setting-group="settingGroup" :setting="setting" :data="data"/>
    <mascots-input v-if="setting.key === ':mascots'" :setting-group="settingGroup" :setting="setting" :data="data"/>
    <!-------------------->
    <div v-if="setting.key === ':icons'">
      <div v-for="(icon, index) in iconsValue" :key="index" class="mascot-container">
        <div v-for="([key, value], index) in icon" :key="index" class="setting-input">
          <el-input :value="key" placeholder="key" class="name-input" @input="parseIcons($event, 'key', index)"/> :
          <el-input :value="value" placeholder="value" class="value-input" @input="parseIcons($event, 'value', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteIcondRow(index)"/>
        </div>
        <div class="icons-button-container">
          <el-button icon="el-icon-plus" circle @click="addValueToIcons"/>
          <span class="icons-button-desc">Add another `key - value` pair to this icon</span>
        </div>
        <div class="icons-button-container">
          <el-button icon="el-icon-plus" circle @click="addIconToIcons"/>
          <span class="icons-button-desc">Add another icon configuration</span>
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
import { AutoLinkerInput, MascotsInput } from './inputComponents'

export default {
  name: 'Inputs',
  components: {
    editor: AceEditor,
    AutoLinkerInput,
    MascotsInput
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
      type: Object || Array,
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
  computed: {
    editorContent: {
      get: function() {
        return this.data[this.setting.key] ? this.data[this.setting.key][0] : ''
      },
      set: function(value) {
        this.processNestedData([value], this.settingGroup.group, this.settingGroup.key, this.settingParent.key, this.settingParent.type, this.setting.key, this.setting.type)
      }
    },
    iconsValue() {
      return this.data[':icons']
        ? this.data[':icons'].map(icon => Object.keys(icon).map(key => [key, icon[key]]))
        : null
    },
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':http_signatures'].includes(this.settingGroup.group) &&
        this.data[this.setting.key]) {
        return this.data[this.setting.key].value
      } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
        this.setting.key === 'Pleroma.Web.Auth.Authenticator') {
        return this.data.value
      } else if (this.setting.type === 'atom') {
        return this.data[this.setting.key] && this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    proxyUrlData() {
      if (!this.data[this.setting.key]) {
        return null
      } else {
        return typeof this.data[this.setting.key] === 'string'
          ? this.data[this.setting.key]
          : `${this.data[this.setting.key][1]}:${this.data[this.setting.key][2]}`
      }
    },
    proxyUrlTypeSocks5() {
      return Array.isArray(this.data[this.setting.key]) && this.data[this.setting.key][0] === 'socks5'
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
    },
    rewritePolicyValue() {
      return typeof this.data[this.setting.key] === 'string' ? [this.data[this.setting.key]] : this.data[this.setting.key]
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    }
  },
  methods: {
    addIconToIcons() {},
    addValueToIcons() {},
    addRowToEditableKeyword() {
      const updatedValue = this.editableKeywordData(this.data).reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, this.settingGroup.group, this.settingGroup.key, this.setting.key)
    },
    deleteEditableKeywordRow(index) {
      const filteredValues = this.editableKeywordData(this.data).filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key)
    },
    deleteIcondRow(index) {},
    editableKeywordWithInput(key) {
      return key === ':replace'
    },
    editableKeywordWithInteger(type) {
      return Array.isArray(type)
        ? type.includes('keyword') && type.includes('integer')
        : false
    },
    editableKeywordWithSelect(type) {
      return type === 'map' ||
      (Array.isArray(type) && type.includes('keyword') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1)
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
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key)
    },
    parseIcons(value, inputType, index) {},
    parseRateLimiter(value, input, typeOfInput, typeOfLimit, currentValue) {
      if (typeOfLimit === 'oneLimit') {
        const valueToSend = typeOfInput === 'scale' ? { 'tuple': [value, currentValue[1]] } : { 'tuple': [currentValue[0], value] }
        this.updateSetting(valueToSend, this.settingGroup.group, 'rate_limit', input)
      } else if (typeOfLimit === 'authUserslimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [value, currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], currentValue[0][1]] }, { 'tuple': [currentValue[1][0], value] }]
        this.updateSetting(valueToSend, this.settingGroup.group, 'rate_limit', input)
      } else if (typeOfLimit === 'unauthUsersLimit') {
        const valueToSend = typeOfInput === 'scale'
          ? [{ 'tuple': [value, currentValue[0][1]] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
          : [{ 'tuple': [currentValue[0][0], value] }, { 'tuple': [currentValue[1][0], currentValue[1][1]] }]
        this.updateSetting(valueToSend, this.settingGroup.group, 'rate_limit', input)
      }
    },
    processNestedData(value, group, key, parentInput, parentType, childInput, childType) {
      const valueExists = value => value[group] && value[group][key] && value[group][key][parentInput]
      const updatedValueForState = valueExists(this.settings)
        ? { ...this.settings[group][key][parentInput], ...{ [childInput]: value }}
        : { [childInput]: value }
      const updatedValue = valueExists(this.updatedSettings)
        ? { ...this.updatedSettings[group][key][parentInput][1], ...{ [childInput]: [childType, value] }}
        : { [childInput]: [childType, value] }
      this.$store.dispatch('UpdateSettings', { group, key, input: parentInput, value: updatedValue, type: parentType })
      this.$store.dispatch('UpdateState', { group, key, input: parentInput, value: updatedValueForState })
    },
    renderMultipleSelect(type) {
      return Array.isArray(type) && (
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('regex') && type.includes('string')) ||
        this.setting.key === ':args'
      )
    },
    toggleAtomTuple(value, tab, input) {
    },
    toggleLimits(value, input) {
      this.updateSetting(value, this.settingGroup.group, 'rate_limit', input)
    },
    update(value, group, key, parent, input, type, nested) {
      nested
        ? this.processNestedData(value, group, key, parent.key, parent.type, input, type)
        : this.updateSetting(value, group, key, input, type)
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
