<template>
  <router-link
    v-if="propertyExists(actor, 'id')"
    :to="{ name: 'UsersShow', params: { id: actor.id }}"
    class="router-link">
    <span v-if="propertyExists(actor, 'nickname')" style="font-weight: 600">
      @{{ actor.nickname }}
    </span>
  </router-link>
</template>

<script>

export default {
  name: 'UserLink',
  props: {
    actor: {
      type: Object,
      required: true
    }
  },
  methods: {
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>
