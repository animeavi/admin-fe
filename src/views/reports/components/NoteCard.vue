<template>
  <el-card class="note-card">
    <div slot="header">
      <div class="note-header">
        <div class="note-actor-container">
          <div class="note-actor">
            <img :src="note.user.avatar" class="note-avatar-img">
            <h3 class="note-actor-name">{{ note.user.display_name }}</h3>
          </div>
          <a :href="note.user.url" target="_blank">
            @{{ note.user.display_name }}
          </a>
        </div>
        <div>
          <el-popconfirm
            title="Are you sure to delete this?"
            confirm-button-text="Yes"
            cancel-button-text="No"
            @onConfirm="handleNoteDeletion(note.id, report.id)">
            <el-button slot="reference" size="mini">
              {{ $t('reports.deleteNote') }}
            </el-button>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <div class="note-body">
      <span class="note-content" v-html="note.content"/>
      {{ parseTimestamp(note.created_at) }}
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NoteCard',
  props: {
    report: {
      type: Object,
      required: true
    },
    note: {
      type: Object,
      required: true
    }
  },
  methods: {
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    handleNoteDeletion(noteID, reportID) {
      this.$store.dispatch('DeleteReportNote', { noteID, reportID })
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
  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height: 40px;
  }
  .note-actor {
    display: flex;
    align-items: center;
  }
  .note-actor-name {
    margin: 0;
    height: 22px;
  }
  .note-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .note-body {
    display: flex;
    flex-direction: column;
  }
  .note-card {
    margin-bottom: 15px;
  }
  .note-content {
    font-size: 15px;
  }
  .note-header {
    display: flex;
    justify-content: space-between;
  }

  @media only screen and (max-width:480px) {
    .el-card__header {
      padding: 10px 17px;
    }
    .note-header {
      display: flex;
      flex-direction: column;
      height: 80px;
    }
    .note-actor-container {
      margin-bottom: 5px;
    }
    .note-header {
      display: flex;
      flex-direction: column;
    }
  }
</style>
