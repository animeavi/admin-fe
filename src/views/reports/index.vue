<template>
  <div class="reports-container">
    <h1>{{ $t('reports.reports') }}</h1>
    <div class="filter-container">
      <reports-filter/>
    </div>
    <div class="block">
      <el-timeline class="timeline">
        <timeline-item v-loading="loading" v-for="report in reports" :report="report" :key="report.id"/>
      </el-timeline>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import TimelineItem from './components/TimelineItem'
import ReportsFilter from './components/ReportsFilter'

export default {
  components: { TimelineItem, ReportsFilter },
  computed: {
    loading() {
      return this.$store.state.users.loading
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  },
  mounted() {
    this.$store.dispatch('FetchReports')
    this.scroll(this.reports)
  },
  methods: {
    scroll(reports) {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight

        if (bottomOfWindow) {
          this.$store.dispatch('FetchReports')
        }
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.reports-container {
  .el-timeline {
    margin: 45px 45px 45px 19px;
    padding: 0px;
  }
  .filter-container {
    margin: 22px 15px 22px 15px;
    padding-bottom: 0
  }
  h1 {
    margin: 22px 0 0 15px;
  }
  .no-reports-message {
    color: gray;
    margin-left: 19px

  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .reports-container {
    h1 {
      margin: 7px 10px 7px 10px;
    }
    .filter-container {
      margin: 0 10px 7px 10px
    }
  }
}
</style>
