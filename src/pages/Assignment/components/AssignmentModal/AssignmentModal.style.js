import { Form, Input, InputNumber, Icon, Radio } from 'antd'
import styled from 'styled-components'

const StyledAssignment = styled.div`
  display: block;
`

const FormItem = styled(Form.Item)`
   &&& {
   flex: 1;
   margin-bottom:0px;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
    &.mcqOption{
      margin-top: 3%; 
      margin-left: 2%;
    }
  }
`
const StyledTextArea = styled(Input.TextArea)`
    &.ant-input {
        border:none;
        border-bottom:2px solid #bdbdbd;
        border-radius:0;
        margin-top:10px;
        &:focus{
        border-right-width: 0px !important ;
        box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
      }
      &:hover{
        border-right-width: 0px !important;
      }
    }
`

const Slider = styled(Form.Item)`
   &&& {
   margin-bottom:0px;
   flex:1;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`

const StyledInput = styled(Input)`
  &.ant-input {
        border:none;
        border-bottom:2px solid #bdbdbd;
        border-radius:0;
        margin-top:10px;
        &:focus{
        border-right-width: 0px !important ;
        box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
      }
      &:hover{
        border-right-width: 0px !important;
      }
    }
`

const StyledInputNumber = styled(InputNumber)`
  &&&{
    &.ant-input-number{
          width: 30%;
          border:none;
          border-bottom:2px solid #bdbdbd;
          border-radius:0;
          margin-top:10px;
          &:focus{
          border-right-width: 0px !important ;
          box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
        }
        &:hover{
          border-right-width: 0px !important;
        }
      }
  }
`

const SliderWrapper = styled.div`
  display:flex;
  margin-top: 15px;
`
const AddOptionLine = styled.div`
  border-radius: 2px;
  border: 1px solid #bdbdbd;
  width: auto;
  height: 0px;
`

const AddOptionText = styled.div`
  color: #bdbdbd;
  margin-top: 20px;
  &:hover{
    color: #7e53c5;
  }
`
const CorrectAnswerWrapper = styled.div`
  display: flex;
  margin-top: 15px;
`
const StyledOptions = styled.div`
  display:flex;
`

const AddOption = styled.div`
  cursor: pointer;
`

const Error = styled.div`
  color: red;
`

const OrderInUse = styled.div`
  paddingTop: 10px; 
  width: 40%;
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

const OrderHelperText = styled.div`
  font-size: 13px;
  font-weight: 500;
`

const StyledRadio = styled(Radio.Button)`
    &.ant-radio-button-wrapper-checked {
        color: white;
        background:#7e53c5;
    }
`

StyledAssignment.BoldIcon = BoldIcon
StyledAssignment.BlockIcon = BlockIcon
StyledAssignment.FormItem = FormItem
StyledAssignment.TextArea = StyledTextArea
StyledAssignment.Slider = Slider
StyledAssignment.Input = StyledInput
StyledAssignment.SliderWrapper = SliderWrapper
StyledAssignment.AddOptionLine = AddOptionLine
StyledAssignment.AddOptionText = AddOptionText
StyledAssignment.CorrectAnswerWrapper = CorrectAnswerWrapper
StyledAssignment.StyledInputNumber = StyledInputNumber
StyledAssignment.StyledOptions = StyledOptions
StyledAssignment.AddOption = AddOption
StyledAssignment.Error = Error
StyledAssignment.OrderInUse = OrderInUse
StyledAssignment.OrderHelperText = OrderHelperText
StyledAssignment.StyledRadio = StyledRadio

export default StyledAssignment
