/* eslint-disable */
import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types'
import MentorSalesStyle from './MentorSales.style'
import { Spin } from 'antd'
import { ADMIN, MENTOR, SALES_EXECUTIVE, TRANSFORMATION_ADMIN, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import getSlotTime from '../../utils/slots/slot-time'
import fetchMentorSales from '../../actions/mentorSales/fetchMentorSales'
import fetchMenteeSessionWithNoFeedBack from '../../actions/mentorSales/fetchMenteeSessionWithNoFeedBack'
import fetchOnlyCountForMentorSales from '../../actions/mentorSales/fetchOnlyCountForMentorSales'
import findSalesOperation from '../../actions/mentorSales/findSalesOperation'
import { filter, get, sortBy, remove, uniqBy } from 'lodash'
import moment from 'moment'
import {
  Table,
  Select,
  DatePicker,
  Button,
  Tooltip,
  Pagination,
  Modal,
  Input,
  Switch
} from 'antd'
import { EditOutlined, ProfileOutlined } from '@ant-design/icons'
// import FromToDatePicker from '../../components/FromToDatePicker/FromToDatePicker'
import { green, yellow, red } from '../../constants/colors'
import updateMentorSales from '../../actions/mentorSales/updateMentorSales'
import fetchSessionLogs from '../../actions/sessions/fetchSessionLogs'
import fetchSessionLogMeta from '../../actions/sessions/fetchSessionLogsMeta'
import SalesOperationModal from '../UmsDashboard/components/SalesOperationModal'
import MentorSalesCountData from './component/MentorSalesCountData'
import MentorManagementNav from '../../components/MentorManagementNav/mentorManagementNav'
import addMentorSales from '../../actions/mentorSales/addMentorSales'
import fetchProfileUserInfo from '../../actions/profile/fetchProfileUserInfo'
import fetchMentorForSalesExec from '../../actions/sessions/fetchMentorForSales'
import updateMentorMenteeSessionStatus from '../../actions/mentorSales/updateMentorMenteeSessionStatus'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

moment.calendarFormat = function(myMoment, now) {
  var diff = myMoment.diff(now, 'days', true)
  var ret = diff < 0 ? `delayed` : diff >= 1 ? `togo` : 'today'
  return ret
}

class MentorSales extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterQuery: '',
      filterQuerySales: '',
      filterQueryLeadStatus: [],
      filterQueryEnrollmentType: '',
      mentorsName: [],
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
      leadStatusOptions: ['pipeline', 'hot', 'won', 'cold', 'lost', 'unfit', 'unassigned'],
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
        },
        won: {},
        hot: {},
        unfit: {}
      },
      nextDate: '',
      showCommentModal: false,
      salesOperationData: null,
      showSessionModal:false,
      perPageQueries: 20,
      currentPage: 1,
      currentPageModal:1,
      perPageModal:40,
      showActivityModal: false,
      showActionModal:false,
      sessionId:null,
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
      showUnfitReasonsModal: false,
      unQualifiedLeadReasons: [
        {
          name: 'knowCoding',
          displayName: 'Already knows programming basics',
          color: 'red',
          selected: false
        },
        {
          name: 'lookingForAdvanceCourse',
          displayName: 'Was looking for advance course',
          color: 'red',
          selected: false
        },
        {
          name: 'ageNotAppropriate',
          displayName: 'Age not appropriate',
          color: 'red',
          selected: false
        },
        {
          name: 'notRelevantDifferentStream',
          displayName: 'Not relevant',
          color: 'red',
          selected: false
        },
        { name: 'noPayingPower', displayName: 'No paying power', color: 'red', selected: false },
        {
          name: 'notInterestedInCoding',
          displayName: 'Not interested in coding(just for sake)',
          color: 'red',
          selected: false
        },
        {
          name: 'learningAptitudeIssue',
          displayName: 'Severe aptitude issues(struggling to learn, unfit)',
          color: 'red',
          selected: false
        }
      ],
      notAQualifiedLeadComment: null,
      unlinkedSalesOperationId: null,
      unlinkedSessionId: null,
      currentRecord: null,
      country: localStorage.getItem('country'),
      mentorsId: [],
      isFetching: false,
      redirectedUser: get(props, 'match.params.userId')
    }
  }

  componentDidMount() {
    let selectedRange = ''
    if (this.state.redirectedUser) {
      selectedRange = '{"duration":"all"}'
    } else {
      selectedRange = '{"duration":"3","unit":"d"}'
    }
    this.setState({
      selectedRange
    })
    this.fetchInitialData()
    window.addEventListener('click', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }
  componentDidUpdate(prevProp, prevState) {
    if (!this.props.sessions || !this.props.mentorSales) {
      fetchMentorSales(
        this.state.filterQuery,
        0,
        null,
        null,
        null,
        null,
        null,
        this.state.country,
        this.state.redirectedUser
      )
    } else if (
      this.props.mentorSales !== prevProp.mentorSales ||
      !this.state.sessions ||
      (!prevProp.hasSalesOperationUpdate && this.props.hasSalesOperationUpdate) ||
      (!prevProp.hasSalesOperationAdd && this.props.hasSalesOperationAdd) ||
      (get(prevProp.addNoteStatus, 'loading') && get(this.props.addNoteStatus, 'loading'))
    ) {
      this.convertSessionsIntoTableForm()
    }

    if (this.state.country !== prevState.country) {
      const savedRole = getDataFromLocalStorage('login.role')
      let filterQuery = ''
      let filterQuerySales = ''
      const { dateFilter, mentorsId } = this.state
      if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
        filterQuery = ``
        fetchProfileUserInfo(MENTOR, 0, false, false)
      } else if (savedRole && savedRole === MENTOR) {
        filterQuery = `{mentorSession_some:{user_some:{id:"${savedId}"}}}`
        filterQuerySales = `{allottedMentor_some:{id:"${savedId}"}}`
      } else if (savedRole && savedRole === SALES_EXECUTIVE) {
        filterQuery = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`
        filterQuerySales = `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`
      }
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
      this.setState({
        currentPage: 1,
        filterQuerySales: filterQuerySales ? filterQuerySales : '',
        sessions: null
      }, () => {
        if (this.state.noFeedBackMenteeShow) {
          fetchMenteeSessionWithNoFeedBack(filterQuery, 0, null, this.state.country, this.state.redirectedUser)
        } else {
          fetchMentorSales(
            filterQuery,
            0,
            null,
            null,
            null,
            null,
            null,
            this.state.country,
            this.state.redirectedUser
          )
        }
      })
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
      await fetchMentorForSalesExec(savedId).then(res => {
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
    const mentorSalesInJs = mentorSales.toJS()
    const tableData = []
    let mentors = []
    mentorSalesInJs.reverse().forEach(session => {
      let data = { ...session }
      let forTable = {
        id: session.id,
        salesId: get(session.salesOperation, "id"),
        menteeId: get(session.menteeSession, "user.id"),
        student: get(data.menteeSession, "user.name"),
        gender: get(data.menteeSession, "user.gender")
          ? get(data.menteeSession, "user.gender")
          : "-",
        grade: get(data.menteeSession, "user.studentProfile.grade")
          ? get(data.menteeSession, "user.studentProfile.grade").slice(5)
          : "-",
        parent: get(
          data.menteeSession,
          "user.studentProfile.parents[0].user.name"
        ),
        phone: get(
          data.menteeSession,
          "user.studentProfile.parents[0].user.phone.number"
        ),
        emailId: get(
          data.menteeSession,
          "user.studentProfile.parents[0].user.email"
        ),
        // mentor: get(data.menteeSession, 'user.studentProfile.parents[0].user.email'),
        sessionInfo: moment(data.sessionStartDate).format("D MMM[,\n] h:mm a"),
        status:
          get(data, "leadStatus") || get(data.salesOperation, "leadStatus"),
        nextSteps: get(data.salesOperation, "nextSteps"),
        unfitNextSteps: this.getUnfitReasons(data.salesOperation),
        nextDate:
          data.salesOperation && data.salesOperation.nextCallOn
            ? moment(data.salesOperation.nextCallOn).format("ll HH:mm")
            : null,
        addNotes: get(data, "sessionCommentByMentor"),
        interest: [
          {
            oneToOne: get(data.salesOperation, "oneToOne"),
            oneToTwo: get(data.salesOperation, "oneToTwo"),
            oneToThree: get(data.salesOperation, "oneToThree"),
          },
        ],
        studentFeedback: data.comment ? data.comment : "-",
        studentRatingAndHw: [
          {
            rating: data.rating === 5 ? 5 : null,
            homework: data.isSubmittedForReview,
          },
        ],
        tags: filter(tags, (item) => data[item.tag]),
        activity: get(data.salesOperation, "salesOperationActivities"),
        sessionStart: data.sessionStartDate,
        mentor: get(data.mentorSession, "user"),
        source: get(data, "source"),
        course: get(session, 'course')
      };
      tableData.push(forTable)
    })
    const users = uniqBy(this.props.users.toJS(), item => item.id)
    if (users) {
      Object.keys(users).forEach(item => {
        if (get(users[item], 'role') === 'mentor') {
          mentors.push(users[item])
        }
      })
    }
    tableData.length
      ? this.setState({
          sessions: sortBy(tableData, data => -moment(data.sessionStart)),
          mentors
        })
      : this.setState({
          sessions: [],
          mentors
        })
  }
  sortByCreatedAt=(a,b)=>{  
  if((get(a, 'createdAt')) && (get(b,'createdAt'))){
    return moment(a.createdAt).unix() > moment(b.createdAt).unix() ? 1 : -1 
  }
}
  getUnfitReasons = so => {
    const { unQualifiedLeadReasons } = this.state
    const unfitNextSteps = []
    unQualifiedLeadReasons.map(reason => {
      if(get(so, reason.name)) {
        unfitNextSteps.push(reason.name)
      }
    })
    return unfitNextSteps
  }
 
  fetchDataWithFilters() {
    const {
      filterQuery,
      filterQuerySales,
      filterQueryLeadStatus,
      filterQueryNextDate,
      currentPage,
      dateFilterQuery,
      noFeedBackMenteeShow,
      filterQueryEnrollmentType,
      mentorsId
    } = this.state
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === TRANSFORMATION_ADMIN)) {
      if (!noFeedBackMenteeShow) {
        fetchMentorSales(
          filterQuery,
          currentPage - 1,
          filterQuerySales,
          filterQueryLeadStatus,
          filterQueryNextDate.query,
          dateFilterQuery,
          filterQueryEnrollmentType,
          this.state.country,
          this.state.redirectedUser
        )
      } else {
        fetchMenteeSessionWithNoFeedBack(filterQuery, currentPage - 1, dateFilterQuery, this.state.country, this.state.redirectedUser)
      }
    } else if (savedRole && savedRole === MENTOR) {
      fetchMentorSales(
        `${filterQuery} {mentorSession_some:{user_some:{id:"${savedId}"}}}`,
        currentPage - 1,
        `${filterQuerySales} {allottedMentor_some:{id:"${savedId}"}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery,
        filterQueryEnrollmentType,
        this.state.country,
        this.state.redirectedUser
      )
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      fetchMentorSales(
        `${filterQuery} {mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
        currentPage - 1,
        `${filterQuerySales} {allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery,
        filterQueryEnrollmentType,
        this.state.country,
        this.state.redirectedUser
      )
    }
  }

  setLeadStatusFilter = filterValue => {
    const { filterQueryLeadStatus, filterQueryEnrollmentType } = this.state
    if (filterQueryLeadStatus.includes(filterValue)) {
      remove(filterQueryLeadStatus, item => item === filterValue)
    } else {
      filterQueryLeadStatus.push(filterValue)
    }
    this.setState(
      {
        filterQueryLeadStatus,
        filterQueryEnrollmentType: filterValue === 'won' ? '' : filterQueryEnrollmentType
      },
      () => {
        this.fetchDataWithFilters()
      }
    )
  }

  setEnrollmentTypeFilter = type => {
    const { filterQueryLeadStatus } = this.state
    if (!filterQueryLeadStatus.includes("won")) {
      filterQueryLeadStatus.push("won")
    }
    this.setState(
      {
        filterQueryLeadStatus,
        filterQueryEnrollmentType: type
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
      query += `{and: [
        {nextCallOn_gte: "${moment()
      .startOf('day')
      .toDate()
      .toISOString()}"}, 
        {nextCallOn_lte: "${moment()
      .endOf('day')
      .toDate()
      .toISOString()}"}
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

 
  updateLeadStatusCall = async (value, record, key) => {
    const input = {
      [key]: value
    }
    const mentorMenteeSessionId = record.id
    if (this.state.unlinkedSalesOperationId || !this.state.noFeedBackMenteeShow || record.salesId) {
      let sessionId = null
      let salesId = null
      if (!record.salesId) {
        salesId = this.state.unlinkedSalesOperationId
        sessionId = this.state.unlinkedSessionId
      } else {
        salesId = record.salesId
      }
      await updateMentorSales(
        salesId,
        input,
        sessionId,
        'salesOperationForMentorSales/update'
      )
      await fetchOnlyCountForMentorSales(
        this.state.filterQuerySales,
        this.state.dateFilterQuery,
        this.state.country,
        this.state.redirectedUser
      )
      if (input && get(input, 'leadStatus')) {
        await updateMentorMenteeSessionStatus(mentorMenteeSessionId, input).then(() => {
          if (this.state.noFeedBackMenteeShow) {
            this.fetchQueryForNoFeedBackMentees()
          }
        })
      }
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
        await updateMentorMenteeSessionStatus(mentorMenteeSessionId, input).then(() => {
          if (this.state.noFeedBackMenteeShow) {
            this.fetchQueryForNoFeedBackMentees()
          }
        })
      }
    }
  }

  updateLeadStatus = async (value, record, key) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === TRANSFORMATION_ADMIN) {
      return null
    }
    if (!record.salesId) {
      findSalesOperation(get(record, 'menteeId')).then(data => {
        if (get(data, 'unlinkedSalesOperation').length) {
          this.setState({
            unlinkedSalesOperationId: get(data, 'unlinkedSalesOperation.0.id'),
            unlinkedSessionId: record.id,
            currentRecord: record
          }, () => {
            if ( key === 'leadStatus' && value === 'unfit' ) {
              this.showUnfitReasonModal(record)
              return
            }
            this.updateLeadStatusCall(value, record, key)
          })
        } else {
          this.setState({
            unlinkedSalesOperationId: null,
            unlinkedSessionId: null,
            currentRecord: record
          }, () => {
            if ( key === 'leadStatus' && value === 'unfit' ) {
              this.showUnfitReasonModal(record)
              return
            }
            this.updateLeadStatusCall(value, record, key)
          })
        }
      })
    }else if (key === 'leadStatus' && value === 'unfit') {
      this.showUnfitReasonModal(record)
      return
    }else {
      this.updateLeadStatusCall(value, record, key)
    }
  }

  showUnfitReasonModal = (record) => {
    this.setState({
      showUnfitReasonModal: true,
      currentRecord: record
    })
  };

  unQualifiedLeadReasonsInit = () => {
    const { unQualifiedLeadReasons } = this.state
    unQualifiedLeadReasons.forEach((reason, index) => {
      unQualifiedLeadReasons[index].selected = false
    })
    this.setState({
      showUnfitReasonModal: false,
      unQualifiedLeadReasons,
      unlinkedSalesOperationId: null,
      unlinkedSessionId: null,
      currentRecord: null
    })
  }

  handleUnfitReasonModalOk = () => {
    const input = {
      leadStatus: "unfit"
    }
    this.state.unQualifiedLeadReasons.forEach(reason => {
      input[reason.name] = reason.selected
    })
    if (this.state.unlinkedSalesOperationId) {
      updateMentorSales(
        this.state.unlinkedSalesOperationId,
        input,
        this.state.unlinkedSessionId,
        'salesOperationForMentorSales/update'
      ).then(res => {
        this.unQualifiedLeadReasonsInit()
      }).catch(err => {
        console.log(err)
        this.unQualifiedLeadReasonsInit()
      })
    } else {
      const { currentRecord } = this.state
      if (get(currentRecord, 'salesId')) {
        updateMentorSales(
          get(currentRecord, 'salesId'),
          input
        ).then(res => {
          this.unQualifiedLeadReasonsInit()
        }).catch(err => {
          console.log(err)
          this.unQualifiedLeadReasonsInit()
        })
      } else {
        addMentorSales(
          get(currentRecord, 'menteeId'),
          getDataFromLocalStorage('login.id'),
          get(currentRecord, 'id'),
          get(currentRecord, 'mentor.id'),
          get(currentRecord, 'course.id'),
          input
        ).then(res => {
          this.unQualifiedLeadReasonsInit()
        }).catch(err => {
          console.log(err)
          this.unQualifiedLeadReasonsInit()
        })
      }
    }
    
  };

  handleUnfitReasonModalCancel = () => {
    this.unQualifiedLeadReasonsInit()
  };

  toggleUnQualifiedLeadReasons = key => {
    const { unQualifiedLeadReasons } = this.state
    unQualifiedLeadReasons[key].selected = !unQualifiedLeadReasons[key].selected
    this.setState({
      unQualifiedLeadReasons
    })
  }

  handleNotAQualifiedLeadComment = e => {
    e.persist()
    this.setState({
      notAQualifiedLeadComment: e.target.value
    })
  }

  renderLeadStatusOptions = (record, status) => {
    const { leadStatusOptions } = this.state
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
          disabled={savedRole === TRANSFORMATION_ADMIN || savedRole === MENTOR}
        >
          {leadStatusOptions.map(leadStatus => {
            return (
              <Option value={leadStatus}>
                <span style={{ textTransform: 'capitalize' }}> {leadStatus} </span>
              </Option>
            )
          })}
        </MentorSalesStyle.StyledSelect>
        {!status || status === 'unassigned' ? (
          <MentorSalesStyle.StatusOfLeadStatus>missing</MentorSalesStyle.StatusOfLeadStatus>
        ) : null}
      </div>
    )
  }

  renderLeadStatusNextSteps = (record, nextStep) => {
    const { nextStepReasons } = this.state
    if (!record.status || record.status === 'unassigned') {
      return <span>Select Status</span>
    }
    // console.log(111, record)
    const savedRole = getDataFromLocalStorage('login.role')
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
          disabled={savedRole === TRANSFORMATION_ADMIN}
        >
          {Object.keys(nextStepReasons[record.status]).map(reason => {
            return (
              <Option value={reason}>
                <span style={{ textTransform: 'capitalize' }}>
                  {' '}
                  {nextStepReasons[record.status][reason]}{' '}
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
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <Fragment>
        <DatePicker
          format="ll"
          disabled={savedRole === TRANSFORMATION_ADMIN}
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
 sessionLogheadingDict={
    addMenteeSession: "Session Booked",
    updateMenteeSession : "Session Rescheduled",
    deleteMenteeSession : "Session Deleted",
    addMentorMenteeSession : "Mentor Allotted",
    deleteMentorMenteeSession :" Mentor Mentee Mapping Deleted",
    addBatchSession :" Batch Session Added",
    updateBatchSession :"Batch Session Updated",
    deleteBatchSession :" Batch Session Deleted" ,
    sessionStarted :"Session Started",
    sessionCompleted:"Session Completed"

  }
  renderSessionLogContent=(sessionLog)=>{
   if(sessionLog.action==='addMenteeSession'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Session is booked on {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')} {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
   else if(sessionLog.action==='updateMenteeSession'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Session is rescheduled on {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')} {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
   else if(sessionLog.action==='deleteMenteeSession'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Session earlier scheduled on {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')} is now deleted {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
   else if(sessionLog.action==='addMentorMenteeSession'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Mentor {sessionLog.mentor && sessionLog.mentor.username} is allotted  {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}for session scheduled at {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
   else if(sessionLog.action==='updateMentorMenteeSession' && sessionLog.sessionStatus==='started'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Session schedule at {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')} is started {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at  { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
   else if(sessionLog.action==='updateMentorMenteeSession' && sessionLog.sessionStatus==='completed'){
    return(
      <MentorSalesStyle.SessionItemNormal>
        Session schedule at {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')} is completed {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`} at  { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
  else if(sessionLog.action==='deleteMentorMenteeSession'){
    return(
      <MentorSalesStyle.SessionItemNormal>
       Mapping of session schedule at {getSlotTime(sessionLog)},{moment(sessionLog.sessionDate).format('MMMM Do YYYY')}  is deleted {sessionLog.actionBy.username &&  `by ${sessionLog.actionBy.username}`}  at { moment(sessionLog.createdAt).format('MMMM Do YYYY hh:mm')}
      </MentorSalesStyle.SessionItemNormal>
    )
   }
  }
  renderSessionList=()=>{
    let sessionLogs = this.props.sessionLogs.filter(sessionLog => sessionLog.__keys[0].includes(this.state.sessionId))
    let sessionLogArr =sessionLogs.filter(sessionLog => sessionLog.action!=="updateMentorMenteeSession"); 
    const updateMentorMenteeStarted = sessionLogs.filter(sessionLog => sessionLog.action==="updateMentorMenteeSession" && sessionLog.sessionStatus==="started"); 
    const updateMentorMenteeCompleted = sessionLogs.filter(sessionLog => sessionLog.action==="updateMentorMenteeSession" && sessionLog.sessionStatus==="completed"); 
    if(updateMentorMenteeCompleted.length>0){
    sessionLogArr.push(updateMentorMenteeCompleted[0])
    }
    if(updateMentorMenteeStarted.length>0){
    sessionLogArr.push(updateMentorMenteeStarted[0])
    }
    sessionLogArr.sort(this.sortByCreatedAt)
   return (
       this.state.isFetching?<MentorSalesStyle.SessionLoader><Spin /></MentorSalesStyle.SessionLoader>:
      (sessionLogArr || []).map((sessionLog)=>{
        return (
          <div id="mod">
        <MentorSalesStyle.Activities >
          <MentorSalesStyle.Activitie>
            <MentorSalesStyle.Session>
            {this.renderSessionLogContent(sessionLog)}
            </MentorSalesStyle.Session>
          </MentorSalesStyle.Activitie>
        </MentorSalesStyle.Activities>
        </div>
        )  
      })
    
      )
  }
  toggleCommentModal = id => {
    const { showCommentModal } = this.state
    const { mentorSales } = this.props
    const mentorSalesData = mentorSales.toJS()
    const data = filter(mentorSalesData, item => get(item, 'salesOperation.id') === id)
    console.log(data)
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
      filterQueryEnrollmentType,
      country,
      mentorsId
    } = this.state
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      if (!noFeedBackMenteeShow) {
        fetchMentorSales(
          filterQuery,
          page - 1,
          filterQuerySales,
          filterQueryLeadStatus,
          filterQueryNextDate.query,
          dateFilterQuery,
          filterQueryEnrollmentType,
          country,
          this.state.redirectedUser
        )
      } else {
        fetchMenteeSessionWithNoFeedBack(filterQuery, page - 1, dateFilterQuery, country, this.state.redirectedUser)
      }
    } else if (savedRole && savedRole === MENTOR) {
      fetchMentorSales(
        `${filterQuery} {mentorSession_some:{user_some:{id:"${savedId}"}}}`,
        page - 1,
        `${filterQuerySales} {allottedMentor_some:{id:"${savedId}"}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery,
        filterQueryEnrollmentType,
        country,
        this.state.redirectedUser
      )
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      fetchMentorSales(
        `${filterQuery} {mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
        page - 1,
        `${filterQuerySales} {allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}`,
        filterQueryLeadStatus,
        filterQueryNextDate.query,
        dateFilterQuery,
        filterQueryEnrollmentType,
        country,
        this.state.redirectedUser
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

  handleSessionLog =id =>{ 
    this.setState(()=>{
    return {sessionId:id}
    },async()=>{
      this.toggleSessionModal()
      this.setState({isFetching:true})
      await fetchSessionLogMeta(id).call()
      await fetchSessionLogs(id,this.state.perPageModal,this.state.currentPageModal-1).call()
      this.setState({isFetching:false})
    })
  
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
  handleLoadMore = () => {
    let a=this.state.currentPageModal;
    this.setState(()=>{
      return {currentPageModal:a+1 }
      },()=>{
        fetchSessionLogs(this.state.sessionId,this.state.perPageModal,this.state.currentPageModal-1).call()
      })
    }
 
  
  toggleSessionModal = () => {
    const { showSessionModal } = this.state
    if(showSessionModal===true){
    this.setState({
      showSessionModal: false,
      currentPageModal:1,
      sessionId:null
    })
  }
  else{
    this.setState({
      showSessionModal: true,
    })
  }
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
    console.log(range)
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
    fetchMenteeSessionWithNoFeedBack(filterQuery, currentPage - 1, dateFilterQuery, this.state.country, this.state.redirectedUser)
  }

  render() {
    const {sessionLogs,sessionLogsMeta}=this.props
    const { Column } = Table
    const fetchStatus =
      this.props.sessionFetchStatus && get(this.props.sessionFetchStatus.toJS(), 'completedSession')
    const savedRole = getDataFromLocalStorage('login.role')
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    const sales = savedRole === SALES_EXECUTIVE
    const transformationAdmin = savedRole === TRANSFORMATION_ADMIN
    if (fetchStatus && fetchStatus.failure) {
      const errorText = 'An unexpected error occurred while fetching sessions.'
      return <div> {errorText} </div>
    }
    const totalSales =
      this.props.totalCompletedSessions &&
      this.props.totalCompletedSessions.toJS().data &&
      this.props.totalCompletedSessions.toJS().data.count
    const { redirectedUser } = this.state
    return (
      <Fragment>
        <MentorManagementNav current={1} totalCount={totalSales} userId={redirectedUser} />
        <MentorSalesStyle>
          <MentorSalesCountData
            countData={this.props.countData.toJS().data}
            setLeadStatusFilter={this.setLeadStatusFilter}
            setNextDateFilter={this.setNextDateFilter}
            setEnrollmentTypeFilter={this.setEnrollmentTypeFilter}
            filterQueryLeadStatus={this.state.filterQueryLeadStatus || []}
            enrollmentType={this.state.filterQueryEnrollmentType}
          />
          <MentorSalesStyle.SearchBy>
            {
              !redirectedUser && (
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
              )
            }
            <div>
            {
              !redirectedUser && this.state.dateRanges.map(range =>
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
              render={(text, record, index) => {
                return `${index + 1}${get(record, 'source') === 'transformation' ? '*' : ''}`
              }}
              fixed="left"
              width="40px"
            />
            <Column title="Student" dataIndex="student" key="student" fixed="left" width="120px" />
            {/* <Column title="M/F" dataIndex="gender" key="gender" fixed="left" width="50px" /> */}
            <Column title="Gr" dataIndex="grade" key="grade" fixed="left" width="40px" />
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
                  record.status === 'won'
                ) {
                  return 'N/A'
                } else if (record.status === 'unfit') {
                  return (
                    <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select Reasons"
                    defaultValue={get(record, 'unfitNextSteps')}
                    disabled={transformationAdmin}
                    onChange={value => {this.setState({ currentRecordsUnfitReasons: value })}}
                    onDropdownVisibleChange={open => {
                      if (!open) {
                        if (this.state.currentRecordsUnfitReasons  &&
                          this.state.currentRecordsUnfitReasons !== get(record, 'unfitNextSteps')) {
                            const input = {}
                            this.state.unQualifiedLeadReasons.map(reasons => {
                              if (this.state.currentRecordsUnfitReasons.indexOf(reasons.name) != -1) {
                                input[reasons.name] = true
                              } else {
                                input[reasons.name] = false
                              }
                            })
                            updateMentorSales(
                              get(record, 'salesId'),
                              input
                            ).then(res => {
                              console.log('saved')
                            }).catch(err => {
                              console.log(err)
                            })
                          }
                      }
                    }}
                  >
                    {
                      this.state.unQualifiedLeadReasons.map((reason, index) => (
                        <Select.Option key={index} value={reason.name}>{reason.displayName}</Select.Option>
                      ))
                    }
                  </Select>
                  )
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
                if (record.status === 'unfit') {
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
                      disabled={transformationAdmin}
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
              disabled={transformationAdmin}
              render={(notes, record) => {
                if (!notes || notes.length === 0) {
                  return (
                    <Fragment>
                      <span> Add note </span>
                      <MentorSalesStyle.StyledEditButton
                        disabled={transformationAdmin}
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
              disabled={transformationAdmin}
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
                      disabled={transformationAdmin}
                    >
                      1:1
                    </MentorSalesStyle.InterestTags>
                  )
                  toreturn.push(
                    <MentorSalesStyle.InterestTags
                      // color={type.oneToTwo ? "blue" : ""}
                      key="oneToTwo"
                      checked={type.oneToTwo}
                      disabled={transformationAdmin}
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
                      disabled={transformationAdmin}
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
            
            <Column
              title="Session Logs"
              dataIndex="menteeId"
              width="150px"
              render={id => {
               
                return (
                  <MentorSalesStyle.ActivityBtn
                    onClick={() => {
                      this.handleSessionLog(id)
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
          
            bodyStyle={{
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
          
          <Modal
            title="Session Logs"
            width='700px'
            bodyStyle={
              {
                maxHeight: 500,
                overflowY: 'scroll',
                padding:"0px"
              }
            }
            centered
            visible={this.state.showSessionModal}
            footer={null}
            onCancel={() => this.toggleSessionModal()}
          >
          {sessionLogs && sessionLogs.length>0 && this.renderSessionList()}
          {sessionLogs && sessionLogsMeta &&  this.state.sessionId && !this.state.isFetching && sessionLogs.filter(sessionLog => sessionLog.__keys[0].includes(this.state.sessionId)).length>0 && sessionLogs.filter(sessionLog => sessionLog.__keys[0].includes(this.state.sessionId)).length !== sessionLogsMeta.count && 
           <MentorSalesStyle.LoadMoreButtonParent>
              <Button
                  type='primary'
                  onClick={this.handleLoadMore}
                  style={{
                    margin: '0 5px'
                  }}
                >Load More</Button>
            </MentorSalesStyle.LoadMoreButtonParent>
             }
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
          <Modal
            title="Why is the Mentee Unfit?"
            visible={this.state.showUnfitReasonModal}
            onOk={this.handleUnfitReasonModalOk}
            onCancel={this.handleUnfitReasonModalCancel}
          >
            {
              this.state.unQualifiedLeadReasons.map((item, key) => (
                <MentorSalesStyle.redOptions
                  key={`${key + 1}${item.name}`}
                  style={{
                    boxShadow: item.selected ? '#00000033 1px 5px 6px' : 'none',
                    border: item.selected ? '2px solid #de2b20' : '0'
                  }}
                  onClick={() => this.toggleUnQualifiedLeadReasons(key)}
                >
                  {item.displayName ? item.displayName : item.name}
                </MentorSalesStyle.redOptions>
              ))
            }
            <Input
              placeholder='tell us more...'
              value={this.state.notAQualifiedLeadComment}
              onChange={this.handleNotAQualifiedLeadComment}
            />
          </Modal>
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
