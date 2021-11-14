import React from 'react'
import PropTypes from 'prop-types'
import Form from './ChangePasswordForm.style'

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmNewPassword: ''
    }
  }
  oldPasswordValidator = [
    'oldPassword',
    {
      rules: [{ required: true, message: 'Please input your password!' }],
    }
  ]

  newPasswordValidator = [
    'newPassword',
    {
      rules: [
        { required: true, message: 'Please input your password!' },
        { min: 6, message: 'New password cannot be less than 6 letters' }
      ],
    }
  ]

  confirmNewPasswordValidator = [
    'confirmNewPassword',
    {
      rules: [{ required: true, message: 'Please input your password!' }],
    }
  ]

  confirmPasswordNotSameMsg = 'New password and confirm password not same!'

  changeNewPassword = password => {
    this.setState({
      newPassword: password
    })
  }

  changeConfirmNewPassword = password => {
    this.setState({
      confirmNewPassword: password
    })
  }

  checkIfNewPasswordSameAsConfirmPassword = () => {
    if (this.state.newPassword === this.state.confirmNewPassword) {
      return true
    }
    return false
  }

  checkValidations = (form, handleChangePassword, notification) => e => {
    e.preventDefault()
    form.validateFields(async (err) => {
      if (!err) {
        if (this.checkIfNewPasswordSameAsConfirmPassword()) {
          await handleChangePassword(e)
          form.setFieldsValue({
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          })
        } else {
          notification.error({
            message: this.confirmPasswordNotSameMsg
          })
        }
      }
    })
  }

  render() {
    return (
      <Form onSubmit={this.checkValidations(
            this.props.form,
            this.props.handleChangePassword,
            this.props.notification)}
      >
        <Form.Item>
          {this.props.form.getFieldDecorator(...this.oldPasswordValidator)(
            <Form.Input
              placeholder='Current Password'
              type='password'
              onChange={(e) => {
                this.props.updateOldPassword(e.target.value)
                    }}
            />
            )}
        </Form.Item>
        <Form.Item>
          {this.props.form.getFieldDecorator(...this.newPasswordValidator)(
            <Form.Input
              placeholder='New Password'
              type='password'
              onChange={e => {
                      this.props.updateNewPassword(e.target.value)
                      this.changeNewPassword(e.target.value)
                    }}
            />
            )}
        </Form.Item>
        <Form.Item>
          {this.props.form.getFieldDecorator(...this.confirmNewPasswordValidator)(
            <Form.Input
              placeholder='Confirm Password'
              type='password'
              onChange={e => {
                      this.props.updateConfirmNewPassword(e.target.value)
                      this.changeConfirmNewPassword(e.target.value)
                    }}
            />
            )}
        </Form.Item>
        <Form.Item>
          <Form.Button loading={this.props.isChangingPassword} htmlType='submit'>
            {this.props.isChangingPassword ? 'Changing Password ...' : 'Change Password'}
          </Form.Button>
        </Form.Item>
      </Form>
    )
  }
}

ChangePasswordForm.propTypes = {
  updateOldPassword: PropTypes.func.isRequired,
  updateNewPassword: PropTypes.func.isRequired,
  updateConfirmNewPassword: PropTypes.func.isRequired,
  handleChangePassword: PropTypes.func.isRequired,
  isChangingPassword: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired
  }).isRequired
}

export default Form.create()(ChangePasswordForm)
