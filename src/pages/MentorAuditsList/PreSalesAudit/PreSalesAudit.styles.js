import { Table } from 'antd'
import styled from 'styled-components'
import colors from '../../../constants/colors'

const PreSalesTable = styled(Table)`
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
 }`

const PreSalesDiv = styled.div`
cursor: pointer;
`

export {
  PreSalesTable,
  PreSalesDiv
}
