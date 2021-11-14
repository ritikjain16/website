/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import { MENTOR } from '../../../../constants/roles'

class SessionTableHead extends Component {
  render() {
    const { country, showSessionLogs } = this.props
    return (
      <Table.Row style={{ justifyContent: 'flex-start' }} columnsTemplate={this.props.columnsTemplate} minWidth={this.props.minWidth}>
        <Table.StickyItem
          style={{ left: 0 }}
        >
          <MainTable.Title style={{ width: 40 }} >#</MainTable.Title>
          {
          this.props.savedRole !== MENTOR ?
            <MainTable.Title style={{ width: 180 }} >Mentor Name</MainTable.Title>
            :
            null
          }
          <MainTable.Title style={{ width: 180 }} >Student Name</MainTable.Title>
        </Table.StickyItem>
        <Table.Item><MainTable.Title>Parent's Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Parent's Email ID</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Parent's Phone</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor's Phone</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Slot Timing</MainTable.Title></Table.Item>
        {
          country !== 'india'
            && <Table.Item><MainTable.Title>Student's Time</MainTable.Title></Table.Item>
        }
        <Table.Item><MainTable.Title>Course Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Topic Name</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session Link</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Status</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session Interval</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Duration</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Start Date</MainTable.Title></Table.Item>
        {
          !showSessionLogs && (
            <Table.Item><MainTable.Title>Homework Submitted</MainTable.Title></Table.Item>
          )
        }
        <Table.Item><MainTable.Title>Mentor's Comment</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Mentor's Observation</MainTable.Title></Table.Item>
        <Table.Item><MainTable.Title>Session Video Link</MainTable.Title></Table.Item>
        {
          !showSessionLogs && (
            <Table.Item><MainTable.Title>Next Call On</MainTable.Title></Table.Item>
          )
        }
        {
          this.props.savedRole !== MENTOR &&
            <React.Fragment>
              <Table.Item><MainTable.Title>Ratings</MainTable.Title></Table.Item>
              <Table.Item><MainTable.Title>Tags</MainTable.Title></Table.Item>
              <Table.Item><MainTable.Title>Child's Feedback</MainTable.Title></Table.Item>
              {
              !showSessionLogs && (
                <Table.Item><MainTable.Title>Toggle Audit</MainTable.Title></Table.Item>
              )
            }
              {
              !showSessionLogs && (
                <Table.Item><MainTable.Title>Post SalesAudit</MainTable.Title></Table.Item>
              )
              }
            </React.Fragment>
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
