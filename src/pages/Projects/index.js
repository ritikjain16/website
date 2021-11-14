import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import getTopicTitle from '../../utils/getTopicTitle'
import Projects from './Projects'
import { fetchStickerEmoji } from '../../actions/stickerEmoji'
import { fetchTopics } from '../../actions/episode'

const ProjectNav = withNav(Projects)({
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  noPadding: true,
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'Project', route: '/project/' }]
})

const mapStateToProps = (state, props) => ({
  ...state,
  ...state.stickerEmoji,
  ...state.learningObjectives,
  topicTitle: getTopicTitle(state, props),
  projects: state.data.getIn(['projects', 'data']),
  isProjectsFetching: state.data.getIn([
    'projects',
    'fetchStatus',
    'projects',
    'loading'
  ]),
  isProjectsFetched: state.data.getIn([
    'projects',
    'fetchStatus',
    'projects',
    'success'
  ]),
  projectAddStatus: state.data.getIn([
    'project',
    'addStatus',
    'projects'
  ]),
  projectAddFailure: state.data.getIn([
    'errors',
    'project/add'
  ]),
  projectDeleteStatus: state.data.getIn([
    'project',
    'deleteStatus',
    'projects'
  ]),
  projectDeleteFailure: state.data.getIn([
    'errors',
    'project/delete'
  ]),
  projectUpdateStatus: state.data.getIn([
    'project',
    'updateStatus',
    'projects'
  ]),
  projectUpdateFailure: state.data.getIn([
    'errors',
    'project/update'
  ])
})

const mapDispatchToProps = dispatch => ({
  fetchStickerEmoji: () => dispatch(fetchStickerEmoji()),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
})

const ProjectNavWithExtraProps = injectProps({
  notification,
})(ProjectNav)

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ProjectNavWithExtraProps)
)
