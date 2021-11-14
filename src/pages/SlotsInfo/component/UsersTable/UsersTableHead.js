import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MENTEE } from '../../../../constants/roles'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

class UsersTableHead extends Component {
  render() {
    if (this.props.role === MENTEE) {
      return (
        <Table.Row columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
          <Table.Item><MainTable.Title>#</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Name</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Parent Info</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Grade</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Gender</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Assign a Mentor</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Choose Course</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Action</MainTable.Title></Table.Item>
          <Table.Item><MainTable.Title>Session Link</MainTable.Title></Table.Item>
        </Table.Row>
      )
    }

    return (
      <Table.Row columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
        <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Email</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Phone</MainTable.Title></Table.Item>
      </Table.Row>
    )
  }
}

UsersTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
}

export default UsersTableHead
