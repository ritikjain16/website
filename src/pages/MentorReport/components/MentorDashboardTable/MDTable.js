import React from 'react'
import { Spin } from 'antd'
import MDTableHead from './MDTableHead'
import { Table } from '../../../../components/StyledComponents'
import MDTableRow from './MDTableRow'

const MDTable = (props) => {
  const { savedRole } = props
  const columnsTemplate = ' minmax(30px,1fr) minmax(150px,1fr) minmax(150px,1fr) minmax(40px,0.7fr) minmax(40px,1fr) minmax(80px,0.7fr) minmax(40px,1.2fr) minmax(100px,1fr) minmax(90px,1fr) minmax(120px,1fr) minmax(100px,0.7fr) minmax(50px,1fr) minmax(80px,0.7fr) minmax(60px,0.7fr) minmax(40px,0.7fr) minmax(40px,0.7fr) minmax(40px,0.7fr) minmax(40px,0.7fr) minmax(130px,1fr) minmax(120px,0.7fr) minmax(50px,1fr) minmax(50px,1fr)'
  const minWidth = '2150px'
  const rowLayoutProps = {
    minWidth,
    columnsTemplate
  }
  return (
    <Table style={{ width: '100%', overflowX: 'scroll', marginTop: '15px' }} savedRole={savedRole} >
      <MDTableHead {...rowLayoutProps} savedRole={savedRole} />
      {!props.isReportsFetching ? (props.mentorReports && props.mentorReports.map((reports) => (
        <MDTableRow key={reports.id} reports={reports} {...rowLayoutProps} savedRole={savedRole} />
        )
      )) : (
        <Spin />
      )}
    </Table>
  )
}

export default MDTable
