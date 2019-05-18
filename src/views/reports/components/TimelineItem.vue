<template>
  <el-timeline-item :timestamp="parseTimestamp(report.created_at)" placement="top" class="timeline-item-container">
    <el-card>
      <div class="header-container">
        <h4>Report on {{ report.account.display_name }}</h4>
        <div>
          <el-tag :type="getStateType(report.state)" size="large">{{ capitalizeFirstLetter(report.state) }}</el-tag>
          <el-button plain size="small" @click="toggleNoteInput">{{ $t('reports.reply') }}</el-button>
        </div>
      </div>
      <h5 class="id">ID: {{ report.id }}</h5>
      <div class="report-row">
        <span>Account:</span>
        <img
          :src="report.account.avatar"
          alt="User's avatar"
          class="avatar-img">
        <a :href="report.account.url" target="_blank" class="account">{{ report.account.acct }}</a>
      </div>
      <div class="report-row">
        <span>Content: {{ report.content }}</span>
      </div>
      <div class="report-row">
        <span>Actor:</span>
        <img
          :src="report.actor.avatar"
          alt="User's avatar"
          class="avatar-img">
        <a :href="report.actor.url" target="_blank" class="account">{{ report.actor.acct }}</a>
      </div>
      <el-collapse v-model="showNotes">
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
      </el-collapse>
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
  }
  .el-card__body {
    padding: 17px 17px 0;
  }
  .el-collapse {
    border-bottom: none;
  }
  .el-collapse-item__header {
    height: 46px;
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
    height: 25px;
  }
  .id {
    color: gray;
    margin: 0 0 12px;
  }
  .new-note {
    p {
      font-size: 13px;
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
  .report-row {
    margin-bottom: 5px;
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
