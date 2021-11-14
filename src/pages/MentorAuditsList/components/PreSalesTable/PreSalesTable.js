import React, { Component } from 'react'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import PreSalesTableBody from './PreSalesTableBody'

class PreSalesTable extends Component {
  render() {
    const { savedRole } = this.props
    const columnsTemplate = '80px 200px 220px 200px 215px 175px 175px 140px'
    const minWidth = '1357px'
    const rowLayoutProps = {
      minWidth,
      columnsTemplate: `${columnsTemplate}100px 100px 200px`
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll', border: '1px solid #ddd', borderRadius: '5px' }}>
        <Table.Row style={{ justifyContent: 'flex-start' }} columnsTemplate={columnsTemplate} minWidth={minWidth}>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title style={{ width: 40 }} >#</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Pre-Sales User</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Student Name</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Parent Name</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Parent Phone No.</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Auditor Name</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Audit Status</MainTable.Title></Table.Item>
          <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Quality Score</MainTable.Title></Table.Item>
        </Table.Row>
        <PreSalesTableBody
          savedRole={savedRole}
          {...this.props}
          {...rowLayoutProps}
        />
      </Table>
    )
  }
}

export default PreSalesTable
