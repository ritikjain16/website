/* eslint-disable */
import React, { Component, Fragment } from 'react'
import moment from 'moment'
import MentorConversionStyle from './MentorConversion.style'
import { ADMIN, MENTOR, SALES_EXECUTIVE, UMS, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { Table, Select, Input, Button, DatePicker, Pagination, Switch, AutoComplete } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Student from './components/studentColumn'
import Plan from './components/planColumn'
import Payment from './components/paymentColumn'
import fetchMentorConversion from './../../actions/mentorConversion/fetchMentorConversion'
// import fetchUserCurrentTopicStatus from './../../actions/mentorConversion/fetchUserCurrentTopicStatus'
import { filter, get, sortBy } from 'lodash'
import commaNumber from 'comma-number'
import MentorManagementNav from '../../components/MentorManagementNav/mentorManagementNav'
import fetchMentorForSalesExec from '../../actions/sessions/fetchMentorForSales'
import FinancialReportModal from '../SMS/MentorConversion/components/FinancialReportModal'

class MentorConversion extends Component {
  state = {
    studentId: this.props.match.params.id,
    tableData: [],
    studentData: null,
    searchKey: 'all',
    searchValue: '',
    filterOptions: ['Student Name', 'Model', 'Installment Type', 'Installment Number'],
    filterQuery: {
      salesOperationFilter: '',
      userPaymentPlanFilter: '',
      dateFilter: {
        from: null,
        to: null
      },
      dateFilterQuery: null
    },
    userIds: [],
    currentPage: 1,
    perPageQueries: 10,
    totalAmountInput: {},
    dateRanges: [
      { label: '1D', subtract: { duration: '1', unit: 'd' } },
      { label: '3D', subtract: { duration: '3', unit: 'd' } },
      { label: '1W', subtract: { duration: '7', unit: 'd' } },
      { label: '2W', subtract: { duration: '14', unit: 'd' } },
      { label: '3W', subtract: { duration: '21', unit: 'd' } },
      { label: '1M', subtract: { duration: '1', unit: 'M' } },
      { label: 'A', subtract: { duration: 'all' } },
    ],
    selectedRange: '{"duration":"7","unit":"d"}',
    bringOverDueSessions: false,
    sessionPaidStatusFilter: 'all',
    mentorsId: [],
    mentorsName: [],
    openFinancialModal: false,
    country: localStorage.getItem('country') || 'india',
  }

  componentDidMount() {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === SALES_EXECUTIVE) {
      const savedId = getDataFromLocalStorage('login.id')
      fetchMentorForSalesExec(savedId).then(res => {
        const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
        const mentorsName = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.name)
        this.setState({
          mentorsId,
          mentorsName
        }, () => this.handleDateFilter([
          moment().subtract(7,'d'),
          moment()
        ]))
      })
    } else if (this.state.studentId) {
      this.handleDateFilter([])
    } else {
      this.handleDateFilter([
        moment().subtract(7,'d'),
        moment()
      ])
    }
    window.addEventListener('click', this.changeType)
  }

  changeType = () => {
    if (localStorage && this.state.country !== localStorage.getItem('country')) {
      this.setState({
        country: localStorage.getItem('country') || 'india'
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const dataFetchStatus =
      this.props.dataFetchStatus && this.props.dataFetchStatus.toJS().completedSession
    const dataFetchStatusPrev =
      prevProps.dataFetchStatus && prevProps.dataFetchStatus.toJS().completedSession
    if (
      dataFetchStatus &&
      dataFetchStatusPrev &&
      dataFetchStatusPrev.loading &&
      dataFetchStatus.success
    ) {
      this.convertDataForStudentColumn()
    } else {
      const planFetchStatus = this.props.userPaymentPlans
      const planFetchStatusPrev = prevProps.userPaymentPlans
      if (planFetchStatus && planFetchStatusPrev && planFetchStatusPrev !== planFetchStatus) {
        this.convertDataForStudentColumn()
      }
    }
    if (this.props.userCurrentTopicComponentStatus !== prevProps.userCurrentTopicComponentStatus) {
      this.convertDataForStudentColumn()
    }
    const savedRole = getDataFromLocalStorage('login.role')
    const { filterQuery, perPageQueries, mentorsId,
      totalAmountInput, studentId, country, bringOverDueSessions } = this.state
    if (country !== prevState.country) {
      if (savedRole === MENTOR) {
        const savedId = getDataFromLocalStorage('login.id')
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, [savedId], {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, bringOverDueSessions, studentId, totalAmountInput, country)
      } else if (savedRole === SALES_EXECUTIVE) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId, {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, bringOverDueSessions, studentId, totalAmountInput, country)
      } else {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, null, {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, bringOverDueSessions, studentId, totalAmountInput, country)
      }
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('click', this.changeType)
  }
  convertDataForStudentColumn() {
    const salesOperationInJS = this.props.salesOperation.toJS()
    const userPaymentPlans = this.props.userPaymentPlans.toJS()
    const firstMentorMenteeSessionInJS = this.props.firstMentorMenteeSession.toJS()
    const savedRole = getDataFromLocalStorage('login.role')
    const tableData = []
    let userIds = ''
    let totalAmountCollected = 0
    let totalAmountToBeCollected = 0
    filter(salesOperationInJS, item => get(item, 'leadStatus') === 'won').forEach(session => {
      const mentorMenteeSession = filter(
        firstMentorMenteeSessionInJS,
        item => get(item, 'id') === get(session, 'firstMentorMenteeSession.id', '')
      )[0]
      let paymentPlan = filter(userPaymentPlans, item => get(item, 'salesOperation.id') === get(session, 'id'))
      totalAmountToBeCollected += paymentPlan.length ? get(paymentPlan[0], 'finalSellingPrice') : 0
      filter(
        get(paymentPlan[0], 'userPaymentInstallments'),
        item => get(item, 'status') === 'paid'
      ).forEach(item => {
        totalAmountCollected += get(item, 'amount')
      })
      userIds += `"${get(session, 'client.id')}", `
      tableData.push({
        createdAt: get(session, 'createdAt'),
        student: {
          personal: {
            name: get(session, 'client.name'),
            gender: get(session, 'client.gender'),
            grade: get(session, 'client.studentProfile.grade'),
            parent: get(session, 'client.studentProfile.parents[0].user.name'),
            phone: `${get(session, 'client.studentProfile.parents[0].user.phone.countryCode')}
              ${get(session, 'client.studentProfile.parents[0].user.phone.number')}`,
            email: get(session, 'client.studentProfile.parents[0].user.email'),
            session: moment(get(mentorMenteeSession, 'sessionStartDate')).format('ll, HH:mm'),
            interest: `${session.oneToOne ? '1:1,' : ''} ${session.oneToTwo ? '1:2,' : ''} ${
              session.oneToThree ? '1:3,' : ''
            }`
          },
          mentorFeedback: {
            homework: get(mentorMenteeSession, 'isSubmittedForReview'),
            rating: get(mentorMenteeSession, 'rating'),
            tags: mentorMenteeSession,
            name: get(session, 'allottedMentor.name')
          },
          sessionFeedback: get(mentorMenteeSession, 'comment'),
          currentTopicStatus: filter(
            this.props.userCurrentTopicComponentStatus.toJS(),
            item => item.user.id === get(session, 'client.id') && get(item, 'currentCourse.id') === get(session, 'course.id')
          ),
          admin:
            savedRole &&
            (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
        },
        plan: {
          salesId: session.id,
          paymentPlan: filter(userPaymentPlans, item => get(item, 'salesOperation.id') === get(session, 'id')),
          menteeId: get(session, 'client.id')
        },
        payment: {
          salesId: session.id,
          paymentPlan: filter(userPaymentPlans, item => get(item, 'salesOperation.id') === get(session, 'id')),
          menteeId: get(session, 'client.id'),
          currentTopicStatus: filter(
            this.props.userCurrentTopicComponentStatus.toJS(),
            item => item.user.id === get(session, 'client.id') && get(item, 'currentCourse.id') === get(session, 'course.id')
          )
        }
      })
    })
    this.setState({
      tableData: sortBy(tableData, item => moment(get(item, 'createdAt'))).reverse(),
      totalAmountCollected: commaNumber(totalAmountCollected),
      totalAmountToBeCollected: commaNumber(totalAmountToBeCollected),
      userIds
    })
    // console.count("conversions")
    // style
  }

  handleSearchKey = searchKey => {
    this.setState({
      searchKey,
      searchValue: searchKey === 'all' ? 'all' : '',
    })
  }

  handleSearchValue = e => {
    this.setState({
      searchValue: e.target ? e.target.value : e
    })
  }

  renderSelectedFilterOptions = () => {
    const { searchKey } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const { Option } = Select
    switch (searchKey) {
      case 'Mentor Name':
        if (savedRole === SALES_EXECUTIVE) {
          return (
            <AutoComplete
              style={{ width: 200 }}
              placeholder='Select a Mentor'
              onSelect={(value) => {
                this.setState({
                  searchValue: value
                }, () => this.handleSearchButton())
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') { this.handleSearchButton() }
              }}
              onChange={this.handleSearchValue}
              filterOption={(input, option) =>
                option.props.children
                  ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              {this.state.mentorsName.map(mentor => (
                <Select.Option value={mentor}>
                  {mentor}
                </Select.Option>
              ))}
            </AutoComplete>
          )
        } else {
          return (
            <Input
              placeholder="Mentor's Name"
              value={this.state.searchValue}
              onChange={this.handleSearchValue}
              style={{ width: 200, marginLeft: 10 }}
              onPressEnter={this.handleSearchButton}
            />
          )
        }
      case 'Student Name':
        return (
          <Input
            placeholder="Student's Name"
            value={this.state.searchValue}
            onChange={this.handleSearchValue}
            style={{ width: 200, marginLeft: 10 }}
            onPressEnter={this.handleSearchButton}
          />
        )
      case 'Model':
        return (
          <Select
            defaultValue=""
            style={{ width: 100, marginLeft: 10 }}
            onChange={this.handleSearchValue}
          >
            <Option value="" disabled>
              Select
            </Option>
            <Option value="oneToOne">1:1</Option>
            <Option value="oneToTwo">1:2</Option>
            <Option value="oneToThree">1:3</Option>
          </Select>
        )
      case 'Installment Type':
        return (
          <Select
            defaultValue=""
            style={{ width: 100, marginLeft: 10 }}
            onChange={this.handleSearchValue}
          >
            <Option value="" disabled>
              Select
            </Option>
            <Option value="auto">Auto</Option>
            <Option value="manual">Manual</Option>
          </Select>
        )
      case 'Installment Number':
        return (
          <Select
            defaultValue=""
            style={{ width: 100, marginLeft: 10 }}
            onChange={this.handleSearchValue}
          >
            <Option value="" disabled>
              Select
            </Option>
            {[1, 2, 3, 4, 5, 6].map(number => (
              <Option value={number}>{number}</Option>
            ))}
          </Select>
        )
      case 'clearSrch':
        this.callFetchQueryForFiltering()
        break
      default:
        break
    }
  }

  callFetchQueryForFiltering = () => {
    const { searchKey, filterQuery, searchValue, perPageQueries, mentorsId,
      currentPage, totalAmountInput, studentId, country } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    if (searchKey === 'clearSrch') {
      if (savedRole === MENTOR) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, [savedId], {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else if (savedRole === SALES_EXECUTIVE) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId, {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, null, {
          dateFilterQuery: filterQuery.dateFilterQuery
        }, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      }
      ['studentName', 'mentorName', 'oneToOne', 'oneToTwo', 'oneToThree', 'installmentType', 'installmentNumber']
      .forEach(key => {
        if (totalAmountInput[key]) {
          delete totalAmountInput[key]
        }
      })
      this.setState({
        searchKey: 'all',
        searchValue: '',
        filterQuery: {
          ...filterQuery,
          salesOperationFilter: null,
          userPaymentPlanFilter: null
        },
        currentPage: 1,
        totalAmountInput
      })
    } else if (searchKey !== 'all' && searchValue !== '') {
      this.setState({
        currentPage: 1
      })
      if (savedRole === MENTOR) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, [savedId],
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else if (savedRole === SALES_EXECUTIVE) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, null,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      }
    } else if (filterQuery.dateFilterQuery) {
      this.setState({
        currentPage: 1
      })
      if (savedRole === MENTOR) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, [savedId],
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else if (savedRole === SALES_EXECUTIVE) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, null,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      }
    } else {
      if (savedRole === MENTOR) {
        fetchMentorConversion({ perPageQueries, currentPage }, [savedId],
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else if (savedRole === SALES_EXECUTIVE) {
        fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      } else {
        fetchMentorConversion({ perPageQueries, currentPage }, null,
          filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
      }
    }
  }

  handleSearchButton = () => {
    const { searchKey, searchValue, filterQuery, totalAmountInput } = this.state
    const newTotalAmountInput = {}
    if (totalAmountInput.fromDate && totalAmountInput.fromDate !== '') {
      newTotalAmountInput.fromDate = totalAmountInput.fromDate
    }
    if (totalAmountInput.toDate && totalAmountInput.toDate !== '') {
      newTotalAmountInput.toDate = totalAmountInput.toDate
    }
    switch (searchKey) {
      case 'Mentor Name':
        newTotalAmountInput.mentorName = searchValue
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: `{allottedMentor_some:{name_contains:"${searchValue}"}}`,
              userPaymentPlanFilter: null
            },
            totalAmountInput: newTotalAmountInput
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Student Name':
        newTotalAmountInput.studentName = searchValue
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: `{client_some:{name_contains:"${searchValue}"}}`,
              userPaymentPlanFilter: null
            },
            totalAmountInput: newTotalAmountInput
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Model':
        newTotalAmountInput[searchValue] = true
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: null,
              userPaymentPlanFilter: `{userPaymentPlan_some:{product_some:{type:${searchValue}}}}`
            },
            totalAmountInput: newTotalAmountInput
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Installment Type':
        newTotalAmountInput.installmentType = searchValue
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: null,
              userPaymentPlanFilter: `{userPaymentPlan_some:{installmentType:${searchValue}}}`
            },
            totalAmountInput: newTotalAmountInput
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Installment Number':
        newTotalAmountInput.installmentNumber = searchValue
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: null,
              userPaymentPlanFilter: `{userPaymentPlan_some:{installmentNumber:${searchValue}}}`
            },
            totalAmountInput: newTotalAmountInput
          },
          this.callFetchQueryForFiltering
        )
        break
      default:
        this.setState(
          {
            filterQuery: {
              ...filterQuery,
              salesOperationFilter: null,
              userPaymentPlanFilter: null
            },
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }

  handleDateRange = rangeInString => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.handleDateFilter([])
      } else {
        this.handleDateFilter([
          moment().subtract(range.duration, range.unit),
          moment()
        ])
      }
    })
  }

  handleDateFilter = (dates) => {
    const { filterQuery, totalAmountInput } = this.state
    if (dates && dates[0]) {
      totalAmountInput.fromDate = dates[0].startOf('day').toDate().toISOString()
    } else {
      delete totalAmountInput['fromDate']
    }
    if (dates && dates[1]) {
      totalAmountInput.toDate = dates[1].endOf('day').toDate().toISOString()
    } else {
      delete totalAmountInput['toDate']
    }
    this.setState(
      {
        filterQuery: {
          ...filterQuery,
          dateFilter: {
            from: dates[0] ? dates[0] : '',
            to: dates[1] ? dates[1] : ''
          }
        },
        totalAmountInput
      },
      () => {
        const { dateFilter } = this.state.filterQuery
        this.setState(
          {
            filterQuery: {
              ...this.state.filterQuery,
              dateFilterQuery: `
            ${
              dateFilter.from && dateFilter.from !== ''
                ? `{sessionStartDate_gte: "${moment(dateFilter.from)
                    .startOf('day')
                    .toDate()
                    .toISOString()}"}`
                : ''
            }
            ${
              dateFilter.to && dateFilter.to !== ''
                ? `{sessionStartDate_lte: "${moment(dateFilter.to)
                    .endOf('day')
                    .toDate()
                    .toISOString()}"}`
                : ''
            }
          `
            }
          },
          this.callFetchQueryForFiltering
        )
      }
    )
  }

  onPageChange = page => {
    this.setState(
      {
        currentPage: page
      },
      () => {
        const { filterQuery, perPageQueries, mentorsId, studentId,
          totalAmountInput, country } = this.state
        var { currentPage } = this.state
        const savedRole = getDataFromLocalStorage('login.role')
        const savedId = getDataFromLocalStorage('login.id')
        if (savedRole === MENTOR) {
          fetchMentorConversion({ perPageQueries, currentPage }, [savedId],
            filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
        } else if (savedRole === SALES_EXECUTIVE) {
          fetchMentorConversion({ perPageQueries, currentPage: 1 }, mentorsId,
            filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
        } else {
          fetchMentorConversion({ perPageQueries, currentPage }, null,
            filterQuery, this.state.bringOverDueSessions, studentId, totalAmountInput, country)
        }
      }
    )
  }

  showSessionsWithPaymentOverDue = checked => {
    this.setState({
      bringOverDueSessions: checked,
      searchKey: 'all',
      searchValue: '',
      filterQuery: {
        salesOperationFilter: '',
        userPaymentPlanFilter: '',
        dateFilter: {
          from: null,
          to: null
        },
        dateFilterQuery: null
      },
      currentPage: 1,
      selectedRange: '{"duration":"all"}'
    }, this.callFetchQueryForFiltering)
  }

  updateSessionPaidStatusFilter = status => {
    const { filterQuery } = this.state
    this.setState({
      sessionPaidStatusFilter: status,
      filterQuery: {
        ...filterQuery,
        salesOperationFilter: status !== 'all' ? `{enrollmentType: ${status}}` : ''
      }
    }, this.callFetchQueryForFiltering)
  }

  render() {
    const { totalAmount, totalAmountCollected } = this.props.getTotalAmountCollected &&
      this.props.getTotalAmountCollected.toJS()
    const savedRole = getDataFromLocalStorage('login.role')
    // console.log(savedRole);
    const { studentId, openFinancialModal, country } = this.state
    let admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    // console.log(admin)
    let sales = savedRole === SALES_EXECUTIVE
    const dataFetchStatus =
      this.props.dataFetchStatus && this.props.dataFetchStatus.toJS().completedSession
    const totalConverted = this.props.totalConverted && this.props.totalConverted.toJS().count
    const { Column } = Table
    const { Option } = Select
    const { StyledTable, SearchBox, ToggleButton } = MentorConversionStyle
    return (
      <Fragment>
        <MentorManagementNav current={2} totalCount={totalConverted} userId={studentId} />
        <div
          style={{
            minWidth: 1345
          }}
        >
          {!studentId && (
            <>
              <SearchBox>
              <div>
                <Select
                  defaultValue="clearSrch"
                  style={{ width: 200 }}
                  onChange={this.handleSearchKey}
                >
                  <Option value="clearSrch">Search...</Option>
                  {admin || sales ? <Option value="Mentor Name">Mentor Name</Option> : null}
                  {this.state.filterOptions.map(val => (
                    <Option value={val}>{val}</Option>
                  ))}
                </Select>
                {this.renderSelectedFilterOptions()}
                {this.state.searchValue && this.searchValue !== '' ? (
                  <Button
                    type="primary"
                    onClick={this.handleSearchButton}
                    style={{ width: 50, marginLeft: 10 }}
                  >
                    <SearchOutlined />
                  </Button>
                ) : null}
              </div>
              <div>
                <DatePicker.RangePicker
                  value={[
                    this.state.filterQuery.dateFilter.from
                      ? moment(this.state.filterQuery.dateFilter.from)
                      : '',
                      this.state.filterQuery.dateFilter.to
                      ? moment(this.state.filterQuery.dateFilter.to)
                      : ''
                  ]}
                  format="DD/MM/YYYY"
                  onCalendarChange={this.handleDateFilter}
                  // onChange={date => this.handleDateFilter(date, 'from')}
                />
              </div>
              <div>
              {
                this.state.dateRanges.map(range =>
                  <Button
                    type={JSON.stringify(range.subtract) === this.state.selectedRange ? 'primary' : 'default'}
                    shape="circle"
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
              <div style={{ display: "grid" }}>
                <span>
                  Total Amount:{' '}
                  {totalAmount ? commaNumber(totalAmount) : 0}
                </span>
                <span>
                  Collected:{' '}
                  {totalAmountCollected ? commaNumber(totalAmountCollected) : 0}
                </span>
              </div>
              </SearchBox>
              <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10
            }}
          >
            <Pagination
              total={totalConverted ? totalConverted : 0}
              onChange={this.onPageChange}
              current={this.state.currentPage}
              defaultPageSize={this.state.perPageQueries}
            />
            <div>
            <ToggleButton
              style={{
                backgroundColor: get(this.state, 'sessionPaidStatusFilter') === 'free' ? '#278af3' : '#fff',
                color: get(this.state, 'sessionPaidStatusFilter') === 'free' ? '#fff' : '#278af3',
              }}
              onClick={e => this.updateSessionPaidStatusFilter('free')}
            >
              Unpaid
            </ToggleButton>
            <ToggleButton
              style={{
                backgroundColor: get(this.state, 'sessionPaidStatusFilter') === 'pro' ? '#278af3' : '#fff',
                color: get(this.state, 'sessionPaidStatusFilter') === 'pro' ? '#fff' : '#278af3',
              }}
              onClick={e => this.updateSessionPaidStatusFilter('pro')}
            >
              Paid
            </ToggleButton>
            <ToggleButton
              style={{
                backgroundColor: get(this.state, 'sessionPaidStatusFilter') === 'all' ? '#278af3' : '#fff',
                color: get(this.state, 'sessionPaidStatusFilter') === 'all' ? '#fff' : '#278af3',
              }}
              onClick={e => this.updateSessionPaidStatusFilter('all')}
            >
              All
            </ToggleButton>
          </div>
            <div>
              Show Sessions With Payment Over Due? {'  '}
              <Switch
                checked={this.state.bringOverDueSessions}
                onChange={this.showSessionsWithPaymentOverDue}
                size="small"
              />
            </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <Button
              type='primary'
              icon='file'
              onClick={() => this.setState({ openFinancialModal: true })}
            >Generate Financial Report</Button>
            <FinancialReportModal
              visible={openFinancialModal}
              onClose={() => this.setState({ openFinancialModal: false })}
              type={UMS}
            />
          </div>
            </>
          )}
        <StyledTable
          dataSource={this.state.tableData}
          bordered
          pagination={false}
          loading={dataFetchStatus && dataFetchStatus.loading}
          style={{
            '.ant-table-row::hover': {
              backgroundColor: '#fff !important'
            }
          }}
        >
          <Column
            title="#"
            dataIndex="key"
            key="key"
            width="40px"
            render={(text, record, index) => index + 1}
          />
          <Column
            title="Student Profile"
            dataIndex="student"
            key="student"
            width="150px"
            render={(text, record, index) => {
              // console.log(record, text)
              return <Student data={text} />
            }}
          />
          <Column
            title="Design subscription plan"
            dataIndex="plan"
            key="plan"
            width="150px"
            render={(text, record, index) => {
              // console.log(text)
              return <Plan data={text} products={this.props.products.toJS()} />
            }}
          />
            <Column
              title="Payment"
              dataIndex="payment"
              key="payment"
              width="200px"
              render={(text, record, index) => {
                // console.log(text)
                return <Payment
                  data={text} plans={this.props.userPaymentPlans.toJS()} products={this.props.products.toJS()} />
              }}
            />
          </StyledTable>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10
            }}
          >
            {
              !studentId && (
                <Pagination
                  total={totalConverted ? totalConverted : 0}
                  onChange={this.onPageChange}
                  current={this.state.currentPage}
                  defaultPageSize={this.state.perPageQueries}
                />
              )
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

export default MentorConversion
