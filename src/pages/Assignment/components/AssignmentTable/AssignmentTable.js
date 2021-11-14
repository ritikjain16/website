import React, { Component } from 'react'
import { Table } from '../../../../components/StyledComponents'
import AssignmentTableHead from './AssignmentTableHead'
import AssignmentTableBody from './AssignmentTableBody'

const columnsTemplate = '80px minmax(250px, 2.3fr) 100px repeat(2, minmax(120px, 0.6fr)) 100px 180px'
const minWidth = '942px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth
}

class AssignmentTable extends Component {
  render() {
    return (
      <Table>
        <AssignmentTableHead {...rowLayoutProps} />
        <AssignmentTableBody {...rowLayoutProps}{...this.props} />
      </Table>
    )
  }
}

export default AssignmentTable
