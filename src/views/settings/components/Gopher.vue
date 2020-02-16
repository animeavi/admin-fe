<template>
  <div v-if="!loading" class="form-container">
    <el-form v-if="!loading" ref="gopher" :model="gopherData" :label-width="labelWidth">
      <setting :setting-group="gopher" :data="gopherData"/>
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
  name: 'Gopher',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    gopher() {
      return this.settings.description.find(setting => setting.key === ':gopher')
    },
    gopherData() {
      return _.get(this.settings.settings, [':pleroma', ':gopher']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '120px' : '280px'
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
