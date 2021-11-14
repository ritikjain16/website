import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

class NPScoreTableHead extends Component {
  render() {
    return (
      <Table.Row style={{ justifyContent: 'flex-start' }} columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
        <Table.Item><MainTable.Title>Student Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Parent&apos;s  Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Phone no.</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>NPS score</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Rating</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Feedback</MainTable.Title></Table.Item>
      </Table.Row>
    )
  }
}

NPScoreTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired
}

export default NPScoreTableHead
