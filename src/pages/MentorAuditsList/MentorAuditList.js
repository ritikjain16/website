/* eslint-disable */
import React, { Component } from 'react'
import moment from 'moment'
import { get, filter, sortBy, cloneDeep } from 'lodash'
import cx from 'classnames'
import SessionTable from './components/SessionTable'
import MentorAuditListStyle from './MentorAuditList.style'
import {
  ADMIN, UMS_ADMIN, UMS_VIEWER, MENTOR, SALES_EXECUTIVE,
  PRE_SALES, POST_SALES, AUDIT_ADMIN, AUDITOR
} from '../../constants/roles'
import fetchMentorForSalesExec from '../../actions/sessions/fetchMentorForSales'
import SessionVideoLinkModal from './components/SessionVideoLinkModal'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import SearchBox from './components/SearchBox'
import styles from '../CompletedSessions/icon.module.scss'
import { Button, Pagination, DatePicker, Switch } from 'antd'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import AssignAuditorModal from './components/AssignAuditorModal'
import { auditType as auditTypesValue, auditSubTypes } from '../../constants/auditQuestionConst'
import PreSalesAuditTable from './PreSalesAudit/PreSalesAuditTable'
import PostSalesAudit from './PostSalesAudit/PostSalesAudit'
import fetchMentorMenteeSessionsForAudit from '../../actions/mentorAudits/fetchMentorMenteeSessionsForAudit'
import updateMentorMenteeSessionForAudit from '../../actions/mentorAudits/updateMentorMenteeSessionForAudit'
import fetchMentorMenteeSessionAuditsForAudit from '../../actions/mentorAudits/fetchMentorMenteeSessionAuditsForAudit'
import { PreSalesDiv } from './PreSalesAudit/PreSalesAudit.styles'
import RadioGroup from 'antd/lib/radio/group'
import MainModal from '../../components/MainModal'
import getAuditTypeText, { getAuditSubTypeText } from '../../utils/getAuditTypeText'
import fetchMentorForAudits from '../../actions/mentorAudits/fetchMentorForAudits'
import fetchBatchSessionsForAudit from '../../actions/mentorAudits/fetchBatchSessionsForAudit'
import updateBatchSessionForAudit from '../../actions/mentorAudits/updateBatchSessionForAudit'

const { mentor, preSales, postSales } = auditTypesValue

const { b2cDemo, b2cPaid, b2b } = auditSubTypes

const flexStyle = { alignItems: 'center', marginBottom: '10px' }

const oneToOneSession = 'oneToOneSession'

const batchSession = 'batchSession'

