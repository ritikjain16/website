import React from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ChangePasswordModal from './ChangePassword.style'
import ChangePasswordForm from './component/ChangePasswordForm'
import { loadStateFromLocalStorage } from '../../../utils/localStorage'

const passwordChangedSuccessMsg = 'Password changed!'

class ChangePasswordEmulator extends React.Component {
  componentDidMount() {
    const savedState = loadStateFromLocalStorage()
    const savedId = get(savedState, 'login.id')
    const savedToken = get(savedState, 'login.token')
    const { updateId, updateToken } = this.props
    updateId(savedId)
    updateToken(savedToken)
  }

  componentDidUpdate(previousProps) {
    const { error,
      notification,
      hasChangedPassword,
      updateOldPassword,
      updateNewPassword,
      updateConfirmNewPassword,
      updateHasPasswordChanged } = this.props
    if (error !== null && error !== '') {
      if (error !== previousProps.error) {
        notification.error({
          message: error
        })
      }
    } else if (hasChangedPassword) {
      notification.success({
        message: passwordChangedSuccessMsg
      })
      updateOldPassword('')
      updateNewPassword('')
      updateConfirmNewPassword('')
      updateHasPasswordChanged(false)
    }
  }

  handleChangePassword = async () => {
    const { id, oldPassword, newPassword, changePassword } = this.props
    await changePassword(id, oldPassword, newPassword)
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        style={{ top: 10 }}
        onCancel={this.props.onCancel}
        footer={[
          <ChangePasswordModal.Button type='primary' onClick={this.props.onCancel}>
                        OK
          </ChangePasswordModal.Button>
                ]}
      >
        <ChangePasswordModal>
          <ChangePasswordModal.Head>
            <ChangePasswordModal.CircleBG />
            <ChangePasswordModal.LogoWrapper>
              <img src='images/logo.png' alt='Tekie Logo' />
            </ChangePasswordModal.LogoWrapper>
          </ChangePasswordModal.Head>
          <ChangePasswordModal.Body>
            <ChangePasswordForm
              {...this.props}
              handleChangePassword={this.handleChangePassword}
            />
          </ChangePasswordModal.Body>
        </ChangePasswordModal>
      </Modal>
    )
  }
}

ChangePasswordEmulator.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  oldPassword: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired
}

export default ChangePasswordEmulator
