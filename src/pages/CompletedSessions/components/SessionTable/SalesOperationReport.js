import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { get, startCase } from 'lodash'
import { Badge, Col, Divider, Row, Tag, DatePicker, Spin } from 'antd'
import moment from 'moment'
import fetchSalesOperationReportOfTheDay from '../../../../actions/sessions/fetchSalesOperationReportOfTheDay'

class SalesOperationReport extends Component {
  state = {
    reschedulingReasons: [
      'zoomIssue',
      'internetIssue',
      'laptopIssue',
      'chromeIssue',
      'powerCut',
      'notResponseAndDidNotTurnUp',
      'turnedUpButLeftAbruptly',
      'leadNotVerifiedProperly',
      'otherReasonForReschedule'
    ],
    reportingDates: null
  }

  componentDidMount() {
    this.setState({
      reportingDates: [
        moment(get(this.props, 'date'))
          .startOf('day')
          .toISOString(),
        moment(get(this.props, 'date'))
          .endOf('day')
          .toISOString()
      ]
    })
  }

  componentDidUpdate(prevProps) {
    const fetchStatus = get(this.props, 'fetchStatus') && get(this.props, 'fetchStatus').toJS()
    const fetchStatusPrev = get(prevProps, 'fetchStatus') && get(prevProps, 'fetchStatus').toJS()
    if (!get(fetchStatus, 'loading') && get(fetchStatusPrev, 'loading')) {
      this.getOverallData()
    }

    if (get(prevProps, 'date') !== get(this.props, 'date')) {
      this.setState({
        reportingDates: [
          moment(get(this.props, 'date'))
            .startOf('day')
            .toISOString(),
          moment(get(this.props, 'date'))
            .endOf('day')
            .toISOString()
        ]
      })
    }
  }

  getOverallData = () => {
    const salesOperationReport =
      get(this.props, 'salesOperationReport') && get(this.props, 'salesOperationReport').toJS()
    const overallData = {}
    let totalReschedulingProblems = 0
    if (salesOperationReport.length > 1) {
      salesOperationReport.forEach(report => {
        Object.keys(report).forEach(key => {
          if (key !== '_id' && key !== 'firstCompletedSessionsPercentage' && overallData[key]) {
            overallData[key] += report[key]
          } else if (key !== '_id' && key !== 'firstCompletedSessionsPercentage' && !overallData[key]) {
            overallData[key] = report[key]
          }
        })
      })
      overallData.firstCompletedSessionsPercentage =
        Math.round((get(overallData, 'firstSessionCompletedCount') * 100) / get(overallData, 'firstMentorMenteeSessionsCount'))
      get(this.state, 'reschedulingReasons').forEach(reason => {
        if (get(overallData, reason)) {
          totalReschedulingProblems += get(overallData, reason)
        }
      })
    } else if (salesOperationReport.length === 1) {
      get(this.state, 'reschedulingReasons').forEach(reason => {
        if (get(salesOperationReport[0], reason)) {
          totalReschedulingProblems += get(salesOperationReport[0], reason)
        }
      })
    }
    this.setState({
      salesOperationReport: overallData,
      totalReschedulingProblems
    })
  }

  handleDateChange = date => {
    this.setState(
      {
        reportingDates: date
      },
      () => {
        fetchSalesOperationReportOfTheDay({
          fromDate: date[0]
            ? moment(date[0])
              .startOf('day')
              .toISOString()
            : '',
          toDate: date[1]
            ? moment(date[1])
              .endOf('day')
              .toISOString()
            : ''
        })
      }
    )
  }

