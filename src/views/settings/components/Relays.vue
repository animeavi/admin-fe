<template>
  <div v-if="!loading" class="relays-container">
    <div class="follow-relay-container">
      <el-input v-model="newRelay" :placeholder="$t('settings.followRelay')" class="follow-relay" @keyup.enter.native="followRelay"/>
      <el-button type="primary" @click.native="followRelay">{{ $t('settings.follow') }}</el-button>
    </div>
    <el-table :data="relays">
      <el-table-column
        :label="$t('settings.instanceUrl')"
        prop="actor"/>
      <el-table-column
        :label="$t('settings.followedBack')"
        prop="followed_back"
        width="120"
        align="center">
        <template slot-scope="scope">
          <i :class="scope.row.followed_back ? 'el-icon-check' : 'el-icon-minus'"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native="deleteRelay(scope.row.actor)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Relays',
  data() {
    return {
      newRelay: ''
    }
  },
  computed: {
    relays() {
      return this.$store.state.relays.fetchedRelays
    },
    loading() {
      return this.$store.state.relays.loading
    }
  },
  mounted() {
    this.$store.dispatch('FetchRelays')
  },
  methods: {
    followRelay() {
      this.$store.dispatch('AddRelay', this.newRelay)
    },
    deleteRelay(relay) {
      this.$store.dispatch('DeleteRelay', relay)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
