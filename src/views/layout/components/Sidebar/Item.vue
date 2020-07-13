<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    count: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { count, icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)} </span>)
    }

    if (count) {
      vnodes.push(<span slot='title'>({(count)})</span>)
    }
    return vnodes
  }
}
</script>
