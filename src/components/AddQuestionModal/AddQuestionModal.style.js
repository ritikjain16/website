import styled from 'styled-components'
import { Modal, Select, InputNumber, Form, Input, Checkbox } from 'antd'
import colors from '../../constants/colors'

const { TextArea } = Input

const QuestionModal = styled(Modal)`
  height: 90vh;
  overflow-y: auto;
  width: 600px !important;
`

const HeaderText = styled.div`
  height: 32px;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.8px;
  text-align: left;
  color: ${colors.questionModal.modalHeading};
  `

const StyledDropdown = styled(Select)`
  &&&{
    width: 160px;
    margin-top: 30px;
    color: ${colors.questionModal.modalDropDown};
    .ant-select-selection--single{
    border-right-width: 0px !important ;
    border-top-style: none !important;
    border-radius: 0px !important;
    border-left-width: 0px !important;
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


const Line = styled.div`
  width: 150px;
  height: 1px;
  background-color: ${colors.questionModal.modalDropDown};
`

const StyledInput = styled(InputNumber)`
 &&&{
 width: 150px;
 margin-top: 30px ;
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

const SingleRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledFormItem = styled(Form.Item)`
   &&& {
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

const StyledTextArea = styled(TextArea)`
  &&&{
  margin-top: 40px ;
  border-right-width: 0px ;
  border-top-style: none ;
  border-radius: 0px ;
  border-left-width: 0px ;
  &:focus{
  border-right-width: 0px !important ;
  box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
  }
  &:hover{
  border-right-width: 0px !important;
  }
  }
`

const QuestionHeading = styled.div`
   margin-top: 20px;
   font-size: 20px;
   font-weight: normal;
   font-style: normal;
   font-stretch: normal;
   line-height: normal;
   letter-spacing: 0.8px;
   text-align: left;
`

const StyledOptions = styled.div`
  margin-top: 10px;
`

const OptionExplanation = styled(TextArea)`
  &&&{
  width: 356px;
  margin-top: 20px ;
  border-right-width: 0px ;
  border-top-style: none ;
  border-radius: 0px ;
  border-left-width: 0px ;
  &:focus{
  border-right-width: 0px !important ;
  box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
  }
  &:hover{
  border-right-width: 0px !important;
  }
  }
`

const OptionInput = styled(TextArea)`
  &&&{
  width: 356px;
  margin-top: 2px ;
  border-right-width: 0px ;
  border-top-style: none ;
  border-radius: 0px ;
  border-left-width: 0px ;
  &:focus{
  border-right-width: 0px !important ;
  box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
  }
  &:hover{
  border-right-width: 0px !important;
  }
  }
`

const StyledCheckBox = styled(Checkbox)`
  &&&{
    margin-top: 20px;
  }
`

const OptionsHeading = styled.div`
   margin-top: 20px;
   font-size: 20px;
   font-weight: normal;
   font-style: normal;
   font-stretch: normal;
   line-height: normal;
   letter-spacing: 0.8px;
   text-align: left;
`

const OptionGrouping = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-evenly ;
`

const ErrorText = styled.div`
 color: ${colors.antdError}
`


QuestionModal.Dropdown = StyledDropdown
QuestionModal.Line = Line
QuestionModal.HeaderText = HeaderText
QuestionModal.StyledInput = StyledInput
QuestionModal.SingleRow = SingleRow
QuestionModal.FormItem = StyledFormItem
QuestionModal.QuestionHeading = QuestionHeading
QuestionModal.StyledTextArea = StyledTextArea
QuestionModal.StyledOptions = StyledOptions
QuestionModal.OptionExplanation = OptionExplanation
QuestionModal.OptionInput = OptionInput
QuestionModal.StyledCheckBox = StyledCheckBox
QuestionModal.OptionsHeading = OptionsHeading
QuestionModal.OptionGrouping = OptionGrouping
QuestionModal.ErrorText = ErrorText

export default QuestionModal
