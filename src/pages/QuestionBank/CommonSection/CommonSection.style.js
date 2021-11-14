import { Select, Radio, Input, Button, Form, InputNumber, Icon } from 'antd'
import styled from 'styled-components'
// import colors from '../../../constants/colors'
const { TextArea } = Input
const StyledSelect = styled(Select)`
    border-bottom:1.5px solid #bdbdbd;
    font-weight:bold;
    .ant-select-selection{
        border:none;
    }
`
const StyledRadio = styled(Radio.Button)`
    &.ant-radio-button-wrapper-checked {
        color: white;
        background:#7e53c5;
    }
`
const StyledTextArea = styled(TextArea)`
    &.ant-input {
        border:none;
        border-bottom:2px solid #bdbdbd;
        border-radius:0;
        margin-top:10px;
        margin-left:5px;
        width:95%;
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

const MinusIcon = styled(Icon)`
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

const FormItem = styled(Form.Item)`
   &&& {
   flex: 1;
   margin-bottom:0px;
   overflow:hidden;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`
const Slider = styled(Form.Item)`
   &&& {
   margin-bottom:0px;
   //flex:1;
    &.ant-form-item-with-help {
      margin-bottom: 11px;
    }
  }
`
const OptionDiv = styled.div`
  width:40px;
  height:40px;
  background:#7e53c5;
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
     border-bottom:1.5px solid #bdbdbd; 
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
     color:#7e53c5;
 }
`
const StyledInputNumber = styled(InputNumber)`
&&&{
margin-left:5px;
border-right-width: 0px ;
border-top-style: none ;
border-radius: 0px ;
border-left-width: 0px ;
border-bottom:2px solid #bdbdbd;
&:focus{
  border-right-width: 0px !important;
  box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
}
&:hover{
  border-right-width: 0px !important;
}
}
`


const TagBox = styled.div`
margin: 5px 10px;
padding: 5px 10px;
border-radius: 20px;
background-color: ${props => props.backgroundColor ? props.backgroundColor : '#8C61CB'};
position: relative;
font-weight: 600;
font-style: normal;
font-size: 16px;
line-height: 24px;
color: #fff;
& .anticon-close{
position: absolute;
height: 15px;
width: 15px;
visibility: hidden;
top: -5px;
right: 0px;
color: white;
background-color: #D34B57;
display: flex;
justify-content: center;
align-items: center;
border-radius: 100px;
font-size: 10px;
cursor: pointer;
}
&:hover .anticon-close{
    visibility: visible;
}
`

const StyledModal = {}
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
StyledModal.BoldIcon = BoldIcon
StyledModal.BlockIcon = BlockIcon
StyledModal.MinusIcon = MinusIcon
StyledModal.TagBox = TagBox

export default StyledModal
