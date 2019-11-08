<template>
  <el-form v-if="!loading" ref="autoLinker" :model="autoLinker" :label-width="labelWidth">
    <el-form-item label="Class">
      <el-switch :value="booleanClass" @change="processTwoTypeValue($event, 'auto_linker', 'opts', 'class')"/>
      <p v-if="!booleanClass" class="expl">Specify the class to be added to the generated link. False to clear.</p>
    </el-form-item>
    <el-form-item v-if="booleanClass">
      <el-input :value="getStringValue('class')" @input="processTwoTypeValue($event, 'auto_linker', 'opts', 'class')"/>
      <p class="expl">Specify the class to be added to the generated link. False to clear.</p>
    </el-form-item>
    <el-form-item label="Rel">
      <el-switch :value="booleanRel" @change="processTwoTypeValue($event, 'auto_linker', 'opts', 'rel')"/>
      <p v-if="!booleanRel" class="expl">Override the rel attribute. False to clear</p>
    </el-form-item>
    <el-form-item v-if="booleanRel">
      <el-input :value="getStringValue('rel')" @input="processTwoTypeValue($event, 'auto_linker', 'opts', 'rel')"/>
      <p class="expl">Override the rel attribute. False to clear</p>
    </el-form-item>
    <el-form-item label="New window">
      <el-switch :value="autoLinker.opts.new_window" @change="processNestedData($event, 'auto_linker', 'opts', 'new_window')"/>
      <p class="expl">Set to false to remove <span class="code">target='_blank'</span> attribute</p>
    </el-form-item>
    <el-form-item label="Scheme">
      <el-switch :value="autoLinker.opts.scheme" @change="processNestedData($event, 'auto_linker', 'opts', 'scheme')"/>
      <p class="expl">Set to true to link urls with schema <span class="code">http://google.com</span></p>
    </el-form-item>
    <el-form-item label="Truncate">
      <el-switch :value="booleanTruncate" @change="processTwoTypeValue($event, 'auto_linker', 'opts', 'truncate')"/>
      <p v-if="!booleanTruncate" class="expl">Set to a number to truncate urls longer then the number.
      Truncated urls will end in <span class="code">..</span></p>
    </el-form-item>
    <el-form-item v-if="booleanTruncate">
      <el-input-number :value="getStringValue('truncate')" :step="1" :min="0" size="large" @change="processTwoTypeValue($event, 'auto_linker', 'opts', 'truncate')"/>
      <p class="expl">Specify the class to be added to the generated link. False to clear.</p>
    </el-form-item>
    <el-form-item label="Strip prefix">
      <el-switch :value="autoLinker.opts.strip_prefix" @change="processNestedData($event, 'auto_linker', 'opts', 'strip_prefix')"/>
      <p class="expl">Strip the scheme prefix</p>
    </el-form-item>
    <el-form-item label="Extra">
      <el-switch :value="autoLinker.opts.extra" @change="processNestedData($event, 'auto_linker', 'opts', 'extra')"/>
      <p class="expl">Link urls with rarely used schemes (magnet, ipfs, irc, etc.)</p>
    </el-form-item>
    <el-form-item label="Validate TLD">
      <el-switch :value="autoLinker.opts.validate_tld" @change="processNestedData($event, 'auto_linker', 'opts', 'validate_tld')"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'

export default {
  name: 'AutoLinker',
  computed: {
    ...mapGetters([
      'autoLinker'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.$store.state.settings.loading
    },
    booleanClass() {
      return this.getBooleanValue('class')
    },
    booleanRel() {
      return this.getBooleanValue('rel')
    },
    booleanTruncate() {
      return this.getBooleanValue('truncate')
    }
  },
  methods: {
    getBooleanValue(name) {
      const value = this.autoLinker.opts[name]
      return typeof value === 'string' || typeof value === 'number'
    },
    getNumValue(name) {
      const value = this.autoLinker.opts[name]
      return value || 0
    },
    getStringValue(name) {
      const value = this.autoLinker.opts[name]
      return value || ''
    },
    processTwoTypeValue(value, tab, inputName, childName) {
      if (value === true) {
        const data = childName === 'truncate' ? 0 : ''
        this.processNestedData(data, tab, inputName, childName)
      } else {
        this.processNestedData(value, tab, inputName, childName)
      }
    },
    processNestedData(value, tab, inputName, childName) {
      const updatedValue = { ...this.$store.state.settings.settings[tab][inputName], ...{ [childName]: value }}
      this.updateSetting(updatedValue, tab, inputName)
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
