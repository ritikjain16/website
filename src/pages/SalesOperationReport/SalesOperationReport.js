/* eslint-disable no-restricted-globals */
/* eslint-disable arrow-body-style */
import { chain, get, sumBy } from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
// eslint-disable-next-line no-unused-vars
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import CanvasJSReact from '../../assets/canvasjs.react'
import SalesOperationReportStyle from './SalesOperationReport.style'
import { lastNdates } from '../../utils/date/date-format'
import { calculatePercentage, createColumn } from './salesOperationReport-utils'

const { CanvasJSChart } = CanvasJSReact
class SalesOperationReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      totalUsersTableData: [],
      // eslint-disable-next-line react/no-unused-state
      convertedUsersTableData: [],
      issuesTableData: [],
      issueColumn: [],
      totalUsersColumn: [],
      convertedUsersColumn: [],
      sameDayUsersColumn: [],
      sameDayUsersTableData: [],
      totalUsers: 'Table',
      convertedUsers: 'Table',
      sameDayUsers: 'Table',
    }
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.createIssueTableFromData()
      if (this.state.totalUsers === 'Table') {
        this.createTotalUsersTable()
      }
      if (this.state.convertedUsers === 'Table') {
        this.createConvertedUsersTable()
      }
      if (this.state.sameDayUsers === 'Table') {
        this.createSameDayUsersTable()
      }
    }
  }
  mergeBasedOnDate = (data) => {
    const result = chain(data)
      .groupBy('date')
      .map((objects, date) => {
        const obj = {}
        obj.date = date
        obj.chromeIssue = sumBy(objects, 'chromeIssue')
        obj.classDurationExceeded = sumBy(objects, 'classDurationExceeded')
        obj.codePlaygroundIssue = sumBy(objects, 'codePlaygroundIssue')
        obj.internetIssue = sumBy(objects, 'internetIssue')
        obj.laptopIssue = sumBy(objects, 'laptopIssue')
        obj.leadNotVerifiedProperly = sumBy(objects, 'leadNotVerifiedProperly')
        obj.logInOTPError = sumBy(objects, 'logInOTPError')
        obj.notResponseAndDidNotTurnUp = sumBy(objects, 'notResponseAndDidNotTurnUp')
        obj.otherReasonForReschedule = sumBy(objects, 'otherReasonForReschedule')
        obj.powerCut = sumBy(objects, 'powerCut')
        obj.registeredSameDay = {}
        obj.registeredSameDay.booked = sumBy(objects, 'registeredSameDay.booked')
        obj.registeredSameDay.converted = sumBy(objects, 'registeredSameDay.converted')
        obj.registeredSameDay.demoCompleted = sumBy(objects, 'registeredSameDay.demoCompleted')
        obj.registeredSameDay.phoneVerified = sumBy(objects, 'registeredSameDay.phoneVerified')
        obj.registeredSameDay.registered = sumBy(objects, 'registeredSameDay.registered')
        obj.totalBooked = sumBy(objects, 'totalBooked')
        obj.totalConvertedUsers = sumBy(objects, 'totalConvertedUsers')
        obj.totalDemoCompleted = sumBy(objects, 'totalDemoCompleted')
        obj.turnedUpButLeftAbruptly = sumBy(objects, 'turnedUpButLeftAbruptly')
        obj.videoNotLoading = sumBy(objects, 'videoNotLoading')
        obj.webSiteLoadingIssue = sumBy(objects, 'webSiteLoadingIssue')
        obj.zoomIssue = sumBy(objects, 'zoomIssue')
        return obj
      })
      .value()
    return result
  }
  createTotalUsersTable = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    const totalUsersRow = ['Registration',
      <div style={{ height: '25px' }}><p style={{ marginBottom: '0px' }}>Trial Session Booked</p><p style={{ fontSize: '10px' }}>*(same + prev day booking)</p></div>,
      'Trial Session Completed',
      'Total Completed(%)'
    ]
    const totalUsersTableData = ['registeredSameDay.registered', 'totalBooked', 'totalDemoCompleted', 'totalCompleted%'].map((str, index) => {
      const obj = {
        key: `${index}`,
        srNo: `${index + 1}`,
        Total_Users: totalUsersRow[index],
      }
      const mergedDataBasedOnDate = this.mergeBasedOnDate(data)
      mergedDataBasedOnDate.forEach(element => {
        if (str === 'totalCompleted%') {
          const percent = ((get(element, 'totalDemoCompleted', 0) * 100 / get(element, 'totalBooked', 0))).toFixed(2)
          obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = (isNaN(percent) || !isFinite(percent)) ? '-' : percent
        } else {
          obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = get(element, str, 0)
        }
      })
      lastNdates(dateDiff).forEach(date => {
        if (!obj[date]) {
          obj[date] = 0
        }
      })
      return obj
    })
    this.setState(
      {
        totalUsersTableData,
      },
      () => this.setTotalUsersTableHeader()
    )
  }
  setTotalUsersTableHeader = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    let totalUsersColumn = []
    if (data.length > 0) {
      totalUsersColumn = createColumn('Total_Users')
      lastNdates(dateDiff).forEach((date) => {
        totalUsersColumn.push({
          title: date,
          dataIndex: date,
          key: date,
          align: 'center',
          width: dateDiff > 7 ? 100 : null,
        })
      })
    }
    this.setState({
      totalUsersColumn,
    })
  }
  createConvertedUsersTable = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    const convertedUsersRow = ['Trial Completed Session', 'Converted Users']
    const convertedUsersTableData = ['totalDemoCompleted', 'totalConvertedUsers'].map((str, index) => {
      const obj = {
        key: `${index}`,
        srNo: `${index + 1}`,
        Converted_Users: convertedUsersRow[index],
      }
      const mergedDataBasedOnDate = this.mergeBasedOnDate(data)
      mergedDataBasedOnDate.forEach(element => {
        obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = get(element, str, 0)
      })
      lastNdates(dateDiff).forEach(date => {
        if (!obj[date]) {
          obj[date] = 0
        }
      })
      return obj
    })
    this.setState(
      {
        convertedUsersTableData,
      },
      () => this.setConvertedUsersTableHeader()
    )
  }
  setConvertedUsersTableHeader =() => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    let convertedUsersColumn = []
    if (data.length > 0) {
      convertedUsersColumn = createColumn('Converted_Users')
      lastNdates(dateDiff).forEach((date) => {
        convertedUsersColumn.push({
          title: date,
          dataIndex: date,
          key: date,
          align: 'center',
          width: dateDiff > 7 ? 100 : null,
        })
      })
    }
    this.setState({
      convertedUsersColumn,
    })
  }
  createSameDayUsersTable = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    const sameDayUsersRow = ['Registered', 'Registered & Booked', 'Registered & Completed', 'Registered & Booked(%)', 'Registered & Completed(%)']
    const sameDayUsersTableData = ['registeredSameDay.registered', 'registeredSameDay.booked', 'registeredSameDay.demoCompleted', 'booked%', 'completed%'].map((str, index) => {
      const obj = {
        key: `${index}`,
        srNo: `${index + 1}`,
        Same_Day_Users: sameDayUsersRow[index],
      }
      const mergedDataBasedOnDate = this.mergeBasedOnDate(data)
      mergedDataBasedOnDate.forEach(element => {
        if (str === 'booked%') {
          const percent = ((get(element, 'registeredSameDay.booked', 0) * 100) / get(element, 'registeredSameDay.registered', 0)).toFixed(2)
          obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = (isNaN(percent) || !isFinite(percent)) ? '-' : percent
        } else if (str === 'completed%') {
          const percent = ((get(element, 'registeredSameDay.demoCompleted', 0) * 100) / get(element, 'registeredSameDay.registered', 0)).toFixed(2)
          obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = (isNaN(percent) || !isFinite(percent)) ? '-' : percent
        } else {
          obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = get(element, str, 0)
        }
      })
      lastNdates(dateDiff).forEach(date => {
        if (!obj[date]) {
          obj[date] = 0
        }
      })
      return obj
    })
    this.setState(
      {
        sameDayUsersTableData,
      },
      () => this.setSameDayUsersTableHeader()
    )
  }
  setSameDayUsersTableHeader = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    let sameDayUsersColumn = []
    if (data.length > 0) {
      sameDayUsersColumn = createColumn('Same_Day_Users')
      lastNdates(dateDiff).forEach((date) => {
        sameDayUsersColumn.push({
          title: date,
          dataIndex: date,
          key: date,
          align: 'center',
          width: dateDiff > 7 ? 100 : null,
        })
      })
    }
    this.setState({
      sameDayUsersColumn,
    })
  }
  createIssueTableFromData = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    const issues = ['internetIssue',
      'zoomIssue',
      'laptopIssue',
      'chromeIssue',
      'powerCut',
      'notResponseAndDidNotTurnUp',
      'classDurationExceeded',
      'turnedUpButLeftAbruptly',
      'leadNotVerifiedProperly',
      'otherReasonForReschedule',
      'webSiteLoadingIssue',
      'videoNotLoading',
      'codePlaygroundIssue',
      'logInOTPError',
      'Total'
    ]
    const issuesTableData = issues.map((issue, index) => {
      const obj = {
        key: `${index}`,
        srNo: `${index + 1}`,
        Issue: `${issue.replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())}`,
      }
      data.forEach(element => {
        obj[`${moment(get(element, 'date')).format('DD MMM YYYY')}`] = get(element, issue, 0)
      })
      lastNdates(dateDiff).forEach(date => {
        if (!obj[date]) {
          obj[date] = 0
        }
      })
      return obj
    })
    data.forEach(obj => {
      const { internetIssue = 0,
        zoomIssue = 0,
        laptopIssue = 0,
        chromeIssue = 0,
        powerCut = 0,
        notResponseAndDidNotTurnUp = 0,
        classDurationExceeded = 0,
        turnedUpButLeftAbruptly = 0,
        leadNotVerifiedProperly = 0,
        otherReasonForReschedule = 0,
        webSiteLoadingIssue = 0,
        videoNotLoading = 0,
        codePlaygroundIssue = 0,
        logInOTPError = 0 } = obj
      issuesTableData[issuesTableData.length - 1][`${moment(get(obj, 'date')).format('DD MMM YYYY')}`] = internetIssue + zoomIssue + laptopIssue + chromeIssue + powerCut + notResponseAndDidNotTurnUp + classDurationExceeded + turnedUpButLeftAbruptly + leadNotVerifiedProperly + otherReasonForReschedule + webSiteLoadingIssue + videoNotLoading + codePlaygroundIssue + logInOTPError
    })
    this.setState(
      {
        issuesTableData,
      },
      () => this.setIssuesTableHeader()
    )
  }
  setIssuesTableHeader = () => {
    const data = this.props.sessionReports
    const { dateDiff } = this.props
    let issueColumn = []
    if (data.length > 0) {
      issueColumn = createColumn('Issue')
      lastNdates(dateDiff).forEach((date) => {
        issueColumn.push({
          title: date,
          dataIndex: date,
          key: date,
          align: 'center',
          width: dateDiff > 7 ? 100 : null,
        })
      })
    }
    this.setState({
      issueColumn
    })
  }
  onTotalUsersChange = e => {
    this.setState({
      totalUsers: e.target.value ? e.target.value : this.state.totalUsers,
    },
    () => {
      if (this.state.totalUsers === 'Table') {
        this.createTotalUsersTable()
      }
    }
    )
  };
  onConvertedUsersChange = e => {
    this.setState({
      convertedUsers: e.target.value ? e.target.value : this.state.convertedUsers,
    },
    () => {
      if (this.state.convertedUsers === 'Table') {
        this.createConvertedUsersTable()
      }
    }
    )
  };
  onSameDayUsersChange = e => {
    this.setState({
      sameDayUsers: e.target.value ? e.target.value : this.state.sameDayUsers,
    },
    () => {
      if (this.state.sameDayUsers === 'Table') {
        this.createSameDayUsersTable()
      }
    }
    )
  };
  render() {
    const { fetchStatus, sessionReports, analyticsMeta, dateDiff } = this.props
    if (sessionReports.length) {
      const regDataPoints = []
      const bookedDataPoints = []
      const demoCompletedDataPoints = []
      const firstSessionBookedDataPoints = []
      const firstSessionCompletedDataPoints = []
      const convertedUsersDataPoint = []

      sessionReports.forEach((obj) => {
        const date = moment(get(obj, 'date')).format('DD-MM-YYYY')
        const registeredUsers = get(obj, 'registeredSameDay.registered')
        const bookedUsers = get(obj, 'registeredSameDay.booked')
        const demoCompletedUsers = get(obj, 'registeredSameDay.demoCompleted')
        const bookedSession = get(obj, 'totalBooked')
        const completedSession = get(obj, 'totalDemoCompleted')
        const convertedUsers = get(obj, 'totalConvertedUsers')

        regDataPoints.push({
          y: registeredUsers,
          label: date
        })
        bookedDataPoints.push({
          y: bookedUsers,
          label: date
        })
        demoCompletedDataPoints.push({
          y: demoCompletedUsers,
          label: date
        })
        // totalRegisteredUser += userRegisteredCount
        firstSessionBookedDataPoints.push({
          y: bookedSession,
          label: date
        })
        // totalTrialBooking += menteeFirstSessionBookedCount
        // totalSecondSessionCompleted += secondSessionCompletedCount
        firstSessionCompletedDataPoints.push({
          y: completedSession,
          label: date
        })
        // totalTrialCompleted += firstSessionCompletedCount
        // allSessionCompletedDataPoints.push({
        //   y: allSessionsCompletedCount,
        //   label: date
        // })
        // otherSessionCompletedDataPoints.push({
        //   y: allSessionsCompletedCount - completedSession,
        //   label: date
        // })
        convertedUsersDataPoint.push({
          y: convertedUsers,
          label: date
        })
      })
      const options4 = {
        animationEnabled: true,
        // eslint-disable-next-line quotes
        backgroundColor: "#F7F7F9",
        title: {
          text: `Same Day Data (${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`})`
        },
        axisY: {
          title: 'Users/Sessions'
        },
        toolTip: {
          shared: true
        },
        data: [
          {
            type: 'spline',
            name: 'Registered',
            showInLegend: true,
            dataPoints: regDataPoints
          },
          {
            type: 'spline',
            name: 'Booked',
            showInLegend: true,
            dataPoints: bookedDataPoints
          },
          {
            type: 'spline',
            name: 'Demo Completed',
            showInLegend: true,
            dataPoints: demoCompletedDataPoints
          },
        ]
      }
      const options2 = {
        animationEnabled: true,
        // eslint-disable-next-line quotes
        backgroundColor: "#F7F7F9",
        title: {
          text: `Converted Users/Sessions (${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`})`
        },
        axisY: {
          title: 'Users/Sessions'
        },
        toolTip: {
          shared: true
        },
        data: [
          {
            type: 'spline',
            name: 'Total Completed Sessions',
            showInLegend: true,
            dataPoints: firstSessionCompletedDataPoints
          },
          {
            type: 'spline',
            name: 'Converted Users',
            showInLegend: true,
            dataPoints: convertedUsersDataPoint
          },
        ]
      }
      const options = {
        animationEnabled: true,
        // eslint-disable-next-line quotes
        backgroundColor: "#F7F7F9",
        title: {
          text: `Number of Users/Sessions (${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`})`
        },
        axisY: {
          title: 'Users/Sessions'
        },
        toolTip: {
          shared: true
        },
        data: [
          {
            type: 'spline',
            name: 'Registration',
            showInLegend: true,
            dataPoints: regDataPoints
          },
          {
            type: 'spline',
            name: 'Trial Session Booked',
            showInLegend: true,
            dataPoints: firstSessionBookedDataPoints
          },
          {
            type: 'spline',
            name: 'Trial Session Completed',
            showInLegend: true,
            dataPoints: firstSessionCompletedDataPoints
          }
        ]
      }
      const totalBooked = get(analyticsMeta, 'totalBooked') || 0
      const totalConvertedUsers = get(analyticsMeta, 'totalConvertedUsers') || 0
      const totalDemoCompleted = get(analyticsMeta, 'totalDemoCompleted') || 0
      const totalRegisteredUsers = get(analyticsMeta, 'totalRegisteredUsers') || 0
      const options3 = {
        animationEnabled: true,
        title: {
          text: `Sales Analysis (${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`})`
        },
        data: [{
          type: 'funnel',
          neckWidth: 10,
          neckHeight: 0,
          valueRepresents: 'area',
          toolTipContent: '<b>{label}</b>: {y} <b>({percentage}%)</b>',
          indexLabelPlacement: 'outside',
          indexLabel: '{label} ({percentage}%)',
          dataPoints: [
            { y: totalRegisteredUsers, label: `Registered-${totalRegisteredUsers}`, percentage: 100 },
            { y: totalBooked, label: `Trial Booked-${totalBooked}`, percentage: calculatePercentage(totalBooked, totalRegisteredUsers) },
            { y: totalDemoCompleted, label: `Trial Completed-${totalDemoCompleted}`, percentage: calculatePercentage(totalDemoCompleted, totalBooked) },
            { y: totalConvertedUsers, label: `Converted User-${totalConvertedUsers}`, percentage: calculatePercentage(totalConvertedUsers, totalDemoCompleted) },
          ]
        }]
      }
      const { totalUsers, convertedUsers, sameDayUsers } = this.state
      if (fetchStatus && fetchStatus.toJS().success && (totalRegisteredUsers
      || totalBooked || totalDemoCompleted || totalConvertedUsers)) {
        return (
          <div>
            <div style={{ padding: '20px', paddingBottom: '40px' }}>
              <SalesOperationReportStyle.TableDiv>
                <SalesOperationReportStyle.RadioDiv>
                  <Radio.Group
                    onChange={this.onTotalUsersChange}
                    value={totalUsers}
                    // eslint-disable-next-line jsx-quotes
                    buttonStyle="solid"
                  >
                    <Radio.Button value='Table'>Table</Radio.Button>
                    <Radio.Button value='Graph'>Graph</Radio.Button>
                  </Radio.Group>
                </SalesOperationReportStyle.RadioDiv>
                {this.state.totalUsers === 'Graph' ? <CanvasJSChart options={options} /> : <>
                  <SalesOperationReportStyle.H1>
                    {`Number of Users/Sessions [${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`}]`}
                  </SalesOperationReportStyle.H1>
                  <SalesOperationReportStyle.SalsesOperationReportTable
                    dataSource={this.state.totalUsersTableData}
                    columns={this.state.totalUsersColumn}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                  />
                </>}
              </SalesOperationReportStyle.TableDiv>
            </div>
            <div style={{ padding: '20px', paddingBottom: '40px' }}>
              <SalesOperationReportStyle.TableDiv>
                <SalesOperationReportStyle.RadioDiv>
                  <Radio.Group
                    onChange={this.onConvertedUsersChange}
                    value={convertedUsers}
                    // eslint-disable-next-line jsx-quotes
                    buttonStyle="solid"
                  >
                    <Radio.Button value='Table'>Table</Radio.Button>
                    <Radio.Button value='Graph'>Graph</Radio.Button>
                  </Radio.Group>
                </SalesOperationReportStyle.RadioDiv>
                {this.state.convertedUsers === 'Graph' ? <CanvasJSChart options={options2} /> : <>
                  <SalesOperationReportStyle.H1>
                    {`Converted Users/Sessions [${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`}]`}
                  </SalesOperationReportStyle.H1>
                  <SalesOperationReportStyle.SalsesOperationReportTable
                    dataSource={this.state.convertedUsersTableData}
                    columns={this.state.convertedUsersColumn}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                  />
                </>}
              </SalesOperationReportStyle.TableDiv>
            </div>
            {/* Same day stats start */}
            <div style={{ padding: '20px', paddingBottom: '40px' }}>
              <SalesOperationReportStyle.TableDiv>
                <SalesOperationReportStyle.RadioDiv>
                  <Radio.Group
                    onChange={this.onSameDayUsersChange}
                    value={sameDayUsers}
                    // eslint-disable-next-line jsx-quotes
                    buttonStyle="solid"
                  >
                    <Radio.Button value='Table'>Table</Radio.Button>
                    <Radio.Button value='Graph'>Graph</Radio.Button>
                  </Radio.Group>
                </SalesOperationReportStyle.RadioDiv>
                {this.state.sameDayUsers === 'Graph' ? <CanvasJSChart options={options4} /> : <>
                  <SalesOperationReportStyle.H1>
                    {`Same Day Data [${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`}]`}
                  </SalesOperationReportStyle.H1>
                  <SalesOperationReportStyle.SalsesOperationReportTable
                    dataSource={this.state.sameDayUsersTableData}
                    columns={this.state.sameDayUsersColumn}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                  />
                </>}
              </SalesOperationReportStyle.TableDiv>
            </div>
            {/* same day stats end */}
            <div style={{ padding: '20px', paddingBottom: '40px' }}>
              <CanvasJSChart options={options3} />
            </div>
            <div style={{ padding: '20px', paddingBottom: '40px' }}>
              <SalesOperationReportStyle.H1>
                {`Issues Analysis [${dateDiff === 1 ? `${dateDiff} day` : `${dateDiff} days`}]`}
              </SalesOperationReportStyle.H1>
              <SalesOperationReportStyle.SalsesOperationReportTable
                dataSource={this.state.issuesTableData}
                columns={this.state.issueColumn}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
            </div>
          </div>
        )
      }
      return null
    }
    return null
  }
}

export default SalesOperationReport
