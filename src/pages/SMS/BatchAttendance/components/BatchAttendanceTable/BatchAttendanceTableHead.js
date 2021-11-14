import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../../components/StyledComponents'
import MainTable from '../../../../../components/MainTable'

class BatchAttendanceTableHead extends Component {
  render() {
    return (
      <Table.Row style={{ justifyContent: 'space-between' }} columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth} noBorder>
        <Table.StickyItem
          style={{ left: 0 }}
          backgroundColor='rgb(215,219,224)'
        >
          <MainTable.Title style={{ width: 40 }} >Serial No.</MainTable.Title>
          {
            <MainTable.Title style={{ width: 180 }} >Student Name</MainTable.Title>
          }
        </Table.StickyItem>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Parent Name</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Phone No.</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Email ID</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Attendance</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Absent Reason</MainTable.Title></Table.Item>
      </Table.Row >
    )
  }
}

BatchAttendanceTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired
}

export default BatchAttendanceTableHead
