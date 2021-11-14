const getTopicTitle = (state, props) => {
  const { episodes } = state.episode
  let topicTitle = ''
  const topicId = props.match.params.id || props.match.params.topicId
  episodes.forEach((topic) => {
    if (topic.id === topicId) {
      topicTitle = topic.title
    }
  })
  return topicTitle
}

export default getTopicTitle
