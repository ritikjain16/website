import withNav from '../../components/withNav'
import UserDashboard from './UserDashboard'

const UserDashboardNav = withNav(UserDashboard)({
  title: 'Dashboard',
  hideSideNavItems: true,
  showTypeSelector: false
})

export default UserDashboardNav
