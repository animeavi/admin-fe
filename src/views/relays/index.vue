<template>
  <div v-if="!loading" class="relays-container">
    <div class="relays-header-container">
      <h1>
        {{ $t('relays.relays') }}
      </h1>
      <reboot-button/>
    </div>
    <div class="follow-relay-container">
      <el-input v-model="newRelay" :placeholder="$t('relays.followRelay')" class="follow-relay" @keyup.enter.native="followRelay"/>
      <el-button @click.native="followRelay">{{ $t('relays.follow') }}</el-button>
    </div>
    <el-table :data="relays">
      <el-table-column
        :label="$t('relays.instanceUrl')"
        prop="actor"/>
      <el-table-column
        :label="$t('relays.followedBack')"
        :width="getLabelWidth"
        prop="followed_back"
        align="center">
        <template slot-scope="scope">
          <i :class="scope.row.followed_back ? 'el-icon-check' : 'el-icon-minus'"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" :width="getLabelWidth" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native="deleteRelay(scope.row.actor)">
            {{ $t('table.unfollow') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import RebootButton from '@/components/RebootButton'

export default {
  name: 'Relays',
  components: { RebootButton },
  data() {
    return {
      newRelay: ''
    }
  },
  computed: {
    getLabelWidth() {
      return this.isDesktop ? '130px' : '85px'
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    loading() {
      return this.$store.state.relays.loading
    },
    relays() {
      return this.$store.state.relays.fetchedRelays
    }
  },
  mounted() {
    this.$store.dispatch('FetchRelays')
  },
  methods: {
    followRelay() {
      this.$store.dispatch('AddRelay', this.newRelay)
      this.newRelay = ''
    },
    deleteRelay(relay) {
      this.$store.dispatch('DeleteRelay', relay)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include relays
</style>
