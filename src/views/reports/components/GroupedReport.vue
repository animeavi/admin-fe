<template>
  <el-timeline class="timeline">
    <el-card v-for="group in groups" :key="group.id">
      <div class="header-container">
        <div>
          <h3 class="report-title">{{ $t('reports.reportsOn') }} {{ group.account.display_name }}</h3>
        </div>
        <div>
          <el-dropdown trigger="click">
            <el-button plain size="small" icon="el-icon-edit">{{ $t('reports.changeAllReports') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeAllReports('resolved', group.reports)">{{ $t('reports.resolveAll') }}</el-dropdown-item>
              <el-dropdown-item @click.native="changeAllReports('open', group.reports)">{{ $t('reports.reopenAll') }}</el-dropdown-item>
              <el-dropdown-item @click.native="changeAllReports('closed', group.reports)">{{ $t('reports.closeAll') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <moderate-user-dropdown :account="group.account"/>
        </div>
      </div>
      <div>
        <div class="line"/>
        <span class="report-row-key">{{ $t('reports.account') }}:</span>
        <img
          :src="group.account.avatar"
          alt="avatar"
          class="avatar-img">
        <a :href="group.account.url" target="_blank">
          <span>{{ group.account.acct }}</span>
        </a>
      </div>
      <div>
        <div class="line"/>
        <span class="report-row-key">{{ $t('reports.actors') }}:</span>
        <span v-for="actor in group.actors" :key="actor.id">
          <a :href="actor.url" target="_blank">
            <span>{{ actor.acct }}, </span>
          </a>
        </span>
      </div>
      <div v-if="group.status">
        <div class="line"/>
        <span class="report-row-key">{{ $t('reports.reportedStatus') }}:</span>
        <div v-for="status in group.status" :key="status.id">
          <status :status="status" :page="1" class="reported-status"/> <!-- Change page value when pagination is implemented -->
        </div>
      </div>
      <div v-if="group.reports">
        <div class="line"/>
        <el-collapse>
          <el-collapse-item :title="$t('reports.reports')">
            <report-card :reports="group.reports"/>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </el-timeline>
</template>

<script>
import ModerateUserDropdown from './ModerateUserDropdown'
import ReportCard from './ReportCard'
import Status from '../../status/Status'

export default {
  name: 'Report',
  components: { ModerateUserDropdown, ReportCard, Status },
  props: {
    groups: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.$store.dispatch('FetchGroupedReports', 1)
  },
  methods: {
    changeAllReports(reportState, groupOfReports) {
      console.log(groupOfReports)
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
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    height: 40px;
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
  .reported-status {
    margin-top: 15px;
  }
  @media
  only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
    .header-container {
      display: flex;
      flex-direction: column;
      height: 80px;
    }
  }
</style>
