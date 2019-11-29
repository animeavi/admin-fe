<template>
  <div v-if="!loading">
    <el-form ref="teslaAdapter" :model="teslaAdapterData" :label-width="labelWidth">
      <setting :setting-group="teslaAdapter" :data="teslaAdapterData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mimeTypes" :model="mimeTypesData" :label-width="labelWidth">
      <setting :setting-group="mimeTypes" :data="mimeTypesData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Setting from './Setting'

export default {
  name: 'Other',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
    },
    mimeTypes() {
      return this.settings.description.find(setting => setting.group === ':mime')
    },
    mimeTypesData() {
      return this.settings.settings[':mime'][':types']
    },
    teslaAdapter() {
      return this.settings.description.find(setting => setting.group === ':tesla')
    },
    teslaAdapterData() {
      return this.settings.settings[':tesla'][':adapter']
    }
  },
  methods: {
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
