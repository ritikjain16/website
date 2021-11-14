import { Form, Input, InputNumber, Icon } from 'antd'
import styled from 'styled-components'

const StyledMcq = styled.div`
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

const McqError = styled.div`
  color: red;
`

const OrderInUse = styled.div`
  paddingTop: 10px; 
  width: 40%;
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

StyledMcq.BoldIcon = BoldIcon
StyledMcq.BlockIcon = BlockIcon
StyledMcq.FormItem = FormItem
StyledMcq.TextArea = StyledTextArea
StyledMcq.Slider = Slider
StyledMcq.Input = StyledInput
StyledMcq.SliderWrapper = SliderWrapper
StyledMcq.AddOptionLine = AddOptionLine
StyledMcq.AddOptionText = AddOptionText
StyledMcq.CorrectAnswerWrapper = CorrectAnswerWrapper
StyledMcq.StyledInputNumber = StyledInputNumber
StyledMcq.StyledOptions = StyledOptions
StyledMcq.AddOption = AddOption
StyledMcq.McqError = McqError
StyledMcq.OrderInUse = OrderInUse

export default StyledMcq
