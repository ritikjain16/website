import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { notification } from 'antd'
import { filterKey } from '../../utils/data-utils'
import EditApprovedCode from './EditApprovedCode'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'

const EditApprovedCodeNav = withNav(EditApprovedCode)({
  title: 'Edit Approved Code',
  activeNavItem: 'Code Approval',
  shouldBack: false,
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

const EditApprovedCodeNavWithExtraProps = injectProps({
  notification
})(EditApprovedCodeNav)

export default connect(mapStateToProps)(withRouter(EditApprovedCodeNavWithExtraProps))
