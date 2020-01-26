<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="autoLinker" :model="autoLinkerData" :label-width="labelWidth">
      <setting :setting-group="autoLinker" :data="autoLinkerData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'AutoLinker',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    autoLinker() {
      return this.settings.description.find(setting => setting.key === ':opts')
    },
    autoLinkerData() {
      return _.get(this.settings.settings, [':auto_linker', ':opts']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '280px'
    },
    loading() {
      return this.settings.loading
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
