import styled from 'styled-components'
import { Table } from 'antd'
import colors from '../../constants/colors'

const TopicAssetsMain = styled(Table)`
  table{
    background: ${colors.taPage.tableCellsBackground};
  }
  table thead th{
    color: ${colors.taPage.tableBackground};
  }
  .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
    padding: 16px 10px;
  }
  .ant-table-tbody > tr > td{
    border-bottom: none !important;
  }
  .ant-table-thead > tr.ant-table-row-hover td,
  .ant-table-tbody > tr.ant-table-row-hover td,
  .ant-table-thead > tr:hover td,
  .ant-table-tbody > tr:hover td,
  tr:hover td{
    background: ${colors.taPage.tableBackground};
    font-weight: bold;
  }
`

export default TopicAssetsMain
