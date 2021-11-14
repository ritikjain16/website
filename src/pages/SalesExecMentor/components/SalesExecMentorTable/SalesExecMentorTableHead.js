import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

class SalesExecMentorTableHead extends Component {
  render() {
    return (
      <Table.Row style={{ justifyContent: 'space-between' }} columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth} noBorder>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Serial Number</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Mentor Name</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Status</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Email ID</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Phone No.</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgba(18, 43, 74, 0.17)'><MainTable.Title>Action</MainTable.Title></Table.Item>
      </Table.Row>
    )
  }
}

SalesExecMentorTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired
}

export default SalesExecMentorTableHead
