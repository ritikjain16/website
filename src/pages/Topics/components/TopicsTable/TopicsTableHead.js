import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

const TopicsTableHead = ({ columnsTemplate, minWidth }) => (
  <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Thumbnail</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Title</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>LO Count</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Video Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Overall PQ</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Quiz</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Badge Count</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Created</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Modified</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Paid/Free</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
  </Table.Row>
)

TopicsTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default TopicsTableHead
