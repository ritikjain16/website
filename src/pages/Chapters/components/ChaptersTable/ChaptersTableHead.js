import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

const ChaptersTableHead = ({ columnsTemplate, minWidth }) => (
  <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Title</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Description</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Topics</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Created</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Modified</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
  </Table.Row>
)

ChaptersTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default ChaptersTableHead
