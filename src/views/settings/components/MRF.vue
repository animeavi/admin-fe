<template>
  <div v-if="!loading">
    <el-form ref="mrfSimple" :model="mrfSimpleData" :label-width="labelWidth">
      <setting :setting-group="mrfSimple" :data="mrfSimpleData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfRejectnonpublic" :model="mrfRejectnonpublicData" :label-width="labelWidth">
      <setting :setting-group="mrfRejectnonpublic" :data="mrfRejectnonpublicData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfHellthread" :model="mrfHellthreadData" :label-width="labelWidth">
      <setting :setting-group="mrfHellthread" :data="mrfHellthreadData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfKeyword" :model="mrfKeywordData" :label-width="labelWidth">
      <setting :setting-group="mrfKeyword" :data="mrfKeywordData"/>
    </el-form>
    <el-form ref="mrfSubchain" :model="mrfSubchainData" :label-width="labelWidth">
      <setting :setting-group="mrfSubchain" :data="mrfSubchainData"/>
    </el-form>
    <el-form ref="mrfMention" :model="mrfMentionData" :label-width="labelWidth">
      <setting :setting-group="mrfMention" :data="mrfMentionData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfNormalizeMarkup" :model="mrfNormalizeMarkupData" :label-width="labelWidth">
      <setting :setting-group="mrfNormalizeMarkup" :data="mrfNormalizeMarkupData"/>
    </el-form>
    <div class="line"/>
    <el-form ref="mrfVocabulary" :model="mrfVocabularyData" :label-width="labelWidth">
      <setting :setting-group="mrfVocabulary" :data="mrfVocabularyData"/>
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
  name: 'MRF',
  components: { Setting },
  // data: function() {
  //   return {
  //     removableDoubleOptions: ['replace', 'mrfUserAllowlist'],
  //     removableSingleOptions: ['keywordReject', 'federatedTimelineRemoval']
  //   }
  // },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    // matchActor() {
    //   return Object.keys(this.mrfSubchain.match_actor).map(key => [key, this.mrfSubchain.match_actor[key]])
    // },
    // replacePatterns() {
    //   return Object.keys(this.mrfKeyword.replace).map(key => [key, this.mrfKeyword.replace[key]])
    // },
    // userAllowlist() {
    //   return Object.keys(this.mrfUserAllowlist).map(key => [key, this.mrfUserAllowlist[key]])
    // },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    labelWidth() {
      return this.isMobile ? '100px' : '240px'
    },
    loading() {
      return this.settings.loading
    },
    mrfSimple() {
      return this.settings.description.find(setting => setting.key === ':mrf_simple')
    },
    mrfSimpleData() {
      return this.settings.settings[':mrf_simple']
    },
    mrfRejectnonpublic() {
      return this.settings.description.find(setting => setting.key === ':mrf_rejectnonpublic')
    },
    mrfRejectnonpublicData() {
      return this.settings.settings[':mrf_rejectnonpublic']
    },
    mrfHellthread() {
      return this.settings.description.find(setting => setting.key === ':mrf_hellthread')
    },
    mrfHellthreadData() {
      return this.settings.settings[':mrf_hellthread']
    },
    mrfKeyword() {
      return this.settings.description.find(setting => setting.key === ':mrf_keyword')
    },
    mrfKeywordData() {
      return this.settings.settings[':mrf_keyword']
    },
    mrfSubchain() {
      return this.settings.description.find(setting => setting.key === ':mrf_subchain')
    },
    mrfSubchainData() {
      return this.settings.settings[':mrf_subchain']
    },
    mrfMention() {
      return this.settings.description.find(setting => setting.key === ':mrf_mention')
    },
    mrfMentionData() {
      return this.settings.settings[':mrf_mention']
    },
    mrfNormalizeMarkup() {
      return this.settings.description.find(setting => setting.key === ':mrf_normalize_markup')
    },
    mrfNormalizeMarkupData() {
      return this.settings.settings[':mrf_normalize_markup']
    },
    mrfVocabulary() {
      return this.settings.description.find(setting => setting.key === ':mrf_vocabulary')
    },
    mrfVocabularyData() {
      return this.settings.settings[':mrf_vocabulary']
    }
  },
  methods: {
    // addMrfSubchainRow() {
    //   const updatedValue = this.matchActor.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting({ ...updatedValue, '': [] }, 'mrf_subchain', 'match_actor')
    // },
    // addMrfUserAllowlistRow() {
    //   const updatedValue = this.userAllowlist.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.$store.dispatch('RewriteConfig', { data: { ...updatedValue, '': [] }, tab: 'mrf_user_allowlist' })
    // },
    // addReplaceRow() {
    //   const updatedValue = this.replacePatterns.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting({ ...updatedValue, '': '' }, 'mrf_keyword', 'replace')
    // },
    // deleteMrfSubchainRow(index) {
    //   const filteredValues = this.matchActor.filter((el, i) => index !== i)
    //   const updatedValue = filteredValues.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting(updatedValue, 'mrf_subchain', 'match_actor')
    // },
    // deleteMrfUserAllowlistRow(index) {
    //   const filteredValues = this.userAllowlist.filter((el, i) => index !== i)
    //   const updatedValue = filteredValues.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.$store.dispatch('RewriteConfig', { data: updatedValue, tab: 'mrf_user_allowlist' })
    // },
    // deleteReplaceRow(index) {
    //   const filteredValues = this.replacePatterns.filter((el, i) => index !== i)
    //   const updatedValue = filteredValues.reduce((acc, el, i) => {
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting(updatedValue, 'mrf_keyword', 'replace')
    // },
    // parseMrfSubchain(value, inputType, index) {
    //   const updatedValue = this.matchActor.reduce((acc, el, i) => {
    //     if (index === i) {
    //       return inputType === 'regExp' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
    //     }
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting(updatedValue, 'mrf_subchain', 'match_actor')
    // },
    // parseMrfUserAllowlist(value, inputType, index) {
    //   const updatedValue = this.userAllowlist.reduce((acc, el, i) => {
    //     if (index === i) {
    //       return inputType === 'domain' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
    //     }
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.$store.dispatch('RewriteConfig', { data: updatedValue, tab: 'mrf_user_allowlist' })
    // },
    // parseReplace(value, inputType, index) {
    //   const updatedValue = this.replacePatterns.reduce((acc, el, i) => {
    //     if (index === i) {
    //       return inputType === 'key' ? { ...acc, [value]: el[1] } : { ...acc, [el[0]]: value }
    //     }
    //     return { ...acc, [el[0]]: el[1] }
    //   }, {})
    //   this.updateSetting(updatedValue, 'mrf_keyword', 'replace')
    // },
    // updateSetting(value, tab, input) {
    //   this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    // },
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
