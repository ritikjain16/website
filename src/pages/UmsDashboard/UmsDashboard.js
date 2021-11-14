/* eslint-disable no-unused-expressions, no-nested-ternary */
import React, { Component, Fragment } from 'react'
import { filter, get, sortBy } from 'lodash'
import { Button, Input, Modal, Pagination, Select, Popconfirm, Radio, DatePicker, Tooltip } from 'antd'
import { DownloadOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import RadioGroup from 'antd/lib/radio/group'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import COUNTRY_CODES from '../../constants/countryCodes'
import getSlotLabel from '../../utils/slots/slot-label'
import getRoleBasedUserAndCount from './common-util/role-based-action'
import {
  ADMIN,
  MENTEE,
  PARENT,
  MENTOR,
  UMS_ADMIN,
  UMS_VIEWER,
  AFFILIATE,
  SALES_EXECUTIVE,
  TRANSFORMATION_TEAM,
  TRANSFORMATION_ADMIN,
  AUDIT_ADMIN,
  PRE_SALES,
  POST_SALES,
  AUDITOR,
  BDE,
  BDE_ADMIN
} from '../../constants/roles'
import fetchCourses from '../../actions/sessions/fetchCourses'
import UmsDashboardStyle from './UmsDashboard.style'
import fetchUserInvites from '../../actions/ums/fetchInvitees'
import addParentChild from '../../actions/ums/addParentChild'
import addUser from '../../actions/ums/addUsers'
import updateUser from '../../actions/ums/updateUser'
// import updateParent from '../../actions/ums/updateParent'
import deleteUser from '../../actions/ums/deleteUser'
import SessionModal from './components/SessionModal/SessionModal'
import deleteMenteeSession from '../../actions/sessions/deleteMenteeSession'
import { filterKey } from '../../utils/data-utils'
import addSalesProfile from '../../actions/ums/AddSalesProfile'
import countryAndState from '../../constants/CountryAndStates'
import userCSVHeaderConfig from './common-util/UsersCSVHeaderConfig'
import MainModal from '../../components/MainModal'
import getFullPath from '../../utils/getFullPath'
import AssignMentorModal from './components/AssignMentorModal'
import deleteMentorMenteeSession from '../../actions/ums/deleteMentorMenteeSession'
import addBDEProfile from '../../actions/ums/addBDEProfile'
import addMentorProfile from '../../actions/ums/addMentorProfile'
import AddUserCourseModal from './components/AddUserCourseModal'
import getGrades from '../../utils/getGrades'


class UmsDashboard extends Component {
  state = {
    roles: [
      PARENT,
      MENTEE,
      MENTOR,
      AFFILIATE,
      ADMIN,
      UMS_ADMIN,
      UMS_VIEWER,
      AUDITOR,
      AUDIT_ADMIN,
      PRE_SALES,
      POST_SALES,
      BDE,
      BDE_ADMIN,
      SALES_EXECUTIVE,
      TRANSFORMATION_TEAM,
      TRANSFORMATION_ADMIN
    ],
    currentRole: PARENT,
    columns: [],
    tableData: [],
    tableObj: {},
    visible: false,
    currentPage: 1,
    perPageQueries: 50,
    filterOptions: ['Name', 'Email', 'Phone No.', 'phoneVerified'],
    searchKey: 'All',
    searchValue: '',
    filterQuery: {
      usersFilter: null,
      salesFilter: null
    },
    addMentor: {
      name: '',
      email: '',
      phoneNumber: '',
      phoneCode: '+91',
      username: '',
      oneTimePwd: ''
    },
    addMentee: {
      parentName: '',
      childName: '',
      parentEmail: '',
      phoneNumber: '',
      phoneCode: '+91',
      grade: '',
      country: localStorage.getItem('country') || 'india',
      timezone: localStorage.getItem('country') === 'usa' ? 'America/New_York' : 'Asia/Kolkata',
      city: '',
      stateValue: '',
      region: ''
    },
    actionType: 'ADD',
    userInvitesTableData: [],
    userInvitesCurrentPage: 1,
    userInvitesPerPage: 10,
    verifiedUsers: false,
    verifiedAndBookedUser: false,
    userInvitesFilterQuery: '',
    sessionModalVisible: false,
    editingSession: false,
    editingCompletedSession: false,
    country: localStorage.getItem('country') || 'india',
    disabledStyle: {
      color: '#FFFFFF',
      backgroundColor: '#ED494C',
      borderColor: '#ED494C',
      textShadow: 'none',
      boxShadow: 'none'
    },
    courses: [],
    fromDate: null,
    toDate: null,
    dateRanges: [
      { label: '1D', subtract: { duration: '0', unit: 'd' } },
      { label: '2D', subtract: { duration: '1', unit: 'd' } },
      { label: '3D', subtract: { duration: '2', unit: 'd' } },
      { label: '4D', subtract: { duration: '3', unit: 'd' } },
      { label: '5D', subtract: { duration: '4', unit: 'd' } },
      { label: '6D', subtract: { duration: '5', unit: 'd' } },
      { label: '1W', subtract: { duration: '7', unit: 'd' } },
      { label: '1M', subtract: { duration: '1', unit: 'M' } },
      { label: 'A', subtract: { duration: 'all' } },
    ],
    selectedRange: '{"duration":"0","unit":"d"}',
    loading: true,
    showAssignmentModal: false,
    referralVisible: false,
    savedChild: null,
    nuTomChecked: false,
    userCoursesObj: {},
    addCourseModalVisisble: false,
    addUserCourseData: null,
    sourceType: '',
    utmSearchKey: '',
    spinLoading: false,
    searchGrade: 'All'
  }

  async componentDidMount() {
    this.handleDateRange(this.state.selectedRange)
    fetchCourses()
    window.addEventListener('click', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country') || 'india'
        })
      }
    })
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      sessionStatus,
      fetchingUser,
      sessionUpdateStatus,
      sessionAddStatus,
      sessionDeleteStatus,
      courseFetchingStatus,
      mentorMenteeSession,
      mentorMenteeSessionDeleteStatus,
      mentorMenteeSessionAddStatus,
      userCoursesFetchStatus,
      userCourseAddStatus,
      userCourseAddFailure,
      userCourseUpdateStatus
    } = this.props
    if (this.state.country !== prevState.country) {
      this.setState({
        filterQuery: {
          usersFilter: null,
          salesFilter: null,
        },
        currentPage: 1,
        searchKey: 'All',
        searchValue: '',
        verifiedAndBookedUser: false,
        verifiedUsers: false
      }, () => {
        getRoleBasedUserAndCount(
          getDataFromLocalStorage('login.id'),
          getDataFromLocalStorage('login.role'),
          {
            role: this.state.currentRole,
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
            filterQuery: {
              usersFilter: null,
              salesFilter: null
            },
            country: this.state.country,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            verifiedAndBookedUser: this.state.verifiedAndBookedUser,
            sourceType: this.state.sourceType,
            searchGrade: this.state.searchGrade
          }
        )
      })
    }

    const deleteUserStatusJS = this.props.deleteUserStatus.toJS()
    const prevDeleteUserStatusJS = prevProps.deleteUserStatus.toJS()
    const fetchingUserData = fetchingUser &&
      get(fetchingUser.toJS(), `user/${this.state.country}.loading`)
    const prevFetchingUsers = get(prevProps.fetchingUser.toJS(),
      `user/${this.state.country}.loading`)
    if (!fetchingUserData && prevFetchingUsers) {
      this.convertDataForTable()
    }
    if (sessionAddStatus && prevProps.sessionAddStatus) {
      if (sessionAddStatus.getIn(['success']) && !prevProps.sessionAddStatus.getIn(['success'])) {
        this.setDefaultBookingDetails()
      }
    }
    if (sessionDeleteStatus && prevProps.sessionDeleteStatus) {
      if (
        sessionDeleteStatus.getIn(['success']) &&
        !prevProps.sessionDeleteStatus.getIn(['success'])
      ) {
        this.setDefaultBookingDetails()
      }
    }
    if (sessionUpdateStatus && prevProps.sessionUpdateStatus) {
      if (
        sessionUpdateStatus.getIn(['success']) &&
        !prevProps.sessionUpdateStatus.getIn(['success'])
      ) {
        getRoleBasedUserAndCount(
          getDataFromLocalStorage('login.id'),
          getDataFromLocalStorage('login.role'),
          {
            role: this.state.currentRole,
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
            filterQuery: {
              usersFilter: null,
              salesFilter: null
            },
            country: this.state.country,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            verifiedAndBookedUser: this.state.verifiedAndBookedUser,
            sourceType: this.state.sourceType,
            searchGrade: this.state.searchGrade
          }
        )
        // this.setDefaultBookingDetails()
      }
    }

    if (mentorMenteeSessionDeleteStatus && !get(mentorMenteeSessionDeleteStatus.toJS(), 'loading')
      && get(mentorMenteeSessionDeleteStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionDeleteStatus !== mentorMenteeSessionDeleteStatus)) {
      this.setDefaultBookingDetails()
    }
    if (mentorMenteeSessionAddStatus && !get(mentorMenteeSessionAddStatus.toJS(), 'loading')
      && get(mentorMenteeSessionAddStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionAddStatus !== mentorMenteeSessionAddStatus)) {
      this.setDefaultBookingDetails()
    }
    if (sessionStatus && prevProps.sessionStatus) {
      const mmSessionArray = mentorMenteeSession && mentorMenteeSession.toJS() || []
      if (sessionStatus.getIn(['success']) && !prevProps.sessionStatus.getIn(['success'])) {
        const { sessions } = this.props
        if (sessions) {
          const statusObj = {}
          sessions.toJS().forEach(session => {
            const findMMSession = mmSessionArray.find(mmSession => get(mmSession, 'menteeSession.id') === session.id)
            let slotTime = ''
            let slotNumber = 0
            for (let i = 0; i < 24; i += 1) {
              if (session[`slot${i}`]) {
                slotTime = getSlotLabel(i).startTime
                slotNumber = i
                break
              }
            }
            if (session.user && session.user.id) {
              if (statusObj[session.user.id] && statusObj[session.user.id].length > 0) {
                statusObj[session.user.id].push({
                  bookingDate: session.bookingDate,
                  startTime: slotTime,
                  sessionId: session.id,
                  sessionStatus: get(findMMSession, 'sessionStatus'),
                  assignedMentor: get(findMMSession, 'mentorSession.user'),
                  mentorSession: get(findMMSession, 'mentorSession'),
                  mentorMenteeSessionId: get(findMMSession, 'id'),
                  sendSessionLink: get(findMMSession, 'sendSessionLink'),
                  slotNumber,
                  ...session
                })
              } else {
                statusObj[session.user.id] = [{
                  bookingDate: session.bookingDate,
                  startTime: slotTime,
                  sessionId: session.id,
                  sessionStatus: get(findMMSession, 'sessionStatus'),
                  assignedMentor: get(findMMSession, 'mentorSession.user'),
                  mentorSession: get(findMMSession, 'mentorSession'),
                  mentorMenteeSessionId: get(findMMSession, 'id'),
                  sendSessionLink: get(findMMSession, 'sendSessionLink'),
                  slotNumber,
                  ...session
                }]
              }
            }
          })
          this.setState(
            {
              bookedSessionObj: statusObj
            },
            this.convertDataForTable()
          )
        }
      }
    }
    if (
      (get(prevProps, 'addingUser') && get(this.props, 'addSuccess')) ||
      (get(prevProps, 'updatingUser') && get(this.props, 'updateSuccess')) ||
      (get(prevDeleteUserStatusJS, 'user.loading') && get(deleteUserStatusJS, 'user.success'))
    ) {
      this.convertDataForTable()
    }
    const { addErrors, updateErrors, notification, deleteErrors } = this.props
    if (prevProps.addFailure !== this.props.addFailure) {
      if (this.props.addFailure) {
        const currentError = addErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (prevProps.addSuccess !== this.props.addSuccess) {
      if (this.props.addSuccess && !prevProps.addSuccess) {
        if (this.state.currentRole === SALES_EXECUTIVE) {
          const user = get(this.props, 'addedUser') && get(this.props, 'addedUser').toJS()
          if (user[0]) {
            addSalesProfile(user[0].id)
          }
        }
        notification.success({
          message: 'User added successfully!'
        })
        this.handleCancel()
      }
    }
    if (prevProps.updateFailure !== this.props.updateFailure) {
      if (this.props.updateFailure) {
        const currentError = updateErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (prevProps.updateSuccess !== this.props.updateSuccess) {
      if (this.props.updateSuccess) {
        notification.success({
          message: 'User updated successfully!'
        })
        if (this.state.visible) this.handleCancel()
      }
    }
    if (get(prevDeleteUserStatusJS, 'user.failure') !== get(deleteUserStatusJS, 'user.failure')) {
      if (get(deleteUserStatusJS, 'user.failure')) {
        const currentError = deleteErrors.pop()
        notification.error({
          message:
            currentError.error.errors &&
            currentError.error.errors[0] &&
            currentError.error.errors[0].message
        })
      }
    }
    if (get(prevDeleteUserStatusJS, 'user.success') !== get(deleteUserStatusJS, 'user.success')) {
      if (get(deleteUserStatusJS, 'user.success')) {
        notification.success({
          message: 'User deleted successfully'
        })
      }
    }
    if (get(prevProps, 'userInvites') !== get(this.props, 'userInvites')) {
      this.convertDataForUserInvitees()
    }
    if ((courseFetchingStatus && !get(courseFetchingStatus.toJS(), 'loading')
      && get(courseFetchingStatus.toJS(), 'success') &&
      (prevProps.courseFetchingStatus !== courseFetchingStatus))) {
      this.setState({
        courses: this.props.courses && this.props.courses.toJS()
      })
    }

    if (userCoursesFetchStatus && !get(userCoursesFetchStatus.toJS(), 'loading')
      && get(userCoursesFetchStatus.toJS(), 'success') &&
      (prevProps.userCoursesFetchStatus !== userCoursesFetchStatus)) {
      this.setUserCoursesDetails()
    }

    if (userCourseUpdateStatus && !get(userCourseUpdateStatus.toJS(), 'loading')
      && get(userCourseUpdateStatus.toJS(), 'success') &&
      (prevProps.userCourseUpdateStatus !== userCourseUpdateStatus)) {
      this.setUserCoursesDetails()
    }
    if (userCourseAddStatus && !get(userCourseAddStatus.toJS(), 'loading')
      && get(userCourseAddStatus.toJS(), 'success') &&
      (prevProps.userCourseAddStatus !== userCourseAddStatus)) {
      this.setUserCoursesDetails()
    } else if (userCourseAddStatus && !get(userCourseAddStatus.toJS(), 'loading')
      && get(userCourseAddStatus.toJS(), 'failure') &&
      (prevProps.userCourseAddFailure !== userCourseAddFailure)) {
      if (userCourseAddFailure && userCourseAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(userCourseAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }

  setDefaultBookingDetails = () => {
    const { sessions, mentorMenteeSession } = this.props
    const mmSessionArray = mentorMenteeSession && mentorMenteeSession.toJS() || []
    if (sessions) {
      const statusObj = {}
      sessions.toJS().forEach(session => {
        const findMMSession = mmSessionArray.find(mmSession => get(mmSession, 'menteeSession.id') === session.id)
        let slotTime = ''
        let slotNumber = 0
        for (let i = 0; i < 24; i += 1) {
          if (session[`slot${i}`]) {
            slotNumber = i
            slotTime = getSlotLabel(i).startTime
            break
          }
        }
        if (session.user && session.user.id) {
          if (statusObj[session.user.id] && statusObj[session.user.id].length > 0) {
            statusObj[session.user.id].push({
              bookingDate: session.bookingDate,
              startTime: slotTime,
              sessionId: session.id,
              sessionStatus: get(findMMSession, 'sessionStatus'),
              assignedMentor: get(findMMSession, 'mentorSession.user'),
              mentorSession: get(findMMSession, 'mentorSession'),
              mentorMenteeSessionId: get(findMMSession, 'id'),
              sendSessionLink: get(findMMSession, 'sendSessionLink'),
              slotNumber,
              ...session
            })
          } else {
            statusObj[session.user.id] = [{
              bookingDate: session.bookingDate,
              startTime: slotTime,
              sessionId: session.id,
              sessionStatus: get(findMMSession, 'sessionStatus'),
              assignedMentor: get(findMMSession, 'mentorSession.user'),
              mentorSession: get(findMMSession, 'mentorSession'),
              mentorMenteeSessionId: get(findMMSession, 'id'),
              sendSessionLink: get(findMMSession, 'sendSessionLink'),
              slotNumber,
              ...session
            }]
          }
        }
      })
      this.setState(
        {
          bookedSessionObj: statusObj
        },
        this.convertDataForTable()
      )
    }
  }

  setUserCoursesDetails = () => {
    let { userCourses } = this.props
    userCourses = userCourses && userCourses.toJS() || []
    const userCoursesObj = {}
    userCourses.forEach(userCourse => {
      if (get(userCourse, 'user.id')) {
        userCoursesObj[get(userCourse, 'user.id')] = userCourse
      }
    })
    this.setState({
      userCoursesObj
    }, this.convertDataForTable)
  }
  getReferalOrSource = (referral, source) => {
    if (referral) {
      return 'Referral'
    }
    if (source === 'transformation') return 'Transformation'
    return source
  }

  convertDataForTable = () => {
    this.setState(
      {
        tableObj: {}
      },
      () => {
        const { currentRole, bookedSessionObj, tableObj, verifiedAndBookedUser,
          userCoursesObj } = this.state
        const users = get(this.props, 'users') && filterKey(get(this.props, 'users'), `user/${this.state.country}`)
          ? filterKey(get(this.props, 'users'), `user/${this.state.country}`).toJS()
          : []
        const tableData = []
        let count = 1
        filter(users, user => get(user, 'role') === currentRole || verifiedAndBookedUser).forEach((user, index) => {
          let childDetails = {}
          if (get(user, 'role') === MENTEE) {
            childDetails = {
              sessionDetails: this.getBookingDetails(get(bookedSessionObj, user.id)),
              no: index + 1,
              userId: get(user, 'id'),
              menteeName: get(user, 'name'),
              parentId: get(user, 'studentProfile.parents[0].user.id'),
              parentName: get(user, 'studentProfile.parents[0].user.name') || '-',
              email: get(user, 'studentProfile.parents[0].user.email') || '-',
              timezone: get(user, 'timezone') || '-',
              phone: `${get(user, 'studentProfile.parents[0].user.phone.countryCode')} ${get(
                user,
                'studentProfile.parents[0].user.phone.number'
              )}`,
              phoneVerified: get(user, 'studentProfile.parents[0].user.phoneVerified') ? 'Yes' : 'No',
              grade: get(user, 'studentProfile.grade')
                ? get(user, 'studentProfile.grade').slice(5)
                : '-',
              schoolName: get(user, 'studentProfile.school.name'),
              registrationDate: get(user, 'createdAt'),
              bookingDate: get(bookedSessionObj, user.id),
              fromReferral: this.getReferalOrSource(get(user, 'fromReferral'), get(user, 'source')),
              createdAt: get(user, 'createdAt'),
              updatedAt: get(user, 'updatedAt'),
              country: get(user, 'country'),
              action: get(user, 'id'),
              city: get(user, 'city', '-'),
              state: get(user, 'state', '-'),
              region: get(user, 'region', '-'),
              role: get(user, 'role', '-'),
              inviteCode: get(user, 'inviteCode', '-'),
              bookingDateString: get(bookedSessionObj, user.id) ?
                `${moment(get(get(bookedSessionObj, user.id), 'bookingDate')).format('DD/MM/YYYY')}` : '-',
              bookingTimeString: get(bookedSessionObj, user.id) ? `${get(get(bookedSessionObj, user.id), 'startTime')}` : '-',
              createdAtString: moment(get(user, 'createdAt')).format('DD-MM-YYYY[,] HH:mm'),
              updatedAtString: moment(get(user, 'updatedAt')).format('DD-MM-YYYY[,] HH:mm'),
              name: get(user, 'name'),
              sessionStatus: get(bookedSessionObj, user.id) ? get(get(bookedSessionObj, user.id), 'sessionStatus') : '',
              verificationStatus: get(user, 'verificationStatus'),
              assignedMentor: get(bookedSessionObj, user.id) ? get(get(bookedSessionObj, user.id), 'assignedMentor.name') : '',
              slotNumber: get(bookedSessionObj, user.id) ? get(get(bookedSessionObj, user.id), 'slotNumber') : '',
              userCourse: get(userCoursesObj, user.id),
              utmData: {
                utmTerm: get(user, 'utmTerm') || '-',
                utmSource: get(user, 'utmSource') || '-',
                utmMedium: get(user, 'utmMedium') || '-',
                utmContent: get(user, 'utmContent') || '-',
                utmCampaign: get(user, 'utmCampaign') || '-',
              },
              batch: get(user, 'studentprofile.batch'),
            }
            if (tableObj && tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')]) {
              tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')].push(childDetails)
            } else {
              tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')] = [childDetails]
            }
            tableData.push({
              ...childDetails
            })
          } else if (currentRole === PARENT) {
            const parentId = get(user, 'parentProfile.user.id')
            const parentName = get(user, 'name') || '-'
            const email = get(user, 'email') || '-'
            const timezone = get(user, 'timezone') || '-'
            const phone = get(user, 'phone.countryCode') && get(user, 'phone.number') ? `${get(user, 'phone.countryCode')} ${get(user, 'phone.number')}` : '-'
            const phoneVerified = get(user, 'phoneVerified') ? 'Yes' : 'No'
            const registrationDate = get(user, 'createdAt')
            const fromReferral = this.getReferalOrSource(get(user, 'fromReferral'), get(user, 'source'))
            const createdAt = get(user, 'createdAt')
            const updatedAt = get(user, 'updatedAt')
            const country = get(user, 'country')
            const city = get(user, 'city', '-')
            const state = get(user, 'state', '')
            const region = get(user, 'region', '')
            const role = get(user, 'role', '')
            const createdAtString = moment(get(user, 'createdAt')).format('DD-MM-YYYY[,] HH:mm')
            const updatedAtString = moment(get(user, 'updatedAt')).format('DD-MM-YYYY[,] HH:mm')
            const name = get(user, 'name')
            const utmTerm = get(user, 'utmTerm') || '-'
            const utmSource = get(user, 'utmSource') || '-'
            const utmMedium = get(user, 'utmMedium') || '-'
            const utmContent = get(user, 'utmContent') || '-'
            const utmCampaign = get(user, 'utmCampaign') || '-'
            if (get(user, 'parentProfile.children', []).length > 0) {
              get(user, 'parentProfile.children', []).forEach(child => {
                const bookingDetails = get(bookedSessionObj, get(child, 'user.id'))
                const userCourse = get(userCoursesObj, get(child, 'user.id'))
                childDetails = {
                  sessionDetails: this.getBookingDetails(bookingDetails),
                  no: count,
                  userId: get(child, 'user.id'),
                  menteeName: get(child, 'user.name'),
                  parentId,
                  parentName,
                  email,
                  timezone,
                  phone,
                  phoneVerified,
                  registrationDate,
                  fromReferral,
                  createdAt,
                  updatedAt,
                  country,
                  action: get(child, 'user.id'),
                  bookingDate: bookingDetails,
                  bookingDateString: bookingDetails ?
                    `${moment(get(bookingDetails, 'bookingDate')).format('DD/MM/YYYY')}` : '-',
                  bookingTimeString: bookingDetails ? `${get(bookingDetails, 'startTime')}` : '-',
                  city,
                  state,
                  region,
                  role,
                  createdAtString,
                  updatedAtString,
                  name,
                  grade: get(child, 'grade')
                    ? get(child, 'grade').slice(5)
                    : '-',
                  schoolName: get(child, 'school.name'),
                  inviteCode: get(child, 'user.inviteCode', '-'),
                  sessionStatus: bookingDetails ? get(bookingDetails, 'sessionStatus') : '',
                  assignedMentor: bookingDetails ? get(bookingDetails, 'assignedMentor.name') : '',
                  verificationStatus: get(child, 'user.verificationStatus'),
                  slotNumber: bookingDetails ? get(bookingDetails, 'slotNumber') : '',
                  userCourse,
                  utmData: {
                    utmTerm,
                    utmSource,
                    utmMedium,
                    utmContent,
                    utmCampaign,
                  },
                  batch: get(child, 'batch'),
                }
                if (tableObj && tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')]) {
                  tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')].push(childDetails)
                } else {
                  tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')] = [childDetails]
                }
                tableData.push({
                  ...childDetails
                })
                count += 1
              })
            } else {
              childDetails = {
                sessionDetails: this.getBookingDetails([]),
                no: count,
                userId: '-',
                menteeName: '-',
                parentId,
                parentName,
                email,
                timezone,
                phone,
                phoneVerified,
                registrationDate,
                fromReferral,
                createdAt,
                updatedAt,
                country,
                action: '-',
                bookingDate: '-',
                bookingDateString: '-',
                city,
                state,
                region,
                role,
                createdAtString,
                updatedAtString,
                name,
                grade: '-',
                assignedMentor: '',
                sessionStatus: '',
                slotNumber: '',
                verificationStatus: '',
                inviteCode: '',
                userCourse: null,
                utmData: {
                  utmTerm,
                  utmSource,
                  utmMedium,
                  utmContent,
                  utmCampaign,
                },
                batch: null,
              }
              if (tableObj && tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')]) {
                tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')].push(childDetails)
              } else {
                tableObj[moment(get(user, 'createdAt')).format('DD-MM-YYYY')] = [childDetails]
              }
              tableData.push({
                ...childDetails
              })
              count += 1
            }
          } else {
            let usersData = {
              no: index + 1,
              userId: get(user, 'id'),
              timezone: get(user, 'timezone') || '-',
              name: get(user, 'name') ? get(user, 'name') : '-',
              username: get(user, 'username') ? get(user, 'username') : '-',
              email: get(user, 'email') ? get(user, 'email') : '-',
              gender: get(user, 'gender') ? get(user, 'gender') : '-',
              dob: get(user, 'dateOfBirth', '-'),
              phone: `${get(user, 'phone.countryCode')} ${get(user, 'phone.number')}`,
              phoneVerified: get(user, 'phoneVerified') ? 'Yes' : 'No',
              phoneNumber: get(user, 'phone.number'),
              phoneCode: get(user, 'phone.countryCode'),
              status: get(user, 'status', '-'),
              action: get(user, 'id'),
              savedPassword: get(user, 'savedPassword'),
              country: get(user, 'country'),
              createdAt: get(user, 'createdAt'),
              updatedAt: get(user, 'updatedAt'),
              role: get(user, 'role', '')
            }
            if (currentRole === MENTOR) {
              usersData = {
                ...usersData,
                profilePic: get(user, 'profilePic'),
                experienceYear: get(user, 'mentorProfile.experienceYear') || '-',
                googleMeetLink: get(user, 'mentorProfile.googleMeetLink') || '-',
                meetingId: get(user, 'mentorProfile.meetingId') || '-',
                meetingPassword: get(user, 'mentorProfile.meetingPassword') || '-',
                mentorRating: this.getMentorRating(get(user, 'mentorProfile')),
                sessionLink: get(user, 'mentorProfile.sessionLink') || '-',
              }
            }
            tableData.push(usersData)
          }
        })
        this.setState({
          tableData: sortBy(tableData, item => -1 * moment(get(item, 'createdAt'))),
          tableObj
        })
      }
    )
    this.setColumns()
  }

  getBookingDetails = (bookingArray = []) => {
    let bookingDetailString = ''
    bookingArray.forEach((booking, index) => {
      bookingDetailString += `${moment(get(booking, 'bookingDate')).format('DD/MM/YYYY')} at ${get(booking, 'startTime')} ${get(booking, 'course') ? `for course: ${get(booking, 'course.title')}` : ''} ${(index < bookingArray.length - 1) ? '|' : ''} `
    })
    return bookingDetailString.trim()
  }
  setColumns = () => {
    const { currentRole } = this.state
    let columns = []
    let childColumns = []
    const savedRole = getDataFromLocalStorage('login.role')
    const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
    if (currentRole === MENTEE || currentRole === PARENT) {
      const tableTitle = (
        <div style={{ display: 'flex' }}>
          <div style={{ width: 100 }}>#</div>
          <div style={{ width: 150 }}>Mentee Name</div>
          <div style={{ width: 150 }}>Parent Name</div>
        </div>
      )
      columns = [
        {
          title: () => tableTitle,
          dataIndex: 'userId',
          key: 'userId',
          render: (text, row) => ({
            props: {
              colSpan: isAdmin ? 16 : 15
            },
            children: `${row} (${this.state.tableObj[row] && this.state.tableObj[row].length})`
          }),
          width: 400,
          align: 'center'
        },
        {
          title: 'Parent e-mail',
          dataIndex: 'email',
          key: 'email',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Parent Phone',
          dataIndex: 'phone',
          key: 'phone',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Phone Verified',
          dataIndex: 'phoneVerified',
          key: 'phoneVerified',
          width: 100,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Grade',
          dataIndex: 'grade',
          key: 'grade',
          width: 100,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Booking Date',
          dataIndex: 'bookingDate',
          key: 'bookingDate',
          width: 350,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Assigned Mentor',
          dataIndex: 'assignedMentor',
          key: 'assignedMentor',
          width: 350,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Source',
          dataIndex: 'fromReferral',
          key: 'fromReferral',
          width: 250,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Timezone',
          dataIndex: 'timezone',
          key: 'timezone',
          width: 150,
          render: () => ({ props: { colSpan: 0 }, children: '-' })
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Updated At',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 150,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: 150,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Verification Status',
          dataIndex: 'verificationStatus',
          key: 'verificationStatus',
          width: 200,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'Referral Code',
          dataIndex: 'inviteCode',
          key: 'inviteCode',
          width: 100,
          render: () => ({ props: { colSpan: 0 } })
        },
        {
          title: 'UTM Data',
          dataIndex: 'utmData',
          key: 'utmData',
          width: 400,
          render: () => ({ props: { colSpan: 0 } }),
          ellipsis: true,
        },
      ]
      childColumns = [
        {
          title: () => tableTitle,
          dataIndex: 'userId',
          key: 'userId',
          // fixed: 'left',
          width: 400,
          render: (text, record, index) => (
            <div style={{ display: 'flex' }}>
              <div style={{ width: 100, textAlign: 'center' }}>{index + 1}</div>
              <div style={{ width: 150, margin: '0 8px' }}>
                {get(record, 'userId') && get(record, 'userId') !== '-' ? (
                  <Link to={`/ums/completedSessions/${get(record, 'userId')}`} >
                    {get(record, 'menteeName')}
                  </Link>
                ) : '-'}

              </div>
              <div style={{ width: 150 }}>{get(record, 'parentName')}</div>
            </div>
          )
        },
        { title: 'Parent e-mail', dataIndex: 'email', key: 'email', width: 200 },
        { title: 'Parent Phone', dataIndex: 'phone', key: 'phone', width: 200 },
        { title: 'Phone Verified', dataIndex: 'phoneVerified', key: 'phoneVerified', width: 100 },
        { title: 'Grade', dataIndex: 'grade', key: 'grade', width: 100 },
        {
          title: 'Booking Date',
          dataIndex: 'bookingDate',
          key: 'bookingDate',
          width: 350,
          render: this.renderBookingDetails
        },
        {
          title: 'Assigned Mentor',
          dataIndex: 'assignedMentor',
          key: 'assignedMentor',
          width: 350,
          render: this.renderAssignedMentor
        },
        {
          title: 'Source',
          dataIndex: 'fromReferral',
          key: 'fromReferral',
          width: 250,
          render: (fromReferral, record) => this.renderSource(fromReferral, record)
        },
        {
          title: 'Timezone',
          dataIndex: 'timezone',
          key: 'timezone',
          width: 150
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150,
          render: text => moment(text).format('DD-MM-YYYY[,] HH:mm')
        },
        {
          title: 'Updated At',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 150,
          render: text => moment(text).format('DD-MM-YYYY[,] HH:mm')
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: 150,
          render: (text, record) => (
            <Button
              onClick={() => {
                this.setState(
                  {
                    userToEdit: text
                  },
                  this.showModal('EDIT', record)
                )
              }}
              icon='edit'
              size='large'
              type='primary'
              disabled={savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM}
              style={{
                backgroundColor: '#FF9800',
                borderColor: '#FF9800'
              }}
            />
          )
        },
        {
          title: 'Verification Status',
          dataIndex: 'verificationStatus',
          key: 'verificationStatus',
          width: 200,
          render: (text, record) => (
            <>
              <UmsDashboardStyle.StatusBox
                backgroundColor={text === 'verified' ? 'rgba(158,247,114,0.6)' : '#fff'}
                hoverBackgroundColor='rgba(158,247,114,0.6)'
                hoverCursor={text !== 'verified' ? 'pointer' : 'not-allowed'}
                onClick={() => {
                  if (text !== 'verified') {
                    this.updateUserStatus({
                      userId: record.userId,
                      parentID: record.parentId,
                      parentInput: {},
                      status: 'verified'
                    })
                  }
                }}
              >
                Verified
              </UmsDashboardStyle.StatusBox>
              <UmsDashboardStyle.StatusBox
                backgroundColor={text === 'notQualified' ? 'rgba(187, 0, 34, 0.3)' : '#fff'}
                hoverBackgroundColor='rgba(187, 0, 34, 0.3)'
                hoverCursor={text !== 'notQualified' ? 'pointer' : 'not-allowed'}
                onClick={() => {
                  if (text !== 'notQualified') {
                    this.updateUserStatus({
                      userId: record.userId,
                      parentID: record.parentId,
                      parentInput: {},
                      status: 'notQualified'
                    })
                  }
                }}
              >
                Not qualified
              </UmsDashboardStyle.StatusBox>
              <UmsDashboardStyle.StatusBox
                backgroundColor={text === 'empty' || text === 'unverified' ? 'rgba(0, 0, 0, 0.1)' : '#fff'}
                hoverBackgroundColor='rgba(0, 0, 0, 0.1)'
                hoverCursor={text !== 'empty' && text !== 'unverified' ? 'pointer' : 'not-allowed'}
                onClick={() => {
                  if (text !== 'empty' && text !== 'unverified') {
                    this.updateUserStatus({
                      userId: record.userId,
                      parentID: record.parentId,
                      parentInput: {},
                      status: 'unverified'
                    })
                  }
                }}
              >
                Unverified
              </UmsDashboardStyle.StatusBox>
            </>
          )
        },
        {
          title: 'Referral Code',
          dataIndex: 'inviteCode',
          key: 'inviteCode',
          width: 100,
          render: (text, record) => (
            <Button
              icon='link'
              size='large'
              type='primary'
              onClick={() => {
                this.setState({
                  savedChild: record,
                  referralVisible: true
                })
              }}
            />
          )
        },
        {
          title: 'UTM Data',
          dataIndex: 'utmData',
          key: 'utmData',
          width: 400,
          render: (utmData) => this.renderUtmData(utmData),
          ellipsis: true,
        },
      ]
      // if (currentRole === PARENT) {
      //   const [removeCol] = columns.splice(1, 1)
      //   const insertAt = columns.findIndex(({ title }) => title === 'Grade')
      //   columns.splice(insertAt, 0, removeCol)

      //   const [removeChildCol] = childColumns.splice(1, 1)
      //   const insertAtChild = childColumns.findIndex(({ title }) => title === 'Grade')
      //   childColumns.splice(insertAtChild, 0, removeChildCol)
      // }
      if (isAdmin) {
        childColumns.push({
          title: 'Added Course',
          dataIndex: 'addedCourse',
          key: 'addedCourse',
          width: 100,
          render: (_, record) => this.renderUserCourse(record)
        })
        columns.push({
          title: 'Added Course',
          dataIndex: 'addedCourse',
          key: 'addedCourse',
          width: 100,
          render: () => ({ props: { colSpan: 0 } })
        })
      }
    } else {
      columns = [
        {
          title: '#',
          dataIndex: 'userId',
          key: 'userId',
          render: (text, record, index) => index + 1,
          width: 100
        },
        { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
        { title: 'UserName', dataIndex: 'username', key: 'username', width: 150 },
        { title: 'E-mail', dataIndex: 'email', key: 'email', width: 250 },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100 },
        {
          title: 'D.O.B',
          dataIndex: 'dob',
          key: 'dob',
          render: text => (text ? moment(text).format('lll') : 'NA'),
          width: 90
        },
        { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 200 },
        { title: 'Phone Verified', dataIndex: 'phoneVerified', key: 'phoneVerified', width: 100 },
        {
          title: currentRole !== AFFILIATE ? 'User Actions' : 'Invited Users',
          dataIndex: 'action',
          key: 'action',
          width: 200,
          render: (text, record) =>
            currentRole === AFFILIATE ? (
              <Fragment>
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        userToEdit: text
                      },
                      this.showModal('VIEW', record)
                    )
                  }}
                  icon='eye'
                  size='large'
                  type='primary'
                  style={{
                    backgroundColor: '#7cc84d',
                    borderColor: '#7cc84d'
                  }}
                />
              </Fragment>
            ) : (
              <Fragment>
                {
                  currentRole === MENTOR && (
                    <Button
                      onClick={() => {
                        this.setState(
                          {
                            userToEdit: text
                          },
                          this.showModal('VIEW_MENTOR', record)
                        )
                      }}
                      style={{ marginRight: '8px' }}
                      icon='link'
                      size='large'
                      type='primary'
                    />
                  )
                }
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        userToEdit: text
                      },
                      this.showModal('EDIT', record)
                    )
                  }}
                  icon='edit'
                  size='large'
                  type='primary'
                  style={{
                    backgroundColor: '#FF9800',
                    borderColor: '#FF9800',
                    marginRight: '8px'
                  }}
                />
                <Popconfirm
                  title={`Do you want to delete ${get(record, 'name')} ?`}
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => {
                    deleteUser(text)
                  }}
                >
                  <Button
                    icon='delete'
                    size='large'
                    type='danger'
                  />
                </Popconfirm>
              </Fragment>
            )
        }
      ]
      if (currentRole === MENTOR) {
        columns.splice(1, 0,
          {
            title: 'Profile Pic',
            dataIndex: 'profilePic',
            key: 'profilePic',
            render: (profilePic) => profilePic ?
              <img
                src={getFullPath(get(profilePic, 'uri'))}
                alt='mentorProfile'
                style={{ width: '100%', objectFit: 'contain' }}
              />
              : '-',
            width: 200
          })
      }
    }
    this.setState({
      columns,
      childColumns
    })
  }

  renderUserCourse = (record) => (
    <Tooltip title='Add Course'>
      <Button
        icon={get(record, 'userCourse') ? 'edit' : 'plus'}
        type='primary'
        style={{
          backgroundColor: '#FF9800',
          borderColor: '#FF9800',
          marginRight: '8px'
        }}
        onClick={() => {
          if (get(record, 'userId') === '-') {
            this.props.notification.warn({
              message: 'Cannot add courses for this user'
            })
          } else {
            this.setState({
              addUserCourseData: record,
              addCourseModalVisisble: true
            })
          }
        }}
      />
    </Tooltip>
  )

  onCloseCourseModal = () => {
    this.setState({
      addUserCourseData: null,
      addCourseModalVisisble: false
    })
  }
  renderSource = (fromReferral, record) => {
    const pStyle = { margin: 0, textTransform: 'capitalize' }
    if (fromReferral === 'school') {
      return (
        <div>
          <p style={pStyle}>{fromReferral}</p>
          {get(record, 'schoolName') && <p style={pStyle}>({get(record, 'schoolName')})</p>}
        </div>
      )
    }
    return <p style={pStyle}>{fromReferral}</p>
  }

  renderUtmData = (utmData) => {
    if (utmData) {
      const pStyle = { margin: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }
      return (
        <div>
          <p style={pStyle}>UTM Term:
            <Tooltip title={get(utmData, 'utmTerm')}>
              {get(utmData, 'utmTerm')}
            </Tooltip>
          </p>
          <p style={pStyle}>UTM Source:
            <Tooltip title={get(utmData, 'utmSource')}>
              {get(utmData, 'utmSource')}
            </Tooltip>
          </p>
          <p style={pStyle}>UTM Medium:
            <Tooltip title={get(utmData, 'utmMedium')}>
              {get(utmData, 'utmMedium')}
            </Tooltip>
          </p>
          <p style={pStyle}>UTM Content:
            <Tooltip title={get(utmData, 'utmContent')}>
              {get(utmData, 'utmContent')}
            </Tooltip>
          </p>
          <p style={pStyle}>UTM Campaign:
            <Tooltip title={get(utmData, 'utmCampaign')}>
              {get(utmData, 'utmCampaign')}
            </Tooltip>
          </p>
        </div>
      )
    }
    return '-'
  }
  updateUserStatus = async (usersData) => {
    const { userId, parentID, parentInput, status } = usersData
    const { currentRole, bookedSessionObj, searchGrade } = this.state
    if (currentRole === PARENT) {
      this.setState({
        loading: false
      })
    }
    let input = {
      role: currentRole,
      parentID,
      parentInput,
    }
    input = {
      ...input,
      verificationStatus: status
    }
    await updateUser(userId, input).then((res) => {
      if (currentRole === PARENT && res) {
        getRoleBasedUserAndCount(
          getDataFromLocalStorage('login.id'),
          getDataFromLocalStorage('login.role'),
          {
            role: this.state.currentRole,
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
            filterQuery: this.state.filterQuery,
            country: this.state.country,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            verifiedAndBookedUser: this.state.verifiedAndBookedUser,
            sourceType: this.state.sourceType,
            searchGrade
          }
        )
      }
    }).catch(error => {
      const errorMessage = get(error, 'errors[0].message')
      this.props.notification.error({
        message: errorMessage
      })
    })
    if (status === 'notQualified') {
      const bookings = get(bookedSessionObj, `${userId}`, [])
      bookings.forEach(async (booking) => {
        const mmsId = get(booking, 'mentorMenteeSessionId')
        const sessionStatus = get(booking, 'sessionStatus')
        if (mmsId && sessionStatus !== 'completed') {
          await deleteMentorMenteeSession(mmsId).then(() => { }).catch((error => {
            const errorMessage = get(error, 'errors[0].message')
            this.props.notification.error({
              message: errorMessage
            })
          }))
        }
      })
    }
  }
  getMentorRating = (mentorInfo) => {
    let ratingNum = 0
    let ratingDen = 0
    if (mentorInfo) {
      Object.keys(mentorInfo).forEach((key) => {
        if (key.includes('pythonCourseRating') && mentorInfo[key] > 0) {
          const ratingValue = key.split('pythonCourseRating')[1]
          ratingNum += ratingValue * mentorInfo[key]
          ratingDen += mentorInfo[key]
        }
      })
      if (ratingNum > 0 && ratingDen > 0) {
        return (ratingNum / ratingDen).toFixed(2)
      }
      return 'NA'
    }
    return 'NA'
  }

  // renderEditSessionButton = (text, record) => {
  //   const savedRole = getDataFromLocalStorage('login.role')
  //   if (get(text, 'sessionStatus') === 'completed'
  //     || (savedRole !== TRANSFORMATION_ADMIN
  //     && savedRole !== TRANSFORMATION_TEAM
  //     && get(record, 'fromReferral') === 'Transformation')) {
  //     return (
  //       <Tooltip title='Cannot edit completed sessions'>
  //         <Button icon='edit' disabled type='primary' />
  //       </Tooltip>
  //     )
  //   }
  //   return (
  //     <Button
  //       icon='edit'
  //       type='primary'
  //       onClick={() => this.showSessionModal(record, 'edit')}
  //     />
  //   )
  // }
  renderBookingDetails = (text, record) => {
    const savedRole = getDataFromLocalStorage('login.role')
    const isAdmin = savedRole === ADMIN
    if (text && text !== '-' && text.length > 0) {
      const bookingDetails = []
      text.forEach(booking => {
        bookingDetails.push(
          <div style={{ marginBottom: '8px' }}>
            <div>{get(booking, 'course.title')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {`${moment(get(booking, 'bookingDate')).format('DD/MM/YYYY')} | ${get(booking, 'startTime', '-')}`}
              {
                // this.renderEditSessionButton(text, record)
                get(booking, 'sessionStatus') && get(booking, 'sessionStatus') === 'completed' ? (
                  isAdmin ? (
                    <Popconfirm
                      title='Are you sure you want to re-book completed session?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={() => this.showSessionModal({
                      ...record,
                      bookingDate: booking
                    }, 'editCompleted')}
                    >
                      <Button
                        icon='edit'
                        type='danger'
                      />
                    </Popconfirm>
                  ) : (
                    <Tooltip title='Cannot edit completed session'>
                      <Button
                        icon='edit'
                        type='danger'
                        disabled
                      />
                    </Tooltip>
                  )
                ) : (
                  <Button
                    icon='edit'
                    type='primary'
                    onClick={() => this.showSessionModal({
                      ...record,
                      bookingDate: booking
                    }, 'edit')}
                    style={
                      savedRole !== TRANSFORMATION_ADMIN &&
                        savedRole !== TRANSFORMATION_TEAM &&
                        record.fromReferral === 'Transformation'
                        ? this.state.disabledStyle
                        : {}
                    }
                  />
                )
              }
              {moment(
                `${moment(get(booking, 'bookingDate')).format('DD/MM/YYYY')} ${get(booking, 'startTime')}`,
                'DD/MM/YYYY h A'
              ).diff(moment()) > 0 && (
                  get(booking, 'sessionStatus') && get(booking, 'sessionStatus') === 'completed' ? (
                    <Tooltip title='Cannot delete completed sessions'>
                      <Button icon='delete' disabled type='danger' />
                    </Tooltip>
                  ) : (
                    <Popconfirm
                      title='Do you want to delete this session?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={() => {
                        deleteMenteeSession(get(booking, 'sessionId'))
                      }}
                    >
                      <Button icon='delete' type='danger' />
                    </Popconfirm>
                  )
                )}
            </div>
            <UmsDashboardStyle.StyledDivider />
          </div>)
      })
      bookingDetails.push(
        <Button
          type='primary'
          style={
            savedRole !== TRANSFORMATION_ADMIN &&
              savedRole !== TRANSFORMATION_TEAM &&
              record.fromReferral === 'Transformation'
              ? this.state.disabledStyle
              : {}
          }
          key={text}
          onClick={() => {
            if (get(record, 'userId') === '-') {
              this.props.notification.warn({
                message: 'Cannot add Session for this user'
              })
            } else {
              this.showSessionModal(record, 'book')
            }
          }}
        >
          Book another Course
        </Button>)
      return bookingDetails
    }
    if (get(record, 'batch')) {
      return (
        <Button
          type='primary'
          key={text}
          style={{
            backgroundColor: 'rgb(255, 153, 0)',
            color: 'white',
            borderColor: 'wheat'
          }}
          onClick={() => {
            if (get(record, 'fromReferral') === 'school'
              && get(record, 'batch.type') !== 'normal') {
              this.props.history.push(`/sms/assignTimetable/${get(record, 'batch.code')}`)
            } else if ((get(record, 'fromReferral') !== 'school')
              && get(record, 'batch.type') === 'normal') {
              this.props.history.push(`/ums/assignTimetable/${get(record, 'batch.code')}`)
            }
          }}
        >
          Go to Batch
        </Button>
      )
    }
    return (
      <Button
        type='primary'
        style={
          savedRole !== TRANSFORMATION_ADMIN &&
            savedRole !== TRANSFORMATION_TEAM &&
            record.fromReferral === 'Transformation'
            ? this.state.disabledStyle
            : {}
        }
        key={text}
        onClick={() => {
          if (get(record, 'userId') === '-') {
            this.props.notification.warn({
              message: 'Cannot add Session for this user'
            })
          } else {
            this.showSessionModal(record, 'book')
          }
        }}
      >
        Book
      </Button>
    )
  }

  renderAssignedMentor = (assignedMentor, record) => {
    if (get(record, 'bookingDate') && get(record, 'bookingDate') !== '-'
      && get(record, 'bookingDate', []).length > 0) {
      const assignedMentorDetails = []
      get(record, 'bookingDate', []).forEach(booking => {
        if (get(booking, 'assignedMentor')) {
          assignedMentorDetails.push(
            <>
              <div>{get(booking, 'course.title')}</div>
              <p>
                {get(booking, 'assignedMentor.name')}
                {
                  get(booking, 'sessionStatus') && get(booking, 'sessionStatus') === 'completed' ? (
                    <Tooltip title='Cannot edit mentor for completed sessions'>
                      <Button
                        icon='edit'
                        type='primary'
                        disabled
                        style={{ marginLeft: '10px' }}
                      />
                    </Tooltip>
                  ) : (
                    <Button
                      icon='edit'
                      type='primary'
                      onClick={() => this.showAssignModal({
                        ...record,
                        bookingDate: booking
                      })}
                      style={{ marginLeft: '10px' }}
                    />
                  )
                }
              </p>
              <UmsDashboardStyle.StyledDivider />
            </>
          )
        } else {
          assignedMentorDetails.push(
            <>
              <div>{get(booking, 'course.title')}</div>
              <Button
                type='primary'
                onClick={() => this.showAssignModal({
                  ...record,
                  bookingDate: booking
                })}
              >
                Assign
              </Button>
              <UmsDashboardStyle.StyledDivider />
            </>
          )
        }
      })
      return assignedMentorDetails
    }
    return '-'
  }
  convertDataForUserInvitees = () => {
    const userInvites = get(this.props, 'userInvites') && get(this.props, 'userInvites').toJS()
    const userInvitesTableData = []
    get(userInvites, 'invites').forEach(details => {
      const user = get(details, 'acceptedBy')
      const userParent = get(details, 'acceptedBy.studentProfile.parents[0].user')
      userInvitesTableData.push({
        userId: get(user, 'id'),
        name: get(user, 'name') ? get(user, 'name') : '-',
        parentName: get(userParent, 'name') ? get(userParent, 'name') : '-',
        email: get(userParent, 'email') ? get(userParent, 'email') : '-',
        gender: get(user, 'gender') ? get(user, 'gender') : '-',
        dob: get(user, 'dateOfBirth', '-'),
        phone: get(userParent, 'phone')
          ? `${get(userParent, 'phone.countryCode')} ${get(userParent, 'phone.number')}`
          : '-',
        phoneNumber: get(userParent, 'phone.number'),
        phoneCode: get(userParent, 'phone.countryCode'),
        grade: get(user, 'studentProfile.grade'),
        createdAt: get(user, 'createdAt')
      })
    })
    const userInvitesColumn = [
      {
        title: '#',
        dataIndex: 'userId',
        key: 'userId',
        width: 100,
        align: 'center',
        render: (text, record, index) => index + 1
      },
      {
        title: 'Mentee Name',
        dataIndex: 'name',
        key: 'name',
        width: 150
      },
      {
        title: 'Parent Name',
        dataIndex: 'parentName',
        key: 'parentName',
        width: 150
      },
      {
        title: 'Parent e-mail',
        dataIndex: 'email',
        key: 'email',
        width: 200
      },
      {
        title: 'Parent Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 200
      },
      {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        width: 100
      }
    ]
    this.setState({
      userInvitesTableData,
      userInvitesColumn
    })
  }

  expandedRow = row => {
    const { tableObj, childColumns } = this.state
    return (
      <UmsDashboardStyle.UMSTable
        columns={childColumns}
        dataSource={tableObj[row]}
        pagination={false}
        showHeader={false}
        bordered
        rowKey={record => this.getRowClass(record.fromReferral)}
        rowClassName={record => this.getRowClass(record.fromReferral)}
      />
    )
  }

  // getRowColor = (fromReferral) => {
  //   console.log(fromReferral)
  //   if (fromReferral === 'Transformation') {
  //     return '#f8ff8a59'
  //   }
  //   if (fromReferral === 'school') {
  //     return '#93e76c59'
  //   }
  //   return ''
  // }

  getRowClass = (fromReferral) => {
    if (fromReferral === 'Transformation') {
      return 'transformationRow'
    }
    if (fromReferral === 'school') {
      return 'schoolRow'
    }
    return ''
  }
  handleRoleChange = value => {
    let fromDate = null
    let toDate = null
    let selectedRange = ''
    if (value === MENTEE || value === PARENT) {
      const range = JSON.parse('{"duration":"0","unit":"d"}')
      selectedRange = '{"duration":"0","unit":"d"}'
      fromDate = moment().subtract(range.duration, range.unit)
      toDate = moment()
    } else {
      selectedRange = '{"duration":"all"}'
      fromDate = null
      toDate = null
    }
    this.setState(
      {
        currentRole: value,
        currentPage: 1,
        perPageQueries: 50,
        filterQuery: {
          usersFilter: null,
          salesFilter: null
        },
        searchKey: 'All',
        searchValue: '',
        tableData: [],
        tableObj: {},
        selectedRange,
        fromDate,
        toDate,
        verifiedAndBookedUser: false,
        verifiedUsers: false,
        loading: true,
        searchGrade: 'All'
      },
      () => {
        getRoleBasedUserAndCount(
          getDataFromLocalStorage('login.id'),
          getDataFromLocalStorage('login.role'),
          {
            role: this.state.currentRole,
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
            filterQuery: this.state.filterQuery,
            country: this.state.country,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            verifiedAndBookedUser: this.state.verifiedAndBookedUser,
            sourceType: this.state.sourceType,
            searchGrade: this.state.searchGrade
          }
        )
      }
    )
  }

  onPageChange = page => {
    this.setState(
      {
        currentPage: page,
        loading: true
      },
      () => {
        getRoleBasedUserAndCount(
          getDataFromLocalStorage('login.id'),
          getDataFromLocalStorage('login.role'),
          {
            role: this.state.currentRole,
            page: this.state.currentPage,
            perPage: this.state.perPageQueries,
            filterQuery: this.state.filterQuery,
            country: this.state.country,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            verifiedAndBookedUser: this.state.verifiedAndBookedUser,
            sourceType: this.state.sourceType,
            searchGrade: this.state.searchGrade
          }
        )
      }
    )
  }

  handleDateChange = (dates) => {
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : '',
      toDate: dates && dates[1] ? dates[1] : '',
      loading: true
    }, () => getRoleBasedUserAndCount(
      getDataFromLocalStorage('login.id'),
      getDataFromLocalStorage('login.role'),
      {
        role: this.state.currentRole,
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
        filterQuery: this.state.filterQuery,
        country: this.state.country,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        verifiedAndBookedUser: this.state.verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade: this.state.searchGrade
      }
    ))
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

  handlePageSizeChange = (value) => {
    this.setState({
      perPageQueries: value,
      currentPage: 1,
      loading: true
    }, () => getRoleBasedUserAndCount(
      getDataFromLocalStorage('login.id'),
      getDataFromLocalStorage('login.role'),
      {
        role: this.state.currentRole,
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
        filterQuery: this.state.filterQuery,
        country: this.state.country,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        verifiedAndBookedUser: this.state.verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade: this.state.searchGrade
      }
    ))
  }

  onUserInvitesPageChange = page => {
    this.setState(
      {
        userInvitesCurrentPage: page
      },
      () => {
        fetchUserInvites({
          invitedBy: get(this.state, 'invitedById'),
          perPage: this.state.userInvitesPerPage,
          skip: this.state.userInvitesCurrentPage
        })
      }
    )
  }

  showModal = (type, record) => {
    const { addMentor } = this.state
    switch (type) {
      case 'ADD':
        const country = localStorage.getItem('country')
        this.setState({
          visible: true,
          addMentor: {
            ...addMentor,
            oneTimePwd: this.generateRandomString()
          },
          addMentee: {
            parentName: '',
            childName: '',
            parentEmail: '',
            phoneNumber: '',
            phoneCode: country === 'usa' ? '+1' : '+91',
            grade: '',
            country: country && country !== 'all' ? country : 'india',
            timezone: country === 'usa' ? 'America/New_York' : 'Asia/Kolkata',
            city: '',
            stateValue: '',
            region: ''
          },
          actionType: type
        })
        break
      case 'EDIT':
        this.setState({
          visible: true,
          addMentor: {
            name: get(record, 'name'),
            username: get(record, 'username'),
            email: get(record, 'email'),
            phoneNumber: get(record, 'phoneNumber'),
            phoneCode: get(record, 'phoneCode'),
            oneTimePwd: get(record, 'savedPassword') ? get(record, 'savedPassword') : ''
          },
          addMentee: {
            parentName: get(record, 'parentName'),
            childName: get(record, 'menteeName'),
            parentEmail: get(record, 'email'),
            phoneNumber: get(record, 'phone')
              .split(' ')
              .pop(),
            phoneCode: get(record, 'phone').split(' ')[0],
            grade: Number(get(record, 'grade')),
            parentId: get(record, 'parentId'),
            country: get(record, 'country'),
            timezone: get(record, 'timezone') === '-' ? '' : get(record, 'timezone'),
            city: get(record, 'city'),
            stateValue: get(record, 'state'),
            region: get(record, 'region'),
          },
          actionType: type
        })
        break
      case 'VIEW':
        this.setState(
          {
            visible: true,
            actionType: type,
            invitedByName: get(record, 'name'),
            invitedById: get(record, 'userId')
          },
          () => {
            fetchUserInvites({
              invitedBy: get(record, 'userId'),
              perPage: this.state.userInvitesPerPage,
              skip: this.state.userInvitesCurrentPage
            })
          }
        )
        break
      case 'VIEW_MENTOR':
        this.setState(
          {
            visible: true,
            actionType: type,
            addMentor: {
              ...record
            }
          })
        break
      default:
        this.setState({
          visible: true
        })
        break
    }
  }

  handleOkForMentee = async () => {
    const { addMentee, actionType, userToEdit, currentRole } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    let err = false
    const excludeKeys = ['city', 'stateValue', 'region']
    Object.keys(addMentee).forEach(key => {
      if (!addMentee[key] && actionType === 'ADD' && !excludeKeys.includes(key)) {
        this.setState({
          error: 'Fill all the values'
        })
        err = true
      }
    })
    if (!err) {
      if (actionType === 'ADD') {
        const addMenteeInput = {
          // role: currentRole,
          parentName: get(addMentee, 'parentName').trim(),
          childName: get(addMentee, 'childName').trim(),
          parentEmail: get(addMentee, 'parentEmail').trim(),
          parentPhone: {
            number: get(addMentee, 'phoneNumber'),
            countryCode: get(addMentee, 'phoneCode')
          },
          grade: `Grade${get(addMentee, 'grade')}`,
          country: get(addMentee, 'country'),
          // city: get(addMentee, 'city'),
          // state: get(addMentee, 'stateValue'),
          // region: get(addMentee, 'region'),
          timezone: get(addMentee, 'timezone')
        }
        if (savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) {
          addMenteeInput.utmSource = 'transformation'
        }
        await addParentChild(addMenteeInput)
      } else if (actionType === 'EDIT') {
        if (currentRole === MENTEE) {
          await updateUser(userToEdit, {
            role: currentRole,
            name: get(addMentee, 'childName').trim(),
            parentID: addMentee.parentId,
            parentInput: {
              name: get(addMentee, 'parentName', '').trim(),
              email: get(addMentee, 'parentEmail', '').trim()
            },
            grade: get(addMentee, 'grade'),
            country: get(addMentee, 'country'),
            timezone: get(addMentee, 'timezone'),
            city: get(addMentee, 'city') || '',
            state: get(addMentee, 'stateValue') || '',
            region: get(addMentee, 'region') || ''
          }).catch(error => {
            const errorMessage = get(error, 'errors[0].message')
            this.props.notification.error({
              message: errorMessage
            })
          })
        } else if (currentRole === PARENT) {
          await updateUser(userToEdit, {
            role: currentRole,
            name: get(addMentee, 'childName').trim(),
            parentID: addMentee.parentId,
            grade: get(addMentee, 'grade'),
            parentInput: {
              name: get(addMentee, 'parentName', '').trim(),
              email: get(addMentee, 'parentEmail', '').trim(),
              country: get(addMentee, 'country') || '',
              timezone: get(addMentee, 'timezone') || '',
              city: get(addMentee, 'city') || '',
              state: get(addMentee, 'stateValue') || '',
              region: get(addMentee, 'region') || ''
            },
          }).catch(error => {
            const errorMessage = get(error, 'errors[0].message')
            this.props.notification.error({
              message: errorMessage
            })
          })
        }
      }
    }
  }

  handleOk = async () => {
    // this.setState({
    //   visible: false
    // })
    const { addMentor, actionType, userToEdit, currentRole } = this.state
    if (currentRole === MENTEE || currentRole === PARENT) {
      this.handleOkForMentee()
    } else {
      let err = false
      Object.keys(addMentor).forEach(key => {
        if (!addMentor[key] && actionType === 'ADD') {
          this.setState({
            error: 'Fill all the values'
          })
          err = true
        }
      })
      if (!err) {
        if (actionType === 'ADD') {
          await addUser({
            role: currentRole,
            name: get(addMentor, 'name').trim(),
            email: get(addMentor, 'email').trim(),
            username: get(addMentor, 'username').trim(),
            password: get(addMentor, 'oneTimePwd').trim(),
            phone: {
              number: get(addMentor, 'phoneNumber'),
              countryCode: get(addMentor, 'phoneCode')
            }
          }).then(res => {
            if (res && res.addUser && res.addUser.id) {
              if (currentRole === BDE) {
                addBDEProfile(get(res, 'addUser.id'))
              } else if (currentRole === MENTOR) {
                addMentorProfile(get(res, 'addUser.id'))
              }
            }
          })
        } else if (actionType === 'EDIT') {
          await updateUser(userToEdit, {
            role: currentRole,
            name: get(addMentor, 'name').trim(),
            username: get(addMentor, 'username').trim(),
            country: get(addMentor, 'country')
          })
        }
      }
    }
  }

  handleReferralCancel = () => {
    this.setState({
      referralVisible: false
    })
  }

  handleCancel = (modalClose = false) => {
    this.setState({
      visible: false,
      addMentor: {
        name: '',
        email: '',
        phoneNumber: '',
        phoneCode: '+91',
        username: '',
        oneTimePwd: ''
      },
      userInvitesCurrentPage: 1,
      searchValue: '',
      searchKey: 'All',
      verifiedAndBookedUser: false,
      verifiedUsers: false,
      loading: true
    }, () => !modalClose && getRoleBasedUserAndCount(
      getDataFromLocalStorage('login.id'),
      getDataFromLocalStorage('login.role'),
      {
        role: this.state.currentRole,
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
        filterQuery: this.state.filterQuery,
        country: this.state.country,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        verifiedAndBookedUser: this.state.verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade: this.state.searchGrade
      }
    ))
  }

  handleFilterKeyChange = value => {
    this.setState(
      {
        searchKey: value,
        searchValue: value === 'All' ? 'All' : ''
      },
      () => {
        if (value === 'All') {
          this.setState(
            {
              filterQuery: {
                usersFilter: null,
                salesFilter: null
              },
              userInvitesFilterQuery: '',
              utmSearchKey: ''
            },
            this.callFetchQueryForFiltering
          )
        }
      }
    )
  }

  handleSeachValueChange = event => {
    this.setState({
      searchValue: event.target.value
    }, () => {
      const { searchKey } = this.state
      if (searchKey === 'phoneVerified' || searchKey === 'verificationStatus') {
        this.handleSearchButton()
      }
    })
  }

  handleSourceTypeChange = value => {
    const { sourceType } = this.state
    if (sourceType === value) {
      this.setState({
        sourceType: ''
      }, this.fetchByAddedFilters)
    } else {
      this.setState({
        sourceType: value,
      }, this.fetchByAddedFilters)
    }
  }


  handleSearchButton = () => {
    const { searchKey, currentRole, utmSearchKey } = this.state
    let { searchValue } = this.state
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Name':
        this.setState(
          {
            filterQuery: {
              usersFilter: `{name_contains: "${searchValue}"}`,
              salesFilter: `{client_some:{name_contains: "${searchValue}"}}`
            }
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Parent Name':
        this.setState(
          {
            filterQuery: {
              usersFilter: `{studentProfile_some:
                {parents_some:
                  {user_some:
                    {name_contains: "${searchValue}"
                  }
                }
              }}`,
              salesFilter: `{client_some:
                {studentProfile_some:
                  {parents_some:
                    {user_some:
                      {name_contains: "${searchValue}"
                    }
                  }
                }}}`
            }
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Email':
        this.setState(
          {
            filterQuery: {
              usersFilter:
                currentRole === MENTEE
                  ? `{studentProfile_some:
                {parents_some:
                  {user_some:
                    {email_contains:"${searchValue}"}
                  }
                }
              }`
                  : `{email_contains:"${searchValue}"}`,
              salesFilter:
                currentRole === MENTEE
                  ? `{
                client_some:
                {studentProfile_some:
                  {parents_some:
                    {user_some:
                      {email_contains:"${searchValue}"}
                    }
                  }
                }}`
                  : null
            }
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'Phone No.':
        this.setState(
          {
            filterQuery: {
              usersFilter:
                currentRole === MENTEE
                  ? `{studentProfile_some:
                {parents_some:
                  {user_some:
                    {phone_number_subDoc_contains:"${searchValue}"}
                  }
                }
              }`
                  : `{phone_number_subDoc_contains:"${searchValue}"}`,
              salesFilter:
                currentRole === MENTEE
                  ? `{client_some:{studentProfile_some:
                {parents_some:
                  {user_some:
                    {phone_number_subDoc_contains:"${searchValue}"}
                  }
                }
              }}`
                  : null
            }
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'phoneVerified':
        this.setState(
          {
            filterQuery: {
              usersFilter:
                currentRole === MENTEE
                  ? `{
                    studentProfile_some: {
                      parents_some: { user_some: ${searchValue === 'Yes' ? '{ phoneVerified:true }' : '{ phoneVerified:false }'} }
                    }
                  }`
                  : `${searchValue === 'Yes' ? '{ phoneVerified:true }' : '{ phoneVerified:false }'}`,
              salesFilter:
                currentRole === MENTEE
                  ? `{client_some:{
                    studentProfile_some: {
                      parents_some: { user_some: ${searchValue === 'Yes' ? '{ phoneVerified:true }' : '{ phoneVerified:false }'} }
                    }
                  }}`
                  : null
            }
          },
          this.callFetchQueryForFiltering
        )
        break
      case 'verificationStatus':
        this.setState({
          filterQuery: {
            usersFilter: currentRole === MENTEE ? `{ verificationStatus: ${searchValue} }` : '',
            salesFilter: currentRole === MENTEE ? `{client_some:{{ verificationStatus: ${searchValue} }}` : ''
          }
        }, this.callFetchQueryForFiltering)
        break
      case 'UTM Parameter':
        const isParentOrMentee = currentRole === MENTEE || currentRole === PARENT
        switch (utmSearchKey) {
          case 'utmTerm':
            this.setState({
              filterQuery: {
                usersFilter: isParentOrMentee ? `{ utmTerm_contains: "${searchValue}" }` : '',
                salesFilter: currentRole === MENTEE ? `{client_some:{{ utmTerm_contains: "${searchValue}" }}` : ''
              }
            }, this.callFetchQueryForFiltering)
            break
          case 'utmSource':
            this.setState({
              filterQuery: {
                usersFilter: isParentOrMentee ? `{ utmSource_contains: "${searchValue}" }` : '',
                salesFilter: currentRole === MENTEE ? `{client_some:{{ utmSource_contains: "${searchValue}" }}` : ''
              }
            }, this.callFetchQueryForFiltering)
            break
          case 'utmMedium':
            this.setState({
              filterQuery: {
                usersFilter: isParentOrMentee ? `{ utmMedium_contains: "${searchValue}" }` : '',
                salesFilter: currentRole === MENTEE ? `{client_some:{{ utmMedium_contains: "${searchValue}" }}` : ''
              }
            }, this.callFetchQueryForFiltering)
            break
          case 'utmContent':
            this.setState({
              filterQuery: {
                usersFilter: isParentOrMentee ? `{ utmContent_contains: "${searchValue}" }` : '',
                salesFilter: currentRole === MENTEE ? `{client_some:{{ utmContent_contains: "${searchValue}" }}` : ''
              }
            }, this.callFetchQueryForFiltering)
            break
          case 'utmCampaign':
            this.setState({
              filterQuery: {
                usersFilter: isParentOrMentee ? `{ utmCampaign_contains: "${searchValue}" }` : '',
                salesFilter: currentRole === MENTEE ? `{client_some:{{ utmCampaign_contains: "${searchValue}" }}` : ''
              }
            }, this.callFetchQueryForFiltering)
            break
          default:
            this.setState(
              {
                filterQuery: {
                  usersFilter: null,
                  salesFilter: null
                }
              },
              this.callFetchQueryForFiltering
            )
            break
        }
        break
      default:
        this.setState(
          {
            filterQuery: {
              usersFilter: null,
              salesFilter: null
            }
          },
          this.callFetchQueryForFiltering
        )
        break
    }
  }

  callFetchQueryForFiltering = async () => {
    const {
      searchKey,
      filterQuery,
      searchValue,
      perPageQueries,
      currentPage,
      currentRole,
      fromDate,
      toDate,
      verifiedAndBookedUser,
      searchGrade
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    if (searchKey === 'All' && searchValue === 'All') {
      getRoleBasedUserAndCount(savedId, savedRole, {
        role: currentRole,
        page: currentPage,
        perPage: perPageQueries,
        filterQuery: {
          salesFilter: null,
          usersFilter: null
        },
        country: this.state.country,
        fromDate,
        toDate,
        verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade
      })
      this.setState({
        searchKey: 'All',
        searchValue: '',
        filterQuery: {
          salesFilter: null,
          usersFilter: null
        },
        currentPage: 1,
        loading: true
      })
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        currentPage: 1,
        loading: true
      })
      getRoleBasedUserAndCount(savedId, savedRole, {
        role: currentRole,
        page: 1,
        perPage: perPageQueries,
        filterQuery,
        country: this.state.country,
        fromDate,
        toDate,
        verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade
      })
    }
  }

  handleUserInvitesFilterKeyChange = value => {
    this.setState(
      {
        searchKey: value,
        searchValue: value === 'All' ? 'All' : ''
      },
      () => {
        if (value === 'All') {
          this.setState(
            {
              userInvitesFilterQuery: ''
            },
            this.callFetchQueryForFilteringUserInvites
          )
        }
      }
    )
  }

  handleUserInvitesSearchButton = () => {
    const { searchKey } = this.state
    let { searchValue } = this.state
    searchValue = searchValue.trim()
    switch (searchKey) {
      case 'Name':
        this.setState(
          {
            userInvitesFilterQuery: `{name_contains: "${searchValue}"}`
          },
          this.callFetchQueryForFilteringUserInvites
        )
        break
      case 'Parent Name':
        this.setState(
          {
            userInvitesFilterQuery: `{studentProfile_some:
              {parents_some:
                {user_some:
                  {name_contains: "${searchValue}"
                }
              }
            }}`
          },
          this.callFetchQueryForFilteringUserInvites
        )
        break
      case 'Email':
        this.setState(
          {
            userInvitesFilterQuery: `{studentProfile_some:
                {parents_some:
                  {user_some:
                    {email_contains:"${searchValue}"}
                  }
                }
              }`
          },
          this.callFetchQueryForFilteringUserInvites
        )
        break
      case 'Phone No.':
        this.setState(
          {
            userInvitesFilterQuery: `{studentProfile_some:
                {parents_some:
                  {user_some:
                    {phone_number_subDoc_contains:"${searchValue}"}
                  }
                }
              }`
          },
          this.callFetchQueryForFilteringUserInvites
        )
        break
      default:
        this.setState(
          {
            userInvitesFilterQuery: ''
          },
          this.callFetchQueryForFilteringUserInvites
        )
        break
    }
  }

  callFetchQueryForFilteringUserInvites = () => {
    const {
      searchKey,
      searchValue,
      invitedById,
      userInvitesCurrentPage,
      userInvitesPerPage,
      userInvitesFilterQuery
    } = this.state
    if (searchKey === 'All' && searchValue === 'All') {
      fetchUserInvites({
        invitedBy: invitedById,
        perPage: userInvitesPerPage,
        skip: userInvitesCurrentPage,
        filterQuery: ''
      })
      this.setState({
        searchKey: 'All',
        searchValue: '',
        userInvitesCurrentPage: 1,
        userInvitesFilterQuery: ''
      })
    } else if (searchKey !== 'All' && searchValue !== '') {
      this.setState({
        userInvitesCurrentPage: 1
      })
      fetchUserInvites({
        invitedBy: invitedById,
        perPage: userInvitesPerPage,
        skip: 1,
        filterQuery: userInvitesFilterQuery
      })
    }
  }

  generateRandomString = length => {
    const randomString = Math.random()
      .toString(36)
      .slice(2)
    return randomString.substring(0, length)
  }

  renderCountryCodes = () => {
    const { Option } = Select
    const { currentRole, addMentee, addMentor } = this.state
    return (
      <Select
        defaultValue={localStorage.getItem('country') === 'usa' ? '+1' : '+91'}
        className='select-before'
        value={currentRole === MENTEE ? addMentee.phoneCode : addMentor.phoneCode}
        style={{ width: 200 }}
        onChange={code => currentRole === MENTEE
          ? this.setState({
            addMentee: {
              ...this.state.addMentee,
              phoneCode: code
            }
          })
          : this.setState({
            addMentor: {
              ...this.state.addMentor,
              phoneCode: code
            }
          })
        }
        disabled={this.state.actionType === 'EDIT'}
      >
        {COUNTRY_CODES.map(country => (
          <Option value={country.dial_code} key={country.name}>
            {country.dial_code} {country.name}
          </Option>
        ))}
      </Select>
    )
  }

  handleAddMentorChange = e => {
    const { addMentor, actionType } = this.state
    if (e.target.name === 'name' && actionType === 'ADD') {
      this.setState({
        addMentor: {
          ...addMentor,
          [e.target.name]: e.target.value,
          username: e.target.value
        }
      })
    } else {
      this.setState({
        addMentor: {
          ...addMentor,
          [e.target.name]: e.target.value
        }
      })
    }
  }

  handleAddMenteeChange = e => {
    const { addMentee } = this.state
    this.setState({
      addMentee: {
        ...addMentee,
        [e.target.name]: e.target.value
      }
    })
  }

  getSaveButtonText = () => {
    if (get(this.props, 'addingUser') || get(this.props, 'updatingUser')) {
      return 'Saving...'
    }
    return 'Save'
  }

  showModalSaving = () => {
    const {
      menteeSessionBookingStatus,
      mentorSessionBookingStatus,
      mentorSessionUpdateStatus,
      mentorMenteeSessionAddStatus,
      menteeSessionUpdateStatus
    } = this.props
    return (
      (menteeSessionBookingStatus &&
        menteeSessionBookingStatus.getIn([
          `menteeSession/${this.state.menteeId}/${this.state.nextTopicIdToBook}`,
          'loading'
        ])) ||
      (mentorSessionBookingStatus &&
        mentorSessionBookingStatus.getIn([
          `mentorSession/paid/${this.state.selectedMentorId}`,
          'loading'
        ])) ||
      (mentorSessionUpdateStatus &&
        mentorSessionUpdateStatus.getIn([
          `mentorSession/paid/${this.state.selectedMentorId}`,
          'loading'
        ])) ||
      (mentorMenteeSessionAddStatus &&
        mentorMenteeSessionAddStatus.getIn([
          `mentorMenteeSession/${this.state.menteeSessionId}/${this.state.mentorSessionId}`,
          'loading'
        ])) ||
      (menteeSessionUpdateStatus &&
        menteeSessionUpdateStatus.getIn([`menteeSession/${this.state.menteeId}`, 'loading']))
    )
  }

  showSessionModal = (record, type) => {
    this.setState({
      sessionModalVisible: true,
      menteeId: record.userId,
      editingSession: type !== 'book',
      sessionToEdit: record,
      editingCompletedSession: type === 'editCompleted'
    })
  }
  showAssignModal = (record) => {
    this.setState({
      addMentee: {
        ...record,
      },
      showAssignmentModal: true
    })
  }
  onCloseAssignModal = () => {
    this.setState({
      showAssignmentModal: false
    })
  }
  closeSessionModal = () => {
    this.setState({
      sessionModalVisible: false
    })
  }

  renderForm = () => {
    const { addMentor, actionType, currentRole, addMentee } = this.state
    if (currentRole === MENTEE || currentRole === PARENT) {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridGap: 15
          }}
        >
          <Input
            value={addMentee.parentName}
            onChange={this.handleAddMenteeChange}
            placeholder='Type Parent Name'
            name='parentName'
            addonBefore='Parent Name: '
          />
          <Input
            value={addMentee.childName}
            onChange={this.handleAddMenteeChange}
            placeholder='Type Child Name'
            name='childName'
            addonBefore='Child Name: '
          />
          <Input
            value={addMentee.parentEmail}
            onChange={this.handleAddMenteeChange}
            placeholder='Type Parent Email'
            name='parentEmail'
            type='email'
            addonBefore='Parent Email: '
          />
          <Input
            addonBefore={this.renderCountryCodes()}
            value={addMentee.phoneNumber}
            onChange={this.handleAddMenteeChange}
            placeholder='Type Phone number'
            name='phoneNumber'
            type='number'
            disabled={actionType === 'EDIT'}
          />
          <div>
            <span>Grade: </span>
            <Radio.Group
              onChange={this.handleAddMenteeChange}
              name='grade'
              value={addMentee.grade}
              style={{ marginBottom: 8 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                <Radio.Button value={grade} key={grade}>
                  {grade}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          {this.state.error ? <p style={{ color: 'crimson' }}>{this.state.error}</p> : null}
          <div style={{ display: 'flex' }}>
            <div>
              Country:{' '}
              <Select
                value={addMentee.country}
                style={{ width: 200 }}
                onChange={country => {
                  this.setState(prev => ({
                    addMentee: {
                      ...prev.addMentee,
                      country
                    }
                  }))
                }}
              >
                {countryAndState.map(country => (
                  <Select.Option value={country.countryValue} label={country.country}>
                    {country.country}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {
              actionType === 'EDIT' && (
                <div style={{ marginLeft: '10px' }}>
                  State:{' '}
                  <Select
                    value={addMentee.stateValue}
                    style={{ width: 200 }}
                    disabled={!addMentee.country}
                    onChange={stateValue => {
                      this.setState(prev => ({
                        addMentee: {
                          ...prev.addMentee,
                          stateValue
                        }
                      }))
                    }}
                  >
                    {get(countryAndState.find(country => get(country, 'countryValue') === addMentee.country), 'states', []).map(s => (
                      <Select.Option value={s} label={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )
            }
          </div>
          {
            actionType === 'EDIT' && (
              <>
                <Input
                  value={addMentee.city}
                  onChange={this.handleAddMenteeChange}
                  placeholder='Type City'
                  name='city'
                  type='text'
                  addonBefore='City: '
                />
                <Input
                  value={addMentee.region}
                  onChange={this.handleAddMenteeChange}
                  placeholder='Type Region'
                  name='region'
                  type='text'
                  addonBefore='Region: '
                />
              </>
            )
          }
          <div>
            Timezone:{' '}
            <Select
              showSearch
              value={addMentee.timezone}
              style={{ width: 200 }}
              onChange={timezone => {
                this.setState(prev => ({
                  addMentee: {
                    ...prev.addMentee,
                    timezone
                  }
                }))
              }}
            >
              {momentTZ.tz.names().map(timezone => (
                <Select.Option value={timezone} label={timezone}>
                  {timezone}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: 15
        }}
      >
        <Input
          value={addMentor.name}
          onChange={this.handleAddMentorChange}
          placeholder='Type Name'
          name='name'
          addonBefore='Name: '
        />
        <Input
          value={addMentor.email}
          onChange={this.handleAddMentorChange}
          placeholder='Type Email'
          name='email'
          type='email'
          disabled={actionType === 'EDIT'}
          addonBefore='Email: '
        />
        <Input
          addonBefore={this.renderCountryCodes()}
          value={addMentor.phoneNumber}
          onChange={this.handleAddMentorChange}
          placeholder='Type Phone number'
          name='phoneNumber'
          type='number'
          disabled={actionType === 'EDIT'}
        />
        <Input
          value={addMentor.username}
          onChange={this.handleAddMentorChange}
          placeholder='Type Username'
          name='username'
          addonBefore='username'
        />
        {actionType === 'EDIT' ? null : (
          <Fragment>
            <Input
              value={addMentor.oneTimePwd}
              onChange={this.handleAddMentorChange}
              placeholder='One time Password'
              name='oneTimePwd'
              addonBefore='Password'
            />
            <div
              style={{
                marginTop: '-13px',
                fontSize: 12
              }}
            >
              First time password only*
            </div>
          </Fragment>
        )}
        {this.state.error ? <p style={{ color: 'crimson' }}>{this.state.error}</p> : null}
      </div>
    )
  }

  getCSVHeader = () => {
    const { currentRole } = this.state
    const { menteeHeaderConfig, otherRoleHeaderConfig } = userCSVHeaderConfig
    let headers = []
    if (currentRole === MENTEE) headers = menteeHeaderConfig
    else if (currentRole === PARENT) {
      headers = [...menteeHeaderConfig]
      headers.splice(1, 1)
      const insertAtChild = headers.findIndex(({ label }) => label === 'Grade')
      headers.splice(insertAtChild, 0, {
        label: 'Mentee Name',
        key: 'menteeName',
      })
    } else if (currentRole === MENTOR) {
      headers = [...otherRoleHeaderConfig, {
        label: 'Mentor Rating',
        key: 'mentorRating',
      },
      {
        label: 'Zoom Link',
        key: 'sessionLink',
      },
      {
        label: 'Meeting ID',
        key: 'meetingId',
      },
      {
        label: 'Meeting Password',
        key: 'meetingPassword',
      },
      {
        label: 'Google Meet Link',
        key: 'googleMeetLink',
      }]
    } else headers = otherRoleHeaderConfig
    return headers
  }

  renderReferralCode = () => {
    const divStyle = { display: 'grid', gridTemplateColumns: '90% 10%' }
    const { savedChild } = this.state
    const code = `${process.env.REACT_APP_TEKIE_APP_URL}/signup?referralCode=${get(savedChild, 'inviteCode', '')}`
    return (
      <div style={{ wordBreak: 'break-all' }}>
        <div style={divStyle}>
          <h3>
            <a href={code} target='_blank' rel='noopener noreferrer' >
              {code}
            </a>
          </h3>
          <Tooltip
            trigger='click'
            title='Copied to clipboard!'
          >
            <Button
              type='secondary'
              size='small'
              onClick={() => { navigator.clipboard.writeText(code) }}
            >
              <CopyOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    )
  }

  renderMentorProfile = () => {
    const { addMentor } = this.state
    const divStyle = { display: 'grid', gridTemplateColumns: '35% auto' }
    return (
      <div style={{ wordBreak: 'break-all' }}>
        <div style={divStyle}>
          <h3>Mentor Rating : </h3>
          <h3>{get(addMentor, 'mentorRating') || '-'}</h3>
        </div>
        <div style={divStyle}>
          <h3>Zoom Link : </h3>
          <h3>
            <a href={get(addMentor, 'sessionLink', '-')} target='_blank' rel='noopener noreferrer' >
              {get(addMentor, 'sessionLink') || '-'}
            </a>
          </h3>
        </div>
        <div style={divStyle}>
          <h3>Meeting ID : </h3>
          <h3>{get(addMentor, 'meetingId') || '-'}</h3>
        </div>
        <div style={divStyle}>
          <h3>Meeting Password : </h3>
          <h3>{get(addMentor, 'meetingPassword') || '-'}</h3>
        </div>
        <div style={divStyle}>
          <h3>Google Meet Link : </h3>
          <h3>
            <a href={get(addMentor, 'googleMeetLink', '-')} target='_blank' rel='noopener noreferrer' >
              {get(addMentor, 'googleMeetLink') || '-'}
            </a>
          </h3>
        </div>
      </div>
    )
  }

  fetchByAddedFilters = () => {
    const { verifiedUsers, currentRole, currentPage,
      verifiedAndBookedUser, sourceType, searchGrade } = this.state
    let usersFilter = ''
    let salesFilter = ''
    if (verifiedUsers) {
      if (currentRole === MENTEE) {
        usersFilter = '{ verificationStatus: verified }'
        salesFilter = '{client_some:{{ verificationStatus: verified }}'
      } else if (currentRole === PARENT) {
        usersFilter = '{ verificationStatus: verified }'
        salesFilter = ''
      }
    }
    // if (nuTomChecked) {
    //   if (currentRole === MENTEE) {
    //     usersFilter += '{ utmSource: "nuTom" }'
    //     salesFilter = '{client_some:{{ utmSource: "nuTom" }}'
    //   } else if (currentRole === PARENT) {
    //     usersFilter += '{ utmSource: "nuTom" }'
    //     salesFilter = ''
    //   }
    // }
    const getSourceFilter = (source) => {
      if (source) {
        if (source === 'school') return '{ source: school }'
        else if (source === 'website') return '{source_not: school }'
      }
      return ''
    }
    if (currentRole === PARENT) {
      usersFilter = `{
            parentProfile_some: {
              children_some: { user_some: { and: [ ${usersFilter} ${getSourceFilter(sourceType)} ] } }
            }
          }`
    }
    this.setState({
      filterQuery: {
        usersFilter,
        salesFilter
      }
    }, () => getRoleBasedUserAndCount(
      getDataFromLocalStorage('login.id'),
      getDataFromLocalStorage('login.role'),
      {
        role: currentRole,
        page: currentPage,
        perPage: this.state.perPageQueries,
        filterQuery: this.state.filterQuery,
        country: this.state.country,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        verifiedAndBookedUser,
        sourceType,
        searchGrade
      }
    ))
  }
  onCheckBookedSession = (event) => {
    const { name, checked, } = event.target
    this.setState({
      [name]: checked,
      loading: true
    }, this.fetchByAddedFilters)
  }
  fetchOnSpinClick = async () => {
    this.setState({
      spinLoading: true
    })
    await getRoleBasedUserAndCount(
      getDataFromLocalStorage('login.id'),
      getDataFromLocalStorage('login.role'),
      {
        role: this.state.currentRole,
        page: this.state.currentPage,
        perPage: this.state.perPageQueries,
        filterQuery: this.state.filterQuery,
        country: this.state.country,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        verifiedAndBookedUser: this.state.verifiedAndBookedUser,
        sourceType: this.state.sourceType,
        searchGrade: this.state.searchGrade
      }
    )
    this.setState({
      spinLoading: false
    })
  }
  renderSearchInput = () => {
    const { searchKey, searchValue, currentRole,
      verifiedAndBookedUser, verifiedUsers,
      utmSearchKey } = this.state
    if (searchKey !== 'All') {
      if (searchKey === 'phoneVerified') {
        return (
          <RadioGroup
            name='phoneVerified'
            buttonStyle='solid'
            style={{ display: 'flex', margin: '0 5px' }}
            value={searchValue}
            onChange={this.handleSeachValueChange}
          >
            <MainModal.StyledRadio value='Yes'>Yes</MainModal.StyledRadio>
            <MainModal.StyledRadio value='No'>No</MainModal.StyledRadio>
          </RadioGroup>
        )
      } else if (searchKey === 'verificationStatus') {
        return (
          <RadioGroup
            name='verificationStatus'
            buttonStyle='solid'
            style={{ display: 'flex', margin: '0 5px' }}
            value={searchValue}
            onChange={this.handleSeachValueChange}
          >
            <MainModal.StyledRadio value='verified'>Verified</MainModal.StyledRadio>
            <MainModal.StyledRadio value='notQualified'>Not Qualified</MainModal.StyledRadio>
            <MainModal.StyledRadio value='unverified'>Unverified</MainModal.StyledRadio>
          </RadioGroup>
        )
      } else if (searchKey === 'UTM Parameter') {
        return (
          <div>
            <Select
              value={utmSearchKey}
              onChange={(value) => this.setState({
                utmSearchKey: value,
                searchValue: ''
              })}
              style={{ width: 200, marginRight: '10px' }}
            >
              {
                ['utmTerm', 'utmSource', 'utmMedium', 'utmContent', 'utmCampaign'].map(option => (
                  <Select.Option
                    key={option}
                    value={option}
                  >{option}
                  </Select.Option>
                ))
              }
            </Select>
            {
              utmSearchKey && (
                <Input
                  value={searchValue}
                  style={{ width: '200px' }}
                  onChange={this.handleSeachValueChange}
                  placeholder={`Type ${utmSearchKey}`}
                  onPressEnter={this.handleSearchButton}
                />
              )
            }
          </div>
        )
      }
      return (
        <Input
          value={searchValue}
          style={{ width: '200px' }}
          onChange={this.handleSeachValueChange}
          placeholder={`Type ${searchKey}`}
          onPressEnter={this.handleSearchButton}
        />
      )
    } else if (currentRole === MENTEE || currentRole === PARENT) {
      return (
        <div>
          <UmsDashboardStyle.FilterCheckBox
            name='verifiedUsers'
            checked={verifiedUsers}
            onChange={this.onCheckBookedSession}
          >
            <UmsDashboardStyle.FilterBox>
              <span>Verified User</span>
            </UmsDashboardStyle.FilterBox>
          </UmsDashboardStyle.FilterCheckBox>
          <UmsDashboardStyle.FilterCheckBox
            name='verifiedAndBookedUser'
            checked={verifiedAndBookedUser}
            onChange={this.onCheckBookedSession}
          >
            <UmsDashboardStyle.FilterBox>
              <span>Verified & Booked Users</span>
            </UmsDashboardStyle.FilterBox>
          </UmsDashboardStyle.FilterCheckBox>
          {/* <UmsDashboardStyle.FilterCheckBox
            name='nuTomChecked'
            checked={nuTomChecked}
            onChange={this.onCheckBookedSession}
          >
            <UmsDashboardStyle.FilterBox>
              <span>NuTom Source</span>
            </UmsDashboardStyle.FilterBox>
          </UmsDashboardStyle.FilterCheckBox> */}
        </div>
      )
    }
    return <div />
  }

  gradeNumber = (grade) => grade.replace('Grade', '')
  render() {
    const { fetchingUser, usersCount, fetchStatusOfUserInvites } = this.props
    const {
      columns,
      tableData,
      tableObj,
      currentRole,
      visible,
      filterOptions,
      searchKey,
      searchValue,
      actionType,
      courses,
      fromDate,
      toDate,
      perPageQueries,
      currentPage,
      loading,
      showAssignmentModal,
      addMentee,
      referralVisible,
      addCourseModalVisisble,
      addUserCourseData,
      spinLoading,
      searchGrade
    } = this.state
    const { Option } = Select
    const { UMSTable } = UmsDashboardStyle
    const savedRole = getDataFromLocalStorage('login.role')
    const totalInvitesCount =
      get(this.props, 'userInvites') &&
      get(this.props, 'userInvites').toJS() &&
      get(get(this.props, 'userInvites').toJS(), 'count')
    const loadingUser = fetchingUser && get(fetchingUser.toJS(), `user/${this.state.country}.loading`)
    const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
    const { userCourseAddStatus, userCourseUpdateStatus } = this.props
    let filterOptionsArray = [...filterOptions]
    if (currentRole === MENTEE) {
      filterOptionsArray = [...filterOptions, 'Parent Name', 'verificationStatus', 'UTM Parameter']
    } else if (currentRole === PARENT) {
      filterOptionsArray = [...filterOptions, 'UTM Parameter']
    }
    return (
      <Fragment>
        <div
          style={{
            marginBottom: 15,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Select
            value={this.state.currentRole}
            style={{ width: 200 }}
            onChange={this.handleRoleChange}
          >
            {
              savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN ? (
                [PARENT, MENTEE].map(role => (
                  <Option value={role} label={role.toUpperCase()}>
                    {role.toUpperCase()}
                  </Option>
                ))
              ) : (
                this.state.roles.map(role => (
                  <Option value={role} label={role.toUpperCase()}>
                    {role.toUpperCase()}
                  </Option>
                ))
              )
            }
          </Select>
          {/* Filters */}
          <Select style={{ width: 200 }} defaultValue='All' onChange={this.handleFilterKeyChange} value={this.state.searchKey}>
            <Option value='All' label='All'>
              All
            </Option>
            {filterOptionsArray.map(option => (
              <Option value={option} label={option.toUpperCase()}>
                {option}
              </Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            value={[fromDate, toDate]}
            format='DD/MM/YYYY'
            onCalendarChange={this.handleDateChange}
          />
          <div>
            {this.state.dateRanges.map(range =>
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
            )}
          </div>
          {/* Filters end */}
          {currentRole !== AFFILIATE && (
            <Button onClick={() => this.showModal('ADD')} type='primary'>
              ADD {currentRole.toUpperCase()}
            </Button>
          )}
        </div>
        {/* <div style={{ display: 'flex', margin: '0 5px', justifyContent: 'center' }}>
          <Button
            type={sourceType === 'school' ? 'primary' : 'default'}
            onClick={() => this.handleSourceTypeChange('school')}
          >
          School
          </Button>
          <Button
            type={sourceType === 'website' ? 'primary' : 'default'}
            onClick={() => this.handleSourceTypeChange('website')}
          >
          Website
          </Button>
        </div> */}

        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <p>User Count: {get(this.props, 'usersCount') || 0}</p>
          {usersCount > perPageQueries && (
            <Pagination
              total={usersCount}
              onChange={this.onPageChange}
              current={currentPage}
              pageSize={perPageQueries}
            />
          )}
          <Select
            style={{ width: 200 }}
            onChange={this.handlePageSizeChange}
            value={perPageQueries}
          >
            {[50, 100, 150].map(size => (
              <Option value={size} key={size}>
                {size}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {this.renderSearchInput()}
            <div style={{ marginLeft: '10px' }}>
              <Tooltip title='Refresh'>
                <SyncOutlined
                  style={{ fontSize: '25px' }}
                  onClick={spinLoading || loadingUser ? null : this.fetchOnSpinClick}
                  spin={spinLoading}
                />
              </Tooltip>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', marginRight: 10 }}>
              Search Grade
              <Select
                label='Minimum Grade'
                placeholder='Minimum Grade'
                name='minGrade'
                value={searchGrade}
                onChange={(value) => this.setState({
                  searchGrade: value
                }, () => {
                  getRoleBasedUserAndCount(
                    getDataFromLocalStorage('login.id'),
                    getDataFromLocalStorage('login.role'),
                    {
                      role: this.state.currentRole,
                      page: this.state.currentPage,
                      perPage: this.state.perPageQueries,
                      filterQuery: this.state.filterQuery,
                      country: this.state.country,
                      fromDate: this.state.fromDate,
                      toDate: this.state.toDate,
                      verifiedAndBookedUser: this.state.verifiedAndBookedUser,
                      sourceType: this.state.sourceType,
                      searchGrade: this.state.searchGrade
                    }
                  )
                })}
                style={{ width: '50%', margin: '0 10px' }}
              >
                {['All', ...getGrades()].map(grade =>
                  <Select.Option
                    value={this.gradeNumber(grade)}
                    key={this.gradeNumber(grade)}
                  >
                    {this.gradeNumber(grade)}
                  </Select.Option>
              )
            }
              </Select>
            </div>
            {
            isAdmin && (
              <Button type='primary' disabled={tableData.length === 0}>
                <CSVLink
                  headers={this.getCSVHeader()}
                  data={tableData}
                  filename={`${currentRole}_users.csv`}
                >
                  <DownloadOutlined /> {'Download User\'s Data'}
                </CSVLink>
              </Button>
            )
          }
          </div>
        </div>
        {currentRole === MENTEE || currentRole === PARENT ? (
          <UMSTable
            dataSource={
              tableObj &&
              Object.keys(tableObj).sort(
                (a, b) => moment(a, 'DD-MM-YYYY').diff(moment(b, 'DD-MM-YYYY')) * -1
              )
            }
            columns={this.state.columns}
            loading={loading && loadingUser}
            bordered
            scroll={{ x: 1300 }}
            pagination={false}
            defaultExpandAllRows={!false}
            expandIconAsCell={false}
            expandedRowRender={this.expandedRow}
            rowKey={record => record}
            expandedRowKeys={tableObj ? Object.keys(tableObj) : []}
            expandIcon={null}
          />
        ) : (
          <UMSTable
            dataSource={tableData}
            columns={columns}
            loading={loadingUser}
            bordered
            scroll={{ x: 1200 }}
            pagination={false}
          />
        )}
        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
          {usersCount > perPageQueries && (
            <Pagination
              total={usersCount}
              onChange={this.onPageChange}
              current={currentPage}
              pageSize={perPageQueries}
            />
          )}
        </div>
        {/* Add Mentor Modal */}
        <Modal
          title={
            currentRole !== AFFILIATE ? `${actionType === 'VIEW_MENTOR' ? 'View Mentor Profile' : `${actionType} User`}` : get(this.state, 'invitedByName')
          }
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => this.handleCancel(true)}
          footer={
            currentRole !== AFFILIATE && actionType !== 'VIEW_MENTOR'
              ? [
                <Button key='cancel' onClick={() => this.handleCancel(true)}>
                  Cancel
                </Button>,
                <Button
                  key='save'
                  type='primary'
                  loading={
                    get(this.props, 'addingUser') ||
                    get(this.props, 'updatingUser') ||
                    get(this.props, 'deleteUserStatus.user.loading')
                  }
                  onClick={this.handleOk}
                >
                  {this.getSaveButtonText()}
                </Button>
              ]
              : null
          }
          width={currentRole !== AFFILIATE ? 600 : 1000}
        >
          {(actionType === 'ADD' || actionType === 'EDIT') && this.renderForm()}
          {actionType === 'VIEW' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridGap: 15
              }}
            >
              {/* Filters */}
              <div style={{ display: 'flex' }}>
                <Select
                  style={{ width: 200 }}
                  defaultValue='All'
                  onChange={this.handleUserInvitesFilterKeyChange}
                >
                  <Option value='All' label='All'>
                    All
                  </Option>
                  {[...filterOptions, 'Parent Name'].map(option => (
                    <Option value={option} label={option.toUpperCase()}>
                      {option}
                    </Option>
                  ))}
                </Select>
                {searchKey !== 'All' && (
                  <Input
                    value={searchValue}
                    onChange={this.handleSeachValueChange}
                    placeholder={`Type ${searchKey}`}
                    onPressEnter={this.handleUserInvitesSearchButton}
                    style={{
                      width: 300
                    }}
                  />
                )}
              </div>
              {/* Filters end */}
              <UMSTable
                dataSource={this.state.userInvitesTableData}
                columns={this.state.userInvitesColumn}
                loading={
                  fetchStatusOfUserInvites && get(fetchStatusOfUserInvites.toJS(), 'loading')
                }
                bordered
                scroll={{ x: 600, y: 600 }}
                pagination={false}
              />
              <Pagination
                total={get(totalInvitesCount, 'count')}
                onChange={this.onUserInvitesPageChange}
                current={this.state.userInvitesCurrentPage}
                defaultPageSize={this.state.userInvitesPerPage}
              />
            </div>
          )}
          {actionType === 'VIEW_MENTOR' && this.renderMentorProfile()}
        </Modal>
        {/* booking add/edit/delete modal */}
        <SessionModal
          id='Session Modal'
          title={this.state.editingSession || this.state.editingCompletedSession ? 'Update Session' : 'Book Session'}
          visible={this.state.sessionModalVisible}
          closeSessionModal={this.closeSessionModal}
          mentors={this.props.mentors ? this.props.mentors.toJS() : []}
          notification={this.props.notification}
          sessions={this.props.menteeSessions && this.props.menteeSessions.toJS()}
          editingSession={this.state.editingSession}
          editingCompletedSession={this.state.editingCompletedSession}
          sessionToEdit={this.state.sessionToEdit}
          userRole={getDataFromLocalStorage('login.role')}
          userId={getDataFromLocalStorage('login.id')}
          path={get(this.props, 'match.path')}
          courses={sortBy(courses, 'order')}
          mentorSessionFetchStatus={this.props.mentorSessionFetchStatus}
          mentorSession={this.props.mentorSession}
          nextTopicIdToBook={this.state.nextTopicIdToBook}
          menteeId={this.state.menteeId}
          setSelectedMentorId={selectedMentorId => this.setState({ selectedMentorId })}
          setMenteeBookingInput={menteeBookingInput => this.setState({ menteeBookingInput })}
          showModalSaving={this.showModalSaving()}
          bookedMenteeSessionId={this.state.bookedMenteeSessionId}
          dateSelected={this.state.bookedSessionDate}
          bookedSessionTime={this.state.bookedSessionTime}
          changeSelectedDate={selectedDate => this.setState({ selectedDate })}
        />
        {/* view Referral Code modal */}
        <Modal
          title='Referral Code'
          visible={referralVisible}
          onCancel={() => this.handleReferralCancel()}
          footer={null}
        >
          {referralVisible && this.renderReferralCode()}
        </Modal>
        <AddUserCourseModal
          addCourseModalVisisble={addCourseModalVisisble}
          addUserCourseData={addUserCourseData}
          coursesList={courses}
          onModalClose={this.onCloseCourseModal}
          userCourseAddStatus={userCourseAddStatus && get(userCourseAddStatus.toJS(), 'loading')}
          userCourseUpdateStatus={userCourseUpdateStatus && get(userCourseUpdateStatus.toJS(), 'loading')}
        />
        {
          showAssignmentModal && (
            <AssignMentorModal
              visible={showAssignmentModal}
              menteeData={addMentee}
              courses={sortBy(courses, 'order')}
              onClose={this.onCloseAssignModal}
            />
          )
        }
      </Fragment>
    )
  }
}

export default UmsDashboard
