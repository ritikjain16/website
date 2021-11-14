import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import injectProps from '../../components/injectProps'
import CodeTags from './ApprovedCodeTags'

const ApprovedCodeTagsNav = withNav(CodeTags)({
  title: 'Tags',
  activeNavItem: 'Tags',
  showCMSNavigation: true,
})

const mapStateToProps = state => ({
  userApprovedCodeTags: filterKey(
    state.data.getIn([
      'userApprovedCodeTags',
      'data'
    ]), 'userApprovedCodeTags'
  ),
  userApprovedCodeTagsCount: state.data.getIn([
    'userApprovedCodeTagsMeta',
    'data',
    'count'
  ]),
  TagsAddedStatus: state.data.getIn(['userApprovedCodeTags', 'addStatus', 'userApprovedCodeTags']),
  TagsUpdateStatus: state.data.getIn(['userApprovedCodeTags', 'updateStatus', 'userApprovedCodeTags']),
  TagsDeleteStatus: state.data.getIn(['userApprovedCodeTags', 'deleteStatus', 'userApprovedCodeTags', 'failure']),
  TagsAddedFailure: state.data.getIn(['errors', 'userApprovedCodeTags/add']),
  TagsDeleteFailure: state.data.getIn(['errors', 'userApprovedCodeTags/delete']),
  isUserApprovedCodeTagsFetching: state.data.getIn([
    'userApprovedCodeTags',
    'fetchStatus',
    'userApprovedCodeTags',
    'loading',
  ]),
  isUserApprovedCodeTagsFetched: state.data.getIn([
    'userApprovedCodeTags',
    'fetchStatus',
    'userApprovedCodeTags',
    'success',
  ]),
  isUserApprovedCodeTagsUpdating: state.data.getIn([
    'userApprovedCodeTags',
    'updateStatus',
    'updateUserApprovedCodeTags'
  ]),
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
  contentTagsCount: state.data.getIn(['contentTagsMeta', 'data', 'count']),
  contentTagAddStatus: state.data.getIn(['contentTag', 'addStatus', 'contentTags']),
  contentTagAddFailure: state.data.getIn(['errors', 'contentTag/add']),
  contentTagUpdateStatus: state.data.getIn(['contentTags', 'updateStatus', 'contentTags']),
  contentTagsDeleteStatus: state.data.getIn(['contentTags', 'deleteStatus', 'contentTags', 'failure']),
  contentTagsDeleteFailure: state.data.getIn(['errors', 'contentTags/delete']),
})

const ApprovedCodeTagsNavWithExtraProps = injectProps({
  notification,
})(ApprovedCodeTagsNav)

export default connect(mapStateToProps)(withRouter(ApprovedCodeTagsNavWithExtraProps))
