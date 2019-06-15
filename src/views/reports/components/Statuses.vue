<template>
  <el-collapse-item :title="getStatusesTitle(report.statuses)">
    <el-card v-for="status in report.statuses" :key="status.id" class="status-card">
      <div slot="header">
        <div class="status-header">
          <div class="status-account-container">
            <div class="status-account">
              <img :src="status.account.avatar" class="status-avatar-img">
              <h3 class="status-account-name">{{ status.account.display_name }}</h3>
            </div>
            <a :href="status.account.url" target="_blank" class="account">
              @{{ status.account.acct }}
            </a>
          </div>
          <div class="status-actions">
            <el-tag v-if="status.sensitive" type="warning" size="large">{{ $t('reports.sensitive') }}</el-tag>
            <el-tag size="large">{{ capitalizeFirstLetter(status.visibility) }}</el-tag>
            <el-dropdown trigger="click">
              <el-button plain size="small" icon="el-icon-edit" class="status-actions-button">
                {{ $t('reports.changeScope') }}<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="!status.sensitive"
                  @click.native="changeStatus(status.id, true, status.visibility, report.id)">
                  {{ $t('reports.addSensitive') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.sensitive"
                  @click.native="changeStatus(status.id, false, status.visibility, report.id)">
                  {{ $t('reports.removeSensitive') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'public'"
                  @click.native="changeStatus(status.id, status.sensitive, 'public', report.id)">
                  {{ $t('reports.public') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'private'"
                  @click.native="changeStatus(status.id, status.sensitive, 'private', report.id)">
                  {{ $t('reports.private') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="status.visibility !== 'unlisted'"
                  @click.native="changeStatus(status.id, status.sensitive, 'unlisted', report.id)">
                  {{ $t('reports.unlisted') }}
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="deleteStatus(status.id, report.id)">
                  {{ $t('reports.deleteStatus') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="status-body">
        <span class="status-content" v-html="status.content"/>
        <a :href="status.url" target="_blank" class="account">
          {{ parseTimestamp(status.created_at) }}
        </a>
      </div>
    </el-card>
  </el-collapse-item>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Statuses',
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    changeStatus(statusId, isSensitive, visibility, reportId) {
      this.$store.dispatch('ChangeStatusScope', { statusId, isSensitive, visibility, reportId })
    },
    deleteStatus(statusId, reportId) {
      this.$confirm('Are you sure you want to delete this status?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteStatus', { statusId, reportId })
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    getStatusesTitle(statuses) {
      return `Reported statuses: ${statuses.length} item(s)`
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .account {
    text-decoration: underline;
  }
  .status-account {
    display: flex;
    align-items: center;
  }
  .status-avatar-img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .status-account-name {
    margin: 0;
    height: 22px;
  }
  .status-body {
    display: flex;
    flex-direction: column;
  }
  .status-content {
    font-size: 15px;
  }
  .status-card {
    margin-bottom: 15px;
  }
  .status-header {
    display: flex;
    justify-content: space-between;
  }
  @media
  only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
    .el-message {
      min-width: 80%;
    }
    .el-message-box {
      width: 80%;
    }
    .status-card {
      .el-card__header {
        padding: 10px 17px
      }
      .el-tag {
        margin: 3px 4px 3px 0;
      }
      .status-account-container {
        margin-bottom: 5px;
      }
      .status-actions-button {
        margin: 3px 0 3px;
      }
      .status-actions {
        display: flex;
        flex-wrap: wrap;
      }
      .status-header {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
