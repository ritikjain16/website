import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../../actions/login'
import Header from './Header'

const mapStateToProps = state => ({
  name: state.login.name,
  hasLogin: state.login.hasLogin,
  role: state.login.role,
  username: state.login.username
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
