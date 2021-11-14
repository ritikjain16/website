import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

const LOTableHeader = ({ columnsTemplate, minWidth }) => (
  <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Title</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Chat</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Quiz</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>PQ</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>PQ Story</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Created</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Modified</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
  </Table.Row>
)

LOTableHeader.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default LOTableHeader
