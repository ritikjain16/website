import { Button, Divider, Switch, Table } from 'antd'
import styled from 'styled-components'
import colors from '../../../../constants/colors'

const ProjectTable = styled(Table)`
& .ant-table-body{
  display: flex;
  justify-content: center;
  height: 100%;
  max-height: unset !important;
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
  padding: 10px !important;
  color: #122b4a;
 }
 & tbody td{
     padding: 10px !important;
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
const PreviewButton = styled(Button)`
border:none !important;
background-color: transparent !important;
& .anticon.anticon-eye-invisible{
  font-size: 24px;
  color: gray;
}
& .anticon.anticon-eye{
  font-size:24px;
  color: #37bee9;
}
`

export {
  StyledSwitch,
  StyledDivider,
  ProjectTable,
  PreviewButton
}
