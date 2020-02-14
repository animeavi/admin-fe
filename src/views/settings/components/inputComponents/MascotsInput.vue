<template>
  <div>
    <div v-for="mascot in data" :key="getId(mascot)" class="mascot-container">
      <el-form-item label="Name" label-width="85px">
        <div class="mascot-name-container">
          <el-input :value="getName(mascot)" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', mascot)"/>
          <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteMascotsRow(mascot)"/>
        </div>
      </el-form-item>
      <el-form-item label="URL" label-width="85px">
        <el-input :value="getUrl(mascot)" placeholder="URL" class="mascot-input" @input="parseMascots($event, 'url', mascot)"/>
      </el-form-item>
      <el-form-item label="Mime type" label-width="85px">
        <el-input :value="getMimeType(mascot)" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', mascot)"/>
      </el-form-item>
    </div>
    <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToMascots"/>
  </div>
</template>

<script>
export default {
  name: 'MascotsInput',
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
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    addRowToMascots() {
      const updatedValue = [...this.data, { '': { ':url': '', ':mime_type': '', id: this.generateID() }}]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteMascotsRow(mascot) {
      const deletedId = this.getId(mascot)
      const filteredValues = this.data.filter(mascot => Object.values(mascot)[0].id !== deletedId)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    getId(mascot) {
      const { id } = Object.values(mascot)[0]
      return id
    },
    getName(mascot) {
      return Object.keys(mascot)[0]
    },
    getUrl(mascot) {
      const [value] = Object.values(mascot)
      return value[':url']
    },
    getMimeType(mascot) {
      const [value] = Object.values(mascot)
      return value[':mime_type']
    },
    parseMascots(value, inputType, mascot) {
      const updatedId = this.getId(mascot)
      const updatedValue = this.data.map((mascot, index) => {
        if (Object.values(mascot)[0].id === updatedId) {
          if (inputType === 'name') {
            return { [value]: Object.values(this.data[index])[0] }
          } else if (inputType === 'url') {
            return { [Object.keys(mascot)[0]]: { ...Object.values(this.data[index])[0], ':url': value }}
          } else {
            return { [Object.keys(mascot)[0]]: { ...Object.values(this.data[index])[0], ':mime_type': value }}
          }
        }
        return mascot
      })
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const mascotsWithoutIDs = value.reduce((acc, mascot) => {
        const { id, ...mascotValue } = Object.values(mascot)[0]
        return { ...acc, [Object.keys(mascot)[0]]: ['', mascotValue] }
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
