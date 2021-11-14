import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { get } from 'lodash'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import SessionBadge from './SessionBadge'
import { COURSE_MAKER } from '../../constants/roles'

const SessionBadgeNav = withNav(SessionBadge)({
  titlePath: 'topicTitle',
  activeNavItem: 'Add Sessions',
  showCourseMakerNavigation: true,
  blockType: COURSE_MAKER,
  breadCrumbPath: [{ name: 'Session', route: '/course-sessions/' },
    { path: 'topicTitle', route: '/course-sessions/' },
    { name: 'Badge', route: '/badge/' }]
})

const setTopics = (state, props) => state.data.getIn(['topic', 'data']).toJS().find(topic => topic.id === props.match.params.topicId)


const mapStateToProps = (state, props) => ({
  topicTitle: state.data.getIn(['topic', 'data']) ? get(setTopics(state, props), 'title') : '',
  badges: state.data.getIn(['badges', 'data']),
  badgeFetchingStatus: state.data.getIn(['badges', 'fetchStatus', 'badges']),
  badgesMeta: state.data.getIn(['badgesMeta', 'data', 'count']),
  badgeAddStatus: state.data.getIn(['badges', 'addStatus', 'badges']),
  badgeAddFailure: state.data.getIn(['errors', 'badges/add']),
  badgeUpdateStatus: state.data.getIn(['badges', 'updateStatus', 'badges']),
  badgeUpdateFailure: state.data.getIn(['errors', 'badges/update']),
  badgeDeleteStatus: state.data.getIn(['badges', 'deleteStatus', 'badges']),
  badgeDeleteFailure: state.data.getIn(['errors', 'badges/delete'])
})

const SessionBadgeNavWithExtraProps = injectProps({
  notification,
})(SessionBadgeNav)

export default connect(mapStateToProps)(
  withRouter(SessionBadgeNavWithExtraProps)
)
