import React, { Component } from 'react'
import { Table } from '../../../../components/StyledComponents'
import SalesExecMentorTableHead from './SalesExecMentorTableHead'
import SalesExecMentorTableBody from './SalesExecMentorTableBody'

class SalesExecMentorTable extends Component {
  render() {
    const { savedRole } = this.props
    const columnsTemplate = ' minmax(80px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(120px, 0.7fr) minmax(120px, 1fr) minmax(80px, 0.7fr)'
    const minWidth = '942px'
    const rowLayoutProps = {
      minWidth,
      columnsTemplate
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll' }}>
        <SalesExecMentorTableHead {...rowLayoutProps} savedRole={savedRole} />
        <SalesExecMentorTableBody {...this.props} savedRole={savedRole} {...rowLayoutProps} />
      </Table>
    )
  }
}

export default SalesExecMentorTable
