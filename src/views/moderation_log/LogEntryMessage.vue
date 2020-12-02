<template>
  <span>
    <component :is="processedHtml"/>
  </span>
</template>

<script>
import ReportLink from './ReportLink'
import UserLink from './UserLink'
import Vue from 'vue'
Vue.component('user-link', UserLink)
Vue.component('report-link', ReportLink)

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
    processedHtml() {
      const html = [...this.message.matchAll(/\@(?<nickname>([\w-]+))/g)].map(res => res.groups.nickname)
        .reduce((acc, nickname) => {
          return acc.replace(`@${nickname}`, `<user-link actor="${nickname}"/>`)
        }, this.message)
      if (this.subject.type === 'report' && this.subject.id) {
        const updatedHtml = [...html.matchAll(/\#(?<reportId>([\w]+))/g)].map(res => res.groups.reportId)
          .reduce((acc, id) => {
            return acc.replace(`#${id}`, `<report-link id="${id}"/>`)
          }, html)
        return {
          template: '<div>' + updatedHtml + '</div>'
        }
      }
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
