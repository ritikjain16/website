import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import getTopicTitle from '../../utils/getTopicTitle'
import { fetchStickerEmoji } from '../../actions/stickerEmoji'
import { fetchTopics } from '../../actions/episode'
import WorkBook from './Workbook'

const WorkBookNav = withNav(WorkBook)({
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  noPadding: true,
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'Workbook', route: '/workbook/' }]
})

const mapStateToProps = (state, props) => ({
  ...state,
  ...state.stickerEmoji,
  topicTitle: getTopicTitle(state, props),
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
  workbooks: state.data.getIn(['workbooks', 'data']),
  workbookCount: state.data.getIn(['workbooksMeta', 'data']),
  isWorkbookFetching: state.data.getIn([
    'workbooks',
    'fetchStatus',
    'workbooks',
    'loading'
  ]),
  isWorkbookFetched: state.data.getIn([
    'workbooks',
    'fetchStatus',
    'workbooks',
    'success'
  ]),
  workbookAddStatus: state.data.getIn([
    'workbook',
    'addStatus',
    'workbooks'
  ]),
  workbookAddFailure: state.data.getIn([
    'errors',
    'workbook/add'
  ]),
  workbookUpdateStatus: state.data.getIn([
    'workbook',
    'updateStatus',
    'workbooks'
  ]),
  workbookUpdateFailure: state.data.getIn([
    'errors',
    'workbook/update'
  ]),
  workbookDeleteStatus: state.data.getIn([
    'workbook',
    'deleteStatus',
    'workbooks'
  ]),
  workbookDeleteFailure: state.data.getIn([
    'errors',
    'workbook/delete'
  ])
})

const mapDispatchToProps = dispatch => ({
  fetchStickerEmoji: () => dispatch(fetchStickerEmoji()),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
})

const WorkBookNavWithExtraProps = injectProps({
  notification,
})(WorkBookNav)

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(WorkBookNavWithExtraProps)
)
