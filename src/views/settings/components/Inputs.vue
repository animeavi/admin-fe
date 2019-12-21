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
      :value="inputValue === null ? 0 : inputValue"
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
    <!-- special inputs -->
    <auto-linker-input v-if="settingGroup.group === ':auto_linker'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <mascots-input v-if="setting.key === ':mascots'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <editable-keyword-input v-if="editableKeyword(setting.key, setting.type)" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <icons-input v-if="setting.key === ':icons'" :data="data[':icons']" :setting-group="settingGroup" :setting="setting"/>
    <proxy-url-input v-if="setting.key === ':proxy_url'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
    <ssl-options-input v-if="setting.key === ':ssl_options'" :setting-group="settingGroup" :setting-parent="settingParent" :setting="setting" :data="data" :nested="true" :custom-label-width="'100px'"/>
    <backends-logger-input v-if="setting.key === ':backends'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <prune-input v-if="setting.key === ':prune'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
    <!-------------------->
    <p class="expl">{{ setting.description }}</p>
  </el-form-item>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/elixir'
import 'default-passive-events'
import { AutoLinkerInput, BackendsLoggerInput, EditableKeywordInput, IconsInput, MascotsInput, ProxyUrlInput, PruneInput, SslOptionsInput } from './inputComponents'

export default {
  name: 'Inputs',
  components: {
    editor: AceEditor,
    AutoLinkerInput,
    BackendsLoggerInput,
    EditableKeywordInput,
    IconsInput,
    MascotsInput,
    ProxyUrlInput,
    PruneInput,
    SslOptionsInput
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
  computed: {
    editorContent: {
      get: function() {
        return this.data[this.setting.key] ? this.data[this.setting.key][0] : ''
      },
      set: function(value) {
        this.processNestedData([value], this.settingGroup.group, this.settingGroup.key, this.settingParent.key, this.settingParent.type, this.setting.key, this.setting.type)
      }
    },
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':http_signatures'].includes(this.settingGroup.group) &&
        this.data[this.setting.key]) {
        return this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':'
          ? this.data[this.setting.key].value.substr(1)
          : this.data[this.setting.key].value
      } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
        this.setting.key === 'Pleroma.Web.Auth.Authenticator' ||
        this.setting.key === ':admin_token') {
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
    editableKeyword(key, type) {
      return key === ':replace' ||
        (Array.isArray(type) && type.includes('keyword') && type.includes('integer')) ||
        type === 'map' ||
        (Array.isArray(type) && type.includes('keyword') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1)
    },
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
      return Array.isArray(type) && this.setting.key !== ':backends' && (
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('regex') && type.includes('string')) ||
        this.setting.key === ':args'
      )
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
