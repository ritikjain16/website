import { connect } from 'react-redux'
import withNav from '../../components/withNav'
import Dashboard from './Dashboard'
import fetchDashboard from '../../actions/dashboard/fetchDashboard'
import fetchCourses from '../../actions/Courses/fetchCourses'

const DashboardNav = withNav(Dashboard)({
  title: 'Dashboard',
  activeNavItem: 'Dashboard',
  showCMSNavigation: true,
})

const mapStateToProps = state => ({
  dashboard: state.dashboard,
  hasCoursesFetched: state.course.hasCoursesFetched,
  isFetchingCourse: state.course.isFetchingCourse,
  isFetchingDashboard: state.dashboard.isFetching,
  courses: state.course.courses
})

const mapDispatchToProps = (dispatch) => ({
  fetchCourses: () => dispatch(fetchCourses()),
  fetchDashboard: id => dispatch(fetchDashboard(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav)