  renderTotalDays = () => {
    const salesOperationReport =
      get(this.props, 'salesOperationReport') && get(this.props, 'salesOperationReport').toJS()
    if (salesOperationReport && salesOperationReport.length <= 1) {
      return null
    }
    const day1 = get(this.state, 'reportingDates.0') && moment(get(this.state, 'reportingDates.0'))
    const day2 = get(this.state, 'reportingDates.1') && moment(get(this.state, 'reportingDates.1'))
    let totalDays = ''
    if (day1 && day2) {
      totalDays = `Overall data of ${Math.abs(day1.diff(day2, 'days'))} days`
    } else if (day1) {
      totalDays = `From ${day1.format('DD/MM/YYYY')}`
    } else if (day2) {
      totalDays = `Till ${day2.format('DD/MM/YYYY')}`
    }
    return (
      <Fragment>
        <p> {totalDays} </p>
        <Divider />
      </Fragment>
    )
  }

  render() {
    let salesOperationReport =
      get(this.props, 'salesOperationReport') && get(this.props, 'salesOperationReport').toJS()
    if (salesOperationReport && salesOperationReport.length > 1) {
      salesOperationReport = get(this.state, 'salesOperationReport')
    } else if (salesOperationReport) {
      salesOperationReport = get(salesOperationReport, '0')
    }
    const loading =
      get(this.props, 'fetchStatus') && get(get(this.props, 'fetchStatus').toJS(), 'loading')
    let noRescheduling = true
    return (
      <div style={{ minHeight: 400 }}>
        <div>
          <p>
            Date:
            <DatePicker.RangePicker
              format='DD-MM-YYYY'
              value={[
                moment(get(this.state, 'reportingDates.0')),
                moment(get(this.state, 'reportingDates.1'))
              ]}
              onCalendarChange={this.handleDateChange}
              allowEmpty={[true, true]}
            />
          </p>
        </div>
        <Divider />
        {loading ? (
          <Spin />
        ) : (
          <Fragment>
            {this.renderTotalDays()}
            <Row>
              <Col span={16}>Registered Users</Col>
              <Col span={8}>: {get(salesOperationReport, 'userRegisteredCount') || '0'} </Col>
            </Row>
            <Row>
              <Col span={16}>Sessions booked by Mentee</Col>
              <Col span={8}>
                : {get(salesOperationReport, 'menteeFirstSessionBookedCount') || '0'}{' '}
              </Col>
            </Row>
            <Row>
              <Col span={16}>Total Assigned Sessions </Col>
              <Col span={8}>
                : {get(salesOperationReport, 'firstMentorMenteeSessionsCount') || '0'}{' '}
              </Col>
            </Row>
            <Row>
              <Col span={16}>Total Completed Sessions </Col>
              <Col span={8}>
                : {get(salesOperationReport, 'firstSessionCompletedCount') || '0'}{' '}
              </Col>
            </Row>
            <Row>
              <Col span={16}>Completed % </Col>
              <Col span={8}>
                : {get(salesOperationReport, 'firstCompletedSessionsPercentage') || '0'}{' '}
              </Col>
            </Row>
            <Divider />
            <p>Rescheduling Problems Occured: {get(this.state, 'totalReschedulingProblems')}</p>
            {this.state.reschedulingReasons.map(reason => {
              if (get(salesOperationReport, `${reason}`)) {
                noRescheduling = false
              }
              return (
                get(salesOperationReport, `${reason}`) && (
                  <Badge
                    count={get(salesOperationReport, `${reason}`)}
                    offset={[-5, 5]}
                    style={{ backgroundColor: '#13c2c2' }}
                  >
                    <Tag
                      style={{
                        color: '#1890ff',
                        background: '#e6f7ff',
                        borderColor: '#91d5ff',
                        margin: '5px 10px'
                      }}
                    >
                      {startCase(reason)}
                    </Tag>
                  </Badge>
                )
              )
            })}
            {noRescheduling && <p>No Problems Occured</p>}
          </Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  salesOperationReport: state.data.getIn(['salesOperationReport', 'data']),
  fetchStatus: state.data.getIn([
    'salesOperationReportOfTheDay',
    'fetchStatus',
    'salesOperationReportOfTheDay'
  ])
})

export default connect(mapStateToProps)(SalesOperationReport)
