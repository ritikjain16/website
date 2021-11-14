import styled from 'styled-components'
import { Input, Form as AntdForm, Button } from 'antd'
import materialInput from '../../../../utils/mixins/materialInput'
import colors from '../../../../constants/colors'

const Form = styled(AntdForm)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 30px);
  max-width: 300px;
  margin-bottom: 20px;
`
const StyledInput = styled(Input)`
  &&& {
    ${materialInput()}
  }
`
const StyledButton = styled(Button)`
  &&& {
    width: 100%;
    border: none;
    outline: none;
    background: ${colors.themeColor};
    color: white;
    font-size: 16px;
    padding: 8px 0;
    border-radius: 2px;
    cursor: pointer;
    height: auto;
    margin-bottom: 30px;
  }
`
const ForgotText = styled.a`
  color: ${colors.themeColor};
  text-transform: uppercase;
  font-weight: 600;
  user-select: none;
  margin-bottom: 30px;
  &:hover {
    color: ${colors.themeColor};
  }
`
const FormItem = styled(Form.Item)`
  &&& {
    width: 100%;
    margin-bottom: 30px;
    .has-error .ant-input {
      border: 0px;
      box-shadow: none;
      border-bottom: 2px solid ${colors.antdError};
      &::placeholder {
        color: ${colors.antdError};
      }
    }
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`

Form.Item = FormItem
Form.Input = StyledInput
Form.Button = StyledButton
Form.ForgotText = ForgotText
export default Form
