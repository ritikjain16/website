import React from 'react'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'

const SchoolProductMappingTableHead = (props) => (
  <Table.Row
    columnsTemplate={props.columnsTemplate}
    minWidth={props.minWidth}
    style={{
      position: 'sticky',
      top: 0,
      gridGap: 0,
      zIndex: 10
    }}
  >
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Price</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 16 }}>Discount Price</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Final Price</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Code</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Expiry Date</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Created on</MainTable.Title>
    </Table.Item>
    <Table.Item>
      <MainTable.Title style={{ fontSize: 14 }}>Actions</MainTable.Title>
    </Table.Item>


  </Table.Row>

)

export default SchoolProductMappingTableHead