class MentorAuditList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedAuditId: null,
      selectedAuditMentorId: null,
      selectedAuditor: null,
      isAssignAuditorModalVisible: false,
      mentorAuditSessions: null,
      fromDate: null,
      toDate: null,
      searchKey: 'Search By',
      searchValue: '',
      showCommentModal: false,
      userIdToEdit: '',
      currentCompletedSessionPhone: '',
      topic: {},
      sessionDetails: {},
      salesExecutiveId: '',
      mentorName: '',
      link:'',
      mentorsId: null,
      showLinkModal: false,
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
      showCompleteSessionModal: false,
      studentName: '',
      currentPage: 1,
      filterQuery: '',
      mentorMenteeSessionFilters: '',
      perPageQueries: 20,
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
      auditType: preSales,
      tableData: [],
      showDocumentsWithAuditStatus: false,
      showSessionWithLink: false,
      showRatings: '',
      mentorsList: [],
      auditSubTypeValue: auditSubTypes.b2cDemo,
      sessionType: oneToOneSession
    }
  }

  fetchMentorAuditsBasedOnUserRoleAndPath = async (
    filterQuery,
    mentorMenteeSessionFilters,
    skipCount) => {
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    const { mentorsId, auditType, showDocumentsWithAuditStatus,
      auditSubTypeValue, sessionType } = this.state
    const isPathContainsAssignedAudits = this.props.match.path.split('/').pop() === 'assignedAudits'
    filterQuery += isPathContainsAssignedAudits ? `{auditor_some:{id:"${savedId}"}}` : ''
    if (showDocumentsWithAuditStatus) filterQuery += `{ isAudit: true }`
    if (auditSubTypeValue === b2cDemo && sessionType === oneToOneSession) {
      filterQuery += `{ topic_some: { order: 1 } }`
    }
    if (auditSubTypeValue === b2cPaid && sessionType === oneToOneSession) {
      filterQuery += `{ topic_some: { order_not: 1 } }`
    }
    if (auditSubTypeValue === b2cDemo && sessionType === batchSession) {
      filterQuery += `{ batch_some: { type_in: [b2b2c, normal] } }{ topic_some: { order: 1 } }`
    }
    if (auditSubTypeValue === b2cPaid && sessionType === batchSession) {
      filterQuery += `{ batch_some: { type_in: [b2b2c, normal] } }{ topic_some: { order_not: 1 } }`
    }
    if (auditSubTypeValue === b2b) {
      filterQuery += '{ batch_some: { type: b2b } }'
    }
    const { perPageQueries } = this.state
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN ||
        savedRole === UMS_VIEWER || savedRole === AUDIT_ADMIN)
    const fetchFromBatchSession = auditSubTypeValue === b2b || sessionType === batchSession
    if (admin) {
      if (auditType === mentor) {
        if (fetchFromBatchSession) {
         fetchBatchSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        } else {
          fetchMentorMenteeSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        }
      }
    } else if (savedRole && savedRole === MENTOR) {
       mentorMenteeSessionFilters += !isPathContainsAssignedAudits ? `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(
           [savedId]
      )}]}}}` : ''
      if (auditType === mentor) {
        if (fetchFromBatchSession) {
          fetchBatchSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        } else {
          fetchMentorMenteeSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        }
      }
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      mentorMenteeSessionFilters += !isPathContainsAssignedAudits ? `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(
           mentorsId
      )}]}}}` : ''
      if (auditType === mentor) {
        if (fetchFromBatchSession) {
          fetchBatchSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        } else {
          fetchMentorMenteeSessionsForAudit({ filterQuery, mentorMenteeSessionFilters, perPageQueries, skipCount })
        }
      }
    } else if (savedRole && savedRole === AUDITOR && auditType === mentor) {
      fetchMentorMenteeSessionAuditsForAudit({ filterQuery: `{ auditor_some: { id: "${savedId}" } }` })
    }
  }

  async componentDidMount() {
    const savedId = getDataFromLocalStorage('login.id')
    const savedRole = getDataFromLocalStorage('login.role')
    const { history, match } = this.props
    if (get(match, 'params.auditType')) {
      this.setState({
        auditType: get(match, 'params.auditType')
      })
    } else {
      if (savedRole === POST_SALES) {
        this.setState({
          auditType: postSales
        }, () => history.push(`/audit/${postSales}`))
      } else if (savedRole === MENTOR) {
        this.setState({
          auditType: mentor
        }, () => history.push(`/audit/${mentor}`))
      } else {
        this.setState({
          auditType: preSales
        }, () => history.push(`/audit/${preSales}`))
      }
    }
    let filterQuery = ''
    let mentorMenteeSessionFilters = ''
    if (savedRole && savedRole === MENTOR) {
      mentorMenteeSessionFilters = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery([savedId])}]}}}`
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      const salesExecutiveId = getDataFromLocalStorage('login.id')
      await fetchMentorForSalesExec(salesExecutiveId).then(res => {
        const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
        const mentorsName = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.name)
        mentorMenteeSessionFilters = `{mentorSession_some:{user_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}}`
        this.setState({
          salesExecutiveId: salesExecutiveId,
          mentorsId: mentorsId,
          mentorsName
        })
      })
    } else if (savedRole !== AUDITOR && savedRole !== MENTOR
      && savedRole !== PRE_SALES && savedRole !== POST_SALES) {
      fetchMentorForAudits()
    }
      this.setState({
        currentPage: 1,
        filterQuery: filterQuery,
        mentorMenteeSessionFilters: mentorMenteeSessionFilters
      }, this.handleDateRange(this.state.selectedRange))
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateVideoLinkStatus, match, mentorAuditsFetchingStatus,
      mentorMenteeSessionsForAuditFetchStatus, auditUpdatingStatus,
    mentorsForAuditsFetchStatus, mentorMenteeSessionsUpdateStatus } = this.props
    if (get(match, 'params') !== get(prevProps, 'match.params')) {
      this.setState({
        auditType: get(match, 'params.auditType')
      })
    }
    if (
      !this.state.mentorAuditSessions ||
      !Object.keys(this.state.mentorAuditSessions) ||
      (prevProps.updateVideoLinkStatus &&
        updateVideoLinkStatus &&
        !prevProps.updateVideoLinkStatus.toJS().success &&
        updateVideoLinkStatus.toJS().success)
    ) {
      let propsMentorAudits = this.props.mentorAudits && this.props.mentorAudits.toJS()
      if ((prevProps.updateVideoLinkStatus &&
        updateVideoLinkStatus &&
        !prevProps.updateVideoLinkStatus.toJS().success &&
        updateVideoLinkStatus.toJS().success)) {
        const updatedSession = this.props.sessions && this.props.sessions.toJS()
        propsMentorAudits.forEach((audits,index) => {
          updatedSession.forEach(session => {
            if (get(audits, 'mentorMenteeSession.id', null) === get(session, 'id', null)) {
              propsMentorAudits[index].mentorMenteeSession.sessionRecordingLink = session.sessionRecordingLink
            }
          })
        })
      }
      if (propsMentorAudits && propsMentorAudits.length > 0) {
        const mentorDateWiseSessions = this.constructDatewiseAudits(
          sortBy(propsMentorAudits, 'createdAt').reverse()
        )
        this.setState({
          mentorAuditSessions: mentorDateWiseSessions,
          onlySessionsArray: filter(propsMentorAudits, (audits) =>
            get(audits, 'mentorMenteeSession.menteeSession')
          )
        })
      }
    } else if (this.props.mentorAudits !== prevProps.mentorAudits) {
      const propsMentorAudits = this.props.mentorAudits && this.props.mentorAudits.toJS()
      const mentorDateWiseSessions = this.constructDatewiseAudits(
        sortBy(propsMentorAudits, 'createdAt').reverse()
      )
      this.setState({
        mentorAuditSessions: mentorDateWiseSessions,
        onlySessionsArray: filter(propsMentorAudits, (audits) =>
          get(audits, 'mentorMenteeSession.menteeSession')
        )
      })
    }

    if (mentorMenteeSessionsForAuditFetchStatus && !get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'loading')
      && get(mentorMenteeSessionsForAuditFetchStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionsForAuditFetchStatus !== mentorMenteeSessionsForAuditFetchStatus)) {
      this.convertDataToTable()
    }
    if (mentorAuditsFetchingStatus && !get(mentorAuditsFetchingStatus.toJS(), 'loading')
      && get(mentorAuditsFetchingStatus.toJS(), 'success') &&
      (prevProps.mentorAuditsFetchingStatus !== mentorAuditsFetchingStatus)) {
      this.convertDataToTable()
    }
    if (auditUpdatingStatus && !get(auditUpdatingStatus.toJS(), 'loading')
      && get(auditUpdatingStatus.toJS(), 'success') &&
      (prevProps.auditUpdatingStatus !== auditUpdatingStatus)) {
      this.convertDataToTable()
    }
    if (mentorsForAuditsFetchStatus && !get(mentorsForAuditsFetchStatus.toJS(), 'loading')
      && get(mentorsForAuditsFetchStatus.toJS(), 'success') &&
      (prevProps.mentorsForAuditsFetchStatus !== mentorsForAuditsFetchStatus)) {
      this.setState({
        mentorsList: this.props.mentorsForAudits && this.props.mentorsForAudits.toJS() || []
      })
    }

    if (mentorMenteeSessionsUpdateStatus && !get(mentorMenteeSessionsUpdateStatus.toJS(), 'loading')
      && get(mentorMenteeSessionsUpdateStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionsUpdateStatus !== mentorMenteeSessionsUpdateStatus)) {
      this.convertDataToTable()
    }
  }
  convertDataToTable = () => {
    const { mentorMenteeSessionsForAudit, mentorAudits } = this.props
    let mentorMenteeSessionData = mentorMenteeSessionsForAudit && mentorMenteeSessionsForAudit.toJS() || []
    const mentorAuditsData = mentorAudits && mentorAudits.toJS() || []
    const { auditSubTypeValue, sessionType } = this.state
    const getDataFromBatchSession = auditSubTypeValue === b2b || sessionType === batchSession
    const tableData = []
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === AUDITOR) {
      mentorAuditsData.forEach(audit => {
        tableData.push({
          ...get(audit, 'mentorMenteeSession'),
          mentorName: get(audit, 'mentorMenteeSession.mentorSession.user.name'),
          mentorId: get(audit, 'mentorMenteeSession.mentorSession.user.id'),
          studentName: get(audit, 'mentorMenteeSession.menteeSession.user.name'),
          studentId: get(audit, 'mentorMenteeSession.menteeSession.user.id'),
          parentName: get(audit, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.name'),
          parentEmail: get(audit, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.email'),
          parentPhone: get(audit, 'mentorMenteeSession.menteeSession.user.studentProfile.parents[0].user.phone'),
          auditor: get(audit, 'auditor'),
          auditScore: get(audit, 'score'),
          auditStatus: get(audit, 'status'),
          auditCreatedAt: get(audit, 'createdAt'),
          auditUpdatedAt: get(audit, 'updatedAt'),
          audit
        })
      })
    } else {
      mentorMenteeSessionData.forEach(mmSession => {
        let auditData = null
        if (getDataFromBatchSession) {
          auditData = mentorAuditsData.find(auditData =>
            get(auditData, 'batchSession.id') === get(mmSession, 'id'))
        } else {
          auditData = mentorAuditsData.find(auditData =>
            get(auditData, 'mentorMenteeSession.id') === get(mmSession, 'id'))
        }
      tableData.push({
        ...mmSession,
        mentorName: get(mmSession, 'mentorSession.user.name'),
        mentorId: get(mmSession, 'mentorSession.user.id'),
        studentName: get(mmSession, 'menteeSession.user.name'),
        studentId: get(mmSession, 'menteeSession.user.id'),
        parentName: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.name'),
        parentEmail: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.email'),
        parentPhone: get(mmSession, 'menteeSession.user.studentProfile.parents[0].user.phone'),
        auditor: get(auditData, 'auditor'),
        auditScore: get(auditData, 'score'),
        auditStatus: get(auditData, 'status'),
        auditCreatedAt: get(auditData, 'createdAt'),
        auditUpdatedAt: get(auditData, 'updatedAt'),
        audit: auditData
      })
    })
    }
    this.setState({
      tableData
    })
  }
  clearFilter = () => {
    // this.refs.searchBox.clearFilters()
    this.setState({
      searchValue: '',
      searchKey: 'Search By',
      showSessionWithLink: false,
      showRatings: ''
    }, () => {
      this.filterByName()
    })
  }

  setFilters = state => {
    if (state.searchKey === 'Search By') {
      this.setState({
        mentorMenteeSessionFilters: ``
      }, this.filterByName)
    }
    /**
     * Default State for filters
     */
    this.setState(
      {
        ...state,
        currentPage: 1
      },
      () => {
        if (
          this.state.searchKey &&
          (this.state.searchValue !== '')
        ) {
          this.filterByName()
        }
      }
    )
  }

  filterByName = () => {
    let { fromDate, toDate, searchValue, searchKey, mentorsId,
      showSessionWithLink, showRatings } = this.state
    let { menteeSessions, users } = this.props
    menteeSessions = menteeSessions.toJS()
    users = users.toJS()
    let tags = cloneDeep(this.state.tags)
    const propsMentorAudits = this.props.mentorAudits && this.props.mentorAudits.toJS()
    const mentorDateWiseSessions = this.constructDatewiseAudits(
      sortBy(propsMentorAudits, 'createdAt').reverse()
    )
    const savedRole = getDataFromLocalStorage('login.role')
    const admin =
      savedRole && (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)
    const id = getDataFromLocalStorage('login.id')
    let filterQuery = ``;
    let mentorMenteeSessionFilters = ``
    if (showSessionWithLink) {
      mentorMenteeSessionFilters += '{ sessionRecordingLink_exists: true }'
    }
    if (showRatings === '5 Rating') {
      mentorMenteeSessionFilters += `{ rating: 5 }`
    } else if (showRatings === 'Less than 5') {
      mentorMenteeSessionFilters += `{ rating_lt: 5 }`
    }
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
    if (shouldFetch && searchValue === '') {
      this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
      shouldFetch = false
    }

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

    /**
     * Filter Results Based On Search Key
     * */
    if (searchValue !== '') {
      if (searchKey === 'Rating') searchValue = Number(searchValue)
      else searchValue = searchValue.toLowerCase()
      switch (searchKey) {
        case 'Auditor Name':
          filterQuery += `{
            auditor_some:{
              name_contains: "${searchValue}"
            }
          }`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery,'',0)
          break
        case 'Mentor Name':
          mentorMenteeSessionFilters += `{mentorSession_some:{
            user_some:{
              id: "${searchValue}"
            }
          }}`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
          break
          case 'Student Name':
            mentorMenteeSessionFilters += `{menteeSession_some:{
              user_some:{
                name_contains: "${searchValue}"
              }
            }}`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
          break
        case 'Topic':
          mentorMenteeSessionFilters += `{
            topic_some:{
              title_contains: "${searchValue}"
            }
          }`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
          break
        case 'Session Status':
          mentorMenteeSessionFilters += `{sessionStatus:${searchValue}}`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
          break
        case 'Rating':
          mentorMenteeSessionFilters += `{rating:${searchValue}}`
          this.fetchMentorAuditsBasedOnUserRoleAndPath(filterQuery, mentorMenteeSessionFilters, 0)
          break
        default:
          break
      }
    }

    let promoters = 0
    let passives = 0
    let detractors = 0
    let total = 0

    tags.map((item, key) => {
      tags[key].count = 0
    })

    this.setState({
      promoters,
      passives,
      detractors,
      tags,
      total,
      mentorAuditSessions: mentorDateWiseSessions,
      filterQuery,
      mentorMenteeSessionFilters
    })
  }

  constructDatewiseAudits = audits => {
    const newAudits = {}
    let currDate = ''

    for (const i in audits) {
      if (get(audits[i], 'mentorMenteeSession.menteeSession')) {
        const thisDate = moment(audits[i].sessionStartDate).startOf('day')
        if (!thisDate.isSame(currDate)) {
          currDate = thisDate
          newAudits[currDate] = []
        }
        newAudits[currDate].push(audits[i])
      }
    }
    return newAudits
  }
  updateMentorMenteeSessionAuditStatus = async (sessionId, checked) => {
    const { auditSubTypeValue, sessionType, tableData } = this.state
    const updateBatchSession = auditSubTypeValue === b2b || sessionType === batchSession
    const sessionIds = tableData.map(session => `"${get(session, 'id')}"`)
    if (updateBatchSession) {
      const filterQueryValue = `{ batchSession_some:{ id_in: [${sessionIds}] } }`
      await updateBatchSessionForAudit(sessionId, checked).then(() => {
        fetchMentorMenteeSessionAuditsForAudit({
          filterQuery: filterQueryValue,
          fromBatchSession: true
        })
      })
    } else {
      const filterQueryValue = `{ mentorMenteeSession_some: { id_in: [${sessionIds}] }}`
      await updateMentorMenteeSessionForAudit(sessionId, checked).then(() => {
        fetchMentorMenteeSessionAuditsForAudit({
          filterQuery: filterQueryValue,
        })
      })
    }
  }
  handleDateRange = (rangeInString) => {
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

  getUserFromId = (userId) => {
    const { users } = this.props
    let filteredUsers = []
    if (users && userId) {
      filteredUsers = users.toJS().filter(u => {
        return u.id === userId
      })
    }

    return filteredUsers
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
          sessionTime,
        },
        mentorName,
      })
    } else {
      this.setState({
        showLinkModal: false,
        link,
      })
    }
  }

  onPageChange = (page) => {
    this.fetchMentorAuditsBasedOnUserRoleAndPath(
      this.state.filterQuery,
      this.state.mentorMenteeSessionFilters,
      page - 1
    )
    this.setState({
      currentPage: page
    })
  }

  getTableSubHeading = (isPathContainsAssignedAudits, savedRole) => {
    if (isPathContainsAssignedAudits) return 'Assigned Audits'
    if(!isPathContainsAssignedAudits && savedRole === MENTOR) return 'Under Audits'
    return 'All Audits'
  }
  onAuditTypeChange = (type) => {
    if (this.state.auditType !== type) {
      this.setState({
        auditType: type
      }, () => {
        if (type === mentor) {
          this.filterByName()
        }
        this.props.history.push(`/audit/${type}`)
      })
    }
  }
  renderTypeTable = (isPathContainsAssignedAudits) => {
    const { auditType, tags, checkAll, tableData,
      auditSubTypeValue, sessionType } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const showBatchSessionTable = auditSubTypeValue === b2b || sessionType === batchSession
    if (auditType === mentor) {
      return (
        <SessionTable
          {...this.props}
          tableData={sortBy(tableData, 'sessionStartDate')}
          showBatchSessionTable={showBatchSessionTable}
          isPathContainsAssignedAudits={isPathContainsAssignedAudits}
          filters={this.state}
          mentorAuditsFetchStatus={
            this.props.mentorAuditsFetchStatus.toJS().mentorAudits
          }
          savedRole={savedRole}
          tags={tags}
          checkAll={checkAll}
          updateMentorMenteeAuditStatus={this.updateMentorMenteeSessionAuditStatus}
          openAssignAuditorModal={(mentorMenteeSessionAuditId, mentorId, auditor) => {
            this.setState({
              isAssignAuditorModalVisible: true,
              selectedAuditId: mentorMenteeSessionAuditId,
              selectedAuditMentorId: mentorId,
              selectedAuditor: auditor
            })
          }}
          openVideoLinkSection={(
            sessionId,
            userId,
            link,
            topic,
            date,
            time,
            mentorName
          ) => {
            this.toggleLinkModal(
              sessionId,
              userId,
              link,
              topic,
              date,
              time,
              mentorName
            )
          }}
        />
      )
    } else if (auditType === preSales) {
      return (
        <PreSalesAuditTable />
      )
    } else if (auditType === postSales) {
      return (
        <PostSalesAudit />
      )
    }
  }

  renderSessionTypeSelector = () => {
    const { auditSubTypeValue, sessionType } = this.state
    if (auditSubTypeValue === b2cDemo || auditSubTypeValue === b2cPaid) {
      const getSessionTypeText = (text) => {
        if (text === oneToOneSession) return '1:1'
        else if (text === batchSession) return 'Batch'
      }
      return (
        <RadioGroup
          name='sessionType'
          buttonStyle='solid'
          value={sessionType}
          onChange={({ target: { value } }) => this.setState({
            sessionType: value
          }, this.filterByName)}
        >
          {
            [oneToOneSession, batchSession].map(type => (
              <MainModal.StyledRadio value={type}>
                {getSessionTypeText(type)}
              </MainModal.StyledRadio>
            ))
          }
        </RadioGroup>
      )
    }
    return null
  }
  getIconName = (status) => status ? styles.videoLinkYes : styles.videoLinkNo
  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const user = this.getUserFromId(this.state.userIdToEdit)
    const isPathContainsAssignedAudits = this.props.match.path.split('/').pop() === 'assignedAudits'
    const { mentorMenteeSessionsMeta, sessionCountWithLessThanFiveRating,
      sessionCountWith5Rating, sessionCountWithLink,
      sessionCountWithIsAudit } = this.props
    const admin =
      savedRole &&
      (savedRole === ADMIN ||
        savedRole === UMS_ADMIN ||
        savedRole === UMS_VIEWER)
    const { auditType, showDocumentsWithAuditStatus,
      showSessionWithLink, showRatings, perPageQueries,
      mentorsList, auditSubTypeValue, sessionType } = this.state
    const hideForMentorPreSalesPostSales = savedRole === MENTOR || savedRole === PRE_SALES
      || savedRole === POST_SALES
    return (
      <>
        {
          !isPathContainsAssignedAudits && (
            <div style={{ display: 'flex', marginBottom: '15px' }}>
              {
                !hideForMentorPreSalesPostSales && [preSales, mentor, postSales].map(type => (
                  <MentorAuditListStyle.AuditTab
                    checked={auditType === type}
                    onClick={() => this.onAuditTypeChange(type)}
                  >
                    {getAuditTypeText(type)}
                  </MentorAuditListStyle.AuditTab>
                ))
              }
            </div>
          )
        }
        {
          auditType === mentor && (
            <>
              {
                savedRole !== AUDITOR && (
                  <MentorAuditListStyle.TopContainer style={{ ...flexStyle, minHeight: '47px' }}>
                    <SearchBox
                      ref='searchBox'
                      path={this.props.match.path.split('/').pop()}
                      savedRole={savedRole}
                      setFilters={this.setFilters}
                      mentorsList={mentorsList}
                      sessionType={sessionType}
                    />
                    <Button type='primary' onClick={this.clearFilter} style={{ marginRight: '10px' }} >
                      Clear Filter
                    </Button>
                  </MentorAuditListStyle.TopContainer>
                )
              }
              {
                savedRole !== AUDITOR && (
                  <MentorAuditListStyle.TopContainer>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PreSalesDiv className={cx(this.getIconName(showSessionWithLink), styles.icon)}
                        onClick={() => this.setState({
                          showSessionWithLink: !showSessionWithLink
                        }, this.filterByName)}
                      />
                      <span style={{ marginLeft: '10px' }}>Show Sessions with link ({sessionCountWithLink || 0})</span>
                    </div>
                    {
                      sessionType === oneToOneSession && (
                        <div>
                          <span style={{ marginRight: '10px' }}>
                            Show Sessions with 
                          </span>
                          <RadioGroup
                            name='showRatings'
                            buttonStyle='solid'
                            value={showRatings}
                            onChange={({ target: { value } }) => this.setState({ showRatings: value }, this.filterByName)}
                          >
                            <MainModal.StyledRadio value='5 Rating'>
                              5 Rating {sessionCountWith5Rating ? `(${sessionCountWith5Rating})` : `(0)`}
                            </MainModal.StyledRadio>
                            <MainModal.StyledRadio value='Less than 5' style={{
                              backgroundColor: showRatings === 'Less than 5' ? '#ff4d4f' : 'white',
                              color: showRatings === 'Less than 5' ? 'white' : 'black',
                            }}>
                              Less than 5 Rating {sessionCountWithLessThanFiveRating ? `(${sessionCountWithLessThanFiveRating})` : '(0)'}
                            </MainModal.StyledRadio>
                          </RadioGroup>
                        </div>
                      )
                    }
                  </MentorAuditListStyle.TopContainer>
                )
              }
              <MentorAuditListStyle.TopContainer style={flexStyle}>
                {
                  auditType === mentor && savedRole !== MENTOR && savedRole !== AUDITOR ? (
                    (
                      <span>
                        <Switch
                          checked={showDocumentsWithAuditStatus}
                          onChange={checked => {
                        this.setState({
                            showDocumentsWithAuditStatus: checked
                          }, this.filterByName)
                        }}
                          size='small'
                        />
                        <span style={{ marginLeft: '10px' }}>Show Sessions with Audits ({sessionCountWithIsAudit || 0})</span>
                      </span>
                    )
                  ) : <div />
                }
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker.RangePicker
                    value={[this.state.fromDate, this.state.toDate]}
                    format='DD/MM/YYYY'
                    onCalendarChange={this.handleDateChange}
                  />
                  <div>
                    {
                      this.state.dateRanges.map(range =>
                        <Button
                          type={JSON.stringify(range.subtract) ===
                            this.state.selectedRange ? 'primary' : 'default'}
                          shape="circle"
                          onClick={() => this.handleDateRange(JSON.stringify(range.subtract))}
                          style={{
                            margin: '8px'
                          }}
                        >
                          {range.label}
                        </Button>
                      )
                    }
                  </div>
                </div>
              </MentorAuditListStyle.TopContainer>
              <MentorAuditListStyle.TopContainer>
                {
                  savedRole !== AUDITOR && (
                    <MentorAuditListStyle.TopContainer style={{ marginBottom: '15px' }}>
                      <MentorAuditListStyle.TopContainer style={{ justifyContent: 'flex-start', flex: '0.5' }}>
                        <h3 style={{ margin: '0 10px' }}>Audit Sub Type: </h3>
                        <RadioGroup
                          name='auditSubTypeValue'
                          buttonStyle='solid'
                          value={auditSubTypeValue}
                          onChange={({ target: { value } }) => this.setState({
                            auditSubTypeValue: value
                          }, this.filterByName)}
                        >
                          {
                            [b2cDemo, b2cPaid, b2b].map(type => (
                              <MainModal.StyledRadio value={type}>
                                {getAuditSubTypeText(type)}
                              </MainModal.StyledRadio>
                            ))
                          }
                        </RadioGroup>
                      </MentorAuditListStyle.TopContainer>
                      <MentorAuditListStyle.TopContainer style={{ justifyContent: 'flex-start', flex: '0.3' }}>
                        {this.renderSessionTypeSelector()}
                      </MentorAuditListStyle.TopContainer>
                      <MentorAuditListStyle.TopContainer style={{ flex: '0.3', justifyContent: 'flex-end' }}>
                        <h4>Total Sessions: {mentorMenteeSessionsMeta || 0}</h4>
                      </MentorAuditListStyle.TopContainer>
                    </MentorAuditListStyle.TopContainer>
                  )
                }
              </MentorAuditListStyle.TopContainer>
              <MentorAuditListStyle.TopContainer style={{ justifyContent: 'center', ...flexStyle }}>
                {(mentorMenteeSessionsMeta &&
                mentorMenteeSessionsMeta < perPageQueries) || savedRole === AUDITOR ? null : (
                  <MentorAuditListStyle.PaginationHolder>
                    <Pagination
                      total={mentorMenteeSessionsMeta ? mentorMenteeSessionsMeta : 0}
                      onChange={this.onPageChange}
                      current={this.state.currentPage}
                      defaultPageSize={this.state.perPageQueries}
                    />
                  </MentorAuditListStyle.PaginationHolder>
                )}
              </MentorAuditListStyle.TopContainer>
            </>
          )
        }
        {this.renderTypeTable(isPathContainsAssignedAudits)}
        <AssignAuditorModal
          {...this.props}
          selectedAuditId={this.state.selectedAuditId}
          selectedAuditor={this.state.selectedAuditor}
          setSelectedAuditor={(auditor) => {
            this.setState({
              selectedAuditor: auditor
            })
          }}
          selectedAuditMentorId={this.state.selectedAuditMentorId}
          isAssignAuditorModalVisible={this.state.isAssignAuditorModalVisible}
          closeAssignAuditorModal={() => {
            this.setState({
              selectedAuditId: null,
              isAssignAuditorModalVisible: false,
              selectedAuditor: null
            })
          }}
        />
        <SessionVideoLinkModal
          id='Session Video Link'
          visible={this.state.showLinkModal}
          title='Session Video Link'
          closeVideoLinkModal={() => this.toggleLinkModal()}
          notification={this.props.notification}
          userIdToEdit={this.state.userIdToEdit}
          name={user && user[0] && user[0].name}
          topic={this.state.topic}
          sessionDetails={this.state.sessionDetails}
          mentorName={this.state.mentorName}
          videoLink={this.state.link}
          updateStatus={
            this.props.updateVideoLinkStatus &&
            this.props.updateVideoLinkStatus.toJS()
          }
          completedSessions={this.props.mentorAuditSessions && this.props.mentorAuditSessions.mentorMenteeSession}
        />
      </>
    )
  }
}

export default MentorAuditList