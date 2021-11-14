/* eslint-disable max-len */
import React, { Component, Fragment } from 'react'
import { DatePicker, Button, notification, Pagination, Switch } from 'antd'
import { get, orderBy } from 'lodash'
import moment from 'moment'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import SearchBox from './components/SearchBox'
import BatchAttendanceStyle from './BatchAttendance.style'
import BatchAttendanceTable from './components/BatchAttendanceTable'
import fetchBatchSessions from '../../../actions/batchAttendance/fetchBatchSessions'
import fetchMentors from '../../../actions/assignTime/fetchMentors'
import { ADMIN, MENTOR, SALES_EXECUTIVE, SCHOOL_ADMIN, SMS, UMS_ADMIN, UMS_VIEWER } from '../../../constants/roles'
import fetchAllSchools from '../../../actions/smsDashboard/fetchAllSchools'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import fetchMentorsSales from '../../../actions/batchUserMap/fetchMentorsSales'

export default class MentorPayReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      batchesData: [],
      fromDate: null,
      toDate: null,
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '3D', subtract: { duration: '3', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: 'A', subtract: { duration: 'all' } },
      ],
      selectedRange: '{"duration":"7","unit":"d"}',
      searchKey: 'All',
      searchValue: '',
      batchCodeFilter: null,
      datasArray: [],
      paramBatchCode: this.props.match.params.code,
      schools: [],
      perPage: 10,
      skip: 0,
      currentPage: 1,
      mentorsId: [],
      role: ''
    }
  }

  async componentWillMount() {
    let batchCodeFilter = ''
    const { perPage, skip } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (this.state.paramBatchCode) {
      batchCodeFilter = `{code: "${this.state.paramBatchCode}"}`
      this.handleDateRange('{"duration":"all"}', true)
    } else {
      // first call
      this.handleDateRange(this.state.selectedRange, true)
    }
    if (savedRole && (savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === ADMIN)) {
      await fetchMentors().then(() => {
        this.setState({
          datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
            {
              id,
              name
            }
          )))],
          mentorsId: [],
          role: savedRole
        }, () => {
          fetchBatchSessions({
            filterQuery: `
            {type_not: normal}
              ${savedRole === SCHOOL_ADMIN && this.state.schools.length > 0 ? `
            {
                students_some: {
                  school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] }
                }
              }
          ` : ''}
            `,
            role: this.state.role,
            mentorsId: this.state.mentorsId,
            batchCodeFilter,
            perPage,
            skip,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            key: SMS
          })
        })
      })
    }
    if (savedRole && savedRole === SALES_EXECUTIVE) {
      const savedId = getDataFromLocalStorage('login.id')
      await fetchMentorsSales(savedId).then(res => {
        this.setState({
          mentorsId: res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id),
          role: savedRole,
          datasArray: get(res, 'user.salesExecutiveProfile.mentors', []).map(({ user }) => user)
        }, () => {
          fetchBatchSessions({
            filterQuery: `
            {type_not: normal}
              ${savedRole === SCHOOL_ADMIN && this.state.schools.length > 0 ? `
            {
                students_some: {
                  school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] }
                }
              }
          ` : ''}
            `,
            role: this.state.role,
            mentorsId: this.state.mentorsId,
            batchCodeFilter,
            perPage,
            skip,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            key: SMS
          })
        })
      })
    } else if (savedRole && savedRole === MENTOR) {
      const savedId = getDataFromLocalStorage('login.id')
      this.setState({
        mentorsId: [savedId],
        role: savedRole
      }, () => {
        fetchBatchSessions({
          filterQuery: `
          {type_not: normal}
            ${savedRole === SCHOOL_ADMIN && this.state.schools.length > 0 ? `
          {
              students_some: {
                school_some: { id_in: [${getIdArrForQuery(this.state.schools)}] }
              }
            }
        ` : ''}
          `,
          role: this.state.role,
          mentorsId: this.state.mentorsId,
          batchCodeFilter,
          perPage,
          skip,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          key: SMS
        })
      })
    }
    if (savedRole === SCHOOL_ADMIN) {
      const savedId = getDataFromLocalStorage('login.id')
      const { schools } = await fetchAllSchools(savedId)
      this.setState({
        schools: schools.map(({ id }) => id)
      })
    }
  }

  componentDidMount() {
    this.setState({
      batchesData: this.props.batches ? this.props.batches.toJS() : [],
      datasArray: [...new Set(this.props.mentors.toJS().map(({ id, name }) => (
        {
          id,
          name
        }
      )))]
    })
  }

  componentDidUpdate(prevProps) {
    const { batchFetchStatus, batchUpdatingStatus } = this.props
    if (batchFetchStatus && !get(batchFetchStatus.toJS(), 'loading')
      && get(batchFetchStatus.toJS(), 'success') &&
      (prevProps.batchFetchStatus !== batchFetchStatus)) {
      this.setBatchesData()
    }
    if (batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'success') &&
      (prevProps.batchUpdatingStatus !== batchUpdatingStatus)) {
      notification.success({
        message: 'Session updated successfully'
      })
      this.setBatchesData()
    }
    if (prevProps.isUpdatingAttendance && this.props.updateAttendanceError) {
      notification.error({
        message: 'Attendance Not Updated!'
      })
    }
  }
  setBatchesData = () => {
    const batchesData = this.props.batches &&
      this.props.batches.toJS() &&
      this.props.batches.toJS().length > 0 ?
      this.props.batches.toJS() : []
    this.setState({
      batchesData
    })
  }
  handleDateRange = (rangeInString, first) => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.handleDateChange([], first)
      } else {
        this.handleDateChange([
          moment().subtract(range.duration, range.unit),
          moment()
        ], first)
      }
    })
  }

  handleDateChange = (dates, first) => {
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : '',
      toDate: dates && dates[1] ? dates[1] : '',
    }, () => !first && this.callFetchQueryForFiltering())
  }
  callFetchQueryForFiltering = () => {
    const {
      searchKey,
      batchCodeFilter,
      searchValue,
      schools,
      perPage,
      skip,
      fromDate,
      toDate,
      paramBatchCode,
      role,
      mentorsId
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (searchKey === 'All') {
      this.setState({
        searchKey: 'All',
        searchValue: '',
        batchCodeFilter: null,
      }, async () => fetchBatchSessions({
        filterQuery: `
        {type_not: normal}
        ${savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
      {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(schools)}] }
          }
        }
    ` : ''}
      `,
        role,
        mentorsId,
        perPage,
        skip,
        fromDate,
        toDate,
        batchCodeFilter: paramBatchCode ? `{code: "${paramBatchCode}"}` : '',
        key: SMS
      })
      )
    } else if (searchKey !== 'All' && searchValue !== 'Show Empty Session' && searchValue !== '') {
      fetchBatchSessions({
        filterQuery: `
        {type_not: normal}
        ${savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
      {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(schools)}] }
          }
        }
    ` : ''}
      `,
        role,
        mentorsId,
        batchCodeFilter,
        perPage,
        skip,
        fromDate,
        toDate,
        key: SMS
      })
    } else if (searchKey === 'Empty' && searchValue === 'Show Empty Session') {
      fetchBatchSessions({
        filterQuery: `
        {type_not: normal}
        ${savedRole === SCHOOL_ADMIN && schools.length > 0 ? `
      {
          students_some: {
            school_some: { id_in: [${getIdArrForQuery(schools)}] }
          }
        }
    ` : ''}
      `,
        role,
        mentorsId,
        batchCodeFilter: '{ students_exists: false }',
        perPage,
        skip,
        fromDate,
        toDate,
        key: SMS
      })
    }
  }

  handleSearchButton = () => {
    const { searchKey } = this.state
    let { searchValue } = this.state
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Batch Code':
        this.setState(
          {
            batchCodeFilter: `{code_contains: "${searchValue}"}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Allotted Mentor':
        this.setState(
          {
            batchCodeFilter: `{allottedMentor_some: {id: "${searchValue}"}}`
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Batch Type':
        this.setState({
          batchCodeFilter: `{ type: ${searchValue} }`
        }, this.callFetchQueryForFiltering)
        break
      default:
        this.setState(
          {
            batchCodeFilter: null
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }

  setFilters = (state) => {
    this.setState({
      ...state
    }, function callbackToSearch() {
      this.handleSearchButton()
    })
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page,
      skip: page - 1
    }, () => this.callFetchQueryForFiltering())
  }

  fetchEmptyBatchSessions = (checked) => {
    if (checked) {
      this.setState({
        searchKey: 'Empty',
        searchValue: 'Show Empty Session'
      }, this.callFetchQueryForFiltering)
    } else {
      this.setState({
        searchKey: 'All',
        searchValue: ''
      }, this.callFetchQueryForFiltering)
    }
  }
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const { datasArray, perPage, currentPage, searchValue, paramBatchCode } = this.state
    const { isFetchingMentors, hasStartedSession, batchSessionsMeta } = this.props
    return (
      <Fragment>
        <BatchAttendanceStyle.TopContainer>
          <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
            <div style={{ flex: 0.5 }}>
              <SearchBox savedRole={savedRole} setFilters={(state) => this.setFilters(state)} datasArray={datasArray} isFetchingMentors={isFetchingMentors} paramBatchCode={paramBatchCode} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex' }}>
                <DatePicker.RangePicker
                  value={[
                    this.state.fromDate,
                    this.state.toDate
                  ]}
                  format='DD/MM/YYYY'
                  onCalendarChange={this.handleDateChange}
                />
              </div>
              <div style={{ margin: '15px 10px 15px auto' }}>
                {
                  this.state.dateRanges.map(range =>
                    <Button
                      type={JSON.stringify(range.subtract) === this.state.selectedRange ? 'primary' : 'default'}
                      shape='circle'
                      onClick={() => this.handleDateRange(JSON.stringify(range.subtract))}
                      style={{
                        margin: '0 5px'
                      }}
                    >
                      {range.label}
                    </Button>
                  )
                }
              </div>
            </div>
            <div>
              Show Empty Batch Sessions {'  '}
              <Switch
                checked={searchValue === 'Show Empty Session'}
                onChange={this.fetchEmptyBatchSessions}
                size='small'
              />
            </div>
          </div>
        </BatchAttendanceStyle.TopContainer>
        <BatchAttendanceStyle.PaginationHolder>
          {batchSessionsMeta > perPage && (
            <Pagination
              total={batchSessionsMeta}
              onChange={this.onPageChange}
              current={currentPage}
              defaultPageSize={perPage}
            />
          )}
          <h4>Total Sessions: {batchSessionsMeta || 0}</h4>
        </BatchAttendanceStyle.PaginationHolder>
        <BatchAttendanceTable
          {...this.props}
          batchesData={orderBy(this.state.batchesData, 'createdAt', 'desc')}
          filters={this.state}
          savedRole={savedRole}
          setTotalCount={this.setTotalCount}
          hasFetchedBatches={this.props.hasFetchedBatches}
          hasStartedSession={hasStartedSession}
        />
      </Fragment>
    )
  }
}
