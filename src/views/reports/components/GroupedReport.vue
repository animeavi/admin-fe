<template>
  <el-timeline class="reports-timeline">
    <el-timeline-item
      v-for="groupedReport in groupedReports"
      :key="groupedReport.id"
      :timestamp="parseTimestamp(groupedReport.date)"
      placement="top"
      class="timeline-item-container">
      <el-card class="grouped-report">
        <div class="header-container">
          <div>
            <h3 class="report-title">{{ $t('reports.reportsOn') }} {{ groupedReport.account.display_name }}</h3>
          </div>
          <div>
            <el-dropdown trigger="click">
              <el-button plain size="small" icon="el-icon-edit" class="report-actions-button">{{ $t('reports.changeAllReports') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeAllReports('resolved', groupedReport.reports)">{{ $t('reports.resolveAll') }}</el-dropdown-item>
                <el-dropdown-item @click.native="changeAllReports('open', groupedReport.reports)">{{ $t('reports.reopenAll') }}</el-dropdown-item>
                <el-dropdown-item @click.native="changeAllReports('closed', groupedReport.reports)">{{ $t('reports.closeAll') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <moderate-user-dropdown :account="groupedReport.account"/>
          </div>
        </div>
        <div>
          <el-divider class="divider"/>
          <span class="report-row-key">{{ $t('reports.account') }}:</span>
          <img
            :src="groupedReport.account.avatar"
            alt="avatar"
            class="avatar-img">
          <a :href="groupedReport.account.url" target="_blank">
            <span>{{ groupedReport.account.nickname }}</span>
          </a>
        </div>
        <div>
          <el-divider class="divider"/>
          <span class="report-row-key">{{ $t('reports.actors') }}:</span>
          <span v-for="(actor, index) in groupedReport.actors" :key="actor.id">
            <a :href="actor.url" target="_blank">
              {{ actor.acct }}<span v-if="index < groupedReport.actors.length - 1">, </span>
            </a>
          </span>
        </div>
        <div v-if="groupedReport.status">
          <el-divider class="divider"/>
          <span class="report-row-key">{{ $t('reports.reportedStatus') }}:</span>
          <status :status="groupedReport.status" :show-checkbox="false" class="reported-status"/>
        </div>
        <div v-if="groupedReport.reports">
          <el-collapse>
            <el-collapse-item :title="$t('reports.reports')">
              <report-card :reports="groupedReport.reports"/>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import moment from 'moment'
import ModerateUserDropdown from './ModerateUserDropdown'
import ReportCard from './ReportCard'
import Status from '@/components/Status'

export default {
  name: 'Report',
  components: { ModerateUserDropdown, ReportCard, Status },
  props: {
    groupedReports: {
      type: Array,
      required: true
    }
  },
  methods: {
    changeAllReports(reportState, groupOfReports) {
      const reportsData = groupOfReports.map(report => {
        return { id: report.id, state: reportState }
      })
      this.$store.dispatch('ChangeReportState', reportsData)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('L HH:mm')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  a {
    text-decoration: underline;
  }
  .avatar-img {
    vertical-align: bottom;
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
  .el-card__body {
    padding: 17px;
  }
  .el-card__header {
    background-color: #FAFAFA;
    padding: 10px 20px;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .divider {
    margin: 15px 0;
  }
  .grouped-report {
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      height: 36px;
    }
  }
  .line {
    width: 100%;
    height: 0;
    border: 0.5px solid #EBEEF5;
    margin: 15px 0 15px;
  }
  .report-title {
    margin: 0;
  }
  .report-row-key {
    font-size: 14px;
    font-weight: 500;
  }
  .reports-timeline {
    margin: 30px 45px 45px 19px;
    padding: 0px;
  }
  .reported-status {
    margin-top: 15px;
  }

  @media only screen and (max-width:480px) {
    .grouped-report {
      .header-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        height: auto;
      }
      .report-actions-button {
        margin: 3px 0 6px;
      }
      .report-title {
        margin-bottom: 7px;
      }
    }
    .block {
      .reports-timeline .el-timeline {
        margin: 20px 10px;
        .el-timeline-item__wrapper {
          padding-left: 20px;
        }
      }
    }
  }
</style>
