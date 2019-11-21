<template>
  <el-form-item :label="setting.label" :label-width="customLabelWidth">
    <el-input
      v-if="setting.type === 'string'"
      :value="inputValue"
      :placeholder="setting.suggestions ? setting.suggestions[0] : null"
      @input="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-switch
      v-if="setting.type === 'boolean'"
      :value="inputValue"
      @change="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-input-number
      v-if="setting.type === 'integer'"
      :value="inputValue"
      :placeholder="setting.suggestions ? setting.suggestions[0].toString() : null"
      :min="0"
      size="large"
      class="top-margin"
      @change="updateSetting($event, settingGroup.key, setting.key)"/>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes(false))"
      :value="inputValue"
      clearable
      @change="updateSetting($event, settingGroup.key, setting.key)">
      <el-option
        v-for="(option, index) in setting.suggestions"
        :value="option"
        :key="index"/>
    </el-select>
    <div v-if="setting.type === 'keyword'">
      <div v-for="subSetting in setting.children" :key="subSetting.key">
        <inputs
          :setting-group="settingGroup"
          :setting="subSetting"
          :data="data[setting.key]"
          :custom-label-width="'100px'"/>
      </div>
    </div>
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="setting.key === ':rewrite_policy' ? rewritePolicyValue : inputValue"
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
      :value="inputValue ? inputValue.substr(1) : null"
      :placeholder="setting.suggestions[0]"
      @input="updateSetting($event, settingGroup.key, setting.key)">
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
    <div v-if="setting.key === ':proxy_url'" class="setting-input">
      <el-checkbox v-model="proxyUrlTypeSocks5" class="name-input" border>Socks5</el-checkbox>
      <el-input
        :value="proxyUrlData"
        :placeholder="setting.suggestions ? setting.suggestions[0] : ''"
        class="value-input"
        @input="updateSetting($event, settingGroup.key, setting.key)"/>
    </div>
    <div v-if="settingGroup.group === ':auto_linker' && (setting.key === ':class' || setting.key === ':rel')">
      <el-switch :value="autoLinkerBooleanValue(setting.key)" @change="processAutoLinker($event, 'auto_linker', 'opts', 'class')"/>
      <el-input v-if="autoLinkerBooleanValue(setting.key)" :value="autoLinkerStringValue(setting.key)" @input="processAutoLinker($event, settingGroup.key, ':opts', setting.key)"/>
    </div>
    <div v-if="settingGroup.group === ':auto_linker' && (setting.key === ':truncate')">
      <el-switch :value="autoLinkerBooleanValue(setting.key)" @change="processAutoLinker($event, 'auto_linker', 'opts', 'class')"/>
      <el-input-number v-if="autoLinkerBooleanValue(setting.key)" :value="autoLinkerIntegerValue(setting.key)" @input="processAutoLinker($event, settingGroup.key, ':opts', setting.key)"/>
    </div>
    <div v-if="setting.key === ':mascots'">
      <div v-for="([name, url, mimeType], index) in mascotsValue" :key="index" class="mascot-container">
        <div class="mascot-name-container">
          <el-input :value="name" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteMascotsRow(index, 'emoji', 'groups')"/>
        </div>
        <el-input :value="url" placeholder="URL" class="mascot-input" @input="parseMascots($event, 'url', index)"/>
        <el-input :value="mimeType" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', index)"/>
      </div>
      <el-button icon="el-icon-plus" circle @click="addRowToMascots"/>
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
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':http_signatures'].includes(this.settingGroup.group) && this.data[this.setting.key]) {
        return this.data[this.setting.key].value
      } else if (this.settingGroup.group === ':logger' && this.setting.key === ':backends') {
        return this.data.value
      } else {
        return this.data[this.setting.key]
      }
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    mascotsValue() {
      return Object.keys(this.data)
        .map(mascotName =>
          [mascotName, this.data[mascotName][':url'], this.data[mascotName][':mime_type']])
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
    }
  },
  methods: {
    addRowToEditableKeyword() {
      const updatedValue = this.editableKeywordData(this.data).reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, this.settingGroup.key, this.setting.key)
    },
    addRowToMascots() {
      const updatedValue = this.data[':mascots'].reduce((acc, el, i) => {
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting({ ...updatedValue, '': { url: '', mime_type: '' }}, 'assets', 'mascots')
    },
    autoLinkerBooleanValue(key) {
      const value = this.data[this.setting.key]
      return typeof value === 'string' || typeof value === 'number'
    },
    autoLinkerIntegerValue(key) {
      const value = this.data[this.setting.key]
      return value || 0
    },
    autoLinkerStringValue(key) {
      const value = this.data[this.setting.key]
      return value || ''
    },
    deleteEditableKeywordRow(index) {
      const filteredValues = this.editableKeywordData(this.data).filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      console.log(updatedValue)
      this.updateSetting(updatedValue, this.settingGroup.key, this.setting.key)
    },
    deleteMascotsRow(index) {
      const filteredValues = this.data[':mascots'].filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting(updatedValue, 'assets', 'mascots')
    },
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
      console.log(updatedValue)
      this.updateSetting(updatedValue, this.settingGroup.key, this.setting.key)
    },
    parseMascots(value, inputType, index) {
      const updatedValue = this.data[':mascots'].reduce((acc, el, i) => {
        if (index === i) {
          if (inputType === 'name') {
            return { ...acc, [value]: { url: el[1], mime_type: el[2] }}
          } else if (inputType === 'url') {
            return { ...acc, [el[0]]: { url: value, mime_type: el[2] }}
          } else {
            return { ...acc, [el[0]]: { url: el[1], mime_type: value }}
          }
        }
        return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
      }, {})
      this.updateSetting(updatedValue, 'assets', 'mascots')
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
    processAutoLinker(value, tab, inputName, childName) {
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
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
