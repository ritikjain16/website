import styled from 'styled-components'
import { Modal, Input, Form, InputNumber, Button } from 'antd'
import colors from '../../../../constants/colors'

const { TextArea } = Input
const saveButton = styled(Button)`
  &&&{height: 36px;
  color:white;
  background-color: ${colors.loPage.addLoBtn};
  box-shadow: 0 2px 0 0 ${colors.loPage.addLoBtnShadow} ;
  border:none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  padding: 8px 13px;}
`
const CancelButton = styled(Button)`
  &&&{border:none;
  background-color: ${colors.loPage.tableBg};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: right;
  color:  ${colors.loPage.loCancelBtn};}
`
const StyledAntdModal = styled(Modal)`
  height:auto;
`
const Header = styled.div`
  height: 32px;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.8px;
  color:  ${colors.loPage.loTitleColor};
`
const DisplayOrder = styled.div`
 margin-top: 27px;
 width: auto;
 height: 19px;
 font-size: 14px;
 font-weight: normal;
 font-style: normal;
 font-stretch: normal;
 line-height: normal;
 letter-spacing: 0.5px;
 text-align: left;
 color: ${colors.ccModal.modalOrder};
`
const StyledInput = styled(Input)`
  &&&{
    margin-top: 26px;
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
  }
`
const StyledInputNumber = styled(InputNumber)`
&&&{
margin-top: 26px ;
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
}
`
const StyledFormItem = styled(Form.Item)`
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
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top:20px;
`
const Row = styled.div`
  display:flex;
  justify-content:'space-between';
`
// const TextArea = styled.textarea`
//   line-height:24px !important;
//   box-sizing: border-box;
//   width: 100%;
//   height:100% !important;
// `
// const AntdTextArea = styled(TextArea).attrs({ rows: 7 })`
//   margin-left:10px !important;
// `
const AntdTextArea = styled(TextArea)`
  margin-left:10px !important;
`
const Text = styled.text`
font-size:18px;
margin-bottom:5px;
`
// const AntdRowsTextArea = AntdTextArea.attrs({ row: 10 })
// const StyledModal = {}
const StyledModal = {}
StyledModal.Header = Header
StyledModal.StyledInput = StyledInput
StyledModal.Footer = Footer
StyledModal.saveButton = saveButton
StyledModal.CancelButton = CancelButton
StyledModal.FormItem = StyledFormItem
StyledModal.DisplayOrder = DisplayOrder
StyledModal.StyledInputNumber = StyledInputNumber
StyledModal.Row = Row
StyledModal.TextArea = AntdTextArea
StyledModal.Text = Text
StyledModal.Modal = StyledAntdModal
export default StyledModal
