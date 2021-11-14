import React from 'react'
import PropTypes from 'prop-types'
import Form from './LoginForm.style'


const usernameValidator = [
  'username',
  {
    rules: [
      { required: true, message: 'Please input your username!' },
      { min: 3, message: 'cannot be less than 3 letters' },
      { max: 30, message: 'cannot be greater than 30 letters' }
    ],
  }
]

const passwordValidator = [
  'password',
  {
    rules: [{ required: true, message: 'Please input your password!' }],
  }
]

const checkValidations = (form, handleLogin) => e => {
  e.preventDefault()
  form.validateFields((err) => {
    if (!err) {
      handleLogin(e)
    }
  })
}

/**
 * responsible for rendering LoginForm
 */
const LoginForm = ({
  updateUsername,
  updatePassword,
  isLoggingIn,
  handleLogin,
  form
}) => (
  <Form onSubmit={checkValidations(form, handleLogin)}>
    <Form.Item>
      {form.getFieldDecorator(...usernameValidator)(
        <Form.Input
          placeholder='Username'
          type='username'
          autoComplete='off'
          onChange={e => {
            updateUsername(e.target.value)
          }}
        />
      )}
    </Form.Item>
    <Form.Item>
      {form.getFieldDecorator(...passwordValidator)(
        <Form.Input
          placeholder='Password'
          type='password'
          onChange={e => {
            updatePassword(e.target.value)
          }}
        />
      )}
    </Form.Item>
    <Form.Button loading={isLoggingIn} htmlType='submit'>
      {isLoggingIn ? 'Signing in ...' : 'Sign in'}
    </Form.Button>
    <Form.ForgotText>Forgot Password ?</Form.ForgotText>
  </Form>
)

LoginForm.propTypes = {
  /** true if user is logging in */
  isLoggingIn: PropTypes.bool.isRequired,
  /** action for updating username in redux store */
  updateUsername: PropTypes.func.isRequired,
  /** action for updateing password in redux store */
  updatePassword: PropTypes.func.isRequired,
  /* handles login on submit */
  handleLogin: PropTypes.func.isRequired,
  /** provided by form by antd */
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired
  }).isRequired
}

export default Form.create()(LoginForm)
