import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { sortBy, get } from 'lodash'
import withNav from '../../components/withNav'
import Episode from './Episode'
import {
  fetchTopics,
  addVideoTopic,
  removeVideoTopic,
  addVideoSubtitleTopic,
  removeVideoSubtitleTopic,
  addVideoThumbnailTopic,
  removeVideoThumbnailTopic,
  editTopicVideoMeta,
  addLearningObjectiveVideoThumbnail,
  removeLearningObjectiveVideoThumbnail,
  updateBulletPoints,
} from '../../actions/episode'
import { fetchLearningObjectives, editLearningObjectives } from '../../actions/LearningObjective'
import getTopicTitle from '../../utils/getTopicTitle'
import addStoryVideoThumbnail from '../../actions/episode/addStoryVideoThumbnail'
import removeStoryVideoThumbnail from '../../actions/episode/removeStoryVideoThumbnail'

const VideoWithNav = withNav(Episode)({
  /* eslint-disable indent */
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' }, { path: 'topicTitle', route: '/learning-objectives/' }, { name: 'Episode', route: '/episode/' }]
})

/**
 *it checks whether lo is present in the state for the selected topic
 */
const hasLearningObjectivesFetched = (state, props) =>
  get(state, 'learningObjectives.learningObjectives', [])
    .some(learningObjective =>
      get(learningObjective, 'topics', []).map(topic => get(topic, 'id')).includes(props.match.params.id))


/**
 *setting ordered learning objective for the topic id
 */
const setLearningObjectives = (state, props) =>
  sortBy(state.learningObjectives.learningObjectives, 'order').filter(learningObjective =>
    get(learningObjective, 'topics', []).map(topic => get(topic, 'id')).includes(props.match.params.id))

const mapStateToProps = (state, props) => ({
  ...state.episode,
  ...state.learningObjectives,
  topicTitle: getTopicTitle(state, props),
  learningObjectives: setLearningObjectives(state, props),
  hasLoFetched: hasLearningObjectivesFetched(state, props)
})
const mapDispatchToProps = dispatch => ({
  fetchTopics: topicId => dispatch(fetchTopics(topicId)),
  addVideoTopic: (file, topicId) => dispatch(addVideoTopic(file, topicId)),
  removeVideoTopic: (topicId, videoId) =>
    dispatch(removeVideoTopic(topicId, videoId)),
  addVideoSubtitleTopic: (file, topicId) => dispatch(addVideoSubtitleTopic(file, topicId)),
  removeVideoSubtitleTopic: (topicId, subtitleId) =>
    dispatch(removeVideoSubtitleTopic(topicId, subtitleId)),
  addVideoThumbnailTopic: (file, topicId) => dispatch(addVideoThumbnailTopic(file, topicId)),
  removeVideoThumbnailTopic: (topicId, thumbnailId) =>
    dispatch(removeVideoThumbnailTopic(topicId, thumbnailId)),
  fetchLearningObjectives: (topicId) => dispatch(fetchLearningObjectives(topicId)),
  editLearningObjectives: (learningObjectives) =>
    dispatch(editLearningObjectives(learningObjectives)),
  editTopicVideoMeta: data => dispatch(editTopicVideoMeta(data)),
  updateBulletPoints: data => dispatch(updateBulletPoints(data)),
  removeLearningObjectiveVideoThumbnail: (learningObjectiveId, thumbnailId) =>
    dispatch(removeLearningObjectiveVideoThumbnail(learningObjectiveId, thumbnailId)),
  addLearningObjectiveVideoThumbnail: (file, learningObjectiveId) =>
    dispatch(addLearningObjectiveVideoThumbnail(file, learningObjectiveId)),
  removeStoryVideoThumbnail: (topicId, thumbnailId) =>
    dispatch(removeStoryVideoThumbnail(topicId, thumbnailId)),
  addStoryVideoThumbnail: (file, topicId) =>
    dispatch(addStoryVideoThumbnail(file, topicId)),
  updateLO: (lo) => dispatch({
    type: 'UPDATE_LO',
    lo
  }),
  updateEpisode: (episode) => dispatch({
    type: 'UPDATE_EPISODE_TIME',
    episode
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VideoWithNav))
