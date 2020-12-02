<template>
  <span>
    <component :is="processedHtml"/>
    <!-- <span v-if="subject.type === 'report' && propertyExists(subject, 'id')">
      {{ logEntryMessageWithoutId[0] }}
      <router-link
        :to="{ name: 'ReportsShow', params: { id: subject.id }}"
        class="router-link">
        <span style="font-weight: 600">#{{ subject.id }}</span>
      </router-link>
      {{ logEntryMessageWithoutId[1] }}
    </span> -->
  </span>
</template>

<script>
import UserLink from './UserLink'
import Vue from 'vue'
Vue.component('user-link', UserLink)

export default {
  name: 'LogEntryMessage',
  props: {
    actor: {
      type: Object,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    subject: {
      type: [Object, Array],
      required: false,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    // logEntryMessageWithoutId() {
    //   return this.logEntryMessage.split(`#${this.subject.id}`)
    // },
    processedHtml() {
      const html = [...this.message.matchAll(/\@(?<nickname>([\w-]+))/g)].map(res => res.groups.nickname)
        .reduce((acc, nickname) => {
          return acc.replace(`@${nickname}`, `<user-link actor="${nickname}"/>`)
        }, this.message)
      return {
        template: '<div>' + html + '</div>'
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
 .router-link {
    text-decoration: none;
  }
</style>
