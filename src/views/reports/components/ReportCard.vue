<template>
  <div>
    <el-card v-for="report in reports" :key="report.id" class="report-card">
      <div slot="header">
        <div class="report-header">
          <div class="report-actor-container">
            <div class="report-actor">
              <img :src="report.actor.avatar" class="report-avatar-img">
              <h3 class="report-actor-name">{{ report.actor.display_name }}</h3>
            </div>
            <a :href="report.actor.url" target="_blank">
              @{{ report.actor.acct }}
            </a>
          </div>
          <div>
            <el-tag :type="getStateType(report.state)" size="large">{{ capitalizeFirstLetter(report.state) }}</el-tag>
            <el-dropdown trigger="click">
              <el-button plain size="small" icon="el-icon-edit">{{ $t('reports.changeState') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="report.state !== 'resolved'" @click.native="changeReportState('resolved', report.id)">{{ $t('reports.resolve') }}</el-dropdown-item>
                <el-dropdown-item v-if="report.state !== 'open'" @click.native="changeReportState('open', report.id)">{{ $t('reports.reopen') }}</el-dropdown-item>
                <el-dropdown-item v-if="report.state !== 'closed'" @click.native="changeReportState('closed', report.id)">{{ $t('reports.close') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="report-body">
        <span class="report-content" v-html="report.content"/>
        {{ parseTimestamp(report.created_at) }}
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Statuses',
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    changeReportState(state, id) {
      this.$store.dispatch('ChangeReportState', [{ state, id }])
    },
    getStateType(state) {
      switch (state) {
        case 'closed':
          return 'info'
        case 'resolved':
          return 'success'
        default:
          return 'primary'
      }
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  a {
    text-decoration: underline;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height: 40px;
  }
  .report-actor {
    display: flex;
    align-items: center;
  }
  .report-actor-name {
    margin: 0;
    height: 22px;
  }
  .report-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .report-body {
    display: flex;
    flex-direction: column;
  }
  .report-card {
    margin-bottom: 15px;
  }
  .report-content {
    font-size: 15px;
  }
  .report-header {
    display: flex;
    justify-content: space-between;
  }
  @media
  only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
    .el-card__header {
      padding: 10px 17px;
    }
    .report-header {
      display: flex;
      flex-direction: column;
      height: 80px;
    }
    .report-actor-container {
      margin-bottom: 5px;
    }
    .report-header {
      display: flex;
      flex-direction: column;
    }
  }
</style>
