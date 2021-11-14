import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, isEqual } from 'lodash'
import LearningObjectiveTable from './components/LearningObjectiveTable'
import withNav from '../../components/withNav'
import toastrMessage from '../../utils/messages'
import { getDataById } from '../../utils/data-utils'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'

class LOPage extends Component {
  state = {
    learningObjectives: []
  }

  async componentDidMount() {
    const topicId = this.props.match.params.id
    const { fetchLearningObjectives, fetchTopics } = this.props
    if (!this.props.hasLoFetched) {
      fetchLearningObjectives(topicId)
      fetchTopics(topicId)
    }
    if (this.props.hasLoFetched) {
      this.setLearningObjectives(this.props.learningObjectives)
    }
  }

  setLearningObjectives = learningObjectives => {
    this.setState({
      learningObjectives: learningObjectives
        .filter(learningObjective =>
          get(learningObjective, 'topics', []).map(topic => get(topic, 'id')).includes(this.props.match.params.id))
    })
  }

  onCancel = () => {
    this.setLearningObjectives(this.props.learningObjectives)
  }

  onSave = async () => {
    const input = this.state.learningObjectives.map((learningObjective, index) => ({
      id: learningObjective.id,
      fields: {
        order: index + 1
      }
    }))
    this.props.editLearningObjectives(input)
  }

  componentDidUpdate(prevProps) {
    const {
      fetchingLearningobjectivesError,
      addingLearningobjectiveError,
      deletingLearningobjectiveError,
      editingLearningobjectiveError } = this.props
    toastrMessage(fetchingLearningobjectivesError, prevProps.fetchingLearningobjectivesError, 'error', fetchingLearningobjectivesError)
    toastrMessage(addingLearningobjectiveError, prevProps.addingLearningobjectiveError, 'error', addingLearningobjectiveError)
    toastrMessage(deletingLearningobjectiveError, prevProps.deletingLearningobjectiveError, 'error', deletingLearningobjectiveError)
    toastrMessage(editingLearningobjectiveError, prevProps.editingLearningobjectiveError, 'error', editingLearningobjectiveError)
    if (!isEqual(prevProps.learningObjectives, this.props.learningObjectives)) {
      this.setLearningObjectives(this.props.learningObjectives)
    }
  }

  publishLearningObjective = id => () => {
    const { editLearningObjective, learningObjectives } = this.props
    const learningObjective = getDataById(learningObjectives, id)
    const { title, order } = learningObjective
    editLearningObjective({
      id,
      title,
      order,
      status: PUBLISHED_STATUS
    })
  }

  unPublishLearningObjective = id => () => {
    const { editLearningObjective, learningObjectives } = this.props
    const learningObjective = getDataById(learningObjectives, id)
    const { title, order } = learningObjective
    editLearningObjective({
      id,
      title,
      order,
      status: UNPUBLISHED_STATUS
    })
  }

  render() {
    return (
      <div style={{ padding: '0 10px' }}>
        <LearningObjectiveTable
          loLength={this.state.learningObjectives.length}
          setLearningObjectives={this.setLearningObjectives}
          learningObjectives={this.state.learningObjectives}
          isFetchingLearningobjective={this.props.isFetchingLearningobjective}
          isAddingLearningobjective={this.props.isAddingLearningobjective}
          addLearningObjective={this.props.addLearningObjective}
          deleteLearningObjective={this.props.deleteLearningObjective}
          editLearningObjective={this.props.editLearningObjective}
          topicConnectId={this.props.match.params.id}
          hasLearningobjectivesFetched={this.props.hasLearningobjectivesFetched}
          fetchingLearningobjectivesError={this.props.fetchingLearningobjectivesError}
          deletingLearningobjectiveId={this.props.deletingLearningobjectiveId}
          publishLearningObjective={this.publishLearningObjective}
          unPublishLearningObjective={this.unPublishLearningObjective}
          onCancel={this.onCancel}
          onSave={this.onSave}
          removeThumbnail={this.props.removeThumbnail}
          removePQStoryImage={this.props.removePQStoryImage}
        />
      </div>
    )
  }
}
LOPage.defaultProps = {
  fetchingLearningobjectivesError: null,
  addingLearningobjectiveError: null,
  deletingLearningobjectiveError: null,
  editingLearningobjectiveError: null,
}
LOPage.propTypes = {
  learningObjectives: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  setLearningObjectives: PropTypes.func.isRequired,
  isFetchingLearningobjective: PropTypes.bool.isRequired,
  isAddingLearningobjective: PropTypes.bool.isRequired,
  fetchLearningObjectives: PropTypes.func.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  hasLearningobjectivesFetched: PropTypes.bool.isRequired,
  addLearningObjective: PropTypes.func.isRequired,
  deleteLearningObjective: PropTypes.func.isRequired,
  editLearningObjective: PropTypes.func.isRequired,
  fetchingLearningobjectivesError: PropTypes.string,
  addingLearningobjectiveError: PropTypes.string,
  deletingLearningobjectiveError: PropTypes.string,
  editingLearningobjectiveError: PropTypes.string,
  deletingLearningobjectiveId: PropTypes.string.isRequired,
  editLearningObjectives: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  hasLoFetched: PropTypes.bool.isRequired,
  removeThumbnail: PropTypes.func.isRequired,
  removePQStoryImage: PropTypes.func.isRequired
}

export default withNav(LOPage)({
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  noPadding: true,
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' }]
})
