import React from 'react'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'

const SchoolOverviewTableHead = (props) => (

  <Table.Row columnsTemplate={props.columnsTemplate} minWidth={props.minWidth}>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>#</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 16 }}>Logo</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 16 }}>School Name</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 16 }}>School Co-ordinator</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>City</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Payment Status</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Created At</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Admin Action</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Actions</MainTable.Title>
    </Table.Item>

  </Table.Row>


)

export default SchoolOverviewTableHead
