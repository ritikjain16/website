import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withNav from '../../components/withNav'
import TopicAssets from './TopicAssets'
import fetchTopicAssets from '../../actions/topicAssets/fetchTopicAssets'

const TopicAssetsNav = withNav(TopicAssets)({
  title: 'Topic Assets',
  activeNavItem: 'Topics',
  showCMSNavigation: true,
})

const mapStateToProps = state => state.topicAssets

const mapDispatchToProps = (dispatch) => ({
  fetchTopicAssets: (topicId) => dispatch(fetchTopicAssets(topicId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopicAssetsNav))
