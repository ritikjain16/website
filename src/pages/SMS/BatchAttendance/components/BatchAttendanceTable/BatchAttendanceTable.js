import React, { Component } from 'react'
import { Table } from '../../../../../components/StyledComponents'
import BatchAttendanceTableHead from './BatchAttendanceTableHead'
import BatchAttendanceTableBody from './BatchAttendanceTableBody'

class BatchAttendanceTable extends Component {
  render() {
    const { savedRole } = this.props
    const columnsTemplate = '250px 200px 200px 200px 400px 200px repeat(5, 150px) '
    const minWidth = '1450px'
    const rowLayoutProps = {
      minWidth,
      columnsTemplate
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll' }}>
        <BatchAttendanceTableHead {...rowLayoutProps} savedRole={savedRole} />
        <BatchAttendanceTableBody {...this.props} {...rowLayoutProps} />
      </Table>
    )
  }
}

export default BatchAttendanceTable
