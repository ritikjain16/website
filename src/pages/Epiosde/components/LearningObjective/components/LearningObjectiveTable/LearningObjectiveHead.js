import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../../../components/StyledComponents'
import MainTable from '../../../../../../components/MainTable'

const LearningObjectiveHead = ({ columnsTemplate, minWidth }) => (
  <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth} style={{ 'min-height': '48px' }}>
    <Table.Item><MainTable.Title>Order</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Title</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Start Time</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>End Time</MainTable.Title></Table.Item>
    <Table.Item><MainTable.Title>Thumbnail</MainTable.Title></Table.Item>
  </Table.Row>
)

LearningObjectiveHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired
}

export default LearningObjectiveHead
