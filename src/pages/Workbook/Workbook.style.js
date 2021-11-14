import styled from 'styled-components'
import { Button, Divider, Icon, Input, Switch, Table } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const TopContainer = styled.div`
    display:flex;
    justify-content:flex-end;
    padding-bottom:20px;
`
const StyledButton = styled(Button)`
  &&& {
    ${props => props.type === 'primary' ? '#1890ff' : antdButtonColor(colors.subThemeColor)}
    color:white;
  }
`

const Tag = styled.div`
  height: 24px;
  width: fit-content;
  font-weight: 550;
  font-size: 11px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px;
  padding: 0 20px 0 12px;
  white-space: nowrap;
  position: relative;
  border: 2px solid ${props => props.color};
  border-right: none;
  color: ${props => props.color};
  text-decoration: none;
  border-radius: 2px 2px 2px 2px;

  &:before {
    content: "";
    position: absolute;
    top: 4px;
    right: -5px;
    width: 12px;
    height: 12px;
    border: 2px solid ${props => props.color};
    border-radius: 2px 2px 2px 0px;
    border-left: none;
    border-bottom: none;
    -webkit-transform: scale(1, 1.5) rotate(45deg);
    -moz-transform: scale(1, 1.5) rotate(45deg);
    -ms-transform: scale(1, 1.5) rotate(45deg);
    transform: scale(1, 1.5) rotate(45deg);
  }
  &:after {
    content: "";
    position: absolute;
    top: 7px;
    right: 2px;
    width: 5px;
    height: 5px;
    border: 2px solid ${props => props.color};
    border-radius: 4px;
  }
`

const StyledInput = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`

const MDTable = styled(Table)`
& .ant-table-body{
  display: flex;
  justify-content: center;
}

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

const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 2em;
      margin: 0px 15px;
      background: #b6b6b6; 
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

export default {
  TopContainer,
  StyledButton,
  StyledInput,
  Tag,
  MDTable,
  StyledSwitch,
  StyledDivider,
  BlockIcon,
  BoldIcon
}
