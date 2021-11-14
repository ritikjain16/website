import styled from 'styled-components'
import { Button, Modal, Input, Form, InputNumber, Select, Radio, Checkbox, Switch } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import materialInput from '../../utils/mixins/materialInput'
import materialSelect, { materialSelectMultiple } from '../../utils/mixins/materialSelect'
import colors from '../../constants/colors'

const SaveButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`
const StyledInput = styled(Input)`
  ${materialInput()}
`
const OrderInput = styled(InputNumber)`
  ${materialInput()}
  &&& {
    width: 100px;
    input {
      padding: 0px;
    }
  }
`
const StyledTextArea = styled(Input.TextArea)`
  ${materialInput()}
`
const OrderHelperText = styled.div`
  font-size: 13px;
  font-weight: 600;
`
const StyledFormItem = styled(Form.Item)`
  &&& {
    width: ${props => props.width || '100%'};
    .has-error .ant-input,
    .has-error .ant-input-number,
    .has-error .ant-select-selection {
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

const StyledSwitch = styled(Switch)`
  background-color: 'green'
`

const MainModal = styled(Modal)`
  width: ${props => props.width || '568px'} !important;
  font-family: ${props => props.font || ''} !important;
  margin-top: ${props => (props.styles && props.styles.marginTop) || 'auto'} !important;
`
const StyledSelect = styled(Select)`
  ${materialSelect()}
  width: ${props => props.width ? props.width : 'auto'} !important;
`
const StyledSelectMultiple = styled(Select)`
  ${materialSelectMultiple}
`
const StyledOption = styled(Select.Option)``
const RadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper-checked {
    background: ${colors.themeColor};
    color: white;
    &:hover {
      color: white;
    }
  }
`

const StyledRadio = styled(Radio.Button)`
    &.ant-radio-button-wrapper-checked {
        color: white;
        background:#7e53c5;
    }
`

const GroupRow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`

const DatePicker = styled.div`
  width: 600px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  .ant-calendar-picker-input{
    width: 600px;
    height: 42px;
    &:hover {
      cursor: pointer;
    }
  }
`

const TextItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #afafaf;
  margin-bottom: 10px;
  font-family: 'Nunito';
`

const StyledCheckBox = styled(Checkbox)`
  &&&{
    margin-top: 20px;
  }
`

MainModal.SaveButton = SaveButton
MainModal.OrderHelperText = OrderHelperText
MainModal.Input = StyledInput
MainModal.GroupRow = GroupRow
MainModal.TextArea = StyledTextArea
MainModal.OrderInput = OrderInput
MainModal.TextArea = StyledTextArea
MainModal.FormItem = StyledFormItem
MainModal.Select = StyledSelect
MainModal.Option = StyledOption
MainModal.RadioGroup = RadioGroup
MainModal.SelectMultiple = StyledSelectMultiple
MainModal.StyledRadio = StyledRadio
MainModal.DatePicker = DatePicker
MainModal.TextItem = TextItem
MainModal.StyledCheckBox = StyledCheckBox
MainModal.StyledSwitch = StyledSwitch

export default MainModal
