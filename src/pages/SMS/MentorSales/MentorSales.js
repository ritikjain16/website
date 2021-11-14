/* eslint-disable */
import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types'
import MentorSalesStyle from './MentorSales.style'
import { ADMIN, MENTOR, SALES_EXECUTIVE, UMS_ADMIN, UMS_VIEWER } from '../../../constants/roles'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import fetchMentorSalesOfSchool from '../../../actions/mentorSalesOfSchool/fetchMentorSalesOfSchool'
import fetchMenteeSessionWithNoFeedBack from '../../../actions/mentorSalesOfSchool/fetchMenteeSessionWithNoFeedBack'
import fetchOnlyCountForMentorSales from '../../../actions/mentorSalesOfSchool/fetchOnlyCountForMentorSales'
import { filter, get, sortBy, remove, uniq, uniqBy } from 'lodash'
import moment from 'moment'
import {
  Table,
  Tag,
  Select,
  DatePicker,
  Button,
  Icon,
  Spin,
  Tooltip,
  Pagination,
  Modal,
  Input,
  Switch
} from 'antd'
import { EditOutlined, ProfileOutlined } from '@ant-design/icons'
// import FromToDatePicker from '../../components/FromToDatePicker/FromToDatePicker'
import { green, yellow, red } from '../../../constants/colors'
import updateMentorSales from '../../../actions/mentorSales/updateMentorSales'
import SalesOperationModal from '../../UmsDashboard/components/SalesOperationModal'
import MentorSalesCountData from './component/MentorSalesCountData'
import MentorMenteeManagement from '../MentorMenteeManagement'
import addMentorSales from '../../../actions/mentorSales/addMentorSales'
import fetchProfileUserInfo from '../../../actions/profile/fetchProfileUserInfo'
import fetchMentorForSalesExecutive from '../../../actions/sessionsOfSchools/fetchMentorsForSchools'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import updateMentorMenteeSessionStatus from '../../../actions/mentorSales/updateMentorMenteeSessionStatus'

moment.calendarFormat = function(myMoment, now) {
  var diff = myMoment.diff(now, 'days', true)
  var ret = diff < 0 ? `delayed` : diff >= 1 ? `togo` : 'today'
  return ret
}

