import { Select, Radio, Icon, Input, Button, Form, InputNumber } from 'antd'
import styled from 'styled-components'
import colors from '../../../constants/colors'

const { TextArea } = Input
const StyledSelect = styled(Select)`
    border-bottom:1.5px solid ${colors.questionBank.inputColor};
    font-weight:bold;
    .ant-select-selection{
        border:none;
    }
`
const StyledRadio = styled(Radio.Button)`
    &.ant-radio-button-wrapper-checked {
        color: white;
        background:${colors.questionBank.addBlankButton};
    }
`
const StyledTextArea = styled(TextArea)`
    &.ant-input {
        border:none;
        border-bottom:2px solid ${colors.questionBank.inputColor};
        border-radius:0;
        margin-top:10px;
        margin-left:5px;
        width:95%;
        min-width:40%;
    }
`

const FormItem = styled(Form.Item)`
   &&& {
   flex: 1;
   margin-bottom:0px;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`
const Slider = styled(Form.Item)`
   &&& {
   margin-bottom:0px;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`
const OptionDiv = styled.div`
  width:40px;
  height:40px;
  background:${colors.questionBank.addBlankButton};
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:17px;
  border-radius:8px;
  min-width:40px;
`
const AddOptionButton = styled(Button)`
 &.ant-btn{
     border:none;
     border-bottom:1.5px solid ${colors.questionBank.inputColor};
     padding:0px;
     border-radius:0px;
     margin-left:10px;
 }
`
const Answer = styled(Input)`
  border:none;
`
const AddBlankButton = styled(Button)`
 margin-top:10px;
 &.ant-btn{
     color:${colors.questionBank.addBlankButton};
 }
`
const StyledInputNumber = styled(InputNumber)`
&&&{
margin-left:5px;
border-right-width: 0px ;
border-top-style: none ;
border-radius: 0px ;
border-left-width: 0px ;
border-bottom:2px solid ${colors.questionBank.inputColor};
&:focus{
  border-right-width: 0px !important;
  box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
}
&:hover{
  border-right-width: 0px !important;
}
}
`
const BoldIcon = styled(Icon)`
&&& {
    font-size: 24px;
    margin-right: 10px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.4);
    transition: 0.3s all ease-in-out;
    cursor: pointer;
    align-self: flex-start;
    &:hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
`

const BlockIcon = styled(Icon)`
&&& {
    font-size: 24px;
    margin-right: 10px;
    margin-top: 10px;
    background-color: #1ac9e8;
    color: rgba(0, 0, 0, 0.4);
    transition: 0.3s all ease-in-out;
    cursor: pointer;
    align-self: flex-start;
    &:hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
`
const StyledModal = {}

StyledModal.BoldIcon = BoldIcon
StyledModal.BlockIcon = BlockIcon
StyledModal.StyledSelect = StyledSelect
StyledModal.StyledRadio = StyledRadio
StyledModal.TextArea = StyledTextArea
StyledModal.FormItem = FormItem
StyledModal.Slider = Slider
StyledModal.OptionDiv = OptionDiv
StyledModal.AddOption = AddOptionButton
StyledModal.Answer = Answer
StyledModal.AddBlankButton = AddBlankButton
StyledModal.StyledInputNumber = StyledInputNumber
export default StyledModal
