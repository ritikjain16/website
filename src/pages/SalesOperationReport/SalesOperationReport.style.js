import styled from 'styled-components'
import { Table } from 'antd'

const SalesOperationReportStyle = styled.div`
`
const RadioDiv = styled.div`
 font-weight: 700;
 margin-bottom: 10px;
 font-size: 18px;
 padding-top: 15px;
 padding-left: 15px;
`
const TableDiv = styled.div`
 background-color: #F7F7F9;
`
const H1 = styled.h1`
  font-size: 30px;
  font-weight: 900;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, “Roboto”, “Droid Sans”,
    “Helvetica Neue”, Helvetica, Arial, sans-serif;
`
const SalsesOperationReportTable = styled(Table)`
.ant-table-thead {
    & > tr { 
        & > th { 
            color: white;
            background: #122B4A !important;
        }
    }
  }
.ant-table-tbody {
    & > tr { 
        & > td { 
            background: #F7F7F9 !important;
        }
    }
  }`

SalesOperationReportStyle.H1 = H1
SalesOperationReportStyle.SalsesOperationReportTable = SalsesOperationReportTable
SalesOperationReportStyle.RadioDiv = RadioDiv
SalesOperationReportStyle.TableDiv = TableDiv

export default SalesOperationReportStyle
