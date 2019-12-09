<template>
  <div>
    <div v-for="([name, url, mimeType, id], index) in mascotsValue" :key="id" :data-id="id" class="mascot-container">
      <el-form-item label="Name" label-width="100px">
        <div class="mascot-name-container">
          <el-input :value="name" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', id)"/>
          <el-button icon="el-icon-minus" circle @click="deleteMascotsRow(id)"/>
        </div>
      </el-form-item>
      <el-form-item label="URL" label-width="100px">
        <el-input :value="url" :ref="generateRef('url', index)" placeholder="URL" class="mascot-input" @input.native="parseMascots($event, 'url', id, index)"/>
      </el-form-item>
      <el-form-item label="Mime type" label-width="100px">
        <el-input :value="mimeType" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', id)"/>
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
  computed: {
    mascotsValue() {
      return Object.keys(this.data).map(mascotName =>
        [mascotName, this.data[mascotName][':url'], this.data[mascotName][':mime_type'], this.generateID()]
      )
    }
  },
  methods: {
    addRowToMascots() {
      const updatedValue = { ...this.data, '': { ':url': '', ':mime_type': '' }}
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteMascotsRow(id) {
      const filteredValues = this.mascotsValue.filter(mascot => mascot[3] !== id)
      const updatedValue = filteredValues.reduce((acc, mascot) => {
        return { ...acc, ...{ [mascot[0]]: { ':url': mascot[1], ':mime_type': mascot[2] }}}
      }, {})
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    parseMascots(event, inputType, id, index) {
      const value = `${event.target.value}${event.data}` // FIXME deletion
      const updatedValue = this.mascotsValue.map(mascot => {
        if (mascot[3] === id) {
          if (inputType === 'name') {
            mascot[0] = value
          } else if (inputType === 'url') {
            mascot[1] = value
          } else {
            mascot[2] = value
          }
        }
        return mascot
      })
      const parsedMascots = updatedValue.reduce((acc, mascot) => {
        return { ...acc, ...{ [mascot[0]]: { ':url': mascot[1], ':mime_type': mascot[2] }}}
      }, {})

      this.updateSetting(parsedMascots, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)

      this.$nextTick(() => this.$refs[`${inputType}${index}`][0].focus())
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    },
    generateRef(field, index) {
      return `${field}${index}`
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
