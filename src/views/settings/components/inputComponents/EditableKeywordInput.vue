<template>
  <div class="editable-keyword-container">
    <div v-if="setting.key === ':replace'" :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="pattern" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input :value="getValue(element)" placeholder="replacement" class="value-input" @input="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithInteger" :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input-number :value="getValue(element)" :min="0" size="large" class="value-input" @change="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-select :value="getValue(element)" multiple filterable allow-create class="value-input" @change="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableKeywordInput',
  props: {
    data: {
      type: Array,
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
    }
  },
  computed: {
    editableKeywordWithInteger() {
      return Array.isArray(this.setting.type) && this.setting.type.includes('keyword') && this.setting.type.includes('integer')
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    addRowToEditableKeyword() {
      const updatedValue = [...this.data, { '': { value: '', id: this.generateID() }}]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteEditableKeywordRow(element) {
      const deletedId = this.getId(element)
      const filteredValues = this.data.filter(element => Object.values(element)[0].id !== deletedId)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    getKey(element) {
      return Object.keys(element)[0]
    },
    getId(element) {
      const { id } = Object.values(element)[0]
      return id
    },
    getValue(element) {
      const { value } = Object.values(element)[0]
      return value
    },
    parseEditableKeyword(value, inputType, element) {
      const updatedId = this.getId(element)
      const updatedValue = this.data.map((element, index) => {
        if (Object.values(element)[0].id === updatedId) {
          return inputType === 'key'
            ? { [value]: Object.values(this.data[index])[0] }
            : { [Object.keys(element)[0]]: { ...Object.values(this.data[index])[0], value }}
        }
        return element
      })

      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const updatedSettings = this.wrapUpdatedSettings(value, input, type)
      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedSettings, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    },
    wrapUpdatedSettings(value, input, type) {
      return type === 'map'
        ? value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: Object.values(element)[0].value }
        }, {})
        : value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: ['list', Object.values(element)[0].value] }
        }, {})
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