class MentorSales extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      filterQuery: '',
      filterQuerySales: '',
      filterQueryLeadStatus: [],
      filterQueryNextDate: {
        values: [],
        query: ''
      },
      dateFilter: {
        fromDate: '',
        toDate: ''
      },
      dateFilterQuery: '',
      sessions: null,
      tags: [
        { tag: 'friendly', icon: 'FR', zone: 'green', active: true, count: 0 },
        {
          tag: 'motivating',
          icon: 'MO',
          zone: 'green',
          active: true,
          count: 0
        },
        { tag: 'engaging', icon: 'ENG', zone: 'green', active: true, count: 0 },
        { tag: 'helping', icon: 'HE', zone: 'green', active: true, count: 0 },
        {
          tag: 'enthusiastic',
          icon: 'ENT',
          zone: 'green',
          active: true,
          count: 0
        },
        { tag: 'patient', icon: 'PA', zone: 'green', active: true, count: 0 },
        {
          tag: 'conceptsPerfectlyExplained',
          displayTitle: 'Concepts Perfectly Explained',
          icon: 'CPE',
          zone: 'green',
          active: true,
          count: 0
        },
        {
          tag: 'averageExplanation',
          displayTitle: 'Average Explanation',
          icon: 'AE',
          zone: 'yellow',
          active: true,
          count: 0
        },
        { tag: 'distracted', icon: 'DI', zone: 'red', active: true, count: 0 },
        { tag: 'rude', icon: 'RU', zone: 'red', active: true, count: 0 },
        {
          tag: 'slowPaced',
          displayTitle: 'Slow Paced',
          icon: 'SP',
          zone: 'red',
          active: true,
          count: 0
        },
        {
          tag: 'fastPaced',
          displayTitle: 'Fast Paced',
          icon: 'FP',
          zone: 'red',
          active: true,
          count: 0
        },
        {
          tag: 'notPunctual',
          displayTitle: 'Not Punctual',
          icon: 'NP',
          zone: 'red',
          active: true,
          count: 0
        },
        { tag: 'boring', icon: 'BO', zone: 'red', active: true, count: 0 },
        {
          tag: 'poorExplanation',
          displayTitle: 'Poor Explanation',
          icon: 'PE',
          zone: 'red',
          active: true,
          count: 0
        }
      ],
      leadStatusOptions: ['pipeline', 'hot', 'won', 'cold', 'lost'],
      nextStepReasons: {
        pipeline: {
          findReferralPartner: 'Need to find partner for referral',
          needFamilyDiscussion: 'Need to discuss with family',
          checkChildInterest: "Need to check child's interest",
          tryOtherDemoSessions: 'Need to try other demo sessions',
          didNotRespond: "Didn't respond will follow up",
          otherReasons: 'Other reason'
        },
        cold: {
          didNotRespondAfterMultipleAttempts: "Didn't respond after multiple attempts"
        },
        lost: {
          cannotManageWithStudies: 'Cannot manage with studies',
          notAffordable: 'Not Affordable',
          choseACompetitor: 'Chose a competitor',
          notInterestedInCoding: 'Not interested in coding',
          willGetBackInFuture: 'Will get back to you in future',
          didNotLikeTekie: "Didn't like Tekie",
          otherReasons: 'Other reason'
        }
      },
      nextDate: '',
      showCommentModal: false,
      salesOperationData: null,
      perPageQueries: 20,
      currentPage: 1,
      showActivityModal: false,
      mentors: [],
      mentees: [],
      searchBy: '',
      noFeedBackMenteeShow: false,
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '3D', subtract: { duration: '2', unit: 'd' } },
        { label: '1W', subtract: { duration: '6', unit: 'd' } },
        { label: '2W', subtract: { duration: '13', unit: 'd' } },
        { label: '3W', subtract: { duration: '20', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: 'A', subtract: { duration: 'all' } },
      ],
      selectedRange: '{"duration":"6","unit":"d"}',
      mentorsId: [],
      mentorsName: []
    }
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  componentDidUpdate(prevProp) {
    if (!this.props.sessions || !this.props.mentorSales) {
      fetchMentorSalesOfSchool(this.state.filterQuery)
    } else if (
      this.props.mentorSales !== prevProp.mentorSales ||
      !this.state.sessions ||
      (!prevProp.hasSalesOperationUpdate && this.props.hasSalesOperationUpdate) ||
      (!prevProp.hasSalesOperationAdd && this.props.hasSalesOperationAdd) ||
      (get(prevProp.addNoteStatus, 'loading') && get(this.props.addNoteStatus, 'loading'))
    ) {
      // console.log( 'inside', !prevProp.hasSalesOperationAdd , this.props.hasSalesOperationAdd);
      this.convertSessionsIntoTableForm()
    }
  }

  fetchInitialData = async () => {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    let filterQuery = ''
    let filterQuerySales = ''
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      filterQuery = ``
      fetchProfileUserInfo(MENTOR, 0, false, false)
    } else if (savedRole && savedRole === MENTOR) {
      filterQuery = `{mentorSession_some:{user_some:{id:"${savedId}"}}}`
      filterQuerySales = `{allottedMentor_some:{id:"${savedId}"}}`
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      await fetchMentorForSalesExecutive(savedId).then(res => {
        const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
        const mentorsName = res.user.salesExecutiveProfile.mentors.map(({ user }) => (
          { name:user.name, id:user.id }
        ))
        this.setState({
          mentorsId,
          mentorsName
        })
        filterQuery = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`
        filterQuerySales = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
      })
    }
    this.setState({
      currentPage: 1,
      filterQuery: filterQuery ? filterQuery : '',
      filterQuerySales: filterQuerySales ? filterQuerySales : '',
      sessions: null
    }, () => {
      this.handleDateRange(this.state.selectedRange)
    })
  }

  convertSessionsIntoTableForm() {
    const { mentorSales } = this.props
    const { tags } = this.state
    // const sessionsInJs = sessions.toJS()
    const mentorSalesInJs = mentorSales.toJS()
    const tableData = []
    // const clientIds = []
    let mentors = []
    let mentees = []
    mentorSalesInJs.reverse().forEach(session => {
      let data = { ...session }
      // console.log(session)
      // let data = { ...session, ...mentorData[0] }
      let forTable = {
        id: session.id,
        salesId: get(session.salesOperation, 'id'),
        menteeId: get(session.menteeSession, 'user.id'),
        student: get(data.menteeSession, 'user.name'),
        gender: get(data.menteeSession, 'user.gender')
          ? get(data.menteeSession, 'user.gender')
          : '-',
        grade: get(data.menteeSession, 'user.studentProfile.grade')
          ? get(data.menteeSession, 'user.studentProfile.grade').slice(5)
          : '-',
        parent: get(data.menteeSession, 'user.studentProfile.parents[0].user.name'),
        phone: get(data.menteeSession, 'user.studentProfile.parents[0].user.phone.number'),
        emailId: get(data.menteeSession, 'user.studentProfile.parents[0].user.email'),
        schoolName: get(data.menteeSession, 'user.studentProfile.school.name'),
        // mentor: get(data.menteeSession, 'user.studentProfile.parents[0].user.email'),
        sessionInfo: moment(data.sessionStartDate).format('D MMM[,\n] h:mm a'),
        status: get(data.salesOperation, 'leadStatus'),
        nextSteps: get(data.salesOperation, 'nextSteps'),
        nextDate:
          data.salesOperation && data.salesOperation.nextCallOn
            ? moment(data.salesOperation.nextCallOn).format('ll HH:mm')
            : null,
        addNotes: get(data, 'sessionCommentByMentor'),
        interest: [
          {
            oneToOne: get(data.salesOperation, 'oneToOne'),
            oneToTwo: get(data.salesOperation, 'oneToTwo'),
            oneToThree: get(data.salesOperation, 'oneToThree')
          }
        ],
        studentFeedback: data.comment ? data.comment : '-',
        studentRatingAndHw: [
          {
            rating: data.rating === 5 ? 5 : null,
            homework: data.isSubmittedForReview
          }
        ],
        tags: filter(tags, item => data[item.tag]),
        activity: get(data.salesOperation, 'salesOperationActivities'),
        sessionStart: data.sessionStartDate,
        mentor: get(data.mentorSession, 'user'),
        course: get(session, 'course')
      }
      tableData.push(forTable)
      // clientIds.push(clientId)
      // }
    })
    const users = uniqBy(this.props.users.toJS(), item => item.id)
    // console.log(users)
    if (users) {
      Object.keys(users).map(item => {
        if (get(users[item], 'role') === 'mentor') {
          mentors.push(users[item])
        }
        // else if (get(users[item], 'role') === "mentee") {
        //   mentees.push(users[item])
        // }
      })
    }
    // console.log(tableData)
    tableData.length
      ? this.setState({
          // sessions: tableData
          sessions: sortBy(tableData, data => -moment(data.sessionStart)),
          mentors
        })
      : this.setState({
          sessions: [],
          mentors
        })
  }

  fetchDataWithFilters() {
    const {
      filterQuery,
      filterQuerySales,
      filterQueryLeadStatus,
      filterQueryNextDate,
      currentPage,
      dateFilterQuery,
      mentorsId,
      noFeedBackMenteeShow
    } = this.state
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      if (!noFeedBackMenteeShow) {
        fetchMentorSalesOfSchool(
          filterQuery,
          currentPage - 1,
          filterQuerySales,
          filterQueryLeadStatus,
          filterQueryNextDate.query,
          dateFilterQuery
        )
      } else {
        fetchMenteeSessionWithNoFeedBack(filterQuery, currentPage - 1, dateFilterQuery)
      }
    } else if (savedRole && savedRole === MENTOR) {
      fetchMentorSalesOfSchool(
        `${filterQuery} {mentorSession_some:{user_some:{id:"${savedId}"}}}`,
        currentPage - 1,
        `${filterQuerySales} {allottedMentor_some:{id:"${savedId}"}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery
      )
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      fetchMentorSalesOfSchool(
        `${filterQuery} {mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
        currentPage - 1,
        `${filterQuerySales} {allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery
      )
    }
  }

  setLeadStatusFilter = filterValue => {
    const { filterQueryLeadStatus } = this.state
    if (filterQueryLeadStatus.includes(filterValue)) {
      remove(filterQueryLeadStatus, item => item === filterValue)
    } else {
      filterQueryLeadStatus.push(filterValue)
    }
    this.setState(
      {
        filterQueryLeadStatus
      },
      () => {
        this.fetchDataWithFilters()
      }
    )
  }

  setNextDateFilter = filterValue => {
    const { filterQueryNextDate } = this.state
    let { values } = filterQueryNextDate
    let query = ''
    if (values.includes(filterValue)) {
      remove(values, item => item === filterValue)
    } else {
      values.push(filterValue)
    }
    if (values.includes('actionDueToday')) {
      query += `{and:[
        { nextCallOn_gte: "${moment()
          .startOf('day')
          .toDate()
          .toISOString()}" }
      { nextCallOn_lte: "${moment()
        .endOf('day')
        .toDate()
        .toISOString()}" }
      ]}`
    }
    if (values.includes('dueLater')) {
      query += `{ nextCallOn_gt: "${moment()
        .endOf('day')
        .toDate()
        .toISOString()}" }`
    }
    if (values.includes('needAttention')) {
      query += `{ nextCallOn_lt: "${moment()
        .startOf('day')
        .toDate()
        .toISOString()}" }`
    }
    this.setState(
      {
        filterQueryNextDate: {
          values,
          query
        }
      },
      this.fetchDataWithFilters
    )
  }

  setNameFilter = value => {
    const { searchBy } = this.state
    let filterQuery = ''
    let filterQuerySales = ''
    if (searchBy !== 'clearSrch') {
      if (searchBy === 'Mentors') {
        filterQuery = `{mentorSession_some:{user_some:{id:"${value}"}}}`
        filterQuerySales = `{allottedMentor_some:{id:"${value}"}}`
      } else if (searchBy === 'Mentees') {
        // filterQuery = `{menteeSession_some:{user_some:{id:"${value}"}}}`
        // filterQuerySales = `{client_some:{id:"${value}"}}`
        filterQuery = `{menteeSession_some:{user_some:{name_contains:"${this.state.searchValue.trim()}"}}}`
        filterQuerySales = `{client_some:{name_contains:"${this.state.searchValue.trim()}"}}`
      }
    }
    this.setState(
      {
        filterQuery,
        filterQuerySales
      },
      this.fetchDataWithFilters
    )
  }

  handleSearchValue = e => {
    this.setState({
      searchValue: e.target.value
    })
  }

  renderFilterOptions = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    switch (this.state.searchBy) {
      case 'Mentors':
        if (this.props.mentors) {
          return (
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a Mentor"
              optionFilterProp="children"
              onChange={this.setNameFilter}
              filterOption={(input, option) =>
                option.props.children
                  ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              {savedRole === SALES_EXECUTIVE ? this.state.mentorsName.map(mentor => (
                <Select.Option value={mentor.id}>
                  {mentor.name && mentor.name}
                </Select.Option>
              )) :
                this.props.mentors.toJS().map(mentor => (
                <Select.Option value={mentor.id}>
                  {mentor.name ? mentor.name : mentor.username}
                </Select.Option>
              ))}
            </Select>
          )
        }

        return <div />
      case 'Mentees':
        return (
          <Input
            placeholder="Mentee's Name"
            value={this.state.searchValue}
            onChange={this.handleSearchValue}
            style={{ width: 200, marginLeft: 10 }}
            onPressEnter={this.setNameFilter}
          />
        )
      default:
        break
    }
  }

  updateLeadStatus = async (value, record, key) => {
    const input = {
      [key]: value
    }
    if (!this.state.noFeedBackMenteeShow || record.salesId) {
      await updateMentorSales(
        record.salesId,
        input,
        record.id,
        'salesOperationForMentorSales/update'
      )
      if (input && get(input, 'leadStatus')) {
        await updateMentorMenteeSessionStatus(record.id, input).then(() => {
          if (this.state.noFeedBackMenteeShow) {
            this.fetchQueryForNoFeedBackMentees()
          }
        })
      }
      await fetchOnlyCountForMentorSales(this.state.filterQuerySales)
    } else {
      const monitoredById = getDataFromLocalStorage('login.id')
      await addMentorSales(
        get(record, 'menteeId'),
        monitoredById,
        get(record, 'id'),
        get(record, 'mentor.id'),
        get(record, 'course.id'),
        input
      )
      if (input && get(input, 'leadStatus')) {
        await updateMentorMenteeSessionStatus(record.id, input).then(() => {
          if (this.state.noFeedBackMenteeShow) {
            this.fetchQueryForNoFeedBackMentees()
          }
        })
      }
    }
  }

  renderLeadStatusOptions = (record, status) => {
    const { leadStatusOptions, noFeedBackMenteeShow } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <div>
        <MentorSalesStyle.StyledSelect
          placeholder="Select Lead Status"
          style={{
            width: '100%'
          }}
          onChange={value => this.updateLeadStatus(value, record, 'leadStatus')}
          value={status ? status : undefined}
          ellipsis="false"
          disabled={savedRole === MENTOR}
        >
          {
            noFeedBackMenteeShow && <Option value="unfit">
              <span style={{ textTransform: 'capitalize' }}> unfit </span>
            </Option>
          }
          {leadStatusOptions.map(status => {
            return (
              <Option value={status}>
                <span style={{ textTransform: 'capitalize' }}> {status} </span>
              </Option>
            )
          })}
        </MentorSalesStyle.StyledSelect>
        {!status ? (
          <MentorSalesStyle.StatusOfLeadStatus>missing</MentorSalesStyle.StatusOfLeadStatus>
        ) : null}
      </div>
    )
  }

  renderLeadStatusNextSteps = (record, nextStep) => {
    const { nextStepReasons } = this.state
    if (!get(record, 'status') || get(record, 'status') === 'unassigned') {
      return <span>Select Status</span>
    }
    return (
      <Fragment>
        <MentorSalesStyle.StyledSelect
          placeholder="Select Next Step"
          style={{
            width: '100%'
          }}
          onChange={value => this.updateLeadStatus(value, record, 'nextSteps')}
          value={nextStep ? nextStep : ''}
          ellipsis="false"
          dropdownMatchSelectWidth={false}
        >
          {Object.keys(nextStepReasons[get(record, 'status')]).map(reason => {
            return (
              <Option value={reason}>
                <span style={{ textTransform: 'capitalize' }}>
                  {' '}
                  {nextStepReasons[get(record, 'status')][reason]}{' '}
                </span>
              </Option>
            )
          })}
        </MentorSalesStyle.StyledSelect>
        {!nextStep ? (
          <MentorSalesStyle.StatusOfLeadStatus>missing</MentorSalesStyle.StatusOfLeadStatus>
        ) : null}
      </Fragment>
    )
  }

  disabledDate = current => current && current < moment().startOf('day')

  renderLeadStatusNextDate = (record, stateId) => {
    return (
      <Fragment>
        <DatePicker
          format="ll"
          disabledDate={this.disabledDate}
          showTime={{
            // defaultValue: moment('00:00', 'HH:mm'),
            minuteStep: 10,
            value: moment(this.state.sessions[stateId].nextDate).format('HH:mm'),
            format: 'HH:mm'
          }}
          onChange={value => {
            let { sessions } = this.state
            sessions[stateId].nextDate = value ? value : ''
            this.setState({
              sessions
            })
          }}
          value={
            this.state.sessions[stateId].nextDate
              ? moment(this.state.sessions[stateId].nextDate)
              : ''
          }
          onOk={() =>
            this.updateLeadStatus(
              moment(this.state.sessions[stateId].nextDate)
                .toDate()
                .toISOString(),
              record,
              'nextCallOn'
            )
          }
          placeholder="Select Date"
          style={{ minWidth: 150 }}
          minuteStep={10}
        />
        <MentorSalesStyle.StatusOfLeadStatus>missing</MentorSalesStyle.StatusOfLeadStatus>
      </Fragment>
    )
  }

  renderZoneColor = zone => {
    switch (zone) {
      case 'green':
        return green
      case 'red':
        return red
      case 'yellow':
        return yellow
      default:
        return 'grey'
    }
  }

  renderTags = tags => {
    const tagsToShow = tags
    if (tagsToShow && tagsToShow.length > 3) {
      return (
        <React.Fragment>
          <MentorSalesStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[0].zone)}`,
              marginLeft: '6px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[0].icon}
          </MentorSalesStyle.TagsIcon>
          <MentorSalesStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[1].zone)}`,
              marginLeft: '6px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[1].icon}
          </MentorSalesStyle.TagsIcon>
          <Tooltip
            placement="right"
            title={() =>
              tagsToShow.map(item => (
                <MentorSalesStyle.MoreTags>
                  {item.displayTitle ? item.displayTitle : item.tag}
                </MentorSalesStyle.MoreTags>
              ))
            }
          >
            <MentorSalesStyle.TagsIcon
              style={{ backgroundColor: '#777', marginLeft: '6px', border: '1px solid #fff' }}
            >
              +{tagsToShow.length - 2}
            </MentorSalesStyle.TagsIcon>
          </Tooltip>
        </React.Fragment>
      )
    }
    if (tagsToShow) {
      return tagsToShow.map(item => (
        <MentorSalesStyle.TagsIcon
          style={{
            backgroundColor: `${this.renderZoneColor(item.zone)}`,
            marginLeft: '6px',
            border: '1px solid #fff'
          }}
        >
          {item.icon}
        </MentorSalesStyle.TagsIcon>
      ))
    }
    return null
  }

  toggleCommentModal = id => {
    const { showCommentModal } = this.state
    const { mentorSales } = this.props
    const mentorSalesData = mentorSales.toJS()
    const data = filter(mentorSalesData, item => get(item, 'salesOperation.id') === id)
    this.setState({
      showCommentModal: !showCommentModal,
      salesOperationData: data && data[0] ? data[0] : [],
      topicForSalesOperation: data && data[0] ? data[0].topic : null
    })
  }

  closeSOModal = () => {
    this.setState({
      showCommentModal: false
    })
  }

  onPageChange = page => {
    const {
      filterQuery,
      filterQuerySales,
      filterQueryLeadStatus,
      filterQueryNextDate,
      dateFilterQuery,
      noFeedBackMenteeShow,
      mentorsId
    } = this.state
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      if (!noFeedBackMenteeShow) {
        fetchMentorSalesOfSchool(
          filterQuery,
          page - 1,
          filterQuerySales,
          filterQueryLeadStatus,
          filterQueryNextDate.query,
          dateFilterQuery
        )
      } else {
        fetchMenteeSessionWithNoFeedBack(filterQuery, page - 1, dateFilterQuery)
      }
    } else if (savedRole && savedRole === MENTOR) {
      fetchMentorSalesOfSchool(
        `${filterQuery} {mentorSession_some:{user_some:{id:"${savedId}"}}}`,
        page - 1,
        `${filterQuerySales} {allottedMentor_some:{id:"${savedId}"}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery
      )
    } else if  (savedRole && savedRole === SALES_EXECUTIVE) {
      fetchMentorSalesOfSchool(
        `${filterQuery} {mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
        page - 1,
        `${filterQuerySales} {allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery
      )
    }
    this.setState({
      currentPage: page
    })
  }

  normaliseCamelCase = text => {
    if (text) {
      return text.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) {
        return str.toUpperCase()
      })
    }
    return null
  }

  editDataForActivityModal = activity => {
    if (!activity || activity.length === 0) {
      this.setState({
        salesOperationModalData: null
      })
      return null
    }
    let activities = []
    activity.forEach(item => {
      const dateFormat = 'll [at] HH:mm'
      let currData = moment(item.currentData).isValid()
        ? moment(item.currentData).format(dateFormat)
        : this.normaliseCamelCase(item.currentData)
      let oldData =
        item.oldData && moment(item.oldData).isValid()
          ? moment(item.oldData).format(dateFormat)
          : this.normaliseCamelCase(item.oldData)
      activities.push(
        <MentorSalesStyle.Activities>
          <p>
            {item.oldData ? (item.actionOn === 'leadStatus' ? 'Moved ' : 'Changed ') : 'Set '}
            {this.normaliseCamelCase(item.actionOn)}
            {item.oldData ? ` from ${currData} to ${oldData}` : ` to ${currData}`}
          </p>
          <p className="createdAt">{moment(item.createdAt).format(dateFormat)}</p>
        </MentorSalesStyle.Activities>
      )
    })
    this.setState(
      {
        salesOperationData: activities
      },
      this.toggleActivityModal
    )
  }

  toggleActivityModal = () => {
    const { showActivityModal } = this.state
    this.setState({
      showActivityModal: !showActivityModal
    })
  }

  callDateFilterQuery = () => {
    let filterQuery = ''
    const { dateFilter } = this.state
    if (dateFilter.fromDate) {
      filterQuery += `{sessionStartDate_gte: "${moment(dateFilter.fromDate)
        .startOf('day')
        .toDate()
        .toISOString()}"}`
    }
    if (dateFilter.toDate) {
      filterQuery += `{sessionStartDate_lte: "${moment(dateFilter.toDate)
        .endOf('day')
        .toDate()
        .toISOString()}"}`
    }
    this.setState(
      {
        dateFilterQuery: filterQuery
      },
      this.fetchDataWithFilters
    )
  }

  handleDateRange = rangeInString => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.onDateFilterChange([])
      } else {
        this.onDateFilterChange([
          moment().subtract(range.duration, range.unit),
          moment()
        ])
      }
    })
  }

  onDateFilterChange = (dates) => {
    this.setState({
      dateFilter: {
        fromDate: dates && dates[0] ? dates[0] : '',
        toDate: dates && dates[1] ? dates[1] : '',
      }
    }, this.callDateFilterQuery)
  }

  showMenteesWithNoFeedBack = checked => {
    this.setState(
      {
        noFeedBackMenteeShow: checked,
        currentPage: 1
      },
      () => {
        if (checked) {
          this.fetchQueryForNoFeedBackMentees()
        } else {
          this.fetchInitialData()
        }
      }
    )
  }

  fetchQueryForNoFeedBackMentees = () => {
    const { filterQuery, currentPage, dateFilterQuery } = this.state
    fetchMenteeSessionWithNoFeedBack(filterQuery, currentPage - 1, dateFilterQuery)
  }

  render() {
    const { Column } = Table
    const fetchStatus =
      this.props.sessionFetchStatus && get(this.props.sessionFetchStatus.toJS(), 'completedSession')
    const savedRole = getDataFromLocalStorage('login.role')
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    const sales = savedRole === SALES_EXECUTIVE
    if (fetchStatus && fetchStatus.failure) {
      const errorText = 'An unexpected error occurred while fetching sessions.'
      return <div> {errorText} </div>
    }

    const totalSales =
      this.props.totalCompletedSessions &&
      this.props.totalCompletedSessions.toJS().data &&
      this.props.totalCompletedSessions.toJS().data.count
    return (
      <Fragment>
        <MentorMenteeManagement current={1} totalCount={totalSales} />
        <MentorSalesStyle>
          <MentorSalesCountData
            countData={this.props.countData.toJS().data}
            setLeadStatusFilter={this.setLeadStatusFilter}
            setNextDateFilter={this.setNextDateFilter}
          />
          <MentorSalesStyle.SearchBy>
            <div>
              <Select
                style={{ width: 200 }}
                placeholder="Select a Filter"
                onChange={val =>
                  this.setState({ searchBy: val }, () => {
                    if (this.state.searchBy === 'clearSrch') {
                      this.setNameFilter()
                    }
                  })
                }
              >
                <Select.Option value="clearSrch">All</Select.Option>
                {admin || sales ? <Select.Option value="Mentors">Mentors</Select.Option> : null}
                {['Mentees'].map(type => (
                  <Select.Option value={type}>{type}</Select.Option>
                ))}
              </Select>
              {this.renderFilterOptions()}
              <DatePicker.RangePicker
                value={[
                  this.state.dateFilter.fromDate,
                  this.state.dateFilter.toDate
                ]}
                format="DD/MM/YYYY"
                onCalendarChange={this.onDateFilterChange}
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
            {admin || sales ? (
              <div>
                Show Mentees with no feedback? {'  '}
                <Switch
                  checked={this.state.noFeedBackMenteeShow}
                  onChange={this.showMenteesWithNoFeedBack}
                  size="small"
                />
              </div>
            ) : null}
          </MentorSalesStyle.SearchBy>
          <MentorSalesStyle.StyledTable
            dataSource={
              this.props.mentorSales && this.props.mentorSales.toJS().length
                ? this.state.sessions
                : null
            }
            bordered
            rowKey="id"
            scroll={{ x: 'fit-content' }}
            pagination={false}
            loading={fetchStatus && fetchStatus.loading}
          >
            <Column
              title="#"
              dataIndex="key"
              key="key"
              render={(text, record, index) => index + 1}
              fixed="left"
              width="40px"
            />
            <Column title="Student" dataIndex="student" key="student" fixed="left" width="120px" />
            <Column title="M/F" dataIndex="gender" key="gender" fixed="left" width="50px" />
            <Column title="Gr" dataIndex="grade" key="grade" fixed="left" width="40px" />
            <Column title="School Name" dataIndex="schoolName" key="schoolName" fixed="left" width="200px" />
            <Column title="Parent" dataIndex="parent" key="parent" width="105px" />
            <Column title="Phone" dataIndex="phone" key="phone" width="120px" />
            <Column title="Email ID" dataIndex="emailId" key="emailId" width="125px" />
            {admin || sales ? (
              <Column
                title="Mentor"
                dataIndex="mentor"
                key="mentor"
                width="120px"
                render={mentor => get(mentor, 'name')}
              />
            ) : null}
            <Column title="Session info" dataIndex="sessionInfo" key="sessionInfo" width="80px" />
            <Column title="Course Name" dataIndex="course" key="course" width="150px"
              render={(course) => {
                return {
                  children: get(course, 'title')
                }
              }} />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              className="mentorStatus"
              width="100px"
              render={(status, record, id) => {
                return {
                  props: {
                    className: `mentorStatus ${status}`
                  },
                  children: this.renderLeadStatusOptions(record, status)
                }
              }}
            />
            <Column
              title="Next Steps"
              dataIndex="nextSteps"
              key="nextSteps"
              className="mentorStatus"
              width="200px"
              render={(nextStep, record) => {
                if (
                  record.status === 'hot' ||
                  record.status === 'won' ||
                  record.status === 'unfit'
                ) {
                  return 'N/A'
                }
                return this.renderLeadStatusNextSteps(record, nextStep)
              }}
            />
            <Column
              title="Next Date"
              dataIndex="nextDate"
              key="nextDate"
              className="mentorStatus"
              width="162px"
              render={(nextDate, record, id) => {
                if (record.status === 'hot' || record.status === 'unfit') {
                  return 'N/A'
                }
                if (nextDate === null || nextDate === '') {
                  return this.renderLeadStatusNextDate(record, id)
                }
                let days = moment(nextDate).calendar(null, {
                  delayed: `[delayed]`,
                  today: `[today at] HH:mm`,
                  togo: `[days to go]`
                })
                return (
                  <Fragment>
                    <DatePicker
                      format="ll"
                      disabledDate={this.disabledDate}
                      showTime={{
                        // defaultValue: moment('00:00', 'HH:mm'),
                        minuteStep: 10,
                        format: 'HH:mm',
                        value: moment(this.state.sessions[id].nextDate).format('HH:mm')
                      }}
                      onChange={value => {
                        let { sessions } = this.state
                        sessions[id].nextDate = value ? value : ''
                        this.setState({
                          sessions
                        })
                      }}
                      value={moment(this.state.sessions[id].nextDate)}
                      onOk={() =>
                        this.updateLeadStatus(
                          moment(this.state.sessions[id].nextDate)
                            .toDate()
                            .toISOString(),
                          record,
                          'nextCallOn'
                        )
                      }
                      placeholder="Select Date"
                      style={{ minWidth: 150 }}
                    />
                    <MentorSalesStyle.StatusOfLeadStatus
                      style={{
                        backgroundColor:
                          days === 'delayed'
                            ? '#fcd6d2'
                            : days === 'days to go'
                            ? '#c9cbcc'
                            : '#f8ed6b'
                      }}
                    >
                      {days === 'delayed'
                        ? `${Math.abs(moment(nextDate).diff(moment.now(), 'days', false)) +
                            1} days delayed`
                        : days === 'days to go'
                        ? `${Math.abs(moment(nextDate).diff(moment.now(), 'days', false))} ${days}`
                        : days}
                    </MentorSalesStyle.StatusOfLeadStatus>
                  </Fragment>
                )
              }}
            />
            <Column
              title="Add Notes"
              dataIndex="addNotes"
              key="addNotes"
              className="mentorStatus"
              width="220px"
              ellipsis="true"
              render={(notes, record) => {
                if (!notes || notes.length === 0) {
                  return (
                    <Fragment>
                      <span> Add note </span>
                      <MentorSalesStyle.StyledEditButton
                        onClick={() => this.toggleCommentModal(get(record, 'salesId'))}
                      >
                        <EditOutlined />
                      </MentorSalesStyle.StyledEditButton>
                      <MentorSalesStyle.StatusOfLeadStatus>
                        missing
                      </MentorSalesStyle.StatusOfLeadStatus>
                    </Fragment>
                  )
                }
                // console.log(notes)
                return (
                  <Fragment>
                    {notes}
                    {/* <MentorSalesStyle.StyledChatIconWrap>
                      <MentorSalesStyle.StyledChatIcon>
                        {filter(notes, note => note.log).length}
                      </MentorSalesStyle.StyledChatIcon>
                    </MentorSalesStyle.StyledChatIconWrap> */}
                    <MentorSalesStyle.StyledEditButton
                      onClick={() => this.toggleCommentModal(get(record, 'salesId'))}
                    >
                      <EditOutlined />
                    </MentorSalesStyle.StyledEditButton>
                  </Fragment>
                )
              }}
            />
            <Column
              title="Interest"
              dataIndex="interest"
              key="interest"
              className="interest"
              width="88px"
              render={(course, record) => {
                if (record.status === "unfit") {
                  return 'N/A'
                }
                let toreturn = []
                course.map(type => {
                  toreturn.push(
                    <MentorSalesStyle.InterestTags
                      // color={type.oneToOne ? "blue" : ""}
                      key="oneToOne"
                      checked={type.oneToOne}
                      onChange={checked =>
                        this.updateLeadStatus(checked, record, 'oneToOne')
                      }
                    >
                      1:1
                    </MentorSalesStyle.InterestTags>
                  )
                  toreturn.push(
                    <MentorSalesStyle.InterestTags
                      // color={type.oneToTwo ? "blue" : ""}
                      key="oneToTwo"
                      checked={type.oneToTwo}
                      onChange={checked =>
                        this.updateLeadStatus(checked, record, 'oneToTwo')
                      }
                    >
                      1:2
                    </MentorSalesStyle.InterestTags>
                  )
                  toreturn.push(
                    <MentorSalesStyle.InterestTags
                      // color={type.oneToThree ? "blue" : ""}
                      key="oneToThree"
                      checked={type.oneToThree}
                      onChange={checked =>
                        this.updateLeadStatus(checked, record, 'oneToThree')
                      }
                    >
                      1:3
                    </MentorSalesStyle.InterestTags>
                  )
                })
                return toreturn
              }}
            />
            <Column
              title="Student's Activity"
              dataIndex="studentFeedback"
              colSpan={4}
              width="182px"
              ellipsis="true"
            />
            <Column
              title="Student's Activity"
              dataIndex="studentRatingAndHw"
              colSpan={0}
              width="37px"
              render={data => {
                const { rating, homework } = data[0]
                return (
                  <>
                    {rating ? (
                      <MentorSalesStyle.TagsIcon style={{ backgroundColor: '#b8e986' }}>
                        {rating}
                      </MentorSalesStyle.TagsIcon>
                    ) : null}
                    <MentorSalesStyle.TagsIcon
                      style={{ backgroundColor: homework ? '#b8e986' : '#f8998e' }}
                    >
                      H
                    </MentorSalesStyle.TagsIcon>
                  </>
                )
              }}
            />
            <Column
              title="Student's Activity"
              dataIndex="tags"
              colSpan={0}
              width="100px"
              render={this.renderTags}
            />
            <Column
              title="Student's Activity"
              dataIndex="activity"
              colSpan={0}
              width="50px"
              render={activity => {
                if (!activity || !activity.length) {
                  return '-'
                }
                return (
                  <MentorSalesStyle.ActivityBtn
                    onClick={() => {
                      this.editDataForActivityModal(activity)
                    }}
                  >
                    <ProfileOutlined />
                  </MentorSalesStyle.ActivityBtn>
                )
              }}
            />
          </MentorSalesStyle.StyledTable>
          {/* Modal for Student Activity */}
          <Modal
            title="Student's TimeLine"
            style={{
              maxHeight: 500,
              overflowY: 'scroll'
            }}
            centered
            visible={this.state.showActivityModal}
            footer={null}
            onCancel={() => this.toggleActivityModal()}
          >
            {this.state.salesOperationData}
          </Modal>
          {/* Modal for Student Activity Ends*/}
          <SalesOperationModal
            id="Comment Section"
            visible={this.state.showCommentModal}
            title="Comment Section"
            closeSOModal={this.closeSOModal}
            opsCommentSection={true}
            adding={this.props.addSOStatus && this.props.addSOStatus.toJS().loading}
            updating={this.props.updateSOStatus && this.props.updateSOStatus.toJS().loading}
            addSuccess={this.props.addSOStatus && this.props.addSOStatus.toJS().success}
            updateSuccess={this.props.updateSOStatus && this.props.updateSOStatus.toJS().success}
            addError={this.props.addSOStatus && this.props.addSOStatus.toJS().error}
            updateError={this.props.updateSOStatus && this.props.updateSOStatus.toJS().error}
            notification={this.props.notification}
            actionType="EDIT"
            salesOperationData={this.state.salesOperationData ? this.state.salesOperationData : {}}
            topic={this.state.topicForSalesOperation}
            path={this.props.match.path}
          />
          <MentorSalesStyle.PaginationHolder>
            <Pagination
              total={totalSales ? totalSales : 0}
              onChange={this.onPageChange}
              current={this.state.currentPage}
              defaultPageSize={this.state.perPageQueries}
            />
          </MentorSalesStyle.PaginationHolder>
        </MentorSalesStyle>
      </Fragment>
    )
  }
}

export default MentorSales
