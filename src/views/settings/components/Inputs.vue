<template>
  <el-form-item :label="setting.label" :label-width="customLabelWidth" :class="labelClass">
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
    <div v-if="setting.type === 'keyword'">
      <div v-for="subSetting in setting.children" :key="subSetting.key">
        <inputs
          :setting-group="settingGroup"
          :setting-parent="[...settingParent, subSetting]"
          :setting="subSetting"
          :data="data[setting.key]"
          :custom-label-width="'100px'"
          :label-class="'center-label'"
          :input-class="'keyword-inner-input'"
          :nested="true"/>
      </div>
    </div>
    <!-- special inputs -->
    <auto-linker-input v-if="settingGroup.group === ':auto_linker'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <mascots-input v-if="setting.key === ':mascots'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <editable-keyword-input v-if="editableKeyword(setting.key, setting.type)" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <icons-input v-if="setting.key === ':icons'" :data="data[':icons']" :setting-group="settingGroup" :setting="setting"/>
    <proxy-url-input v-if="setting.key === ':proxy_url'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
    <!-- <ssl-options-input v-if="setting.key === ':ssl_options'" :setting-group="settingGroup" :setting-parent="settingParent" :setting="setting" :data="data" :nested="true" :custom-label-width="'100px'"/> -->
    <multiple-select v-if="setting.key === ':backends' || setting.key === ':args'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <prune-input v-if="setting.key === ':prune'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
    <rate-limit-input v-if="settingGroup.key === ':rate_limit'" :data="data" :setting-group="settingGroup" :setting="setting"/>
    <!-------------------->
    <p v-if="setting.type !== 'keyword'" :class="inputClass" class="expl">{{ setting.description }}</p>
  </el-form-item>
</template>

<script>
import AceEditor from 'vue2-ace-editor'
import 'brace/mode/elixir'
import 'default-passive-events'
import { AutoLinkerInput, EditableKeywordInput, IconsInput, MascotsInput, MultipleSelect, ProxyUrlInput, PruneInput, RateLimitInput, SslOptionsInput } from './inputComponents'
import { processNested } from '@/store/modules/normalizers'

export default {
  name: 'Inputs',
  components: {
    editor: AceEditor,
    AutoLinkerInput,
    EditableKeywordInput,
    IconsInput,
    MascotsInput,
    MultipleSelect,
    ProxyUrlInput,
    PruneInput,
    RateLimitInput,
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
    inputClass: {
      type: String,
      default: function() {
        return 'input-class'
      },
      required: false
    },
    labelClass: {
      type: String,
      default: function() {
        return 'label'
      },
      required: false
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
      type: Array,
      default: function() {
        return []
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
        this.processNestedData([value], this.settingGroup.group, this.settingGroup.key, this.settingParent)
      }
    },
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':http_signatures', ':tesla'].includes(this.settingGroup.group) &&
        this.data[this.setting.key]) {
        return this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':'
          ? this.data[this.setting.key].value.substr(1)
          : this.data[this.setting.key].value
      } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
        this.setting.key === 'Pleroma.Web.Auth.Authenticator' ||
        this.setting.key === ':admin_token') {
        return this.data.value
      } else if (this.settingGroup.group === ':mime' && this.settingParent[0].key === ':types') {
        return this.data.value[this.setting.key]
      } else if (this.setting.type === 'atom') {
        return this.data[this.setting.key] && this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
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
    processNestedData(value, group, parentKey, parents) {
      const { valueForState,
        valueForUpdatedSettings,
        setting } = processNested(value, value, group, parentKey, parents.reverse(), this.settings, this.updatedSettings)

      this.$store.dispatch('UpdateSettings',
        { group, key: parentKey, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
      this.$store.dispatch('UpdateState',
        { group, key: parentKey, input: setting.key, value: valueForState })
    },
    renderMultipleSelect(type) {
      return Array.isArray(type) && this.setting.key !== ':backends' && this.setting.key !== ':args' && (
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('regex') && type.includes('string')) ||
        this.setting.key === ':args'
      )
    },
    update(value, group, key, parents, input, type, nested) {
      nested
        ? this.processNestedData(value, group, key, parents)
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
