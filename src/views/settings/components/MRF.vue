<template>
  <div v-if="!loading" class="form-container">
    <el-form ref="mrfSimple" :model="mrfSimpleData" :label-width="labelWidth">
      <setting :setting-group="mrfSimple" :data="mrfSimpleData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mrfRejectnonpublic" :model="mrfRejectnonpublicData" :label-width="labelWidth">
      <setting :setting-group="mrfRejectnonpublic" :data="mrfRejectnonpublicData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mrfHellthread" :model="mrfHellthreadData" :label-width="labelWidth">
      <setting :setting-group="mrfHellthread" :data="mrfHellthreadData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mrfKeyword" :model="mrfKeywordData" :label-width="labelWidth">
      <setting :setting-group="mrfKeyword" :data="mrfKeywordData"/>
    </el-form>
    <el-form ref="mrfSubchain" :model="mrfSubchainData" :label-width="labelWidth">
      <setting :setting-group="mrfSubchain" :data="mrfSubchainData"/>
    </el-form>
    <el-form ref="mrfMention" :model="mrfMentionData" :label-width="labelWidth">
      <setting :setting-group="mrfMention" :data="mrfMentionData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mrfNormalizeMarkup" :model="mrfNormalizeMarkupData" :label-width="labelWidth">
      <setting :setting-group="mrfNormalizeMarkup" :data="mrfNormalizeMarkupData"/>
    </el-form>
    <el-divider class="divider thick-line"/>
    <el-form ref="mrfVocabulary" :model="mrfVocabularyData" :label-width="labelWidth">
      <setting :setting-group="mrfVocabulary" :data="mrfVocabularyData"/>
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
  name: 'MRF',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    loading() {
      return this.settings.loading
    },
    mrfSimple() {
      return this.settings.description.find(setting => setting.key === ':mrf_simple')
    },
    mrfSimpleData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_simple']) || {}
    },
    mrfRejectnonpublic() {
      return this.settings.description.find(setting => setting.key === ':mrf_rejectnonpublic')
    },
    mrfRejectnonpublicData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_rejectnonpublic']) || {}
    },
    mrfHellthread() {
      return this.settings.description.find(setting => setting.key === ':mrf_hellthread')
    },
    mrfHellthreadData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_hellthread']) || {}
    },
    mrfKeyword() {
      return this.settings.description.find(setting => setting.key === ':mrf_keyword')
    },
    mrfKeywordData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_keyword']) || {}
    },
    mrfSubchain() {
      return this.settings.description.find(setting => setting.key === ':mrf_subchain')
    },
    mrfSubchainData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_subchain']) || {}
    },
    mrfMention() {
      return this.settings.description.find(setting => setting.key === ':mrf_mention')
    },
    mrfMentionData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_mention']) || {}
    },
    mrfNormalizeMarkup() {
      return this.settings.description.find(setting => setting.key === ':mrf_normalize_markup')
    },
    mrfNormalizeMarkupData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_normalize_markup']) || {}
    },
    mrfVocabulary() {
      return this.settings.description.find(setting => setting.key === ':mrf_vocabulary')
    },
    mrfVocabularyData() {
      return _.get(this.settings.settings, [':pleroma', ':mrf_vocabulary']) || {}
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
