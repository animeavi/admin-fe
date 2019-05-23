<template>
  <el-timeline-item :timestamp="parseTimestamp(report.created_at)" placement="top" class="timeline-item-container">
    <el-card>
      <div class="header-container">
        <h3 class="report-title">Report on {{ report.account.display_name }}</h3>
        <div>
          <el-tag :type="getStateType(report.state)" :key="report.state" size="large">{{ capitalizeFirstLetter(report.state) }}</el-tag>
          <el-dropdown>
            <el-button plain size="small" icon="el-icon-edit">{{ $t('reports.changeState') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="report.state !== 'resolved'" @click.native="changeReportState('resolved', report.id)">Resolve</el-dropdown-item>
              <el-dropdown-item v-if="report.state !== 'open'" @click.native="changeReportState('open', report.id)">Open</el-dropdown-item>
              <el-dropdown-item v-if="report.state !== 'closed'" @click.native="changeReportState('closed', report.id)">Close</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button plain size="small" @click="toggleNoteInput">{{ $t('reports.reply') }}</el-button> -->
        </div>
      </div>
      <h5 class="id">ID: {{ report.id }}</h5>
      <div class="line"/>
      <div>
        <span class="report-row-key">Account:</span>
        <img
          :src="report.account.avatar"
          alt="User's avatar"
          class="avatar-img">
        <a :href="report.account.url" target="_blank" class="account">
          <span class="report-row-value">{{ report.account.acct }}</span>
        </a>
      </div>
      <div class="line"/>
      <div>
        <span class="report-row-key">Content:
          <span class="report-row-value">{{ report.content.length > 0 ? report.content : '-' }}</span>
        </span>
      </div>
      <div class="line"/>
      <div>
        <span class="report-row-key">Actor:</span>
        <img
          :src="report.actor.avatar"
          alt="User's avatar"
          class="avatar-img">
        <a :href="report.actor.url" target="_blank" class="account">
          <span class="report-row-value">{{ report.actor.acct }}</span>
        </a>
      </div>
      <div class="statuses">
        <el-collapse>
          <el-collapse-item :title="getStatusesTitle(report.statuses)">
            <el-card v-for="status in report.statuses" :key="status.id" class="status-card">
              <div slot="header">
                <div class="status-header">
                  <img :src="status.account.avatar" alt="User's avatar" class="status-avatar-img">
                  <h3 class="status-account-name">{{ status.account.display_name }}</h3>
                </div>
                <a :href="status.account.url" target="_blank" class="account">
                  @{{ status.account.acct }}
                </a>
              </div>
              <div class="status-body">
                <span class="status-content">{{ status.content }}</span>
                <a :href="status.url" target="_blank" class="account">
                  {{ parseTimestamp(status.created_at) }}
                </a>
              </div>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- <el-collapse v-model="showNotes">
        <el-collapse-item :title="$t('reports.showNotes')" name="showNotes">
          <div v-if="report.statuses.length > 0">
            <div v-for="note in report.statuses" :key="note.id">
              <el-card :body-style="{ padding: '6px 14px 0 14px' }" class="note">
                <div class="header-container">
                  <h4>{{ $t('reports.from') }} {{ note.author }}</h4>
                  <i class="el-icon-close" @click="deleteNote(report.id, note.id)"/>
                </div>
                <p class="timestamp">{{ note.timestamp }}</p>
                <p>{{ note.text }}</p>
              </el-card>
            </div>
          </div>
          <div v-else>
            <p class="no-notes">{{ $t('reports.noNotes') }}</p>
          </div>
        </el-collapse-item>
        <div v-show="showNewNoteInput" class="new-note">
          <div class="header-container">
            <p>{{ $t('reports.newNote') }}</p>
            <i class="el-icon-close" @click="toggleNoteInput"/>
          </div>
          <el-input v-model="note" :rows="2" type="textarea" autofocus/>
          <el-button class="submit-button" plain size="small" @click="addNewNote(report.id)">{{ $t('reports.submit') }}</el-button>
        </div>
      </el-collapse> -->
    </el-card>
  </el-timeline-item>
</template>

<script>
import i18n from '@/lang'
import * as moment from 'moment'

export default {
  name: 'TimelineItem',
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showNotes: [],
      showNewNoteInput: false,
      note: ''
    }
  },
  methods: {
    addNewNote(reportId) {
      if (this.$data.note.length < 2) {
        this.$message('Note must contain at least 2 characters')
      } else {
        const currentUserNickname = this.$store.state.user.name
        const note = { author: currentUserNickname, text: this.$data.note, timestamp: '2019/04/01' }
        this.$store.dispatch('AddNote', { reportId, note })
        this.$data.note = ''
      }
    },
    changeReportState(reportState, reportId) {
      this.$store.dispatch('ChangeReportState', { reportState, reportId })
    },
    deleteNote(reportId, noteId) {
      this.$confirm(i18n.t('reports.confirmMsg'), {
        confirmButtonText: i18n.t('reports.delete'),
        cancelButtonText: i18n.t('reports.cancel'),
        type: 'warning',
        showClose: false,
        customClass: 'confirm-message'
      }).then(() => {
        this.$store.dispatch('DeleteNote', { reportId, noteId })
        this.$message({
          type: 'success',
          message: i18n.t('reports.deleteCompleted')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('reports.deleteCanceled')
        })
      })
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
          return ''
      }
    },
    getStatusesTitle(statuses) {
      return `Reported statuses: ${statuses.length} item(s)`
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    toggleNoteInput() {
      this.$data.showNewNoteInput = !this.$data.showNewNoteInput
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
    height: 30px;
  }
  .id {
    color: gray;
    margin: 0 0 12px;
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
  .status-account-name {
    margin: 0;
  }
  .status-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .status-body {
    display: flex;
    flex-direction: column;
  }
  .status-card {
    margin-bottom: 15px;
  }
  .status-content {
    font-size: 15px;
  }
  .status-header {
    display: flex;
    align-items: center;
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
    .confirm-message {
      width: 98%;
    }
  }
</style>
