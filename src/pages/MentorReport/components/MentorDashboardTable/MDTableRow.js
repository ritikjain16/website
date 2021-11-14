import React from 'react'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import MentorReportStyle from '../../MentorReport.style'

const MDTableRow = (props) => {
  const {
    avgSlotOpenPerDay,
    bookingPercent,
    bookingsAssigned,
    bookingsRescheduled,
    cold,
    conversionPercent,
    feedBackFormFilledPercent,
    hot,
    lost,
    name,
    oneToOneConversion,
    oneToThreeConversion,
    oneToTwoConversion,
    pipeline,
    rescheduledPercent,
    salesExecutive,
    slotsOpened,
    status,
    trialsCompleted,
    trialsQualified,
    videoLinkUploadedPercent,
    isMentorActive,
    won
  } = props.reports
  return (
    <Table.Row columnsTemplate={props.columnsTemplate} minWidth={props.minWidth}>
      <Table.Item><MainTable.Title>01</MainTable.Title></Table.Item>
      <Table.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MainTable.Title>{name}</MainTable.Title>
          <MentorReportStyle.StatusIcon color={` ${isMentorActive ? '#16d877' : 'red'} `} />
        </div>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>{status}</MainTable.Title>
      </Table.Item>
      <Table.Item><MainTable.Title>{slotsOpened}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{avgSlotOpenPerDay}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{bookingsAssigned}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{bookingPercent}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{bookingsRescheduled}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{rescheduledPercent}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{feedBackFormFilledPercent}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{videoLinkUploadedPercent}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{trialsCompleted}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{trialsQualified}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{lost}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{cold}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{pipeline}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{hot}</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{won}</MainTable.Title></Table.Item>
      <Table.Item flexDirection='column' >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} >
          <div><MainTable.Title>{oneToOneConversion}</MainTable.Title></div>
          <div><MainTable.Title>{oneToTwoConversion}</MainTable.Title></div>
          <div><MainTable.Title>{oneToThreeConversion}</MainTable.Title></div>
        </div >
      </Table.Item>
      <Table.Item><MainTable.Title>{conversionPercent} %</MainTable.Title></Table.Item>
      <Table.Item><MainTable.Title>{salesExecutive}</MainTable.Title></Table.Item>
    </Table.Row>
  )
}
export default MDTableRow
