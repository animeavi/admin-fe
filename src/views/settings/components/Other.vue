<template>
  <div>
    <el-form ref="formatEncoders" :model="formatEncoders" :label-width="labelWidth">
      <el-form-item label="Phoenix Format encoders:"/>
      <el-form-item label="JSON">
        <el-input :value="formatEncoders.json" @input="updateSetting($event, 'format_encoders', 'json')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="teslaAdapter" :model="teslaAdapter" :label-width="labelWidth">
      <el-form-item label="Tesla adapter">
        <el-input :value="teslaAdapter.value" @input="updateSetting($event, 'adapter', 'value')"/>
      </el-form-item>
    </el-form>
    <div class="line"/>
    <el-form ref="mimeTypesConfig" :model="mimeTypesConfig" :label-width="labelWidth">
      <el-form-item label="Mime types">
        <div v-for="([type, value], index) in mimeTypes" :key="index" class="setting-input">
          <el-input :value="type" placeholder="type" class="name-input" @input="parseMimeTypes($event, 'type', index)"/> :
          <el-select :value="value" multiple filterable allow-create class="value-input" @change="parseMimeTypes($event, 'value', index)"/>
          <el-button icon="el-icon-minus" circle @click="deleteMimeTypes(index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addRowToMimeTypes"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'

export default {
  name: 'Other',
  computed: {
    ...mapGetters([
      'formatEncoders',
      'mimeTypesConfig',
      'teslaAdapter'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '210px'
    },
    mimeTypes() {
      return Object.keys(this.mimeTypesConfig.value).map(key => [key, this.mimeTypesConfig.value[key]])
    }
  },
  methods: {
    addRowToMimeTypes() {
      const updatedValue = this.mimeTypes.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting({ ...updatedValue, '': [] }, 'types', 'value')
    },
    deleteMimeTypes(index) {
      const filteredValues = this.mimeTypes.filter((el, i) => index !== i)
      const updatedValue = filteredValues.reduce((acc, el, i) => {
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'types', 'value')
    },
    onSubmit() {
      this.$store.dispatch('SubmitChanges')
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    },
    parseMimeTypes(value, inputType, index) {
      const updatedValue = this.mimeTypes.reduce((acc, el, i) => {
        if (index === i) {
          return inputType === 'type' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
        }
        return { ...acc, [el[0]]: el[1] }
      }, {})
      this.updateSetting(updatedValue, 'types', 'value')
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
