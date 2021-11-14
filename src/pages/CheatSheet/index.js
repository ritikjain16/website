import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import CheatSheet from './CheatSheet'
import getTopicTitle from '../../utils/getTopicTitle'
import { fetchStickerEmoji } from '../../actions/stickerEmoji'
import { addCheatSheetContent } from '../../actions/cheatSheet'
import { fetchTopics } from '../../actions/episode'

const CheatSheetNav = withNav(CheatSheet)({
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  noPadding: true,
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'CheatSheet', route: '/cheatSheet/' }]
})

const mapStateToProps = (state, props) => ({
  ...state,
  ...state.stickerEmoji,
  ...state.learningObjectives,
  topicTitle: getTopicTitle(state, props),
  cheatSheets: state.data.getIn(['cheatSheets', 'data']),
  isCheatsFetching: state.data.getIn(['cheatSheets', 'fetchStatus', 'cheatSheets', 'loading']),
  isCheatsFetched: state.data.getIn(['cheatSheets', 'fetchStatus', 'cheatSheets', 'success']),
  conceptAddStatus: state.data.getIn(['cheatSheet', 'addStatus', 'cheatSheets']),
  conceptUpdateStatus: state.data.getIn(['cheatSheet', 'updateStatus', 'cheatSheets']),
  conceptUpdateFailure: state.data.getIn([
    'errors',
    'cheatSheet/update'
  ]),
  conceptAddFailure: state.data.getIn([
    'errors',
    'cheatSheet/add'
  ]),
  cheatSheetDeleteStatus: state.data.getIn(['cheatSheet', 'deleteStatus', 'cheatSheets']),
  cheatSheetDeleteFailure: state.data.getIn(['errors', 'cheatSheet/delete']),
  singleCheat: state.data.getIn(['cheatSheet']),
  contentTags: state.data.getIn(['contentTags', 'data']),
  isContentTagsFetching: state.data.getIn([
    'contentTags',
    'fetchStatus',
    'contentTags',
    'loading'
  ]),
  isContentTagsFetched: state.data.getIn([
    'contentTags',
    'fetchStatus',
    'contentTags',
    'success'
  ]),
})

const mapDispatchToProps = dispatch => ({
  fetchStickerEmoji: () => dispatch(fetchStickerEmoji()),
  addCheatSheetContent: (input) => dispatch(addCheatSheetContent(input)),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
})

const CheatSheetNavWithExtraProps = injectProps({
  notification,
})(CheatSheetNav)

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(CheatSheetNavWithExtraProps)
)
