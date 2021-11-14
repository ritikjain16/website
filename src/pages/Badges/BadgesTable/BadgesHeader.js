import React from 'react'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'

/** @returns course header */
const BadgesHeader = (props) => (
  <Table.Row {...props}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Name</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>InactiveImage</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>ActiveImage</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Created</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Updated</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
  </Table.Row>
)

export default BadgesHeader
