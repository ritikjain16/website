import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

class AssignmentTableHead extends Component {
  render() {
    return (
      <Table.Row columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
        <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Statement</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Difficulty</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Created On</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Modified On</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Action</MainTable.Title></Table.Item>
      </Table.Row>
    )
  }
}

AssignmentTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default AssignmentTableHead
