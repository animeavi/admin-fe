<template>
  <div v-if="!loadingPeers" class="statuses-container">
    <div class="statuses-header">
      <h1>
        {{ $t('statuses.statuses') }}
      </h1>
      <reboot-button/>
    </div>
    <div class="statuses-header-container">
      <el-button-group>
        <el-button plain>{{ $t('statuses.direct') }}: {{ statusVisibility.direct }}</el-button>
        <el-button plain>{{ $t('statuses.private') }}: {{ statusVisibility.private }}</el-button>
        <el-button plain>{{ $t('statuses.public') }}: {{ statusVisibility.public }}</el-button>
        <el-button plain>{{ $t('statuses.unlisted') }}: {{ statusVisibility.unlisted }}</el-button>
      </el-button-group>
    </div>
    <div class="filter-container">
      <el-select
        v-model="selectedInstance"
        :placeholder="$t('statuses.instanceFilter')"
        :no-data-text="$t('statuses.noInstances')"
        filterable
        clearable
        class="select-instance"
        @change="handleFilterChange">
        <el-option
          v-for="(instance,index) in instances"
          :key="index"
          :label="instance"
          :value="instance"/>
      </el-select>
      <multiple-users-menu
        :selected-users="selectedUsers"
        @apply-action="clearSelection"/>
    </div>
    <div v-if="currentInstance" class="checkbox-container">
      <el-checkbox v-model="showLocal" class="show-private-statuses">
        {{ $t('statuses.onlyLocalStatuses') }}
      </el-checkbox>
      <el-checkbox v-model="showPrivate" class="show-private-statuses">
        {{ $t('statuses.showPrivateStatuses') }}
      </el-checkbox>
    </div>
    <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
    <div v-for="status in statuses" :key="status.id" class="status-container">
      <status
        :status="status"
        :account="status.account"
        :show-checkbox="isDesktop"
        :fetch-statuses-by-instance="true"
        @status-selection="handleStatusSelection" />
    </div>
    <div v-if="statuses.length > 0" class="statuses-pagination">
      <el-button v-if="!allLoaded" :loading="buttonLoading" @click="handleLoadMore">{{ $t('statuses.loadMore') }}</el-button>
      <el-button v-else icon="el-icon-check" circle/>
    </div>
  </div>
</template>

<script>
import MultipleUsersMenu from '@/views/users/components/MultipleUsersMenu'
import Status from '@/components/Status'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'Statuses',
  components: {
    MultipleUsersMenu,
    RebootButton,
    Status
  },
  data() {
    return {
      selectedUsers: []
    }
  },
  computed: {
    allLoaded() {
      return this.$store.state.status.statusesByInstance.allLoaded
    },
    buttonLoading() {
      return this.$store.state.status.statusesByInstance.buttonLoading
    },
    currentInstance() {
      return this.selectedInstance === this.$store.state.user.authHost
    },
    instances() {
      return [this.$store.state.user.authHost, ...this.$store.state.peers.fetchedPeers]
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    loadingPeers() {
      return this.$store.state.peers.loading
    },
    page() {
      return this.$store.state.status.statusesByInstance.page
    },
    pageSize() {
      return this.$store.state.status.statusesByInstance.pageSize
    },
    selectedInstance: {
      get() {
        return this.$store.state.status.statusesByInstance.selectedInstance
      },
      set(instance) {
        this.$store.dispatch('HandleFilterChange', instance)
      }
    },
    showLocal: {
      get() {
        return this.$store.state.status.statusesByInstance.showLocal
      },
      set(value) {
        this.$store.dispatch('HandleLocalCheckboxChange', value)
      }
    },
    showPrivate: {
      get() {
        return this.$store.state.status.statusesByInstance.showPrivate
      },
      set(value) {
        this.$store.dispatch('HandleGodmodeCheckboxChange', value)
      }
    },
    statuses() {
      return this.$store.state.status.fetchedStatuses
    },
    statusVisibility() {
      return this.$store.state.status.statusVisibility
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchPeers')
    this.$store.dispatch('FetchStatusesCount')
  },
  destroyed() {
    this.$store.dispatch('ClearState')
  },
  methods: {
    handleFilterChange() {
      this.$store.dispatch('HandlePageChange', 1)
      this.$store.dispatch('FetchStatusesByInstance')
    },
    handleLoadMore() {
      this.$store.dispatch('HandlePageChange', this.page + 1)

      this.$store.dispatch('FetchStatusesPageByInstance')
    },
    clearSelection() {
      this.selectedUsers = []
    },
    handleStatusSelection(user) {
      if (this.selectedUsers.find(selectedUser => user.id === selectedUser.id) !== undefined) {
        return
      }
      this.selectedUsers = [...this.selectedUsers, user]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.statuses-container {
  padding: 0 15px;
  h1 {
    margin: 10px 0 15px 0;
  }
  .status-container {
    margin: 0 0 10px;
  }
}
.checkbox-container {
  margin-bottom: 15px;
}
.filter-container {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  margin: 22px 0 15px 0;
}
.reboot-button {
  padding: 10px;
  margin: 0;
  width: 145px;
}
.select-instance {
  width: 396px;
}
.statuses-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statuses-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statuses-pagination {
  padding: 15px 0;
  text-align: center;
}

@media only screen and (max-width:480px) {
  .checkbox-container {
    margin-bottom: 10px;
  }
  .filter-container {
    display: flex;
    height: 36px;
    flex-direction: column;
    margin: 10px 0;
  }
  .select-field {
    width: 100%;
    margin-bottom: 5px;
  }
  .select-instance {
    width: 100%;
  }
  .statuses-header-container {
    flex-direction: column;
    align-items: flex-start;
    .el-button {
      padding: 10px 6.5px;
    }
    .reboot-button {
      margin: 10px 0 0 0;
    }
  }
}
</style>
