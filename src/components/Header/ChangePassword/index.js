import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import ChangePasswordEmulator from './ChangePasswordEmulator'
import {
  changePassword,
  updateConfirmNewPassword,
  updateOldPassword,
  updateNewPassword,
  updateId,
  updateToken,
  updateHasPasswordChanged
} from '../../../actions/changePassword'
import injectProps from '../../../components/injectProps'

const mapStateToProps = state => state.changePassword

const mapDispatchToProps = dispatch => ({
  changePassword: (id, oldPassword, newPassword) => dispatch(
    changePassword(id, oldPassword, newPassword)
  ),
  updateId: id => dispatch(updateId(id)),
  updateOldPassword: oldPassword => dispatch(updateOldPassword(oldPassword)),
  updateNewPassword: newPassword => dispatch(updateNewPassword(newPassword)),
  updateConfirmNewPassword: confirmNewPassword => dispatch(
    updateConfirmNewPassword(confirmNewPassword)
  ),
  updateToken: token => dispatch(updateToken(token)),
  updateHasPasswordChanged: hasPasswordChange => dispatch(
    updateHasPasswordChanged(hasPasswordChange)
  )
})

const ChangePassWithExtraProps = injectProps({
  notification
})(ChangePasswordEmulator)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangePassWithExtraProps))
