import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import Badges from './Badges'
import withNav from '../../components/withNav'
import { fetchBadgesByTopic, addBadge, deleteBadge, updateBadge, removeActiveImage, removeInactiveImage } from '../../actions/badges'
import { getDataByProp } from '../../utils/data-utils'

const mapStateToProps = (state, props) => ({
  // filter badges by topic id
  badges: { ...state.badge, badges: getDataByProp(state.badge.badges, 'topic.id', props.match.params.id).sort((a, b) => a.order - b.order) },
  topicTitle: get(getDataByProp(state.badge.badges, 'topic.id', props.match.params.id), '[0].topic.title')
})

const mapDispatchToProps = dispatch => ({
  fetchBadges: (topicId) => dispatch(fetchBadgesByTopic(topicId)),
  addBadge: (input) =>
    dispatch(addBadge(input)),
  deleteBadge: (id) => dispatch(deleteBadge(id)),
  editBadge: (input) =>
    dispatch(updateBadge(input)),
  removeActiveImage: (badgeId, thumbnailId) => dispatch(removeActiveImage(badgeId, thumbnailId)),
  removeInactiveImage: (badgeId, thumbnailId) =>
    dispatch(removeInactiveImage(badgeId, thumbnailId)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withNav(Badges)({ titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'Badges', route: '/badges/' }] })))

