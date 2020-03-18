<template>
  <div class="reports-container">
    <h1>
      {{ $t('reports.reports') }}
      <span class="report-count">({{ normalizedReportsCount }})</span>
    </h1>
    <div class="reports-filter-container">
      <reports-filter/>
    </div>
    <div class="block">
      <report v-loading="loading" :reports="reports"/>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import Report from './components/Report'
import ReportsFilter from './components/ReportsFilter'

export default {
  components: { Report, ReportsFilter },
  computed: {
    loading() {
      return this.$store.state.reports.loading
    },
    normalizedReportsCount() {
      return numeral(this.$store.state.reports.totalReportsCount).format('0a')
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  },
  mounted() {
    this.$store.dispatch('FetchReports', 1)
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
  h1 {
    margin: 10px 0 0 15px;
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

@media only screen and (max-width:480px) {
  .reports-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .reports-filter-container {
      margin: 0 10px;
    }
  }
}
</style>
