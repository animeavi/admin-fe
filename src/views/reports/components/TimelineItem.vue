<template>
  <el-timeline-item :timestamp="parseTimestamp(report.created_at)" placement="top" class="timeline-item-container">
    <el-card>
      <div class="header-container">
        <div>
          <h3 class="report-title">Report on {{ report.account.display_name }}</h3>
          <h5 class="id">ID: {{ report.id }}</h5>
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
          <el-dropdown trigger="click">
            <el-button plain size="small" icon="el-icon-files">{{ $t('reports.moderateUser') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="showDeactivatedButton(report.account)"
                @click.native="toggleActivation(report.account)">
                {{ report.account.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="showDeactivatedButton(report.account.id)"
                @click.native="handleDeletion(report.account.id)">
                {{ $t('users.deleteAccount') }}
              </el-dropdown-item>
              <el-dropdown-item
                :divided="true"
                :class="{ 'active-tag': report.account.tags.includes('force_nsfw') }"
                @click.native="toggleTag(report.account, 'force_nsfw')">
                {{ $t('users.forceNsfw') }}
                <i v-if="report.account.tags.includes('force_nsfw')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': report.account.tags.includes('strip_media') }"
                @click.native="toggleTag(report.account, 'strip_media')">
                {{ $t('users.stripMedia') }}
                <i v-if="report.account.tags.includes('strip_media')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': report.account.tags.includes('force_unlisted') }"
                @click.native="toggleTag(report.account, 'force_unlisted')">
                {{ $t('users.forceUnlisted') }}
                <i v-if="report.account.tags.includes('force_unlisted')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                :class="{ 'active-tag': report.account.tags.includes('sandbox') }"
                @click.native="toggleTag(report.account, 'sandbox')">
                {{ $t('users.sandbox') }}
                <i v-if="report.account.tags.includes('sandbox')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="report.account.local"
                :class="{ 'active-tag': report.account.tags.includes('disable_remote_subscription') }"
                @click.native="toggleTag(report.account, 'disable_remote_subscription')">
                {{ $t('users.disableRemoteSubscription') }}
                <i v-if="report.account.tags.includes('disable_remote_subscription')" class="el-icon-check"/>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="report.account.local"
                :class="{ 'active-tag': report.account.tags.includes('disable_any_subscription') }"
                @click.native="toggleTag(report.account, 'disable_any_subscription')">
                {{ $t('users.disableAnySubscription') }}
                <i v-if="report.account.tags.includes('disable_any_subscription')" class="el-icon-check"/>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <div class="line"/>
        <span class="report-row-key">Account:</span>
        <img
          :src="report.account.avatar"
          alt="avatar"
          class="avatar-img">
        <a :href="report.account.url" target="_blank" class="account">
          <span class="report-row-value">{{ report.account.acct }}</span>
        </a>
      </div>
      <div v-if="report.content.length > 0">
        <div class="line"/>
        <span class="report-row-key">Content:
          <span class="report-row-value">{{ report.content }}</span>
        </span>
      </div>
      <div>
        <div class="line"/>
        <span class="report-row-key">Actor:</span>
        <img
          :src="report.actor.avatar"
          alt="avatar"
          class="avatar-img">
        <a :href="report.actor.url" target="_blank" class="account">
          <span class="report-row-value">{{ report.actor.acct }}</span>
        </a>
      </div>
      <div v-if="report.statuses.length > 0" class="statuses">
        <el-collapse>
          <statuses :report="report"/>
        </el-collapse>
      </div>
    </el-card>
  </el-timeline-item>
</template>

<script>
import moment from 'moment'
import Statuses from './Statuses'

export default {
  name: 'TimelineItem',
  components: { Statuses },
  props: {
    report: {
      type: Object,
      required: true
    }
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
    handleDeletion(user) {
      this.$store.dispatch('DeleteUsers', [user])
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('L HH:mm')
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleActivation(user) {
      user.deactivated
        ? this.$store.dispatch('ActivateUsers', [user])
        : this.$store.dispatch('DeactivateUsers', [user])
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag })
        : this.$store.dispatch('AddTag', { users: [user], tag })
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
