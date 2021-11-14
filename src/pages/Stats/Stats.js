import React, { Component } from 'react'
import RenderCards from './Components/Cards/Cards'
import StatsTopContainer from './Stats.styles'
import fetchStatsMeta from '../../actions/stats/fetchStats'
import SingleTableModal from './Components/SingleTableModal/SingleTableModal'
import SalesOperationReport from '../SalesOperationReport/SalesOperationReport'
import moment from 'moment'
import { Button, Switch } from 'antd'
import DateRangePicker from '../../components/FromToDatePicker/DateRangePicker'
import { debounce, get } from 'lodash'
import fetchSessionReports from '../../actions/stats/fetchSessionReports'
import { filterKey } from '../../utils/data-utils'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalTitle: '',
      fromDate: null,
      toDate: null,
      dateRanges: [
        { label: 'Yesterday', subtract: { duration: '1', unit: 'd' } },
        { label: '3D', subtract: { duration: '2', unit: 'd' } },
        { label: '4D', subtract: { duration: '3', unit: 'd' } },
        { label: '5D', subtract: { duration: '4', unit: 'd' } },
        { label: '6D', subtract: { duration: '5', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
      ],
      selectedRange: '{"duration":"7","unit":"d"}',
      country: 'india',
      vertical: 'b2c',
      showDatePicker: false,
      analyticsMeta: {},
      sessionReports: [],
      fetchCount: 0
    }
  }

  componentDidMount = () => {
    this.handleDateRange(this.state.selectedRange)
    localStorage.setItem('country', 'india')
    window.dispatchEvent(new Event('storage'))
    window.addEventListener('storage', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { sessionReportsFetchStatus } = this.props
    if (this.state.country !== prevState.country || this.state.vertical !== prevState.vertical) {
      this.fetchStatsData()
    }
    const fetchStatus = sessionReportsFetchStatus.getIn([`sessionReports/${this.state.fetchCount}`])
    const prevFetchStatus = prevProps.sessionReportsFetchStatus.getIn([`sessionReports/${this.state.fetchCount}`])
    if (fetchStatus && !get(fetchStatus.toJS(), 'loading')
      && get(fetchStatus.toJS(), 'success') &&
      (prevFetchStatus !== fetchStatus)) {
      this.convertSessionData()
    }
  }

  convertSessionData = () => {
    let { sessionReports } = this.props
    const { fetchCount } = this.state
    sessionReports = sessionReports && filterKey(sessionReports, `sessionReports/${fetchCount}`).toJS() || []
    let totalBooked = 0
    let totalConvertedUsers = 0
    let totalDemoCompleted = 0
    let totalRegisteredUsers = 0
    let totalVerifiedUsers = 0
    sessionReports.forEach(sReport => {
      totalBooked += get(sReport, 'totalBooked', 0)
      totalConvertedUsers += get(sReport, 'totalConvertedUsers', 0)
      totalDemoCompleted += get(sReport, 'totalDemoCompleted', 0)
      totalRegisteredUsers += get(sReport, 'registeredSameDay.registered', 0)
      totalVerifiedUsers += get(sReport, 'registeredSameDay.phoneVerified', 0)
    })
    this.setState({
      analyticsMeta: {
        totalBooked,
        totalConvertedUsers,
        totalDemoCompleted,
        totalRegisteredUsers,
        totalVerifiedUsers
      },
      sessionReports
    })
  }
  fetchStatsData = async () => {
    let { fromDate, toDate,
      country, fetchCount,
      vertical } = this.state
    let filterQuery = ''
    filterQuery += fromDate ? `{ date_gte: "${moment(fromDate).startOf('day')}" }` : ''
    filterQuery += toDate ? ` { date_lte: "${moment(toDate).endOf('day')}" }` : ''
    filterQuery += (country && country !== 'all') ? `{ country: ${country} }` : ''
    if (vertical && vertical === 'all') {
      filterQuery += '{vertical_in: [b2c, b2b2c]}'
    } else if (vertical && vertical !== 'all') {
      filterQuery += `{vertical: ${vertical}}`
    }
    this.setState({
      fetchCount: fetchCount + 1
    })
    debounce(() => {
      fetchSessionReports(filterQuery, this.state.fetchCount)
    }, 500)()
  }
  handleDateRange = (rangeInString, type) => {
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
  openModal = (title) => { this.setState({ showModal: true, modalTitle: title }) }
  closeModal = () => { this.setState({ showModal: false, modalTitle: '' }) }
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
  handleCountryChange = (value) => {
    this.setState({
      country: value
    })
    localStorage.setItem('country', value)
    window.dispatchEvent(new Event('storage'))
  }
  handleVerticalChange = (value) => {
    this.setState({
      vertical: value
    })
  }
  render() {
    const { fromDate, toDate, dateRanges, selectedRange,
      analyticsMeta, showDatePicker, fetchCount,
      sessionReports } = this.state
    const { sessionReportsFetchStatus } = this.props
    const fetchStatus = sessionReportsFetchStatus.getIn([`sessionReports/${fetchCount}`])
    const countriesArray = [
      {
        countryValue: 'india',
        country: 'INDIA'
      },
      {
        countryValue: 'uae',
        country: 'UAE'
      }
    ]
    const verticalsArray = [
      {
        verticalValue: 'all',
        vertical: 'ALL'
      },
      {
        verticalValue: 'b2c',
        vertical: 'B2C'
      },
      {
        verticalValue: 'b2b2c',
        vertical: 'B2B2C'
      }
    ]
    return (
      <div>
        <StatsTopContainer>
          <StatsTopContainer.innerContainer>
            {/* <span>
              <StatsTopContainer.filledCircle filterWillWork={true} />
              Date Filter can be applied
            </span>
            <span>
              <StatsTopContainer.filledCircle filterWillWork={false} />
              Date Filter can't be applied
            </span> */}
            <span>
              Filter by Date Range :
              <Switch
                checked={showDatePicker}
                onChange={(checked) => this.setState({ showDatePicker: checked })}
                size='small'
              />
            </span>
          </StatsTopContainer.innerContainer>
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
                      shape={range.label === 'Yesterday' ? 'round' : 'circle'}
                      onClick={() => this.handleDateRange(JSON.stringify(range.subtract), 'user')}
                      style={{
                        margin: '0 5px'
                      }}
                    >
                      {range.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </StatsTopContainer>
        <StatsTopContainer>
          <div style={{ display: 'flex' }}>
            {
              countriesArray.map((c) => (
                <StatsTopContainer.StyledTab
                  checked={c.countryValue === this.state.country}
                  onClick={() => this.handleCountryChange(c.countryValue)}
                >
                  {c.country}
                </StatsTopContainer.StyledTab>
              ))
            }
          </div>
          <div style={{ display: 'flex' }}>
            {
              verticalsArray.map((c) => (
                <StatsTopContainer.StyledTab
                  checked={c.verticalValue === this.state.vertical}
                  onClick={() => this.handleVerticalChange(c.verticalValue)}
                >
                  {c.vertical}
                </StatsTopContainer.StyledTab>
              ))
            }
          </div>
        </StatsTopContainer>
        <RenderCards
          openModal={this.openModal}
          analyticsMeta={analyticsMeta}
          fetchStatus={fetchStatus}
          dateDiff={this.getDateDiff()}
        />
        <SalesOperationReport
          salesOperationReport={this.props.salesOperationReport}
          analyticsMeta={analyticsMeta}
          fetchStatus={fetchStatus}
          sessionReports={sessionReports}
          dateDiff={this.getDateDiff()}
        />
        {
          this.state.showModal ?
            <SingleTableModal
              closeModal={this.closeModal}
              title={this.state.modalTitle}
              fromDate={fromDate}
              toDate={toDate}
            />
            :
            null
        }
      </div>
    )
  }
}

export default Stats
