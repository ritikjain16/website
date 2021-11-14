import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, sortBy } from 'lodash'
import { notification } from 'antd'
import { filterKey } from '../../../utils/data-utils'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentTechTalk from './ContentTechTalk'
import { CONTENT_MAKER } from '../../../constants/roles'


const ContentTechTalkNav = withNav(ContentTechTalk)({
  title: 'Tech Talk',
  activeNavItem: 'Learning Objective',
  titlePath: 'topicTitle',
  showContentMakerNavigation: true,
  blockType: CONTENT_MAKER,
  breadCrumbPath: [{ name: 'Learning Objective', route: '/content-learningObjective' },
    { path: 'topicTitle', route: '/content-learningObjective' }, { name: 'Tech Talk', route: '/content-techTalk/' }]
})

const setLearningObjectives = (state, props) =>
  sortBy(state.data.getIn(['learningObjectives', 'data']).toJS(), 'order').find(learningObjective => learningObjective.id === props.match.params.learningObjectiveId)

const mapStateToProps = (state, props) => ({
  messages: filterKey(state.data.getIn(['messages', 'data']), 'messages'),
  messageFetchingStatus: state.data.getIn(['messages', 'fetchStatus', 'messages']),
  topicTitle: setLearningObjectives(state, props) ? get(setLearningObjectives(state, props), 'title') : '',
})

const ContentTechTalkNavWithExtraProps = injectProps({
  notification,
})(ContentTechTalkNav)

export default connect(mapStateToProps)(withRouter(ContentTechTalkNavWithExtraProps))
