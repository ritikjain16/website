/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { get, filter, sortBy, cloneDeep } from 'lodash'
import SessionTable from './components/SessionTable'
import CompletedSessionStyle from './CompletedSessions.style'
import { ADMIN, UMS_ADMIN, UMS_VIEWER, MENTOR, TRANSFORMATION_ADMIN, SALES_EXECUTIVE, TRANSFORMATION_TEAM } from '../../constants/roles'
// import fetchUsers from '../../actions/ums/fetchUsers'
import fetchCompletedSessions from '../../actions/sessions/fetchCompletedSessions'
import updateMentorMenteeSession from "../../actions/sessions/updateMentorMenteeSession";
import fetchCompletedSessionsCount from '../../actions/sessions/fetchCompletedSessionsCount'
import findSalesOperationForMentorMenteeSession from '../../actions/sessions/findSalesOperationForMentorMenteeSession'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import FromToDatePicker from '../../components/FromToDatePicker'
import SearchBox from './components/SearchBox'
import CompletedSessionsTags from './components/CompletedSessionsTags'
import SalesOperationModal from '../UmsDashboard/components/SalesOperationModal'
import SessionVideoLinkModal from './components/SessionVideoLinkModal'
import SessionRatingsScale from './components/SessionRatingsScale'
import CompleteSessionPopup from './components/CompleteSessionPopup'
import { Button, Pagination, DatePicker, Switch } from 'antd'
import SendSessionModalLink from './components/SendSessionModalLink'
import MentorManagementNav from '../../components/MentorManagementNav/mentorManagementNav'
import { getLowerboundTime, T12HrFormat } from '../../utils/time'
import formatDate from '../../utils/formatDate'
import fetchMentorForSalesExec from '../../actions/sessions/fetchMentorForSales'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import { filterKey } from 'duck-state/lib/State'

