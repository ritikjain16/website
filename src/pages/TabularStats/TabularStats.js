import React, { Component } from 'react'
import { debounce, get } from 'lodash'
import moment from 'moment'
import { Button, Switch, Table } from 'antd'
import StatsTopContainer from '../Stats/Stats.styles'
import fetchSessionReports from '../../actions/stats/fetchSessionReports'
import DateRangePicker from '../../components/FromToDatePicker/DateRangePicker'
import { filterKey } from '../../utils/data-utils'
import offsetDate from '../../utils/date/date-offset'
import './antdTableStyle.scss'

class TabularStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDatePicker: false,
      fromDate: new Date(),
      toDate: null,
      fetchCount: 0,
      currentPageNumber: 1,
      data: [],
      columns: [],
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '2D', subtract: { duration: '1', unit: 'd' } },
        { label: '3D', subtract: { duration: '2', unit: 'd' } },
        { label: '4D', subtract: { duration: '3', unit: 'd' } },
        { label: '5D', subtract: { duration: '4', unit: 'd' } },
        { label: '6D', subtract: { duration: '5', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
      ],
      selectedRange: '{"duration":"0","unit":"d"}',
      country: localStorage.getItem('country') || 'india'
    }
  }
  componentDidMount = () => {
    this.handleDateRange(this.state.selectedRange)
    window.addEventListener('click', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country') || 'india'
        })
      }
    })
  }
  componentDidUpdate = (prevProps, prevState) => {
    const startDate = offsetDate(new Date(this.state.fromDate), (this.state.currentPageNumber - 1) * 7, 'ADD')
    const { sessionReportsFetchStatus } = this.props
    if (this.state.country !== prevState.country) {
      this.fetchStatsData()
    }
    const fetchStatus = sessionReportsFetchStatus.getIn([`sessionReports/${this.state.fetchCount}`])
    const prevFetchStatus = prevProps.sessionReportsFetchStatus.getIn([`sessionReports/${this.state.fetchCount}`])
    if (fetchStatus && !get(fetchStatus.toJS(), 'loading')
      && get(fetchStatus.toJS(), 'success') &&
      (prevFetchStatus !== fetchStatus)) {
      const columns = this.getColumns(startDate)
      let data = []
      data = this.getTableData()
      this.setState({
        columns,
        data
      })
    }
  }
  fetchStatsData = async () => {
    const { fromDate, toDate, country, fetchCount } = this.state
    let filterQuery = ''
    filterQuery += fromDate ? `{ date_gte: "${moment(fromDate).startOf('day')}" }` : ''
    filterQuery += toDate ? ` { date_lte: "${moment(toDate).endOf('day')}" }` : ''
    filterQuery += country ? `{ country: ${country} }` : ''
    this.setState({
      fetchCount: fetchCount + 1
    })
    debounce(() => {
      fetchSessionReports(filterQuery, this.state.fetchCount)
    }, 500)()
  }
  getColumns = (startDate) => {
    const dateDiff = this.getDateDiff()
    const columns = [
      {
        title: 'Title',
        dataIndex: 'rowTitle',
        align: 'center',
        width: 300,
      }
    ]
    for (let i = 0; i < this.getDateDiff(); i += 1) {
      if (i === 0) {
        columns.push({
          title: `${moment(startDate).format('DD MMM YYYY')}`,
          dataIndex: `${moment(startDate).format('DD-MM-yyyy')}`,
          width: dateDiff > 7 ? 100 : null,
        })
      } else {
        columns.push({
          title: `${moment(offsetDate(startDate, i, 'ADD')).format('DD MMM YYYY')}`,
          dataIndex: `${moment(offsetDate(startDate, i, 'ADD')).format('DD-MM-yyyy')}`,
          width: dateDiff > 7 ? 100 : null,
        })
      }
    }
    return columns
  }
  handleDateRange = (rangeInString) => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      this.handleDateChange([
        moment().subtract(range.duration, range.unit),
        moment()
      ], 'rangeSelector')
    })
  }
  getDayWiseData = (key, title) => {
    const datediff = this.getDateDiff()
    let { sessionReports } = this.props
    const { fetchCount } = this.state
    const currDate = offsetDate(new Date(this.state.fromDate), (this.state.currentPageNumber - 1) * 7, 'ADD')
    sessionReports = sessionReports && filterKey(sessionReports, `sessionReports/${fetchCount}`).toJS() || []
    const dataDayWise = {}
    for (let j = 0; j < datediff; j += 1) {
      const reportDate = moment(offsetDate(currDate, j, 'ADD')).format('DD-MM-yyyy').toString()
      const sr = sessionReports[j]
      const value = get(sr, key, 0)
      dataDayWise[reportDate] = [
        <div>
          { value || 0 }
        </div>
      ]
    }

    dataDayWise.rowTitle = title
    return dataDayWise
  }
  getTableData = () => {
    const { sessionReports } = this.props
    const data = []
    if (sessionReports) {
      data.push(this.getDayWiseData('registeredSameDay.registered', 'Registered'))
      data.push(this.getDayWiseData('totalBooked', 'Total Sessions Booked'))
      data.push(this.getDayWiseData('totalDemoCompleted', 'Total Sessions Completed'))
      data.push(this.getDayWiseData('totalConvertedUsers', 'Converted Users'))
      data.push(this.getDayWiseData('zoomIssue', 'Zoom Issue'))
      data.push(this.getDayWiseData('internetIssue', 'Internet Issue'))
      data.push(this.getDayWiseData('laptopIssue', 'Laptop Issue'))
      data.push(this.getDayWiseData('chromeIssue', 'Chrome Issue'))
      data.push(this.getDayWiseData('powerCut', 'Power Cut'))
      data.push(this.getDayWiseData('notResponseAndDidNotTurnUp', 'Did Not Turn Up'))
      data.push(this.getDayWiseData('classDurationExceeded', 'Class Duration Excedded'))
      data.push(this.getDayWiseData('turnedUpButLeftAbruptly', 'Left Abruptly'))
      data.push(this.getDayWiseData('leadNotVerifiedProperly', 'Not verified Properly'))
      data.push(this.getDayWiseData('otherReasonForReschedule', 'Other reason for reschedule'))
      data.push(this.getDayWiseData('webSiteLoadingIssue', 'Website Not Loading'))
      data.push(this.getDayWiseData('videoNotLoading', 'Video Not Loading'))
      data.push(this.getDayWiseData('codePlaygroundIssue', 'Code Playground issue'))
      data.push(this.getDayWiseData('logInOTPError', 'Login OTP Error'))
    }

    return data
  }
  getDateDiff = () => {
    let dateDiff = 0
    let { fromDate, toDate } = this.state
    if (fromDate && toDate) {
      fromDate = moment(fromDate).startOf('day')
      toDate = moment(toDate).endOf('day')
      dateDiff = moment(toDate).diff(moment(fromDate), 'days')
    }
    if (dateDiff < 7) return dateDiff + 1
    return dateDiff
  }
  handleDateChange = (event, type) => {
    if (type === 'rangeSelector') {
      const dates = event
      this.setState({
        fromDate: dates && dates[0] ? new Date(dates[0]).toDateString() : null,
        toDate: dates && dates[1] ? new Date(dates[1]).toDateString() : null,
      }, this.fetchStatsData)
    } else if (type === 'from') {
      this.setState({
        fromDate: event && (new Date(event)).toDateString(),
      }, this.fetchStatsData)
    } else if (type === 'to') {
      this.setState({
        toDate: event && (new Date(event)).toDateString()
      }, this.fetchStatsData)
    }
  }
  render() {
    const { showDatePicker, fromDate, toDate, dateRanges,
      selectedRange, fetchCount } = this.state
    const { sessionReportsFetchStatus } = this.props
    const fetchStatus = sessionReportsFetchStatus.getIn([`sessionReports/${fetchCount}`])
    return (
      <div>
        <StatsTopContainer>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Filter by Date Range :
              <Switch size='small' checked={showDatePicker} onChange={(checked) => this.setState({ showDatePicker: checked })} />
            </span>
          </div>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex' }}>
                {
                  showDatePicker && (
                    <DateRangePicker
                      fromDate={fromDate}
                      toDate={toDate}
                      handleDateChange={this.handleDateChange}
                    />
                  )
                }
                <div style={{ marginLeft: '15px' }}>
                  {dateRanges.map(range =>
                    <Button
                      type={JSON.stringify(range.subtract) === selectedRange ? 'primary' : 'default'}
                      shape='circle'
                      onClick={() => this.handleDateRange(JSON.stringify(range.subtract), 'user')}
                      style={{
                        margin: '0 5px'
                      }}
                    >{range.label}
                    </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </StatsTopContainer>
        <Table
          className='reportTable'
          bordered
          rowKey='id'
          dataSource={this.state.data}
          size='middle'
          columns={this.state.columns}
          loading={fetchStatus && get(fetchStatus.toJS(), 'loading')}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </div>
    )
  }
}

export default TabularStats
