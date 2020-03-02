<template>
  <div v-if="!loadingPeers" class="statuses-container">
    <h1>
      {{ $t('statuses.statuses') }}
    </h1>
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
        :show-checkbox="isDesktop"
        :fetch-statuses-by-instance="true"
        @status-selection="handleStatusSelection" />
    </div>
    <div v-if="statuses.length > 0" class="statuses-pagination">
      <el-button :loading="buttonLoading" @click="handleLoadMore">{{ $t('statuses.loadMore') }}</el-button>
    </div>
  </div>
</template>

<script>
import MultipleUsersMenu from '@/views/users/components/MultipleUsersMenu'
import Status from '@/components/Status'

export default {
  name: 'Statuses',
  components: {
    MultipleUsersMenu,
    Status
  },
  data() {
    return {
      selectedUsers: []
    }
  },
  computed: {
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
    }
  },
  mounted() {
    this.$store.dispatch('FetchPeers')
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
.select-instance {
  width: 350px;
}
.statuses-pagination {
  padding: 15px 0;
  text-align: center;
}
h1 {
  margin: 22px 0 0 0;
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
}
</style>
