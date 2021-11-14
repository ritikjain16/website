import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import SchoolOverviewTable from './SchoolOverviewTable'

const SchoolOverviewTableNav = withNav(SchoolOverviewTable)({
  title: 'School Overview Table',
  activeNavItem: 'School Overview Table',
  showSMSNavigation: true,
})
const mapStateToProps = (state) => (
  {
    fetchSchoolsLoading: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'loading'
    ]),
    fetchSchoolsSuccess: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'success'
    ]),
    fetchSchoolsFailure: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'failure'
    ]),
    fecthErrors: state.data.toJS().errors['schools/fetch'],
    schoolsData: filterKey(
      state.data.getIn([
        'schools',
        'data'
      ]), 'schools'
    ),
    schoolCountSuccess: state.data.getIn([
      'schoolsMeta',
      'fetchStatus',
      'schoolsMeta',
      'success'
    ]),
    schoolCount: state.data.getIn([
      'schoolsMeta',
      'data',
      'count'
    ]),
    deleteSchoolLoading: state.data.getIn([
      'schools',
      'deleteStatus',
      'schools',
      'loading'
    ]),
    deleteSchoolSuccess: state.data.getIn([
      'schools',
      'deleteStatus',
      'schools',
      'success'
    ]),
    deleteSchoolFailure: state.data.getIn([
      'schools',
      'deleteStatus',
      'schools',
      'failure'
    ]),
    deleteErrors: state.data.toJS().errors['schools/delete'],
    addSchoolLoading: state.data.getIn([
      'schools',
      'addStatus',
      'schools',
      'loading'
    ]),
    addSchoolSuccess: state.data.getIn([
      'schools',
      'addStatus',
      'schools',
      'success'
    ]),
    addSchoolFailure: state.data.getIn([
      'schools',
      'addStatus',
      'schools',
      'failure'
    ]),
    addErrors: state.data.toJS().errors['schools/add'],
    updateSchoolLoading: state.data.getIn([
      'schools',
      'updateStatus',
      'schools',
      'loading'
    ]),
    updateSchoolSuccess: state.data.getIn([
      'schools',
      'updateStatus',
      'schools',
      'success'
    ]),
    updateSchoolFailure: state.data.getIn([
      'schools',
      'updateStatus',
      'schools',
      'failure'
    ]),
    updateErrors: state.data.toJS().errors['schools/update'],
    userAddStatus: state.data.getIn(['users', 'addStatus', 'users']),
    userAddFailure: state.data.getIn([
      'errors',
      'users/add'
    ]),
    userUpdateStatus: state.data.getIn(['users', 'updateStatus', 'users']),
    userUpdateFailure: state.data.getIn([
      'errors',
      'users/update'
    ]),
    userDeleteStatus: state.data.getIn(['users', 'deleteStatus', 'users']),
    userDeleteFailure: state.data.getIn([
      'errors',
      'users/delete'
    ]),
    bdUsersfetchingStatus: state.data.getIn(['users', 'fetchStatus', 'bdUsers']),
    bdUsers: filterKey(state.data.getIn(['user', 'data']), 'bdUsers')
  }
)

export default connect(mapStateToProps)(withRouter(SchoolOverviewTableNav))
