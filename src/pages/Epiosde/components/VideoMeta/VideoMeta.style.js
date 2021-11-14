import styled from 'styled-components'
import { Input, Button, Form } from 'antd'
import colors from '../../../../constants/colors'

const { TextArea } = Input


const Main = styled.div`
  width: 100%;
  height: 100%;
`
const FormDiv = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  flex-wrap: wrap;
  min-height: 200px;
  justify-content: center;
`
const StyledFormItem = styled(Form.Item)`
   &&& {
    width: 35vw;
    margin-top:10px;
    .has-error .ant-input, .has-error .ant-input-number, .has-error .ant-select-selection {
      border: 0px;
      box-shadow: none;
      border-bottom: 2px solid ${colors.antdError};
      input {
        &::placeholder {
          color: ${colors.antdError};
        }
      }
      .ant-select-selection__placeholder {
        color: ${colors.antdError};
      }
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
  &&&{
    margin-top: 20px;
    border-right-width: 0px ;
    border-top-style: none ;
    border-radius: 0px ;
    border-left-width: 0px ;
    background: ${colors.video.background};
    &:focus{
      border-right-width: 0px !important;
      box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
    }
    &:hover{
      border-right-width: 0px !important;
    }
    ::placeholder {
      color: rgba(0, 0, 0, 0.65);
    }
    &:focus::placeholder {
      color: ${colors.themeColor};
    }
  }
`

const DescTextArea = styled(TextArea)`
  &&&{
  margin-top: 20px ;
  border-right-width: 0px ;
  border-top-style: none ;
  border-radius: 0px ;
  border-left-width: 0px ;
  &:focus{
    border-right-width: 0px !important;
    box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
  }
  &:hover{
    border-right-width: 0px !important;
  }
  max-height: 120px;
  min-height: 80px;
  background: ${colors.video.background};
  ::placeholder {
    color: rgba(0, 0, 0, 0.65);
  }
  &:focus::placeholder {
    color: ${colors.themeColor};
  }
}
`

const saveButton = styled(Button)`
  &&& {
    border-radius: 3px;
    width: 10em;
    padding: 0.25em 0;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: 1em;
    background-color: #e99a54 !important;
    &:disabled {
      color: ${colors.video.disable.color};
      border-color: ${colors.video.disable.color};
      background-color: ${colors.video.disable.background};
    }
    color: white;
    height: 2.5vw;
    width: 7.3vw;
    font-size: 16px;
    min-height: 36px !important;
  }
}
`

const ButtonsWrapper = styled.div`
  width: 95%;
  height: 25%;
  display: flex;
  justify-content: flex-end;
  min-height: 88px !important;
  margin-top: 0.5em;
`
const TextSpan = styled.span`
  width: 72.5%;
  line-height: 84px;
  font-size: 20px;
  display: flex;
`

Main.FormItem = StyledFormItem
Main.DescTextArea = DescTextArea
Main.saveButton = saveButton
Main.StyledInput = StyledInput
Main.ButtonsWrapper = ButtonsWrapper
Main.TextSpan = TextSpan
Main.FormDiv = FormDiv
export default Main
