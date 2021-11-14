import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import UserProfilePage from './UserProfilePage'
import withNav from '../../components/withNav'

const mapStateToProps = state => ({
  userProfile: state.data.getIn([
    'userProfile',
    'data'
  ]),
  userFetchStatus: state.data.getIn([
    'userProfile',
    'fetchStatus'
  ]),
  profileUpdateStatus: state.data.getIn([
    'userProfile',
    'updateStatus'
  ]),
  mentorProfile: state.data.getIn([
    'mentorProfile',
    'data'
  ])
})
const mapDispatchToProps = () => ({})

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps
)(withNav(UserProfilePage)({
  title: 'User Profile',
  activeNavItem: 'UserProfilePage',
  showUMSNavigation: true,
  showTypeSelector: false
})
))
