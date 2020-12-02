<template>
  <router-link
    :to="{ name: 'UsersShow', params: { id: actor }}"
    class="router-link">
    <span style="font-weight: 600;margin-right: -3px;">
      @{{ actor }}
    </span>
  </router-link>
</template>

<script>

export default {
  name: 'UserLink',
  props: {
    actor: {
      type: String,
      required: true
    }
  }
}
</script>
