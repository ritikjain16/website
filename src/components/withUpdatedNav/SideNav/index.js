import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SideNav from './SideNav'
import { filterKey } from '../../../utils/data-utils'

const mapStateToProps = state => ({
  name: state.login.name,
  hasLogin: state.login.hasLogin,
  role: state.login.role,
  mentors: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  username: state.login.username,
  userProfile: state.data.getIn([
    'userProfile',
    'data'
  ]),
  mentorProfile: state.data.getIn([
    'mentorProfile',
    'data'
  ])
})

export default connect(mapStateToProps)(withRouter(SideNav))
