<template>
  <div v-if="!loading">
    <el-form ref="frontendData" :model="frontendData" :label-width="labelWidth">
      <el-form-item>
        <p class="expl">This form can be used to configure a keyword list that keeps the configuration data for any kind of frontend.
        By default, settings for <span class="code">pleroma_fe</span> and <span class="code">masto_fe</span> are configured.
        If you want to add your own configuration your settings need to be complete as they will override the defaults.</p>
      </el-form-item>
      <setting :settings-group="frontend" :data="frontendData"/>
    </el-form>
    <el-form ref="assetsData" :model="assetsData" :label-width="labelWidth">
      <el-form-item label="Assets:"/>
      <setting :settings-group="assets" :data="assetsData"/>
      <!-- <el-form-item label="Default mascot">
        <el-select :value="assets.default_mascot" clearable @change="updateSetting($event, 'assets', 'default_mascot')"/>
        <p class="expl">An element from mascots - This will be used as the default mascot on MastoFE
        (default: <span class="code">:pleroma_fox_tan</span>)</p>
      </el-form-item>
      <el-form-item label="Mascots">
        <div v-for="([name, url, mimeType], index) in mascots" :key="index" class="mascot-container">
          <div class="mascot-name-container">
            <el-input :value="name" placeholder="Name" class="mascot-name-input" @input="parseMascots($event, 'name', index)"/>
            <el-button icon="el-icon-minus" circle @click="deleteMascotsRow(index, 'emoji', 'groups')"/>
          </div>
          <el-input :value="url" placeholder="URL" class="mascot-input" @input="parseMascots($event, 'url', index)"/>
          <el-input :value="mimeType" placeholder="Mime type" class="mascot-input" @input="parseMascots($event, 'mimeType', index)"/>
        </div>
        <el-button icon="el-icon-plus" circle @click="addRowToMascots"/>
      </el-form-item> -->
    </el-form>
    <div class="line"/>
    <el-form ref="emojiData" :model="emojiData" :label-width="labelWidth">
      <el-form-item label="Emoji:"/>
      <setting :settings-group="emoji" :data="emojiData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="chatData" :model="chatData" :label-width="labelWidth">
      <setting :settings-group="chat" :data="chatData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="markupData" :model="markupData" :label-width="labelWidth">
      <el-form-item label="Markup settings:"/>
      <setting :settings-group="markup" :data="markupData"/>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'

export default {
  name: 'Frontend',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    assets() {
      return this.settings.description.find(setting => setting.key === ':assets')
    },
    assetsData() {
      return this.settings.settings[':assets']
    },
    chat() {
      return this.settings.description.find(setting => setting.key === ':chat')
    },
    chatData() {
      return this.settings.settings[':chat']
    },
    emoji() {
      return this.settings.description.find(setting => setting.key === ':emoji')
    },
    emojiData() {
      return this.settings.settings[':emoji']
    },
    frontend() {
      return this.settings.description.find(setting => setting.key === ':frontend_configurations')
    },
    frontendData() {
      return this.settings.settings[':frontend_configurations']
    },
    markup() {
      return this.settings.description.find(setting => setting.key === ':markup')
    },
    markupData() {
      return this.settings.settings[':markup']
    },
    // mascots() {
    //   return Object.keys(this.assets.mascots)
    //     .map(mascotName =>
    //       [mascotName, this.assets.mascots[mascotName].url, this.assets.mascots[mascotName].mime_type])
    // },
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
    //
    // addRowToMascots() {
    //   const updatedValue = this.mascots.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
    //   }, {})
    //   this.updateSetting({ ...updatedValue, '': { url: '', mime_type: '' }}, 'assets', 'mascots')
    // },
    // deleteMascotsRow(index) {
    //   const filteredValues = this.mascots.filter((el, i) => index !== i)
    //   const updatedValue = filteredValues.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
    //   }, {})
    //   this.updateSetting(updatedValue, 'assets', 'mascots')
    // },
    // parseMascots(value, inputType, index) {
    //   const updatedValue = this.mascots.reduce((acc, el, i) => {
    //     if (index === i) {
    //       if (inputType === 'name') {
    //         return { ...acc, [value]: { url: el[1], mime_type: el[2] }}
    //       } else if (inputType === 'url') {
    //         return { ...acc, [el[0]]: { url: value, mime_type: el[2] }}
    //       } else {
    //         return { ...acc, [el[0]]: { url: el[1], mime_type: value }}
    //       }
    //     }
    //     return { ...acc, [el[0]]: { url: el[1], mime_type: el[2] }}
    //   }, {})
    //   this.updateSetting(updatedValue, 'assets', 'mascots')
    // },
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