class CompletedSessions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessions: null,
      fromDate: null,
      toDate: null,
      searchKey: 'Search By',
      userIdSendSession: '',
      searchValue: '',
      sessionTimeModalVisible: false,
      sessionVideoModalVisible: false,
      sessionVideoModalShadowVisible: false,
      isHomeworkSubmitted: null,
      selectedSlots: [],
      totalSessionsCount: 0,
      showCommentModal: false,
      sendVideoSessionId: '',
      userIdToEdit: '',
      currentCompletedSessionPhone: '',
      salesAction: 'ADD',
      salesOperationData: {},
      topic: {},
      sessionDetails: {},
      mentorName: '',
      mentorSessionLink: '',
      salesExecutiveId: '',
      mentorsId: [],
      mentorsName: [],
      country: localStorage.getItem('country'),
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
      checkAll: true,
      showLinkModal: false,
      link: '',
      avgRating: 0,
      showCompleteSessionModal: false,
      studentName: '',
      currentPage: 1,
      filterQuery: '',
      perPageQueries: 30,
      sessionType: 'trial',
      queryFetchingNumber: 0,
      queryFetchedNumber: 0,
      updatedMentorMenteeSessionId: '',
      currUpdagtingMentorMenteeSessionId: '',
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '3D', subtract: { duration: '3', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: 'A', subtract: { duration: 'all' } },
      ],
      selectedRange: '{"duration":"3","unit":"d"}',
      showSessionLogs: false,
      redirectedUser: get(props, 'match.params.userId')
    }
  }

  totalSessionsCount = 0

  async componentDidMount() {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    let filterQuery = ''
    let selectedRange = ''
    if (this.state.redirectedUser) {
      selectedRange = '{"duration":"all"}'
    } else {
      selectedRange = '{"duration":"3","unit":"d"}'
    }
    if (savedRole && savedRole === MENTOR) {
      filterQuery = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      const salesExecutiveId = getDataFromLocalStorage('login.id')
      await fetchMentorForSalesExec(salesExecutiveId).then(res => {
        const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
        const mentorsName = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.name)
        filterQuery = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`
        this.setState({
          salesExecutiveId: salesExecutiveId,
          mentorsId: mentorsId,
          mentorsName
        })
      })
    }
    this.setState({
      currentPage: 1,
      filterQuery: filterQuery,
      selectedRange,
      queryFetchingNumber: localStorage.getItem('currCompletedSessionQueryFetchedCount')
        ? parseInt(localStorage.getItem('currCompletedSessionQueryFetchedCount')) + 1
        : 0,
    }, this.handleDateRange(selectedRange))
    window.addEventListener('click', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }

  getKey = (sessions) => {
    if (sessions && sessions.toJS().length) {
      return get(sessions.toJS(), '0.__keys')
        ? get(sessions.toJS(), '0.__keys').pop()
        : ''
    } else if (sessions && !sessions.toJS().length) {
      return 
    }
    
    return ''
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateVideoLinkStatus, notification, sessionFetchStatus, updateSessionStatus,
      updateSOStatus, sendLinkFailure, sendLinkStatus, sessionLogs } = this.props
    const { mentorsId, showSessionLogs } = this.state
    const currSessions = filterKey(this.props.sessions, `completedSession/${this.state.queryFetchingNumber}`)
    const prevSession = filterKey(prevProps.sessions, `completedSession/${this.state.queryFetchingNumber}`)
    const currKey = this.getKey(filterKey(this.props.sessions, `completedSession/${this.state.queryFetchingNumber}`))
    const prevKey = this.getKey(filterKey(prevProps.sessions, `completedSession/${this.state.queryFetchingNumber}`))

    const currentSessionKey = this.getKey(filterKey(sessionLogs, `completedSession/${this.state.queryFetchingNumber}`))
    const prevSessionKey = this.getKey(filterKey(prevProps.sessionLogs, `completedSession/${this.state.queryFetchingNumber}`))
    if ((updateSessionStatus && !get(updateSessionStatus.toJS(), 'loading')
      && get(updateSessionStatus.toJS(), 'success') &&
      (prevProps.updateSessionStatus !== updateSessionStatus)) ||
      (updateSOStatus && !get(updateSOStatus.toJS(), 'loading')
      && get(updateSOStatus.toJS(), 'success') &&
      (prevProps.updateSOStatus !== updateSOStatus))) {
      const propsSessions = currSessions && currSessions.toJS()
        const datewiseSessions = this.constructDatewiseSessions(
          sortBy(propsSessions, 'sessionStartDate').reverse()
      )
        localStorage.setItem('currCompletedSessionQueryFetchedCount', this.state.queryFetchingNumber)
        this.setState(
          {
            sessions: datewiseSessions,
            onlySessionsArray: filter(propsSessions, session => get(session, 'menteeSession')),
            queryFetchedNumber: this.state.queryFetchingNumber
          },
          this.calculateAvgRating
        )
      }
    if (
      !this.state.sessions ||
      !Object.keys(this.state.sessions) ||
      (prevProps.updateVideoLinkStatus &&
        updateVideoLinkStatus &&
        !prevProps.updateVideoLinkStatus.toJS().success &&
        updateVideoLinkStatus.toJS().success)
    ) {
      const propsSessions = currSessions && currSessions.toJS()
      if (propsSessions && propsSessions.length > 0) {
        const datewiseSessions = this.constructDatewiseSessions(
          sortBy(propsSessions, 'sessionStartDate').reverse()
        )
        localStorage.setItem('currCompletedSessionQueryFetchedCount', this.state.queryFetchingNumber)
        this.setState(
          {
            sessions: datewiseSessions,
            onlySessionsArray: filter(propsSessions, session => get(session, 'menteeSession')),
            queryFetchedNumber: this.state.queryFetchingNumber
          },
          this.calculateAvgRating
        )
      }
    } else if (
      (currKey !== prevKey) ||
      (
        sessionFetchStatus && get(sessionFetchStatus.toJS(), `completedSession/${this.state.queryFetchingNumber}.success`) &&
        !(prevProps.sessionFetchStatus && get(prevProps.sessionFetchStatus.toJS(), `completedSession/${this.state.queryFetchingNumber}.success`)) &&
        localStorage.getItem('fetchedCompletedSessionLength') == 0
      )
    ) {
      const propsSessions = currSessions && currSessions.toJS()
      const datewiseSessions = this.constructDatewiseSessions(
        sortBy(propsSessions, 'sessionStartDate').reverse()
      )
      localStorage.setItem('currCompletedSessionQueryFetchedCount', this.state.queryFetchingNumber)
      this.setState(
        {
          sessions: datewiseSessions,
          onlySessionsArray: filter(propsSessions, session => get(session, 'menteeSession')),
          queryFetchedNumber: this.state.queryFetchingNumber
        },
        this.calculateAvgRating
      )
    } else if (showSessionLogs && ((currentSessionKey !== prevSessionKey)
      || (sessionFetchStatus && get(sessionFetchStatus.toJS(), `completedSession/${this.state.queryFetchingNumber}.success`) &&
        !(prevProps.sessionFetchStatus && get(prevProps.sessionFetchStatus.toJS(), `completedSession/${this.state.queryFetchingNumber}.success`)) &&
        localStorage.getItem('fetchedCompletedSessionLength') == 0)
    )) {
      const currentSessionLogs = sessionLogs && sessionLogs.toJS() && filterKey(sessionLogs, `completedSession/${this.state.queryFetchingNumber}`).toJS() || []
      const datewiseSessions = this.constructDatewiseSessions(
        sortBy(currentSessionLogs, 'sessionStartDate').reverse()
      )
      localStorage.setItem('currCompletedSessionQueryFetchedCount', this.state.queryFetchingNumber)
      this.setState(
        {
          sessions: datewiseSessions,
          onlySessionsArray: filter(currentSessionLogs, session => get(session, 'menteeSession')),
          queryFetchedNumber: this.state.queryFetchingNumber
        },
      )
    }
    const { sessionType, country, queryFetchingNumber } = this.state
    if (prevState.country !== this.state.country) {
      const savedId = getDataFromLocalStorage('login.id')
      const savedRole = getDataFromLocalStorage('login.role')
      let dateFilter = ''
      const range = JSON.parse(this.state.selectedRange)
      if (range.duration !== 'all') {
        const fromDate = moment().subtract(range.duration, range.unit)
        const toDate = moment()
        dateFilter += `{sessionStartDate_gte:"${moment(fromDate)
          .startOf('day')
          .toDate()
          .toISOString()}"}`
          dateFilter += `{sessionStartDate_lte:"${moment(toDate)
          .endOf('day')
          .toDate()
          .toISOString()}"}`
      }
      if (
        savedRole &&
        (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
          || savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM)
      ) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType,
            filterQuery: dateFilter,
            country,
            queryNumberCount: queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType, dateFilter, this.state.country, this.state.redirectedUser)
        })
        // fetchUsers(MENTOR)
      } else if (savedRole && savedRole === MENTOR) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType,
            filterQuery: `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}},${dateFilter}`,
            skipCount: 0,
            country,
            queryNumberCount: queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        fetchCompletedSessionsCount(this.state.sessionType ,`{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}},${dateFilter}`, this.state.country, this.state.redirectedUser)
        })
      } else if (savedRole && savedRole === SALES_EXECUTIVE) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType,
            filterQuery: `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}},${dateFilter}`,
            skipCount: 0,
            country: queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType ,`{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}},${dateFilter}`, this.state.country, this.state.redirectedUser)
        })
      }
    }
    if (
      this.props.startingSessionStatus && get(this.props.startingSessionStatus.toJS(), `updateCompletedSession/startSession/${this.state.currUpdagtingMentorMenteeSessionId}.loading`) &&
      !(prevProps.startingSessionStatus && get(prevProps.startingSessionStatus.toJS(), `updateCompletedSession/startSession/${this.state.currUpdagtingMentorMenteeSessionId}.loading`))
    ) {
      notification.info({
        message: 'Starting Session...',
        key: `startingSession/${this.state.currUpdagtingMentorMenteeSessionId}`,
        duration: 0
      })
    }

    if (prevState.updatedMentorMenteeSessionId !== this.state.updatedMentorMenteeSessionId) {
      notification.close(`startingSession/${this.state.updatedMentorMenteeSessionId}`)
      notification.success({
        message: 'Session started!',
        key: 'sessionStarted',
      })
    }

    if (
      this.props.startingSessionStatus && get(this.props.startingSessionStatus.toJS(), `updateCompletedSession/startSession/${localStorage.getItem('updatedMentorMenteeSession')}.success`) &&
      !(prevProps.startingSessionStatus && get(prevProps.startingSessionStatus.toJS(), `updateCompletedSession/startSession/${localStorage.getItem('updatedMentorMenteeSession')}.success`))
    ) {
      const propsSessions = currSessions && currSessions.toJS()
      const datewiseSessions = this.constructDatewiseSessions(
        sortBy(propsSessions, 'sessionStartDate').reverse()
      )
      this.setState(
        {
          sessions: datewiseSessions,
          onlySessionsArray: filter(propsSessions, session => get(session, 'menteeSession'))
        },
        this.calculateAvgRating
      )
      notification.close(`startingSession/${localStorage.getItem('updatedMentorMenteeSession')}`)
      notification.success({
        message: 'Session started!',
        key: 'sessionStarted',
      })
    }

    if (sendLinkStatus && !get(sendLinkStatus.toJS(), 'loading')
      && get(sendLinkStatus.toJS(), 'success') &&
      (prevProps.sendLinkStatus !== sendLinkStatus)) {
      if (prevSession && (currSessions !== prevSession)) {
        const propsSessions = currSessions && currSessions.toJS()
        const datewiseSessions = this.constructDatewiseSessions(
          sortBy(propsSessions, 'sessionStartDate').reverse()
        )
        localStorage.setItem('currCompletedSessionQueryFetchedCount', this.state.queryFetchingNumber)
        this.setState(
          {
            sessions: datewiseSessions,
            onlySessionsArray: filter(propsSessions, session => get(session, 'menteeSession')),
            queryFetchedNumber: this.state.queryFetchingNumber
          },
          this.calculateAvgRating
        )
      }
      notification.success({
        message: 'Session link sent'
      })
    } else if (sendLinkStatus && !get(sendLinkStatus.toJS(), 'loading')
      && get(sendLinkStatus.toJS(), 'failure') &&
      (prevProps.sendLinkFailure !== sendLinkFailure)) {
      if (sendLinkFailure && sendLinkFailure.toJS().length > 0) {
        notification.error({
          message: get(get(sendLinkFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }

  getSessionFilters = () => {
    const { fromDate, toDate, searchKey, searchValue,
      showSessionLogs, mentorsId } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    let dateFilter = ''
    if (fromDate) {
      dateFilter += `{sessionStartDate_gte:"${moment(fromDate).startOf('day').toDate().toISOString()}"}`
    }
    if (toDate) {
      dateFilter += `{sessionStartDate_lte:"${moment(toDate).endOf('day').toDate().toISOString()}"}`
    }
    let filterQuery = ''
    switch (searchKey) {
      case 'Mentor Name':
        filterQuery += `{mentor_some:{ name_contains: "${searchValue}" }}`
        break
      case 'Student Name':
        filterQuery += `{ client_some:{ name_contains: "${searchValue}" } }`
        break
      case 'Topic':
        filterQuery += `{
          topic_some:{
            title_contains: "${searchValue}"
          }
        }`
        break
      case 'Slot Timing':
        filterQuery += `${this.state.selectedSlots.map(slot => `{slot${slot}: true}`)}`
        break
      case 'Region':
        switch (searchValue) {
          case 'promoters':
            filterQuery += `{rating: 5}`
            break
          case 'passives':
            filterQuery += `{rating: 4}`
            break
          case 'detractors':
            filterQuery += `{rating_in: [3,2,1]}`
            break
          default:
            break
        }
        break
      case 'Ratings':
        filterQuery += `{rating:${Number(searchValue)}}`
        break
      case 'Session Status':
        filterQuery += `{sessionStatus:${searchValue}}`
        break
      default:
        break
    }
    let userFilter = ''
    if (savedRole === SALES_EXECUTIVE) {
      userFilter += `{mentor_some: { id_in:[${getIdArrForQuery(mentorsId)}] }}`
    } else if (savedRole === MENTOR) {
      userFilter += `{mentor_some: { id_in:[${getIdArrForQuery([savedId])}] }}`
    }
    return {
      dateFilter,
      filterQuery,
      userFilter,
      showSessionLogs
    }
  }


  calculateAvgRating() {
    let { countData } = this.props
    countData = countData.toJS().data
    let avgRating = 0
    let totalCount = 0
    for (let i = 1; i <= 5; i++) {
      if (countData[`rating${i}`]) {
        avgRating += countData[`rating${i}`].count * i
        totalCount += countData[`rating${i}`].count
      }
    }
    this.setState({
      avgRating: avgRating ? parseFloat(avgRating / totalCount).toFixed(2) : '0.00'
    })
  }

  toggleTags = (tag, activeState, index) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      var { tags } = this.state
      if (index !== -1) {
        tags[index].active = !tags[index].active
      } else {
        tags.map(obj => {
          obj.active = activeState
          return obj
        })
      }
      this.setState(
        {
          tags
        },
        () => {
          this.setState({
            checkAll: !filter(this.state.tags, tag => !tag.active).length
          })
        }
      )
    }
  }

  setFilters = state => {
    // when the search value is empty
    if (
      this.state.searchKey !== 'Region' &&
      this.state.searchValue !== '' &&
      state.searchValue === ''
    ) { 
      const savedId = getDataFromLocalStorage('login.id')
      const savedRole = getDataFromLocalStorage('login.role')
      const { mentorsId } = this.state
      this.setState({
        queryFetchingNumber: localStorage.getItem('currCompletedSessionQueryFetchedCount')
          ? parseInt(localStorage.getItem('currCompletedSessionQueryFetchedCount')) + 1
          : 0,
      }, () => {
        if (
          savedRole &&
          (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === TRANSFORMATION_ADMIN)
        ) {
          const queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery: null,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
            // fetchUsers(MENTOR)
            fetchCompletedSessionsCount(this.state.sessionType, null, this.state.country, this.state.redirectedUser)
          })
        } else if (savedRole && savedRole === MENTOR) {
          const queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery: `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
            fetchCompletedSessionsCount(this.state.sessionType, `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`, this.state.country, this.state.redirectedUser)
          })
        } else if  (savedRole && savedRole === SALES_EXECUTIVE) {
          const queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery: `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
            fetchCompletedSessionsCount(this.state.sessionType, `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`, this.state.country, this.state.redirectedUser)
          })
        }
      })
    }
    // required for all the filters
    this.setState(
      {
        ...state,
        currentPage: 1
      },
      () => {
        if (
          this.state.searchKey &&
          (this.state.searchValue !== '' ||
            this.state.selectedSlots.length ||
            this.state.isHomeworkSubmitted !== null)
        ) {
          this.filterByName()
        }
      }
    )
  }

  filterByName = () => {
    let { countData } = this.props
    countData = countData.toJS().data
    let { fromDate, toDate, searchValue, searchKey, mentorsId } = this.state
    let { menteeSessions, users } = this.props
    menteeSessions = menteeSessions.toJS()
    users = users.toJS()
    let tags = cloneDeep(this.state.tags)
    const propsSessions = filterKey(this.props.sessions, `completedSession/${this.state.queryFetchingNumber}`)
        ? filterKey(this.props.sessions, `completedSession/${this.state.queryFetchingNumber}`).toJS()
        : []
    const datewiseSessions = this.constructDatewiseSessions(
      sortBy(propsSessions, 'sessionStartDate').reverse()
    )
    const savedRole = getDataFromLocalStorage('login.role')
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    const transformationTeam =  savedRole === TRANSFORMATION_ADMIN
    const id = getDataFromLocalStorage('login.id')
    let filterQuery = ``
    let shouldFetch = false
    // Date Filter conditions
    if (fromDate && toDate) {
      filterQuery += `{sessionStartDate_gte:"${moment(fromDate)
        .startOf('day')
        .toDate()
        .toISOString()}"}`
      filterQuery += `{sessionStartDate_lte:"${moment(toDate)
        .endOf('day')
        .toDate()
        .toISOString()}"}`
      shouldFetch = true
    } else if (fromDate && !toDate) {
      filterQuery += `{sessionStartDate_gte:"${moment(fromDate)
        .startOf('day')
        .toDate()
        .toISOString()}"}`
      shouldFetch = true
    } else if (!fromDate && toDate) {
      filterQuery += `{sessionStartDate_lte:"${moment(toDate)
        .endOf('day')
        .toDate()
        .toISOString()}"}`
      shouldFetch = true
    } else if (!fromDate && !toDate) {
      shouldFetch = true
    }

    if (
      shouldFetch && searchKey === 'Search By' &&
      (searchValue === '' ||
        this.state.selectedSlots.length ||
        this.state.isHomeworkSubmitted !== null)
    ) {
      if (admin || transformationTeam) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}`, this.state.country, this.state.redirectedUser)
        })
      } else if (savedRole && savedRole === MENTOR){
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`, this.state.country, this.state.redirectedUser)
        })
      } else if (savedRole && savedRole === SALES_EXECUTIVE) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`, this.state.country, this.state.redirectedUser)
        })
      }
      shouldFetch = false
    }

    // admin and mentor filtering
    if (admin) {
      if (!this.state.checkAll) {
        let tagsFilterQuery = ``
        let addOr = false
        tags.forEach(tag => {
          if (tag.active) {
            tagsFilterQuery += `{${tag.tag}_exists: true}`
            shouldFetch = true
            addOr = true
          }
        })
        if (addOr) {
          filterQuery += `{or: [${tagsFilterQuery}]}`
        }
      } else {
        shouldFetch = true
      }
    } else if (savedRole === MENTOR) {
      propsSessions.map(session => {
        tags.map((item, key) => {
          if (session[item.tag]) {
            tags[key].count += 1
          }
        })
        if (session.rating) {
          if (session.rating === 5) {
            promoters += 1
          } else if (session.rating === 4) {
            passives += 1
          } else {
            detractors += 1
          }
        }
      })
    }

    // if (shouldFetch && searchValue === '') {
    //   console.log('######', shouldFetch)
    //   if (admin) {
    //     const queryFetchingNumber = this.state.queryFetchingNumber + 1
    //     this.setState({
    //       queryFetchingNumber
    //     }, () => {
    //       fetchCompletedSessions(this.state.sessionType ,filterQuery, 0, this.state.country, this.state.queryFetchingNumber)
    //     })
    //   }
    //   shouldFetch = false
    // }

    // Search By Condition's Conditions
    if (searchValue !== '' || this.state.selectedSlots.length) {
      searchValue = searchValue.toLowerCase()
      switch (searchKey) {
        case 'Mentor Name':
          filterQuery += `{mentorSession_some:{
            user_some:{
              name_contains: "${searchValue}"
            }
          }}`
          if (admin || transformationTeam) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          } else if (savedRole && savedRole === SALES_EXECUTIVE) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          }
          break
        case 'Student Name':
          filterQuery += `{menteeSession_some:{
            user_some:{
              name_contains: "${searchValue}"
            }
          }}`
          if (admin || transformationTeam) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
              fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}`, this.state.country, this.state.redirectedUser)
            })
          } else if (savedRole && savedRole === SALES_EXECUTIVE) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          } else {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          }
          break
        case 'Topic':
          filterQuery += `{
            topic_some:{
              title_contains: "${searchValue}"
            }
          }`
          if (admin || transformationTeam) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
              fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}`, this.state.country, this.state.redirectedUser)
            })
          } else if (savedRole && savedRole === SALES_EXECUTIVE) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          }
          else {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          }
          break
        case 'Slot Timing':
          filterQuery += `{
            menteeSession_some:{
              or: [
                ${this.state.selectedSlots.map(slot => `{slot${slot}: true}`)}
              ]
            }
          }`
          if (admin || transformationTeam) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
              fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}`, this.state.country, this.state.redirectedUser)
            })
          } else if (savedRole && savedRole ===  SALES_EXECUTIVE) {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          } else {
            const queryFetchingNumber = this.state.queryFetchingNumber + 1
            this.setState({
              queryFetchingNumber
            }, () => {
              fetchCompletedSessions({
                sessionType: this.state.sessionType,
                filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`,
                skipCount: 0,
                country: this.state.country,
                queryNumberCount: this.state.queryFetchingNumber,
                sessionFilter: this.getSessionFilters(),
                userId: this.state.redirectedUser
              })
            })
          }
          break
        case 'Region':
          switch (searchValue) {
            case 'promoters':
              filterQuery += `{rating: 5}`
              break
            case 'passives':
              filterQuery += `{rating: 4}`
              break
            case 'detractors':
              filterQuery += `{rating_in: [3,2,1]}`
              break
            default:
              break
          }
          let queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
          })
          break
        case 'Ratings':
          filterQuery += `{rating:${Number(searchValue)}}`
          queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
          })
          break
        case 'Session Status':
          filterQuery += `{sessionStatus:${searchValue}}`
          queryFetchingNumber = this.state.queryFetchingNumber + 1
          this.setState({
            queryFetchingNumber
          }, () => {
            fetchCompletedSessions({
              sessionType: this.state.sessionType,
              filterQuery,
              skipCount: 0,
              country: this.state.country,
              queryNumberCount: this.state.queryFetchingNumber,
              sessionFilter: this.getSessionFilters(),
              userId: this.state.redirectedUser
            })
          })
          break
        default:
          break
      }
    } else if (searchKey === 'Homework Submitted' && this.state.isHomeworkSubmitted !== null) {
      filterQuery += `{isSubmittedForReview: ${this.state.isHomeworkSubmitted}}`
      if (admin || transformationTeam) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
          fetchCompletedSessionsCount(this.state.sessionType ,`${filterQuery}`, this.state.country, this.state.redirectedUser)
        })
      } else if (savedRole && savedRole === SALES_EXECUTIVE) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        })
      } else {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([id])}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        })
      }
    }

    let promoters = 0
    let passives = 0
    let detractors = 0
    let total = 0

    tags.map((item, key) => {
      tags[key].count = 0
    })

    let avgRating = 0
    let totalCount = 0
    for (let i = 1; i <= 5; i++) {
      if (countData[`rating${i}`]) {
        avgRating += countData[`rating${i}`].count
        totalCount += countData[`rating${i}`].count * i
      }
    }
    this.setState({
      promoters,
      passives,
      detractors,
      avgRating: avgRating ? parseFloat(avgRating / totalCount).toFixed(2) : '0.00',
      tags,
      total,
      sessions: datewiseSessions,
      filterQuery
    })
  }

  constructDatewiseSessions = sessions => {
    const newSessions = {}
    let currDate = ''

    for (const i in sessions) {
      if (get(sessions[i], 'menteeSession')) {
        const thisDate = moment(sessions[i].sessionStartDate).startOf('day')
        if (!thisDate.isSame(currDate)) {
          currDate = thisDate
          newSessions[currDate] = []
        }
        newSessions[currDate].push(sessions[i])
      }
    }
    return newSessions
  }

  setTotalSessionCount = totalSessionsCount => {
    if (this.state.totalSessionsCount !== totalSessionsCount) {
      this.setState({ totalSessionsCount })
    }
  }

  handleDateRange = rangeInString => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.handleDateChange([])
      } else {
        this.handleDateChange([
          moment().subtract(range.duration, range.unit),
          moment()
        ])
      }
    })
  }

  handleDateChange = (dates) => {
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : '',
      toDate: dates && dates[1] ? dates[1] : '',
    }, this.filterByName)
  }

  toggleCommentModal = (
    sessionId = '',
    userId = '',
    salesOperationData,
    topic = {},
    sessionDate,
    sessionTime,
    mentorName,
    mentorId,
    session
  ) => {
    switch (this.state.showCommentModal) {
      case true:
        this.setState({
          showCommentModal: false
        })
        break
      case false:
        if (salesOperationData && salesOperationData.id) {
          this.setState({
            showCommentModal: true,
            salesOperationData: salesOperationData,
            userIdToEdit: userId,
            topic,
            salesAction: 'EDIT',
            sessionDetails: {
              sessionId,
              sessionDate,
              sessionTime,
              sessionCourse: get(session, 'course')
            },
            mentorName,
            session
          })
        } else {
          findSalesOperationForMentorMenteeSession(userId, get(session, 'course.id')).then(res => {
            if (get(res, 'unlinkedSalesOperation').length) {
              this.setState({
                showCommentModal: true,
                salesOperationData: get(res, 'unlinkedSalesOperation.0'),
                userIdToEdit: userId,
                topic,
                salesAction: 'EDIT',
                sessionDetails: {
                  sessionId,
                  sessionDate,
                  sessionTime,
                  sessionCourse: get(session, 'course')
                },
                mentorName,
                session
              })
            } else {
              this.setState({
                showCommentModal: true,
                userIdToEdit: userId,
                salesAction: 'ADD',
                topic,
                salesOperationData: salesOperationData,
                mentorName,
                sessionDetails: {
                  sessionId,
                  sessionDate,
                  sessionTime,
                  mentorId,
                  sessionCourse: get(session, 'course')
                },
                session
              })
            }
          })
        }
        break
      default:
        break
    }
  }

  toggleLinkModal = (
    sessionId = '',
    userId = '',
    link = '',
    topic = {},
    sessionDate,
    sessionTime,
    mentorName
  ) => {
    if (!this.state.showLinkModal) {
      this.setState({
        showLinkModal: true,
        link,
        userIdToEdit: userId,
        topic,
        sessionDetails: {
          sessionId,
          sessionDate,
          sessionTime
        },
        mentorName
      })
    } else {
      this.setState({
        showLinkModal: false,
        link
      })
    }
  }

  getOperationLogs = salesOperation => {
    if (salesOperation) {
      salesOperation.toJS().forEach((sO, index) => {
        if (sO.log && sO.log.type !== 'operation') {
          salesOperation.toJS().splice(index, 1)
        }
      })
    }

    return salesOperation
  }

  mapSalesOperationWithUserId = () => {
    const { salesOperation } = this.props
    const sOMap = {}
    if (salesOperation) {
      salesOperation.toJS().forEach(sO => {
        const userId = get(sO, 'client.id')
        sOMap[userId] = sO
      })
    }

    return sOMap
  }

  getCurrSalesOperationDataId = () => {
    const { salesOperation } = this.props
    if (salesOperation) {
      for (let i = 0; i < salesOperation.toJS().length; i += 1) {
        const sOData = salesOperation.toJS()[i]
        const userId = get(sOData, 'client.id')
        if (userId === this.state.userIdToEdit) {
          return sOData.id
        }
      }
    }

    return ''
  }

  getUserFromId = userId => {
    const { users } = this.props
    let filteredUsers = []
    if (users && userId) {
      filteredUsers = users.toJS().filter(u => {
        return u.id === userId
      })
    }

    return filteredUsers
  }

  toggleCompleteSessionModal = (
    sessionId = '',
    name = '',
    topic = {},
    sessionDate,
    sessionTime,
    mentorName,
    currentCompletedSessionPhone = ''
  ) => {
    if (!this.state.showCompleteSessionModal) {
      this.setState({
        showCompleteSessionModal: true,
        topic,
        sessionDetails: {
          sessionId,
          sessionDate,
          sessionTime
        },
        mentorName,
        studentName: name,
        currentCompletedSessionPhone
      })
    } else {
      this.setState({
        showCompleteSessionModal: false,
        currentCompletedSessionPhone: ''
      })
    }
  }

  getRatingScalesData = () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    if (!admin) {
      return filter(this.props.sessions.toJS(), item => item.rating)
    } else if (this.state.sessions) {
      let dataWithRatings = []
      Object.keys(this.state.sessions).forEach(date => {
        const sessions = this.state.sessions[date]
        sessions.map(session => {
          if (session.rating) {
            dataWithRatings.push(session)
          }
        })
      })
      return dataWithRatings
    }
    return []
  }

  onAuditToggle = async (checked, sessionId, type = false) => {
    let input = {
      isAudit : checked
    }
    if (type) {
      input = {
        isPostSalesAudit: checked
      }
    }
    await updateMentorMenteeSession(sessionId, input)
}

  onPageChange = page => {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    const { mentorsId } = this.state
    if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === TRANSFORMATION_ADMIN)) {
      const queryFetchingNumber = this.state.queryFetchingNumber + 1
      this.setState({
        queryFetchingNumber
      }, () => {
        fetchCompletedSessions({
          sessionType: this.state.sessionType,
          filterQuery: this.state.filterQuery,
          skipCount: page - 1,
          country: this.state.country,
          queryNumberCount: this.state.queryFetchingNumber,
          sessionFilter: this.getSessionFilters(),
          userId: this.state.redirectedUser
        })
      })
    } else if (savedRole && savedRole === MENTOR) {
      const queryFetchingNumber = this.state.queryFetchingNumber + 1
      this.setState({
        queryFetchingNumber
      }, () => {
        fetchCompletedSessions({
          sessionType: this.state.sessionType,
          filterQuery: `${this.state.filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`,
          skipCount: page - 1,
          country: this.state.country,
          queryNumberCount: this.state.queryFetchingNumber,
          sessionFilter: this.getSessionFilters(),
          userId: this.state.redirectedUser
        })
      })
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      const queryFetchingNumber = this.state.queryFetchingNumber + 1
      this.setState({
        queryFetchingNumber
      }, () => {
        fetchCompletedSessions({
          sessionType: this.state.sessionType,
          filterQuery: `${this.state.filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
          skipCount: page - 1,
          country: this.state.country,
          queryNumberCount: this.state.queryFetchingNumber,
          sessionFilter: this.getSessionFilters(),
          userId: this.state.redirectedUser
        })
      })
    }
    this.setState({
      currentPage: page
    })
  }

  onSessionTypeChange = type => {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    // if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
    //   // fetchCompletedSessions(type)
    //   fetchCompletedSessionsCount(type, null, this.state.country)
    // }
    let selectedRange
    if (this.state.redirectedUser) {
      selectedRange = '{"duration":"all"}'
    } else {
      selectedRange = '{"duration":"3","unit":"d"}'
    }
    this.setState({
      sessions: null,
      fromDate: null,
      toDate: null,
      searchKey: 'Search By',
      userIdSendSession: '',
      searchValue: '',
      sessionTimeModalVisible: false,
      sessionVideoModalVisible: false,
      sessionVideoModalShadowVisible: false,
      isHomeworkSubmitted: null,
      selectedSlots: [],
      totalSessionsCount: 0,
      showCommentModal: false,
      sendVideoSessionId: '',
      userIdToEdit: '',
      salesAction: 'ADD',
      salesOperationData: {},
      topic: {},
      sessionDetails: {},
      mentorName: '',
      mentorSessionLink: '',
      checkAll: true,
      showLinkModal: false,
      link: '',
      avgRating: 0,
      showCompleteSessionModal: false,
      studentName: '',
      currentPage: 1,
      filterQuery: '',
      sessionType: type,
      selectedRange: selectedRange
    }, this.handleDateRange(selectedRange))
  }

  nextSession = e => {
    const { onlySessionsArray, session } = this.state
    let length = onlySessionsArray.length
    let currentId
    onlySessionsArray.forEach((tempSession, index) => {
      if (get(tempSession, 'id') === get(session, 'id')) {
        currentId = index
        return
      }
    })
    this.dataForSalesOperationModal(onlySessionsArray[(((currentId + 1) % length) + length) % length])
  }

  prevSession = e => {
    const { onlySessionsArray, session } = this.state
    let length = onlySessionsArray.length
    let currentId
    onlySessionsArray.forEach((tempSession, index) => {
      if (get(tempSession, 'id') === get(session, 'id')) {
        currentId = index
        return
      }
    })
    this.dataForSalesOperationModal(onlySessionsArray[(((currentId - 1) % length) + length) % length])
  }

  dataForSalesOperationModal = (sessionToShow) => {
    const { salesOperation, menteeId, topic,  } = sessionToShow
    const { sessionDate, sessionTime } = T12HrFormat(getLowerboundTime(formatDate(get(sessionToShow, 'sessionStartDate')).timeHM), 'a')
    if (salesOperation && salesOperation.id) {
      this.setState({
        showCommentModal: true,
        salesOperationData: salesOperation,
        userIdToEdit: menteeId,
        topic,
        salesAction: 'EDIT',
        sessionDetails: {
          sessionId: sessionToShow.id,
          sessionDate,
          sessionTime,
          sessionCourse: get(sessionToShow, 'course')
        },
        mentorName: get(sessionToShow, 'mentorSession.user.name'),
        session: sessionToShow
      })
    } else {
      findSalesOperationForMentorMenteeSession(menteeId, get(sessionToShow, 'course.id')).then(res => {
        if (get(res, 'unlinkedSalesOperation').length) {
          this.setState({
            showCommentModal: true,
            salesOperationData: get(res, 'unlinkedSalesOperation.0'),
            userIdToEdit: menteeId,
            topic,
            salesAction: 'EDIT',
            sessionDetails: {
              sessionId: sessionToShow.id,
              sessionDate,
              sessionTime,
              sessionCourse: get(sessionToShow, 'course')
            },
            mentorName: get(sessionToShow, 'mentorSession.user.name'),
            session: sessionToShow
          })
        } else {
          this.setState({
            showCommentModal: true,
            userIdToEdit: menteeId,
            salesAction: 'ADD',
            topic,
            salesOperationData: salesOperation,
            sessionDetails: {
              sessionId: sessionToShow.id,
              sessionDate,
              sessionTime,
              mentorId: get(sessionToShow, 'mentorSession.user.id'),
              sessionCourse: get(sessionToShow, 'course')
            },
            mentorName: get(sessionToShow, 'mentorSession.user.name'),
            session: sessionToShow
          })
        }
      })
    }
  }
  onShowSessionLogsChange = (checked) => {
    this.setState({
      showSessionLogs: checked
    }, () => {
      const savedId = getDataFromLocalStorage('login.id')
      const savedRole = getDataFromLocalStorage('login.role')
      const { mentorsId } = this.state
      if (savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === TRANSFORMATION_ADMIN)) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: this.state.filterQuery,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        })
      } else if (savedRole && savedRole === MENTOR) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${this.state.filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        })
      } else if (savedRole && savedRole === SALES_EXECUTIVE) {
        const queryFetchingNumber = this.state.queryFetchingNumber + 1
        this.setState({
          queryFetchingNumber
        }, () => {
          fetchCompletedSessions({
            sessionType: this.state.sessionType,
            filterQuery: `${this.state.filterQuery}{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`,
            skipCount: 0,
            country: this.state.country,
            queryNumberCount: this.state.queryFetchingNumber,
            sessionFilter: this.getSessionFilters(),
            userId: this.state.redirectedUser
          })
        })
      }
    })
  }
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const user = this.getUserFromId(this.state.userIdToEdit)
    const { sessionType, session, mentorsName, showSessionLogs, redirectedUser } = this.state
    const totalCompletedSessionsCount =
      this.props.totalCompletedSessions &&
      this.props.totalCompletedSessions.toJS().data &&
      this.props.totalCompletedSessions.toJS().data.count

    // const {sessionFetchStatus} = this.props
    // const loading = sessionFetchStatus.toJS()
    // if (get(loading, 'completedSession.loading')) {
    //   return <p>loading...</p>
    // }
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    return (
      <div>
        {
          (savedRole !== TRANSFORMATION_ADMIN && savedRole !== TRANSFORMATION_TEAM) &&
            <MentorManagementNav current={0} totalCount={totalCompletedSessionsCount} userId={redirectedUser} />
        }
        <CompletedSessionStyle.TopDetails
          style={{ flexDirection: admin ? 'column' : 'column-reverse' }}
        >
          <CompletedSessionStyle.TopContainer>
            {
              !redirectedUser && (
                <>
                  <SearchBox mentorsName={mentorsName}
                      savedRole={savedRole} setFilters={this.setFilters} />
                    <DatePicker.RangePicker
                      value={[
                        this.state.fromDate,
                        this.state.toDate
                      ]}
                      format="DD/MM/YYYY"
                      onCalendarChange={this.handleDateChange}
                    />
                    <div style={{ margin: '5px 10px 0 auto' }}>
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
                </>
              )
            }
            <div style={{ margin: '5px 10px 0 auto' }}>
              {`Total Sessions: ${totalCompletedSessionsCount}`}<br/>
              {`Avg. Rating: ${this.state.avgRating}`}
            </div>
          </CompletedSessionStyle.TopContainer>
          <div>
          </div>
        </CompletedSessionStyle.TopDetails>
        {
          savedRole !== TRANSFORMATION_ADMIN &&
          <CompletedSessionStyle.PaginationHolder>
          <Button
           type={sessionType === 'trial' ? 'primary' : 'default'}
           onClick={e => this.onSessionTypeChange('trial')}
          >
            TRIAL
          </Button>
          <Button
           type={sessionType === 'paid' ? 'primary' : 'default'}
           onClick={e => this.onSessionTypeChange('paid')}
          >
            PAID
          </Button>
        </CompletedSessionStyle.PaginationHolder>
        }
        {!redirectedUser && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <Switch
              checked={showSessionLogs}
              onChange={this.onShowSessionLogsChange}
              size="small"
              style={{ marginRight: '10px' }}
            />
            Show SessionLogs {'  '}
          </div>
        )}
        <SessionTable
          {...this.props}
          filters={this.state}
          showSessionLogs={showSessionLogs}
          savedRole={savedRole}
          sessionType={sessionType}
          openSendSessionModal={(userId, sessionId, mentorSessionLink) => {
            if (mentorSessionLink) {
              this.setState({
                sessionVideoModalShadowVisible: true,
                userIdSendSession: userId,
                sendVideoSessionId: sessionId,
                mentorSessionLink
              })
            } else {
              this.setState({
                sessionVideoModalVisible: true,
                userIdSendSession: userId,
                sendVideoSessionId: sessionId,
              })
            }
          }}
          tags={this.state.tags}
          checkAll={this.state.checkAll}
          onAuditToggle={this.onAuditToggle}
          setTotalSessionCount={this.setTotalSessionCount}
          fetchStatus={this.props.sessionFetchStatus.toJS().completedSession}
          queryFetchingNumber={this.state.queryFetchingNumber}
          queryFetchedNumber={this.state.queryFetchedNumber}
          openCommentSection={(
            sessionId,
            userId,
            salesOperationData,
            topic,
            date,
            time,
            mentorName,
            mentorId,
            session
          ) => {
            return this.toggleCommentModal(
              sessionId,
              userId,
              salesOperationData,
              topic,
              date,
              time,
              mentorName,
              mentorId,
              session
            )
          }}
          openVideoLinkSection={(sessionId, userId, link, topic, date, time, mentorName) => {
            this.toggleLinkModal(sessionId, userId, link, topic, date, time, mentorName)
          }}
          salesOperation={this.mapSalesOperationWithUserId()}
          salesOperationData={this.state.salesOperationData}
          toggleCompleteSessionModal={(sessionId, name, topic, date, time, mentorName, currentCompletedSessionPhone) =>
            this.toggleCompleteSessionModal(sessionId, name, topic, date, time, mentorName, currentCompletedSessionPhone)
          }
          country={this.state.country}
          updateSessionIdOfUpdatingSessionInState={(id) => this.setState({
            currUpdagtingMentorMenteeSessionId: id
          })}
        />
        <SalesOperationModal
          id="Comment Section"
          visible={this.state.showCommentModal}
          showSessionLogs={showSessionLogs}
          title={
            <CompletedSessionStyle.CommentSectionTitle>
                <p>Comment Section</p>
                <div>
                {
                  get(session, 'mentorSession.user.name') && <p>Mentor: {get(session, 'mentorSession.user.name')} </p>
                }
                {
                  get(session, 'menteeName') && <p>Mentee: {get(session, 'menteeName')} </p>
                }
                </div>
              </CompletedSessionStyle.CommentSectionTitle>
          }
          closeSOModal={() => this.toggleCommentModal()}
          opsCommentSection={true}
          adding={this.props.addSOStatus && this.props.addSOStatus.toJS().loading}
          updating={
            (this.props.updateSOStatus && this.props.updateSOStatus.toJS().loading)
            // (this.props.updateSessionStatus && this.props.updateSessionStatus.toJS().loading)
          }
          addSuccess={this.props.addSOStatus && this.props.addSOStatus.toJS().success}
          updateSuccess={
            (this.props.updateSOStatus && this.props.updateSOStatus.toJS().success)
            // (this.props.updateSessionStatus && this.props.updateSessionStatus.toJS().success)
          }
          addError={this.props.addSOStatus && this.props.addSOStatus.toJS().error}
          updateError={
            (this.props.updateSOStatus && this.props.updateSOStatus.toJS().error)
            // (this.props.updateSessionStatus && this.props.updateSessionStatus.toJS().error)
          }
          notification={this.props.notification}
          userIdToEdit={this.state.userIdToEdit}
          actionType={this.state.salesAction}
          currSalesOperDataId={this.getCurrSalesOperationDataId()}
          salesOperationData={this.state.salesOperationData}
          name={user && user[0] && user[0].name}
          topic={this.state.topic}
          sessionDetails={this.state.sessionDetails}
          session={this.state.session}
          mentorName={this.state.mentorName}
          path={this.props.match.path}
          nextSession={this.nextSession}
          prevSession={this.prevSession}
        />
        <SessionVideoLinkModal
          id="Session Video Link"
          visible={this.state.showLinkModal}
          title="Session Video Link"
          closeVideoLinkModal={() => this.toggleLinkModal()}
          notification={this.props.notification}
          userIdToEdit={this.state.userIdToEdit}
          name={user && user[0] && user[0].name}
          topic={this.state.topic}
          sessionDetails={this.state.sessionDetails}
          mentorName={this.state.mentorName}
          videoLink={this.state.link}
          updateStatus={this.props.updateVideoLinkStatus && this.props.updateVideoLinkStatus.toJS()}
          completedSessions={this.props.sessions}
        />
        <SendSessionModalLink
          id="SendSessionModalLink"
          visible={this.state.sessionVideoModalVisible}
          shadowVisible={this.state.sessionVideoModalShadowVisible}
          userId={this.state.userIdSendSession}
          sessionId={this.state.sendVideoSessionId}
          sessionLink={this.state.mentorSessionLink}
          close={() => {
            this.setState({
              sessionVideoModalVisible: false,
              sessionVideoModalShadowVisible: false
            })
          }}
        />
        <CompleteSessionPopup
          id="Complete Session"
          visible={this.state.showCompleteSessionModal}
          title="Complete Session"
          closeModal={() => this.toggleCompleteSessionModal()}
          topic={this.state.topic}
          sessionDetails={this.state.sessionDetails}
          mentorName={this.state.mentorName}
          studentName={this.state.studentName}
          phone={this.state.currentCompletedSessionPhone}
          notification={this.props.notification}
          updateStatus={this.props.updateVideoLinkStatus && this.props.updateVideoLinkStatus.toJS()}
        />
        {totalCompletedSessionsCount &&
        totalCompletedSessionsCount < this.state.perPageQueries ? null : (
          <CompletedSessionStyle.PaginationHolder>
            <Pagination
              total={totalCompletedSessionsCount ? totalCompletedSessionsCount : 0}
              onChange={this.onPageChange}
              current={this.state.currentPage}
              defaultPageSize={this.state.perPageQueries}
            />
          </CompletedSessionStyle.PaginationHolder>
        )}
      </div>
    )
  }
}

export default CompletedSessions
