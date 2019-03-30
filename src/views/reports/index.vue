<template>
  <div class="reports-container">
    <h1>{{ $t('reports.reports') }}</h1>
    <div class="block">
      <el-timeline class="timeline">
        <timeline-item v-for="item in reports" :item="item" :key="item.id"/>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import TimelineItem from './components/TimelineItem'

export default {
  components: { TimelineItem },
  computed: {
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.reports-container {
  h1 {
    margin: 22px 0 0 15px;
  }
  .el-timeline {
    margin: 45px 45px 45px 19px;
    padding: 0px;
  }
}
@media
only screen and (max-width: 760px),
(min-device-width: 768px) and (max-device-width: 1024px) {
  .reports-container {
    h1 {
      margin: 7px 10px 7px 10px;
    }
  }
}
</style>
