import { Form, Input, InputNumber, Icon } from 'antd'
import styled from 'styled-components'

const StyledArrange = styled.div`
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
const CorrectAnswers = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 15px;
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

const ArrangeButton = styled.div`
width: 26px;
height: 22px;
background: ${props => props.active ? '#2FCC59' : ''};
border: 1px solid #000000;
box-sizing: border-box;
padding: 10px;
display: flex;
justify-content: center;
align-items: center;
margin: 8px;
cursor: pointer;
`

StyledArrange.FormItem = FormItem
StyledArrange.TextArea = StyledTextArea
StyledArrange.Slider = Slider
StyledArrange.Input = StyledInput
StyledArrange.SliderWrapper = SliderWrapper
StyledArrange.AddOptionLine = AddOptionLine
StyledArrange.AddOptionText = AddOptionText
StyledArrange.CorrectAnswerWrapper = CorrectAnswerWrapper
StyledArrange.StyledInputNumber = StyledInputNumber
StyledArrange.StyledOptions = StyledOptions
StyledArrange.AddOption = AddOption
StyledArrange.McqError = McqError
StyledArrange.CorrectAnswers = CorrectAnswers
StyledArrange.OrderInUse = OrderInUse
StyledArrange.BoldIcon = BoldIcon
StyledArrange.BlockIcon = BlockIcon
StyledArrange.ArrangeButton = ArrangeButton

export default StyledArrange
