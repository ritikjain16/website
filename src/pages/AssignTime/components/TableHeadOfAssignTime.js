import React, { Component } from 'react'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'


class TableHeadOfAssignTime extends Component {
  render() {
    return (
      <Table.Row
        columnsTemplate={this.props.columnsTemplate}
        minWidth={this.props.minWidth}
      >
        <Table.Item><MainTable.Title>Sno</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Topic</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Date</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Time</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Attendance</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session Start Time</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session End Time</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session Duration</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Zoom Link</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor Comment</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
      </Table.Row>
    )
  }
}


export default TableHeadOfAssignTime
