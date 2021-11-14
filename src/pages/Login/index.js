import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import injectProps from '../../components/injectProps'
import { updateUsername, updatePassword, login } from '../../actions/login'
import Login from './Login'

const mapStateToProps = state => state.login

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password)),
  updateUsername: username => dispatch(updateUsername(username)),
  updatePassword: password => dispatch(updatePassword(password))
})

const LoginWithExtraProps = injectProps({
  notification
})(Login)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginWithExtraProps))
