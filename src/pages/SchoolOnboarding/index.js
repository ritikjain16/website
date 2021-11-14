import { connect } from 'react-redux'
import { filterKey } from '../../utils/data-utils'
import SchoolOnboarding from './SchoolOnboarding'
import withNav from '../../components/withNav'

const SchoolOnboardingNav = withNav(SchoolOnboarding)({
  title: 'School Onboarding',
  activeNavItem: 'School Onboarding',
  showSMSNavigation: true,
  noPadding: true
})

const mapStateToProps = (state) => ({
  schoolData: filterKey(state.data.getIn(['schools', 'data']), 'school'),
  schoolDashboardCount: state.data.getIn(['schoolDashboardCount', 'data']),
  schoolClassesGrades: state.data.getIn(['schoolClasses', 'data']),
  schoolClassGradesFetchStatus: state.data.getIn(['schoolClasses', 'fetchStatus', 'schoolClasses']),
  schoolClassesAddStatus: state.data.getIn(['schoolClasses', 'addStatus', 'schoolClasses']),
  schoolClassesDeleteStatus: state.data.getIn(['schoolClasses', 'deleteStatus', 'schoolClasses']),
  campaigns: state.data.getIn(['campaigns', 'data']),
  campaignsFetchStatus: state.data.getIn(['campaigns', 'fetchStatus', 'campaigns']),
  campaignsAddStatus: state.data.getIn(['campaigns', 'addStatus', 'campaigns']),
  campaignsUpdateStatus: state.data.getIn(['campaigns', 'updateStatus', 'campaigns']),
  campaignsUpdateBatchStatus: state.data.getIn(['campaigns', 'updateStatus', 'addBatches']),
  campaignsDeleteStatus: state.data.getIn(['campaigns', 'deleteStatus', 'campaigns']),
  parentSignUpStatus: state.data.getIn([
    'parentChildSignUp', 'addStatus', 'addParentSignUp'
  ]),

  courses: state.data.getIn(['course', 'data']),
  courseFetchingStatus: state.data.getIn(['courses', 'fetchStatus', 'courses'])
})


export default connect(mapStateToProps)(SchoolOnboardingNav)

