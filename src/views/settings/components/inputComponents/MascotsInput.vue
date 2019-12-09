<template>
  <div>
    <div v-for="(mascot, name) in data" :key="mascot.id" class="mascot-container">
      <el-form-item label="Name" label-width="100px">
        <div class="mascot-name-container">
          <el-input :value="name" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', mascot.id)"/>
          <el-button icon="el-icon-minus" circle @click="deleteMascotsRow(mascot.id)"/>
        </div>
      </el-form-item>
      <el-form-item label="URL" label-width="100px">
        <el-input :value="mascot[':url']" placeholder="URL" class="mascot-input" @input="parseMascots($event, 'url', mascot.id)"/>
      </el-form-item>
      <el-form-item label="Mime type" label-width="100px">
        <el-input :value="mascot[':mime_type']" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', mascot.id)"/>
      </el-form-item>
    </div>
    <el-button icon="el-icon-plus" circle @click="addRowToMascots"/>
  </div>
</template>

<script>

export default {
  name: 'MascotsInput',
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
    }
  },
  methods: {
    addRowToMascots() {
      const updatedValue = { ...this.data, '': { ':url': '', ':mime_type': '', id: this.generateID() }}
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteMascotsRow(id) {
      const filteredValues = Object.keys(this.data).reduce((acc, mascot) => {
        return this.data[mascot].id !== id
          ? { ...acc, ...{ [mascot]: this.data[mascot] }}
          : acc
      }, {})
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    parseMascots(value, inputType, id, index) {
      const updatedValue = Object.keys(this.data).reduce((acc, mascot) => {
        if (this.data[mascot].id === id) {
          if (inputType === 'name') {
            return { ...acc, ...{ [value]: this.data[mascot] }}
          } else if (inputType === 'url') {
            return { ...acc, ...{ [mascot]: { ...this.data[mascot], ':url': value }}}
          } else {
            return { ...acc, ...{ [mascot]: { ...this.data[mascot], ':mime_type': value }}}
          }
        }
        return { ...acc, ...{ [mascot]: this.data[mascot] }}
      }, {})
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const mascotsWithoutIDs = Object.keys(value).reduce((acc, name) => {
        return { ...acc, ...{ [name]: { ':url': value[name][':url'], ':mime_type': value[name][':mime_type'] }}}
      }, {})
      this.$store.dispatch('UpdateSettings', { group, key, input, value: mascotsWithoutIDs, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
