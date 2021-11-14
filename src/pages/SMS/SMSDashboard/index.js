import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import SmsDashboard from './SmsDashboard'
import withNav from '../../../components/withNav'
// import { filterKey } from '../../../utils/data-utils'
import injectProps from '../../../components/injectProps'

const SmsDashboardNav = withNav(SmsDashboard)({
  title: 'SMS Dashboard',
  activeNavItem: 'SMS Dashboard',
  showSMSNavigation: true,
})

const mapStateToProps = state => ({
  users: state.data.getIn(['user', 'data']),
  schools: state.data.getIn(['schools', 'data']),
  studentsOfSchool: state.data.getIn(['studentsOfSchool', 'data']),
  studentsOfSchoolCount: state.data.getIn(['studentsOfSchoolCount', 'data', 'count']),
  studentsOfSchoolFetch: state.data.getIn(['studentsOfSchool', 'fetchStatus', 'studentsOfSchool']),
  schoolStudentDataFetchStatus: state.data.getIn(['schoolStudentData', 'fetchStatus']),
  schoolStudentData: state.data.getIn(['schoolStudentData', 'data'])
})

const SmsDashboardNavWithExtraProps = injectProps({
  notification
})(SmsDashboardNav)

export default connect(mapStateToProps)(withRouter(SmsDashboardNavWithExtraProps))
