<template>
  <div>
    <el-timeline class="reports-timeline">
      <el-timeline-item
        v-for="report in reports"
        :timestamp="parseTimestamp(report.created_at)"
        :key="report.id"
        placement="top"
        class="timeline-item-container">
        <el-card class="report">
          <div class="header-container">
            <div class="title-container">
              <h3 class="report-title">{{ $t('reports.reportOn') }} {{ report.account.display_name }}</h3>
              <h5 class="id">{{ $t('reports.id') }}: {{ report.id }}</h5>
            </div>
            <div>
              <el-tag :type="getStateType(report.state)" size="large" class="report-tag">{{ capitalizeFirstLetter(report.state) }}</el-tag>
              <el-dropdown trigger="click">
                <el-button plain size="small" icon="el-icon-edit" class="report-actions-button">{{ $t('reports.changeState') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
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
            <el-divider class="divider"/>
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
            <el-divider class="divider"/>
            <span class="report-row-key">{{ $t('reports.content') }}:
              <span>{{ report.content }}</span>
            </span>
          </div>
          <div :style="showStatuses(report.statuses) ? '' : 'margin-bottom:15px'">
            <el-divider class="divider"/>
            <span class="report-row-key">{{ $t('reports.actor') }}:</span>
            <img
              :src="report.actor.avatar"
              alt="avatar"
              class="avatar-img">
            <a :href="report.actor.url" target="_blank" class="account">
              <span>{{ report.actor.acct }}</span>
            </a>
          </div>
          <div v-if="showStatuses(report.statuses)" class="statuses">
            <el-collapse>
              <el-collapse-item :title="getStatusesTitle(report.statuses)">
                <div v-for="status in report.statuses" :key="status.id">
                  <status :status="status" :show-checkbox="false" :page="currentPage"/>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="report-notes">
            <el-collapse>
              <el-collapse-item :title="getNotesTitle(report.notes)">
                <note-card v-for="(note, index) in report.notes" :key="index" :note="note" :report="report"/>
              </el-collapse-item>
            </el-collapse>
            <div class="report-note-form">
              <el-input
                v-model="notes[report.id]"
                :placeholder="$t('reports.leaveNote')"
                type="textarea"
                rows="2"/>
              <div class="report-post-note">
                <el-button @click="handleNewNote(report.id)">{{ $t('reports.postNote') }}</el-button>
              </div>
            </div>
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
import NoteCard from './NoteCard'
import Status from '@/components/Status'
import ModerateUserDropdown from './ModerateUserDropdown'

export default {
  name: 'Report',
  components: { Status, ModerateUserDropdown, NoteCard },
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      notes: {}
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
  methods: {
    changeReportState(state, id) {
      this.$store.dispatch('ChangeReportState', [{ state, id }])
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
    getNotesTitle(notes = []) {
      return `Notes: ${notes.length} item(s)`
    },
    handleNewNote(reportID) {
      this.$store.dispatch('CreateReportNote', { content: this.notes[reportID], reportID })
      this.notes[reportID] = ''
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchReports', page)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('L HH:mm')
    },
    showStatuses(statuses) {
      return statuses.length > 0
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
  .divider {
    margin: 15px 0;
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
  .report {
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      height: 40px;
    }
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
  .report-note-form {
    margin: 15px 0 0 0;
  }
  .report-post-note {
    margin: 5px 0 0 0;
    text-align: right;
  }
  .reports-pagination {
    margin: 25px 0;
    text-align: center;
  }
  .reports-timeline {
    margin: 30px 45px 45px 19px;
    padding: 0px;
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

  @media only screen and (max-width:480px) {
    .report {
      .header-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        height: auto;
      }
      .id {
        margin: 6px 0 0 0;
      }
      .report-actions-button {
        margin: 3px 0 6px;
      }
      .report-tag {
        margin: 3px 0 6px;
      }
      .title-container {
        margin-bottom: 7px;
      }
    }
    .reports-timeline {
      margin: 20px 10px;
      .el-timeline-item__wrapper {
        padding-left: 20px;
      }
    }
  }
</style>
