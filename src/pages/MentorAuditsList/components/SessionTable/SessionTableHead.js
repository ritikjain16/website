/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { AUDITOR, MENTOR } from '../../../../constants/roles'

class SessionTableHead extends Component {
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const { showBatchSessionTable, columnsTemplate, minWidth } = this.props
    return (
      <Table.Row style={{
        justifyContent: 'flex-start',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
        columnsTemplate={columnsTemplate}
        minWidth={minWidth}
      >
        <Table.StickyItem
          style={{ left: 0 }}
          backgroundColor='rgb(215,219,224)'
        >
          <MainTable.Title style={{ width: 40 }} >#</MainTable.Title>
          <MainTable.Title style={{ width: 180 }} >Mentor Name</MainTable.Title>
          <MainTable.Title style={{ width: 180 }} >
            {showBatchSessionTable ? 'Batch Code' : 'Student Name'}
          </MainTable.Title>
          {
          savedRole === MENTOR || savedRole === AUDITOR ? null : (
            <MainTable.Title style={{ width: 150 }}>Toggle Audit</MainTable.Title>
          )
        }
        </Table.StickyItem>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Auditor Name</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Audit Status</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Topic Name</MainTable.Title></Table.Item>
        {
          !showBatchSessionTable ? (
            <>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Ratings</MainTable.Title></Table.Item>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Child's Feedback</MainTable.Title></Table.Item>
            </>
          ) : (
            <>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Batch Type</MainTable.Title></Table.Item>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>School Name</MainTable.Title></Table.Item>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Student Count</MainTable.Title></Table.Item>
            </>
          )
        }
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Custom Score</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Quality Score</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Mentor's Phone</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Session Start Date</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Session Duration</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Session Interval</MainTable.Title></Table.Item>
        <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Session Video Link</MainTable.Title></Table.Item>
        {
          !showBatchSessionTable && (
            <>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Tags</MainTable.Title></Table.Item>
              <Table.Item backgroundColor='rgb(215,219,224)'><MainTable.Title>Country</MainTable.Title></Table.Item>
            </>
          )
        }
      </Table.Row>
    )
  }
}

SessionTableHead.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  savedRole: PropTypes.string.isRequired
}

export default SessionTableHead
