import styled from 'styled-components'
import { Button, Icon, Input, Radio, Select, Switch, Table } from 'antd'
import antdButtonColor from '../../../utils/mixins/antdButtonColor'
import colors from '../../../constants/colors'

const FlexContainer = styled.div`
    display:flex;
    justify-content: ${props => props.justify ? props.justify : 'space-between'};
    padding-bottom:20px;
    align-items: center;
    ${props => props.modalGrid ? `
    display: grid;
    grid-template-columns: 30% 65%;
    justify-content: space-between;
    padding: 0;
    align-items: flex-start;
    ` : ''}
    & h1, & h2, & h3, & h4, & h5, & h6, & p{
      margin: 0;
      margin-right: 10px;
    }
`
const StyledButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? '#1890ff' : antdButtonColor(colors.subThemeColor)}
    color:white;
  }
`

const StyledSelect = styled(Select)`
width: 200px;
`

const StyledInput = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`

const MDTable = styled(Table)`
& .ant-table-content{
  color: #122b4a;
  background-color: #ffffff;
  border-radius:6px;
  
}
 & .ant-table-thead > tr > th{
  background-color: rgba(18, 43, 74, 0.17);
  margin: 0 0 78px 1px !important;
  font-weight: 600;
  color: #122b4a;
 }
 & tbody > tr{
   background-color: rgba(228, 228, 228, 0.35);
 }
 & .ant-table-content .ant-table-body .ant-table-tbody .antdTable-child-row > td {
   padding: 8px 0px;
 }
 & tbody > tr > td:nth-of-type(3){
   min-width: fit-content;
 }
 & tbody > tr .anticon-delete svg{
  width: 16.8px;
  height: 22.2px;
  color: ${colors.table.deleteIcon};
 }
`

const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background-color: #fff;
    border: 1px solid ${(props) => props.bgcolor};
    margin: 0px 10px;
  }  
  &.ant-switch::after {
    background-color: ${(props) => props.bgcolor};
  }
`

const StyledTextArea = styled(Input.TextArea)`
width:100% !important;
min-height: 100px !important;
`

const RadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper-checked {
    background: ${colors.themeColor};
    color: white;
    &:hover {
      color: white;
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

export {
  FlexContainer,
  StyledButton,
  StyledInput,
  MDTable,
  StyledSwitch,
  StyledSelect,
  StyledTextArea,
  RadioGroup,
  BlockIcon,
  BoldIcon
}
