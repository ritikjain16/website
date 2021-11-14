import styled from 'styled-components'
import { Button, Form as AntdForm, Input } from 'antd'
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

const FormItem = styled(Form.Item)`
  &&& {
    width: 100%;
    margin-bottom: 20px;
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

const StyledInput = styled(Input)`
  &&& {
    ${materialInput()}
  }
`

Form.Input = StyledInput
Form.Button = StyledButton
Form.Item = FormItem

export default Form
