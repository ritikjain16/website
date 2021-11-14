import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import BDEManagementPage from './BDEManagement'
import { filterKey } from '../../../utils/data-utils'

const BDEManagement = withNav(BDEManagementPage)({
  title: 'BDE Management',
  activeNavItem: 'BDE Management',
  showSMSNavigation: true,
})

const mapStateToProps = (state) => ({
  bdProfileFetchStatus: state.data.getIn(['bdeProfiles', 'fetchStatus', 'bdeProfiles']),
  bdProfileData: filterKey(state.data.getIn(['bdeProfiles', 'data']), 'bdeProfiles'),
  bdUserProfileMeta: state.data.getIn(['bdeProfilesMeta', 'data', 'count']),
  schoolFetchingStatus: state.data.getIn(['schools', 'fetchStatus', 'schools']),
  schoolsData: state.data.getIn(['schools', 'data']),
  bdProfileUpdatingStatus: state.data.getIn(['bdeProfiles', 'updateStatus', 'bdeProfiles']),
  bdProfileUpdateFailure: state.data.getIn(['errors', 'bdeProfiles/update']),
})

const BDEManagementWithExtraProps = injectProps({
  notification,
})(BDEManagement)

export default connect(mapStateToProps)(
  withRouter(BDEManagementWithExtraProps)
)
