<template>
  <div v-if="!loading" class="report-show-page-container">
    <header class="report-page-header-container">
      <div class="report-page-header">
        <div v-if="propertyExists(report.account, 'nickname')" class="avatar-name-container">
          <h1 >{{ $t('reports.reportOn') }}</h1>
          <el-avatar
            v-if="propertyExists(report.account, 'avatar')"
            :src="report.account.avatar"
            :size="isMobile ? 'small' : 'large'"
            class="report-page-avatar"/>
          <h1>{{ report.account.nickname }}</h1>
          <a v-if="propertyExists(report.account, 'url')" :href="report.account.url" target="_blank">
            <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
          </a>
        </div>
        <h1 v-else>{{ $t('reports.report') }}</h1>
      </div>
      <div class="report-actions-container">
        <el-tag :type="getStateType(report.state)" class="report-tag">{{ capitalizeFirstLetter(report.state) }}</el-tag>
        <el-dropdown trigger="click">
          <el-button
            :size="isMobile ? 'small' : 'medium'"
            plain
            icon="el-icon-edit"
            class="report-actions-button">
            {{ $t('reports.changeState') }}<i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="report.state !== 'resolved'" @click.native="changeReportState('resolved', report.id)">{{ $t('reports.resolve') }}</el-dropdown-item>
            <el-dropdown-item v-if="report.state !== 'open'" @click.native="changeReportState('open', report.id)">{{ $t('reports.reopen') }}</el-dropdown-item>
            <el-dropdown-item v-if="report.state !== 'closed'" @click.native="changeReportState('closed', report.id)">{{ $t('reports.close') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <moderate-user-dropdown
          v-if="propertyExists(report.account, 'nickname')"
          :account="report.account"
          :report-id="report.id"
          :rendered-from="'showPage'"/>
        <reboot-button/>
      </div>
    </header>
    <h4 v-if="propertyExists(report.account, 'id')" class="id">{{ $t('reports.id') }}: {{ report.id }}</h4>
    <div class="report-card-container">
      <el-card class="report">
        <report-content :report="report"/>
      </el-card>
    </div>
  </div>
</template>

<script>
import ModerateUserDropdown from './components/ModerateUserDropdown'
import RebootButton from '@/components/RebootButton'
import ReportContent from './components/ReportContent'

export default {
  name: 'ReportsShow',
  components: { ModerateUserDropdown, RebootButton, ReportContent },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    loading() {
      return this.$store.state.reports.loadingSingleReport
    },
    report() {
      return this.$store.state.reports.singleReport
    }
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchSingleReport', this.$route.params.id)
    this.$store.dispatch('FetchTagPolicySetting')
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    async changeReportState(state, id) {
      await this.$store.dispatch('ChangeReportState', [{ state, id }])
      this.$store.dispatch('FetchSingleReport', id)
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
    propertyExists(account, property, _secondProperty) {
      if (_secondProperty) {
        return account[property] && account[_secondProperty]
      }
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.report-show-page-container {
  .id {
    color: gray;
    margin: 0 15px 22px 15px;
  }
  .report {
    max-width: 1000px;
    margin: auto;
  }
  .report-actions-button {
    margin: 0 5px;
  }
  .report-actions-container {
    display: flex;
    flex-wrap: wrap;
  }
  .report-card-container {
    margin: auto;
    padding: 0 15px;
  }
  .report-page-header {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    padding: 0;
    h1 {
      display: inline;
      margin: 0;
    }
    h4 {
      margin-top: 10px;
    }
    .avatar-name-container {
      display: flex;
      align-items: center;
      .el-icon-top-right {
        font-size: 2em;
        line-height: 36px;
        color: #606266;
      }
    }
    .report-page-avatar {
      margin: 0 7px 0 12px;
    }
  }
  .report-page-header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 15px;
    padding: 0;
  }
  .report-tag {
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    font-size: 14px;
  }
}
@media only screen and (max-width:801px) {
  .report-show-page-container {
    .id {
      margin: 7px 15px 15px 15px;
    }
    .report-actions-button {
      margin: 0 3px 6px;
    }
    .report-page-header-container {
      flex-direction: column;
      align-items: flex-start;
    }
    .report-page-header {
      h1 {
        font-size: 24px;
      }
      .avatar-name-container {
        .el-icon-top-right {
          font-size: 24px;
        }
      }
      .report-page-avatar {
        margin: 0 5px 0 9px;
      }
    }
  }
}
@media only screen and (max-width:480px) {
  .report-tag {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
}
</style>
