<template>
  <el-collapse-item :title="getStatusesTitle(report.statuses)">
    <el-card v-for="status in report.statuses" :key="status.id" class="status-card">
      <div slot="header">
        <div class="status-header">
          <div class="status-account">
            <img :src="status.account.avatar" alt="avatar" class="status-avatar-img">
            <h3 class="status-account-name">{{ status.account.display_name }}</h3>
          </div>
          <div class="status-actions">
            <el-tag v-if="status.sensitive" type="warning" size="large">{{ $t('reports.sensitive') }}</el-tag>
            <el-tag size="large">{{ capitalizeFirstLetter(status.visibility) }}</el-tag>
            <el-dropdown trigger="click">
              <el-button plain size="small" icon="el-icon-edit">{{ $t('reports.changeScope') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
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
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
</template>

<script>
import * as moment from 'moment'

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
</style>
