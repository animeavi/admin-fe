<template>
  <div v-if="!loading">
    <el-form ref="databaseData" :model="databaseData" :label-width="labelWidth">
      <setting :setting-group="database" :data="databaseData"/>
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
  name: 'Database',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    database() {
      return this.settings.description.find(setting => setting.key === ':database')
    },
    databaseData() {
      return this.settings.settings[':database']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
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
