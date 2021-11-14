import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import isUserWrite from '../../../../utils/userRolePermissions/isUserWrite'

class SessionTableHead extends Component {
  render() {
    return (
      <Table.Row columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
        <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Slot Time</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Created At</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Modified At</MainTable.Title></Table.Item>
        {isUserWrite() && <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>}
      </Table.Row>
    )
  }
}

SessionTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default SessionTableHead
