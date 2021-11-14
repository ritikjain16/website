import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'

const MDTableHead = props => (
  <Table.Row columnsTemplate={props.columnsTemplate} minWidth={props.minWidth}>
    <Table.Item><MainTable.Title>Sr. No</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Mentors</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Slots Opened</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Avg.Slots per.day</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Bookings assigned</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Bookings (%)</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Bookings Rescheduled</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Rescheduled (%)</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Feedback form filled(%)</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Video Link Upload (%)</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Trials Completed</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Trials Qualified</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Lost</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Cold</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Pipeline</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Hot</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Won</MainTable.Title></Table.Item>
    <Table.Item flexDirection='column' >
      <MainTable.Title>Conversion Type</MainTable.Title>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
        <div><MainTable.Title>1:1</MainTable.Title></div>
        <div><MainTable.Title>1:2</MainTable.Title></div>
        <div><MainTable.Title>1:3</MainTable.Title></div>
      </div >
    </Table.Item>
    <Table.Item><MainTable.Title>Conversion %</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Sales Executive</MainTable.Title></Table.Item>
  </Table.Row>
)

MDTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired
}

export default MDTableHead
