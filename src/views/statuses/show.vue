<template>
  <main>
    {{ status }}
    <!-- <status :status="status" :account="status.account" :show-checkbox="false" :godmode="showPrivate"/> -->
  </main>
</template>

<script>
import Status from '@/components/Status'

export default {
  name: 'UsersShow',
  components: { Status },
  data() {
    return {
      showPrivate: false
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    status() {
      return this.$store.state.status.fetchedStatus
    }
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchStatus', this.$route.params.id)
  }
}
</script>
