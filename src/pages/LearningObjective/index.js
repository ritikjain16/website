import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { sortBy, get } from 'lodash'
import LearningObjective from './LearningObjective'
import {
  fetchLearningObjectives,
  addLearningObjective,
  deleteLearningObjective,
  editLearningObjective,
  editLearningObjectives,
  removeThumbnail,
  removePQStoryImage
} from '../../actions/LearningObjective'
import {
  fetchTopics,
} from '../../actions/episode'
import getTopicTitle from '../../utils/getTopicTitle'

/**
*it creates the route for LearningObjectiveTable and wraps it with withNav HOC
*/
const hasLearningObjectivesFetched = (state, props) => get(state, 'learningObjectives.learningObjectives', [])
  .some(learningObjective => get(learningObjective, 'topics', []).map(topic => get(topic, 'id')).includes(props.match.params.id))

const mapStateToProps = (state, props) => ({
  ...state.learningObjectives,
  learningObjectives: sortBy(
    state.learningObjectives.learningObjectives, 'order'
  ),
  topicTitle: getTopicTitle(state, props),
  hasLoFetched: hasLearningObjectivesFetched(state, props)
})

const mapDispatchToProps = (dispatch) => ({
  fetchLearningObjectives: (topicId) => dispatch(fetchLearningObjectives(topicId)),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
  addLearningObjective: (input) => dispatch(addLearningObjective(input)),
  deleteLearningObjective: (id) => dispatch(deleteLearningObjective(id)),
  editLearningObjective: (input) => dispatch(editLearningObjective(input)),
  editLearningObjectives: (input) => dispatch(editLearningObjectives(input)),
  removeThumbnail: (learningObjectiveId, thumbnailId) => dispatch(
    removeThumbnail(learningObjectiveId, thumbnailId)),
  removePQStoryImage: (learningObjectiveId, thumbnailId) => dispatch(
    removePQStoryImage(learningObjectiveId, thumbnailId)),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LearningObjective))
