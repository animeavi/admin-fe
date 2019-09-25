<template>
  <div class="reports-container">
    <h1>{{ $t('reports.reports') }}</h1>
    <div class="filter-container">
      <reports-filter/>
      <el-checkbox v-model="groupReports" class="group-reports-checkbox" @change="toggleReportsGrouping">
        Group reports by statuses
      </el-checkbox>
    </div>
    <div class="block">
      <el-timeline class="timeline">
        <report v-loading="loading" v-for="report in reports" :report="report" :key="report.id"/>
      </el-timeline>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
      <div v-if="!loading" class="reports-pagination">
        <el-pagination
          :total="totalReportsCount"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Report from './components/Report'
import ReportsFilter from './components/ReportsFilter'

export default {
  components: { Report, ReportsFilter },
  computed: {
    groupReports() {
      return this.$store.state.reports.groupReports
    },
    loading() {
      return this.$store.state.reports.loading
    },
    pageSize() {
      return this.$store.state.reports.pageSize
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    },
    totalReportsCount() {
      return this.$store.state.reports.totalReportsCount
    },
    currentPage() {
      return this.$store.state.reports.currentPage
    }
  },
  mounted() {
    this.$store.dispatch('FetchReports')
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  // destroyed() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('FetchReports', { page })
    },
    toggleReportsGrouping() {

    }
    // handleScroll(reports) {
    //   const bottomOfWindow = document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight
    //   if (bottomOfWindow) {
    //     this.$store.dispatch('FetchReports')
    //   }
    // }
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
    display: flex;
    flex-direction: column;
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
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .reports-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .filter-container {
      margin: 0 10px
    }
  }
  #app > div > div.main-container > section > div > div.block > ul {
    margin: 45px 45px 5px 19px;
  }
  .reports-pagination {
    margin: 25px 0;
    text-align: center;
  }
}
</style>
