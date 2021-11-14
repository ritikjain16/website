import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import injectProps from '../../components/injectProps'
import CodeApproval from './CodeApproval'

const CodeApprovalNav = withNav(CodeApproval)({
  title: 'Code Approval',
  activeNavItem: 'Code Approval',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  userSavedCodes: filterKey(
    state.data.getIn([
      'userSavedCodes',
      'data'
    ]), 'userSavedCodes'
  ),
  userApprovedCodeTags: filterKey(
    state.data.getIn([
      'userApprovedCodeTags',
      'data'
    ]), 'userApprovedCodeTags'
  ),
  userSavedCodesCount: state.data.getIn([
    'userSavedCodesMeta',
    'data',
    'count'
  ]),
  salesOperation: state.data.getIn([
    'salesOperation',
    'data'
  ]),
  isSalesOperationFetching: state.data.getIn([
    'salesOperation',
    'fetchStatus',
    'convertedUser',
    'loading'
  ]),
  isUserSavedCodeFetching: state.data.getIn([
    'userSavedCodes',
    'fetchStatus',
    'userSavedCodes',
    'loading',
  ]),
  isUserSavedCodeFetched: state.data.getIn([
    'userSavedCodes',
    'fetchStatus',
    'userSavedCodes',
    'success',
  ]),
  isUserSavedCodeUpdating: state.data.getIn([
    'userSavedCodes',
    'updateStatus',
    'updateUserSavedCodes'
  ]),
  isUserApprovedCodeUpdating: state.data.getIn([
    'updateUserApprovedCode',
    'updateStatus',
    'updateUserApprovedCode'
  ])
})

const CodeApprovalNavWithExtraProps = injectProps({
  notification,
})(CodeApprovalNav)

export default connect(mapStateToProps)(withRouter(CodeApprovalNavWithExtraProps))
