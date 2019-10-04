<template>
  <div>
    <el-timeline class="timeline">
      <el-timeline-item
        v-for="report in reports"
        :timestamp="parseTimestamp(report.created_at)"
        :key="report.id"
        placement="top"
        class="timeline-item-container">
        <el-card>
          <div class="header-container">
            <div>
              <h3 class="report-title">{{ $t('reports.reportOn') }} {{ report.account.display_name }}</h3>
              <h5 class="id">{{ $t('reports.id') }}: {{ report.id }}</h5>
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
              <moderate-user-dropdown :account="report.account"/>
            </div>
          </div>
          <div>
            <div class="line"/>
            <span class="report-row-key">{{ $t('reports.account') }}:</span>
            <img
              :src="report.account.avatar"
              alt="avatar"
              class="avatar-img">
            <a :href="report.account.url" target="_blank" class="account">
              <span>{{ report.account.acct }}</span>
            </a>
          </div>
          <div v-if="report.content.length > 0">
            <div class="line"/>
            <span class="report-row-key">{{ $t('reports.content') }}:
              <span>{{ report.content }}</span>
            </span>
          </div>
          <div>
            <div class="line"/>
            <span class="report-row-key">{{ $t('reports.actor') }}:</span>
            <img
              :src="report.actor.avatar"
              alt="avatar"
              class="avatar-img">
            <a :href="report.actor.url" target="_blank" class="account">
              <span>{{ report.actor.acct }}</span>
            </a>
          </div>
          <div v-if="report.statuses.length > 0" class="statuses">
            <el-collapse>
              <el-collapse-item :title="getStatusesTitle(report.statuses)">
                <div v-for="status in report.statuses" :key="status.id">
                  <status :status="status" :page="currentPage"/>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
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
</template>

<script>
import moment from 'moment'
import Status from '../../status/Status'
import ModerateUserDropdown from './ModerateUserDropdown'

export default {
  name: 'Report',
  components: { Status, ModerateUserDropdown },
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  computed: {
    loading() {
      return this.$store.state.reports.loading
    },
    pageSize() {
      return this.$store.state.reports.pageSize
    },
    totalReportsCount() {
      return this.$store.state.reports.totalReportsCount
    },
    currentPage() {
      return this.$store.state.reports.currentPage
    }
  },
  mounted() {
    this.$store.dispatch('FetchReports', 1)
  },
  methods: {
    changeReportState(reportState, reportId) {
      this.$store.dispatch('ChangeReportState', { reportState, reportId })
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
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
    getStatusesTitle(statuses) {
      return `Reported statuses: ${statuses.length} item(s)`
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchReports', page)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('L HH:mm')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .account {
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
  .el-collapse {
    border-bottom: none;
  }
  .el-collapse-item__header {
    height: 46px;
    font-size: 14px;
  }
  .el-collapse-item__content {
    padding-bottom: 7px;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .el-icon-close {
    padding: 10px 5px 10px 10px;
    cursor: pointer;
  }
  h4 {
    margin: 0;
    height: 17px;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height: 40px;
  }
  .id {
    color: gray;
    margin-top: 6px;
  }
  .line {
    width: 100%;
    height: 0;
    border: 0.5px solid #EBEEF5;
    margin: 15px 0 15px;
  }
  .new-note {
    p {
      font-size: 14px;
      font-weight: 500;
      height: 17px;
      margin: 13px 0 7px;
    }
  }
  .note {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
    margin-bottom: 10px;
  }
  .no-notes {
    font-style: italic;
    color: gray;
  }
  .report-row-key {
    font-size: 14px;
    font-weight: 500;
  }
  .report-row-key {
    font-size: 14px;
  }
  .report-title {
    margin: 0;
  }
  .reports-pagination {
    margin: 25px 0;
    text-align: center;
  }
  .statuses {
    margin-top: 15px;
  }
  .submit-button {
    display: block;
    margin: 7px 0 17px auto;
  }
  .timestamp {
    margin: 0;
    font-style: italic;
    color: gray;
  }
  @media
  only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
    .timeline-item-container {
      .header-container {
        display: flex;
        flex-direction: column;
        height: 80px;
      }
      .id {
        margin: 6px 0 0 0;
      }
    }
  }
</style>
