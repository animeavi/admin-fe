<template>
  <div class="reports-container">
    <h1 v-if="groupReports">
      {{ $t('reports.groupedReports') }}
      <span class="report-count">({{ normalizedReportsCount }})</span>
    </h1>
    <h1 v-else>
      {{ $t('reports.reports') }}
      <span class="report-count">({{ normalizedReportsCount }})</span>
    </h1>
    <div class="reports-filter-container">
      <reports-filter v-if="!groupReports"/>
      <el-checkbox v-model="groupReports" class="group-reports-checkbox">
        Group reports by statuses
      </el-checkbox>
    </div>
    <div class="block">
      <grouped-report v-loading="loading" v-if="groupReports" :grouped-reports="groupedReports"/>
      <report v-loading="loading" v-else :reports="reports"/>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import GroupedReport from './components/GroupedReport'
import numeral from 'numeral'
import Report from './components/Report'
import ReportsFilter from './components/ReportsFilter'

export default {
  components: { GroupedReport, Report, ReportsFilter },
  computed: {
    groupedReports() {
      return this.$store.state.reports.fetchedGroupedReports
    },
    groupReports: {
      get() {
        return this.$store.state.reports.groupReports
      },
      set() {
        this.toggleReportsGrouping()
      }
    },
    loading() {
      return this.$store.state.reports.loading
    },
    normalizedReportsCount() {
      return this.groupReports
        ? numeral(this.$store.state.reports.fetchedGroupedReports.length).format('0a')
        : numeral(this.$store.state.reports.totalReportsCount).format('0a')
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  },
  mounted() {
    this.$store.dispatch('FetchReports', 1)
    this.$store.dispatch('FetchGroupedReports')
  },
  methods: {
    toggleReportsGrouping() {
      this.$store.dispatch('ToggleReportsGrouping')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.reports-container {
  .reports-filter-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 22px 15px 22px 15px;
    padding-bottom: 0
  }
  .group-reports-checkbox {
    margin-top: 10px;
  }
  h1 {
    margin: 22px 0 0 15px;
  }
  .no-reports-message {
    color: gray;
    margin-left: 19px
  }
  .report-count {
    color: gray;
    font-size: 28px;
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .reports-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .reports-filter-container {
      margin: 0 10px;
    }
  }
  #app > div > div.main-container > section > div > div.block > ul {
    margin: 45px 45px 5px 19px;
  }
}
</style>
