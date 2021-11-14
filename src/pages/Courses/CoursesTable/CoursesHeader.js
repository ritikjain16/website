import React from 'react'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
/** @returns course header */
const CoursesHeader = (props) => (
  <Table.Row {...props}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Title</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Description</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>ChaptersCount</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Category</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Created</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Updated</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Actions</MainTable.Title></Table.Item>
  </Table.Row>
)
export default CoursesHeader
