import React from 'react'
import { Spin, Checkbox, Radio, Select, notification } from 'antd'
import { get } from 'lodash'
import { LoadingOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import moment from 'moment'
import fetchMentorMenteeSession from '../../../actions/mentorSessions/fetchMentorMenteeSession'
import fetchSalesOperationData from '../../../actions/mentorSessions/fetchSalesOperationData'
import addSalesOperationData from '../../../actions/ums/addSalesOperationData'
import updateMentorMenteeSession from '../../../actions/mentorSessions/updateMentorMenteeSessions'
import deleteMentorMenteeSession from '../../../actions/mentorSessions/deleteMentorMenteeSession'
import updateMentorSession from '../../../actions/mentorSessions/updateMentorSession'
import addMentorSession from '../../../actions/mentorSessions/addMentorSessions'
import fetchMentorSessions from '../../../actions/mentorSessions/fetchMentorSessions'
import rescheduleSession from '../../../actions/mentorSessions/rescheduleUpdate'
import addMentorMenteeSession from '../../../actions/mentorSessions/addMentorMenteeSession'
import { loadStateFromLocalStorage } from '../../../utils/localStorage'
import updateSalesOperationData from '../../../actions/ums/updateSalesOperationData'
import requestToGraphql from '../../../utils/requestToGraphql'
import ClassFeedbackStyle from './ClassFeedback.style'
import Modal from '../components/Modal.styles'
import { ClockSVG, TypeSVG, RatioSVG } from '../../../constants/icons'
import { TekieAmethyst } from '../../../constants/colors'
import { getDuration } from '../../../utils/time'
import { getSlotTime } from '../utils'
import appConfig from '../../../config/appConfig'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import { MENTOR } from '../../../constants/roles'
import fetchSessionLogs from '../../../actions/mentorSessions/fetchSessionLogs'


const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: TekieAmethyst }} spin />
class MentorDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      demoCompleted: null,
      isFetching: true,
      showError: {},
      selectedStudentImpression: [],
      technicalIssue: [],
      studentImpressions: [
        { label: 'Already knows programming basics', key: 'knowCoding' },
        { label: 'Was looking for advance course', key: 'lookingForAdvanceCourse' },
        { label: 'Age not appropriate', key: 'ageNotAppropriate' },
        { label: 'Not relevant', key: 'notRelevantDifferentStream' },
        { label: 'No paying power', key: 'noPayingPower' },
        { label: 'Not interested in coding (just for sake)', key: 'notInterestedInCoding' },
        { label: 'Severe aptitude issues (struggling to learn, unfit)', key: 'learningAptitudeIssue' },
      ],
      reschedulingReasons: [
        { key: 'internetIssue', label: 'Slow/Unstable internet' },
        { key: 'zoomIssue', label: 'Zoom not installed' },
        { key: 'laptopIssue', label: 'No laptop - Joined over the phone' },
        { key: 'chromeIssue', label: 'Google chrome not installed' },
        { key: 'powerCut', label: 'Power Cut' },
        { key: 'notResponseAndDidNotTurnUp', label: "No response and didn't turn up" },
        { key: 'turnedUpButLeftAbruptly', label: 'Turned up but left abruptly' },
        { key: 'leadNotVerifiedProperly', label: 'Lead is not verified properly' },
        { key: 'otherReasonForReschedule', label: 'Other reasons' }
      ],
      classStatus: [
        {
          label: 'Was the demo class completed?',
          isRequired: true,
          key: 'demoCompleted',
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Did the student turn up?',
          isRequired: true,
          key: 'didNotTurnUpInSession',
          conditionalRender: [{
            key: 'demoCompleted',
            value: false
          }],
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Did the parent pick your phone call?',
          isRequired: true,
          // didNotPickTheCall
          key: 'notResponseAndDidNotTurnUp',
          conditionalRender: [{
            key: 'didNotTurnUpInSession',
            value: false
          }],
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Was the parent interested to reschedule?',
          isRequired: true,
          key: 'isSessionRescheduled',
          conditionalRender: [
            {
              key: 'didNotTurnUpInSession',
              value: true
            },
            {
              key: 'notResponseAndDidNotTurnUp',
              value: true
            },
          ],
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Did the parent share a reschedule time slot?',
          isRequired: true,
          key: 'rescheduledDateProvided',
          conditionalRender: [
            {
              key: 'isSessionRescheduled',
              value: true
            },
          ],
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Would you like to take this class?',
          isRequired: true,
          key: 'isMentorReadyToTakeClass',
          conditionalRender: [{
            key: 'rescheduledDateProvided',
            value: true
          }],
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
      ],
      challenges: [
        {
          label: 'Internet Issue',
          isRequired: true,
          key: 'internetIssue',
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Laptop not available',
          isRequired: true,
          key: 'laptopIssue',
          conditionalRender: [{
            key: 'demoCompleted',
            value: false
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Zoom not installed',
          isRequired: true,
          key: 'zoomIssue',
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Google Chrome not installed',
          isRequired: true,
          key: 'chromeIssue',
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Power Cut',
          isRequired: true,
          key: 'powerCut',
          conditionalRender: [{
            key: 'demoCompleted',
            value: false
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Technical Issue',
          isRequired: true,
          key: 'technicalIssue',
          values: [
            { toShow: 'Website Loading Issue', toSend: 'webSiteLoadingIssue' },
            { toShow: 'Video Not Loading', toSend: 'videoNotLoading' },
            { toShow: 'Code Playground Issue', toSend: 'codePlaygroundIssue' },
            { toShow: 'Log-In / OTP Error', toSend: 'logInOTPError' },
            { toShow: 'Other Reason', toSend: 'otherTechnicalReasonRadio' },
          ]
        },
        {
          label: 'Language Barrier (Student)',
          key: 'languageBarrier',
          conditionalRender: [{
            key: 'demoCompleted',
            value: false
          }],
          inputType: 'select',
          values: [
            { toShow: 'Hindi', toSend: 'hindi' },
            { toShow: 'Tamil', toSend: 'tamil' },
            { toShow: 'Telegu', toSend: 'telegu' },
            { toShow: 'Malayalam', toSend: 'malayalam' },
            { toShow: 'Kannada', toSend: 'kannada' },
            { toShow: 'Gujarati', toSend: 'gujarati' },
            { toShow: 'Bengali', toSend: 'bengali' },
            { toShow: 'Marathi', toSend: 'marathi' },
            { toShow: 'Other Language', toSend: 'otherLanguage' },
          ]
        },
        {
          label: 'Student Left Mid-Way',
          isRequired: true,
          key: 'studentLeftMidWay',
          conditionalRender: [{
            key: 'demoCompleted',
            value: false
          }],
          values: [
            { toShow: 'Left Abruptly', toSend: 'turnedUpButLeftAbruptly' },
            { toShow: 'Class Duration Exceeded (Other Commitments)', toSend: 'classDurationExceeded' },
          ]
        },
        {
          label: 'Other Challenges',
          isRequired: true,
          key: 'otherReasonForChallenges',
          inputType: 'textArea'
        },
      ],
      mentorPitch: [
        {
          label: 'Were the parent counseled?',
          key: 'parentCounsellingDone',
          isRequired: true,
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        // {
        //   label: 'Student’s batch preference*',
        //   isRequired: true,
        //   key: 'courseInterestedIn',
        //   values: [
        //     { toShow: '1:1', toSend: 'oneToOne' },
        //     { toShow: '1:2', toSend: 'oneToTwo' },
        //     { toShow: '1:3', toSend: 'oneToThree' }
        //   ]
        // },
        {
          label: 'Were the parents highly interested in the course?',
          key: 'leadStatus',
          values: [
            { toShow: 'Yes', toSend: 'hot' },
            { toShow: 'No', toSend: 'pipeline' },
          ]
        },
      ],
      studentPersona: [
        {
          label: 'Prodigy Student (Super-High Aptitude)',
          isRequired: true,
          key: 'prodigyChild',
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ]
        },
        {
          label: 'Learning Speed',
          isRequired: true,
          key: 'learningSpeed',
          values: [
            { toShow: 'Weak', toSend: 'weak' },
            { toShow: 'Slow', toSend: 'slow' },
            { toShow: 'Average', toSend: 'average' },
            { toShow: 'Fast', toSend: 'fast' }
          ]
        },
        {
          label: 'Personality',
          isRequired: true,
          key: 'personality',
          values: [
            { toShow: 'Extrovert', toSend: 'extrovert' },
            { toShow: 'Introvert', toSend: 'introvert' },
            { toShow: 'Ambivert', toSend: 'ambivert' }
          ]
        },
        {
          label: 'Student’s english proficiency',
          isRequired: true,
          key: 'studentEnglishSpeakingSkill',
          values: [
            { toShow: 'Poor', toSend: 'notFluent' },
            { toShow: 'Average', toSend: 'fluent' },
            { toShow: 'Excellent', toSend: 'veryFluent' },
          ]
        },
        {
          label: 'Parent’s english proficiency',
          key: 'parentEnglishSpeakingSkill',
          values: [
            { toShow: 'Poor', toSend: 'notFluent' },
            { toShow: 'Average', toSend: 'fluent' },
            { toShow: 'Excellent', toSend: 'veryFluent' },
          ]
        },
        {
          label: 'Course Purchase Ability',
          isRequired: true,
          key: 'payingPower',
          values: [
            { toShow: 'Low', toSend: 'no' },
            { toShow: 'Medium', toSend: 'average' },
            { toShow: 'High', toSend: 'yes' },
          ]
        },
        {
          label: 'Already knew programming basics',
          key: 'knowCoding',
          inputType: 'checkbox',
          conditionalRender: [{
            key: 'demoCompleted',
            value: true
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Was looking for an advance course',
          key: 'lookingForAdvanceCourse',
          inputType: 'checkbox',
          conditionalRender: [{
            key: 'demoCompleted',
            value: true
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Overage (above Grade 12)',
          key: 'ageNotAppropriate',
          inputType: 'checkbox',
          conditionalRender: [{
            key: 'demoCompleted',
            value: true
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
        {
          label: 'Not interested in coding(booked just for sake)',
          key: 'notInterestedInCoding',
          inputType: 'checkbox',
          conditionalRender: [{
            key: 'demoCompleted',
            value: true
          }],
          values: [
            { toShow: 'Yes', toSend: true },
          ]
        },
      ],
    }
    this.targetScrollContainer = React.createRef()
  }

  async componentDidMount() {
    const { sessionId } = this.props.match.params
    let session = null
    let isSessionFromLog = false
    let salesOperationData = null
    if (this.props.location.search.includes('logs')) {
      isSessionFromLog = true
      await fetchSessionLogs(null, `{id: "${sessionId}"}`).then(async res => {
        if (res && res.sessionLogs && res.sessionLogs.length) {
          /* eslint-disable prefer-destructuring */
          session = {
            ...res.sessionLogs[0],
            menteeSessionData: {
              ...res.sessionLogs[0],
              sessionType: 'trial',
              userData: res.sessionLogs[0] && res.sessionLogs[0].client,
              bookingDate: res.sessionLogs[0] && res.sessionLogs[0].sessionDate
            },
            mentorSessionData: {
              sessionType: 'trial',
            }
          }
          if (get(session, 'hasRescheduled', false) && get(session, 'rescheduledDateProvided', false) && get(session, 'salesOperation')) {
            salesOperationData = get(session, 'salesOperation')
          } else {
            await fetchSalesOperationData(`{ and: [{ client_some: { id: "${get(session, 'client.id')}" } }, 
            { course_some: { id: "${get(session, 'course.id')}" } }] }`)
            if (this.props.salesOperation && this.props.salesOperation.toJS()) {
              salesOperationData = this.props.salesOperation && this.props.salesOperation.toJS()[0]
            }
          }
        }
      })
    } else {
      await fetchMentorMenteeSession(sessionId)
      session = this.props.mentorMenteeSession && this.props.mentorMenteeSession.toJS()
      // salesOperationData = get(session, 'salesOperationData')
      await fetchSalesOperationData(`{ and: [{ client_some: { id: "${get(session, 'menteeSessionData.userData.id')}" } }, 
        { course_some: { id: "${get(session, 'course.id')}" } }] }`).then(res => {
        if (res && res.salesOperations && res.salesOperations.length) {
          salesOperationData = res.salesOperations[0] || null
        }
      })
    }
    this.setDefaultValues(session, salesOperationData, isSessionFromLog)
    this.setState({
      isFetching: false,
      session,
      salesOperationData,
    })
  }

  componentDidUpdate(prevProps) {
    const updateMentorSessionStatus = this.props.updateMenteeStatus
      && this.props.updateMenteeStatus.toJS()
    const prevUpdateMentorSessionStatus = prevProps.updateMenteeStatus
      && prevProps.updateMenteeStatus.toJS()

    if (get(updateMentorSessionStatus, 'failure')
      && !get(prevUpdateMentorSessionStatus, 'failure')) {
      const failureMessage = this.props.mentorSessionsUpdateFailure
        && this.props.mentorSessionsUpdateFailure.toJS()
      const error = get(get(failureMessage[0], 'error.errors[0]'), 'extensions.exception.name')
      if (error === 'SlotsOccupiedError') {
        notification.error({
          message: 'Slots Already Occupied!'
        })
      } else {
        const errorObj = get(get(failureMessage[0], 'error.errors[0]'), 'message')
        notification.error({
          message: errorObj
        })
      }
    }
  }

  setDefaultValues = (session, salesOperationData, isSessionFromLog = false) => {
    const { studentImpressions, reschedulingReasons, mentorPitch,
      studentPersona, challenges } = this.state
    const savedState = loadStateFromLocalStorage()
    let {
      sessionCommentByMentor
    } = this.state
    if (get(session, 'isFeedbackSubmitted', false)) {
      this.setState({
        readOnly: (isSessionFromLog || get(savedState, 'login.role') === MENTOR)
      })
    }
    if (salesOperationData) {
      const isSessionRescheduled =
        get(session, 'hasRescheduled') === null ? false : get(session, 'hasRescheduled')
      const rescheduledDateProvided =
        get(session, 'rescheduledDateProvided') === null ? false : get(session, 'rescheduledDateProvided')
      const demoCompleted =
        get(session, 'sessionNotConducted') === null ? null : !get(session, 'sessionNotConducted')
      let notResponseAndDidNotTurnUp = null
      let didNotTurnUpInSession = null
      if (demoCompleted === false) {
        notResponseAndDidNotTurnUp = !get(session, 'didNotPickTheCall', true)
        didNotTurnUpInSession = !get(session, 'didNotTurnUpInSession', true)
      }
      let selectedRescheduledDate = null
      let isMentorReadyToTakeClass = null
      if (get(session, 'rescheduledDate', null)) {
        selectedRescheduledDate = moment(get(session, 'rescheduledDate'))
      }
      isMentorReadyToTakeClass = get(salesOperationData, 'isMentorReadyToTakeClass', null)

      const reasonsForReschedule = []
      reschedulingReasons.forEach(item => {
        if (salesOperationData[item.key]) {
          reasonsForReschedule.push(item.key)
        }
      })
      sessionCommentByMentor = get(session, 'sessionCommentByMentor')
      // ---------- //
      const prodigyChild = salesOperationData.prodigyChild ? salesOperationData.prodigyChild : false
      const selectedStudentImpression = []
      studentImpressions.forEach(item => {
        if (salesOperationData[item.key]) {
          selectedStudentImpression.push(item.key)
        }
      })
      let courseInterestedIn = ''
      const defaultValue = {}
      if (get(session, 'isFeedbackSubmitted', false)) {
        mentorPitch.forEach(item => {
          if (item.key === 'courseInterestedIn') {
            item.values.forEach(value => {
              if (salesOperationData[value.toSend]) {
                courseInterestedIn = value.toSend
              }
            })
          } else {
            defaultValue[item.key] = salesOperationData[item.key]
          }
        })
        studentPersona.forEach(item => {
          defaultValue[item.key] = salesOperationData[item.key]
        })
      }
      const technicalIssue = []
      const studentLeftMidWay = []
      challenges.forEach(item => {
        if (['technicalIssue'].includes(item.key)) {
          item.values.forEach(el => {
            if (session[el.toSend]) {
              technicalIssue.push(el.toSend)
            }
          })
        } else if (['studentLeftMidWay'].includes(item.key)) {
          item.values.forEach(el => {
            if (session[el.toSend]) {
              studentLeftMidWay.push(el.toSend)
            }
          })
        } else if (item.key === 'otherReasonForChallenges') {
          defaultValue[item.key] = session[item.key]
        } else {
          defaultValue[item.key] = [session[item.key]]
        }
      })
      if (session.otherTechnicalReason) {
        defaultValue.otherTechnicalReason = session.otherTechnicalReason
        technicalIssue.push('otherTechnicalReasonRadio')
      }
      if (get(session, 'languageBarrier')) {
        defaultValue.languageBarrier = get(session, 'languageBarrier')
      }
      if (get(session, 'otherLanguageBarrier')) {
        defaultValue.otherLanguageBarrier = get(session, 'otherLanguageBarrier')
        defaultValue.languageBarrier = 'otherLanguage'
      }
      this.setState({
        isSessionRescheduled,
        prodigyChild,
        selectedStudentImpression,
        reasonsForReschedule,
        courseInterestedIn,
        sessionCommentByMentor,
        rescheduledDateProvided,
        demoCompleted,
        notResponseAndDidNotTurnUp,
        didNotTurnUpInSession,
        studentLeftMidWay,
        technicalIssue,
        selectedRescheduledDate,
        isMentorReadyToTakeClass,
        ...defaultValue,
        isSessionFromLog
      })
    }
  }

  checkIfFieldValueNotExists = (value) => {
    if (value === ''
      || value === null
      || value === undefined) {
      return true
    }
    return false
  }

  validateFields = () => {
    const {
      studentPersona,
      notResponseAndDidNotTurnUp,
      isSessionRescheduled,
      demoCompleted,
      rescheduledDateProvided,
      didNotTurnUpInSession,
      selectedRescheduledDate,
      isMentorReadyToTakeClass,
      challenges,
      technicalIssue,
      studentLeftMidWay,
      mentorPitch
    } = this.state
    const showError = {}
    if (!demoCompleted) {
      if (this.checkIfFieldValueNotExists(didNotTurnUpInSession)) {
        this.setState({
          showError: { didNotTurnUpInSession: true }
        })
        return true
      }
      if (notResponseAndDidNotTurnUp === true || didNotTurnUpInSession === true) {
        if (this.checkIfFieldValueNotExists(isSessionRescheduled)) {
          this.setState({
            showError: { isSessionRescheduled: true }
          })
          return true
        }
        if (isSessionRescheduled === true) {
          if (this.checkIfFieldValueNotExists(rescheduledDateProvided)) {
            this.setState({
              showError: { rescheduledDateProvided: true }
            })
            return true
          }
          if (rescheduledDateProvided === true) {
            if (this.checkIfFieldValueNotExists(selectedRescheduledDate)) {
              this.setState({
                showError: { rescheduledDateProvided: true }
              })
              return true
            }
            if (this.checkIfFieldValueNotExists(isMentorReadyToTakeClass)) {
              this.setState({
                showError: { isMentorReadyToTakeClass: true }
              })
              return true
            }
          }
        }
      }
    }
    if ((this.state.demoCompleted === false &&
      (this.state.didNotTurnUpInSession
        || this.state.notResponseAndDidNotTurnUp))
    ) {
      showError.challengesError = true
      challenges.forEach(item => {
        if (item.key === 'technicalIssue') {
          if (technicalIssue && technicalIssue.length) {
            delete showError.challengesError
          }
        } else if (item.key === 'studentLeftMidWay' && !demoCompleted) {
          if (studentLeftMidWay && studentLeftMidWay.length) {
            delete showError.challengesError
          }
        } else if (item.key === 'otherReasonForChallenges') {
          if (!this.checkIfFieldValueNotExists(this.state.otherReasonForChallenges)) {
            delete showError.challengesError
          }
        }
        if (this.state[item.key]
          && this.state[item.key].length
          && !['technicalIssue', 'studentLeftMidWay', 'otherReasonForChallenges'].includes(item.key)) {
          delete showError.challengesError
        }
      })
    }
    if (this.state.demoCompleted === true) {
      studentPersona.forEach(persona => {
        if (persona.isRequired) {
          if (this.checkIfFieldValueNotExists(this.state[persona.key])) {
            showError[persona.key] = true
          }
        }
      })
    }
    if (this.state.demoCompleted === true
      || (this.state.demoCompleted === false && this.state.notResponseAndDidNotTurnUp)) {
      mentorPitch.forEach(pitch => {
        if (pitch.isRequired) {
          if (this.checkIfFieldValueNotExists(this.state[pitch.key])) {
            showError[pitch.key] = true
          }
        }
      })
    }
    if (this.checkIfFieldValueNotExists(this.state.sessionCommentByMentor)) {
      showError.sessionCommentByMentor = true
    }
    if (Object.keys(showError).length > 0) {
      this.setState({
        showError
      })
      if (this.targetScrollContainer && this.targetScrollContainer.current) {
        this.targetScrollContainer.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'start'
        })
      }
      return true
    }
    return false
  }

  navigateBack = (isFeedbackSubmitted = false) => {
    const { mentorId } = this.props.match.params
    const { state } = this.props.history.location
    if (mentorId) {
      this.props.history.push({
        pathname: `/mentorDashboard/${mentorId}`,
        state: {
          ...state,
          isFeedbackSubmitted,
          hasRescheduled: get(this.state, 'rescheduledDateProvided', false),
        }
      })
    } else {
      this.props.history.push({
        pathname: '/mentorDashboard',
        state: {
          ...state,
          isFeedbackSubmitted,
          hasRescheduled: get(this.state, 'rescheduledDateProvided', false),
        }
      })
    }
  }

  onSave = async () => {
    const session = this.props.mentorMenteeSession && this.props.mentorMenteeSession.toJS()
    const salesOperationData = get(this.state, 'salesOperationData')
    const actionType = get(salesOperationData, 'id') ? 'EDIT' : 'ADD'
    const topic = get(session, 'topic')
    const userIdToEdit = get(session, 'menteeSessionData.userData.id')
    const savedState = loadStateFromLocalStorage()
    const savedId = get(savedState, 'login.id')
    let input = {}
    const salesStatus = get(session, 'salesOperationData.userVerificationStatus')
    const userResponseStatus = get(session, 'salesOperationData.userResponseStatus')
    const err = await this.validateFields()
    if (err) {
      notification.error({
        message: 'Please fill in all the required fields.'
      })
    }
    if (!err) {
      this.setState({
        isLoading: true
      })
      const {
        challenges,
        mentorPitch,
        studentPersona,
        leadStatus,
        isSessionRescheduled,
        rescheduledDateProvided,
        demoCompleted,
        notResponseAndDidNotTurnUp,
        technicalIssue,
        studentLeftMidWay,
        isMentorReadyToTakeClass
      } = this.state
      let { sessionCommentByMentor, didNotTurnUpInSession } = this.state
      const sessionNotConducted = !demoCompleted
      let dataToBeSended = {}
      let reschedulingDataToBeSended = {}
      let didNotPickTheCall = false
      if (sessionNotConducted) {
        didNotTurnUpInSession = !didNotTurnUpInSession
        reschedulingDataToBeSended.didNotTurnUpInSession = didNotTurnUpInSession
        if (!notResponseAndDidNotTurnUp) {
          didNotPickTheCall = true
        }
      }
      sessionCommentByMentor = sessionCommentByMentor || ''
      if (sessionNotConducted && didNotTurnUpInSession && didNotPickTheCall) {
        reschedulingDataToBeSended.sessionCommentByMentor = sessionCommentByMentor
        reschedulingDataToBeSended.didNotPickTheCall = didNotPickTheCall
        dataToBeSended.leadStatus = 'unfit'
      } else {
        reschedulingDataToBeSended.sessionCommentByMentor = sessionCommentByMentor
        reschedulingDataToBeSended.hasRescheduled = isSessionRescheduled || false
        reschedulingDataToBeSended.rescheduledDateProvided = rescheduledDateProvided || false
        if (reschedulingDataToBeSended.rescheduledDateProvided) {
          reschedulingDataToBeSended.rescheduledDate = new Date(
            new Date(this.state.selectedRescheduledDate).setHours(0, 0, 0, 0)).toISOString()
        }
        challenges.forEach(item => {
          if (item.key === 'technicalIssue' && technicalIssue) {
            technicalIssue.forEach(el => {
              if (el === 'otherTechnicalReasonRadio') {
                reschedulingDataToBeSended.otherTechnicalReason = this.state.otherTechnicalReason
              } else {
                reschedulingDataToBeSended[el] = true
              }
            })
          } else if (item.key === 'studentLeftMidWay'
            && !demoCompleted && studentLeftMidWay) {
            studentLeftMidWay.forEach(el => {
              reschedulingDataToBeSended[el] = true
            })
          } else if (item.key === 'otherReasonForChallenges') {
            reschedulingDataToBeSended.otherReasonForChallenges =
              this.state.otherReasonForChallenges || ''
              /* eslint-disable prefer-destructuring */
          } else if (item.key === 'languageBarrier') {
            if (this.state.languageBarrier && this.state.languageBarrier.length) {
              if (this.state.languageBarrier.includes('otherLanguage')) {
                reschedulingDataToBeSended.otherLanguageBarrier = this.state.otherLanguageBarrier
              } else {
                reschedulingDataToBeSended.languageBarrier = this.state.languageBarrier[0]
              }
            }
          }
          if (this.state[item.key]
            && this.state[item.key].length
            && !['technicalIssue', 'studentLeftMidWay', 'otherReasonForChallenges', 'languageBarrier'].includes(item.key)) {
            reschedulingDataToBeSended[item.key] = this.state[item.key][0]
          }
        })
        mentorPitch.forEach(item => {
          if (item.key === 'leadStatus') {
            dataToBeSended[item.key] = leadStatus
          } else if (item.key !== 'courseInterestedIn' && this.state[item.key] !== null) {
            dataToBeSended[item.key] = this.state[item.key]
          }
        })
        studentPersona.forEach(item => {
          if (this.state[item.key] !== null) {
            dataToBeSended[item.key] = this.state[item.key]
          }
        })
        if (isMentorReadyToTakeClass !== null) {
          dataToBeSended.isMentorReadyToTakeClass = isMentorReadyToTakeClass
        }
        dataToBeSended.hasRescheduled = isSessionRescheduled || false
        dataToBeSended.rescheduledDateProvided = rescheduledDateProvided || false
      }
      if (topic.order === 1) {
        input = {
          ...dataToBeSended
        }
      } else {
        input = {
          userVerificationStatus: salesStatus,
          userResponseStatus
        }
      }
      dataToBeSended = Object.entries(dataToBeSended)
        .reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
      reschedulingDataToBeSended = Object.entries(reschedulingDataToBeSended)
        .reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
      if (topic.order !== 1) {
        input = {}
        await requestToGraphql(gql`
        query{
          salesOperations(
                filter: { and: [
                  { client_some: { id: "${userIdToEdit}" } },
                { course_some: { id: "${get(session, 'course.id')}" } }
              ] }
              ){
            id
          }}
        `).then(res => {
          if (res.data.salesOperations.length > 0) {
            updateSalesOperationData(res.data.salesOperations[0].id, input)
          } else {
            addSalesOperationData(
              userIdToEdit,
              savedId,
              input,
              get(session, 'id'),
              get(session, 'mentorSessionData.userData.id'),
              get(session, 'course.id')
            )
          }
        })
      } else if (actionType === 'ADD') {
        const addInput = {
          leadStatus: get(dataToBeSended, 'leadStatus', 'pipeline'),
          sessionCommentByMentor,
          sessionNotConducted,
          didNotPickTheCall,
          ...reschedulingDataToBeSended,
          isFeedbackSubmitted: true
        }
        if (demoCompleted === true) {
          addInput.sessionStatus = 'completed'
        }
        await addSalesOperationData(
          userIdToEdit,
          savedId,
          input,
          get(session, 'id'),
          get(session, 'mentorSessionData.userData.id'),
          get(session, 'course.id')
        ).then(async () => {
          await updateMentorMenteeSession(get(session, 'id'), {
            ...addInput
          })
        })
      } else if (actionType === 'EDIT') {
        const editInput = {
          leadStatus: get(dataToBeSended, 'leadStatus', 'pipeline'),
          sessionCommentByMentor,
          sessionNotConducted,
          didNotPickTheCall,
          ...reschedulingDataToBeSended,
          isFeedbackSubmitted: true
        }
        if (demoCompleted === true) {
          editInput.sessionStatus = 'completed'
        }
        if (get(session, 'salesOperation.id')) {
          await updateSalesOperationData(salesOperationData.id, input).then(async () => {
            await updateMentorMenteeSession(get(session, 'id'), {
              ...editInput
            })
          })
        } else {
          await updateSalesOperationData(salesOperationData.id, input, get(session, 'id')).then(
            async () => {
              await updateMentorMenteeSession(get(session, 'id'), {
                ...editInput
              })
            }
          )
        }
      }
      if (isSessionRescheduled && rescheduledDateProvided && this.state.shouldReschedule) {
        await this.rescheduleSession()
      } else {
        if (demoCompleted === false) {
          await deleteMentorMenteeSession(get(session, 'id'))
        }
        this.setState({
          isLoading: false
        })
        this.navigateBack(true, true)
      }
    }
  }

  updateSessionsBasedOnType = async (mentorSessionRecord = null) => {
    const { selectedRescheduledDate, isMentorReadyToTakeClass } = this.state
    const session = this.props.mentorMenteeSession && this.props.mentorMenteeSession.toJS()
    const bookingDate = new Date(
      new Date(selectedRescheduledDate).setHours(0, 0, 0, 0)).toISOString()
    const slots = this.getSlotsFromTimeRange()
    for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
      if (!slots[`slot${i}`]) {
        slots[`slot${i}`] = false
      }
    }
    /** update MMS Session */
    await rescheduleSession(
      get(session, 'menteeSessionData.id', null),
      { bookingDate, ...slots }
    ).then(async (res) => {
      if (res && get(res, 'updateMenteeSession.id') && isMentorReadyToTakeClass) {
        await addMentorMenteeSession(
          get(session, 'menteeSessionData.id', null),
          get(mentorSessionRecord, 'id', null),
          '{sessionStatus: allotted}',
          get(session, 'topic.id'),
          get(session, 'course.id'),
          isMentorReadyToTakeClass
        )
      }
      this.navigateBack(true)
    })
    this.setState({
      isLoading: false
    })
  }

  getSlotsFromTimeRange = () => {
    const { startHour } = this.state.rescheduledTimeValue
    let endHour = startHour + 1
    endHour = endHour === 0 ? 24 : endHour
    const slots = {}
    for (let i = startHour; i < endHour; i += 1) {
      slots[`slot${i}`] = true
    }
    return slots
  }

  rescheduleSession = async () => {
    const { selectedRescheduledDate } = this.state
    const slots = await this.getSlotsFromTimeRange()
    const availabilityDate = new Date(
      new Date(selectedRescheduledDate).setHours(0, 0, 0, 0)).toISOString()
    const prevMentorSession = this.props.prevMentorSession && this.props.prevMentorSession.toJS()
    const session = this.props.mentorMenteeSession && this.props.mentorMenteeSession.toJS()
    const userId = get(session, 'mentorSessionData.userData.id')
    if (get(this.state, 'isMentorReadyToTakeClass') === false) {
      await this.updateSessionsBasedOnType()
      return true
    }
    if (prevMentorSession && prevMentorSession.length === 0) {
      /** Add Mentor Session */
      const input = {
        availabilityDate,
        sessionType: 'trial',
        ...slots,
      }
      await addMentorSession(input, userId, get(session, 'course.id')).then(async res => {
        /** Update Batch/MMS Session */
        if (res && res.addMentorSession && res.addMentorSession.id) {
          await this.updateSessionsBasedOnType(res.addMentorSession)
        }
      })
    } else if (prevMentorSession && prevMentorSession.length > 0) {
      /** Update Mentor Session  */
      const input = {
        availabilityDate,
        ...slots,
      }
      await updateMentorSession(input, get(prevMentorSession[0], 'id')).then(async res => {
        /** Update Batch/MMS Session */
        if (res && res.updateMentorSession && res.updateMentorSession.id) {
          await this.updateSessionsBasedOnType(
            res.updateMentorSession)
        }
      })
    }
  }

  renderClassDetails = ({ type, value, icon }) => (
    <ClassFeedbackStyle.ContentClassDetail>
      <ClassFeedbackStyle.Icon theme='twoTone'
        component={icon}
      />
      <span className='classDetailsText'>{type}</span>
      <ClassFeedbackStyle.Text>{ value }</ClassFeedbackStyle.Text>
    </ClassFeedbackStyle.ContentClassDetail>
  )

  evaluateRenderConditions = (conditionalRenderArr) => {
    if (conditionalRenderArr && conditionalRenderArr.length) {
      let shouldDisplay = false
      conditionalRenderArr.forEach(condition => {
        if (this.state[condition.key] === condition.value) {
          shouldDisplay = true
        }
      })
      return shouldDisplay
    }
    return true
  }

  renderRescheduleAction = () => (
    <ClassFeedbackStyle.FlexContainer style={{ flexDirection: 'row', width: 'fit-content', margin: '12px 0px' }}>
      <Modal.CustomTimePicker
        use12Hours
        format='hh a'
        allowClear={false}
        disabledHours={() => {
          if (new Date().setHours(0, 0, 0, 0)
            === new Date(this.state.selectedRescheduledDate).setHours(0, 0, 0, 0)) {
            return [...Array(new Date().getHours() + 1).keys()].slice(1)
          }
        }}
        disabled={this.state.readOnly}
        placeholder='Start'
        value={get(this.state, 'rescheduledTimeValue.rawValue')}
        onChange={(value) => {
          this.setState({
            rescheduledTimeValue: {
              rawValue: value,
              startHour: get(value, '_d').getHours()
            }
          })
        }}
      />
      <ClassFeedbackStyle.SecondaryText style={{ padding: '8px' }}>on</ClassFeedbackStyle.SecondaryText>
      <Modal.CustomDatePicker
        onChange={(value) => {
          this.setState({
            selectedRescheduledDate: value,
            shouldReschedule: true
          }, async () => {
            const session = this.props.mentorMenteeSession
              && this.props.mentorMenteeSession.toJS()
            const userId = get(session, 'mentorSessionData.userData.id')
            await fetchMentorSessions(getIdArrForQuery([userId]),
            `{availabilityDate: "${new Date(
              new Date(value).setHours(0, 0, 0, 0)
              ).toISOString()}"},{sessionType: trial},`, 'prevMentorSession')
          })
        }}
        disabled={this.props.isPrevMentorSessionsLoading
          || !this.state.rescheduledTimeValue
          || this.state.readOnly}
        placeholder='Start Date'
        allowClear={false}
        value={this.state.selectedRescheduledDate}
        disabledDate={(current) => current &&
          current < new Date().setDate((new Date().getDate()) - 1)
        }
        format='DD MMMM YYYY'
        style={{ width: 'fit-content' }}
      />
    </ClassFeedbackStyle.FlexContainer>
  )

  renderRequiredAsterisk = (isRequired) => {
    if (isRequired) {
      return (
        <ClassFeedbackStyle.RequiredAsterisk>
          *
        </ClassFeedbackStyle.RequiredAsterisk>
      )
    }
  }

  changeStudentPersonaRequired = () => {
    if (this.state.demoCompleted) {
      this.setState({
        studentPersona: this.state.studentPersona.map((persona) => {
          if (persona.isRequired !== undefined) {
            return { ...persona, isRequired: true }
          }
          return persona
        }),
        mentorPitch: this.state.mentorPitch.map((pitch) => {
          if (pitch.isRequired !== undefined) {
            return { ...pitch, isRequired: true }
          }
          return pitch
        }),
      })
    } else if (this.state.demoCompleted === false) {
      this.setState({
        studentPersona: this.state.studentPersona.map((persona) => {
          if (persona.isRequired !== undefined) {
            return { ...persona, isRequired: false }
          }
          return persona
        }),
        mentorPitch: this.state.mentorPitch.map((pitch) => {
          if (pitch.isRequired !== undefined) {
            return { ...pitch, isRequired: false }
          }
          return pitch
        }),
      })
    }
  }

  renderAboutClassStatus = () => (
    <>
      <ClassFeedbackStyle.FeedbackTitle>
        Class Status
      </ClassFeedbackStyle.FeedbackTitle>
      {this.state.classStatus.map((status, statusIndex) => (
        <>
          {this.evaluateRenderConditions(status.conditionalRender) && (
            <ClassFeedbackStyle.FeedbackContainer>
              <ClassFeedbackStyle.FeedbackLayout placement='left'>
                <ClassFeedbackStyle.FeedbackDescription>
                  {status.label}
                  {this.renderRequiredAsterisk(status.isRequired || false)}
                </ClassFeedbackStyle.FeedbackDescription>
              </ClassFeedbackStyle.FeedbackLayout>
              <ClassFeedbackStyle.FeedbackLayout>
                <Radio.Group
                  disabled={this.state.readOnly}
                  onChange={e => {
                    const updateObj = {}
                    this.state.classStatus.forEach((el, index) => {
                      if ((el.key !== status.key) && statusIndex < index) {
                        updateObj[el.key] = null
                      }
                    })
                    this.setState({
                      [status.key]: e.target.value,
                      ...updateObj,
                      showError: {
                        ...this.state.showError,
                        [status.key]: false
                      }
                    }, () => {
                      if (['didNotTurnUpInSession', 'demoCompleted'].includes(status.key)) {
                        this.changeStudentPersonaRequired()
                      }
                    })
                  }}
                  style={{ display: 'flex', flexDirection: 'row' }}
                  value={this.state[status.key]}
                >
                  {status.values.map(value => (
                    <ClassFeedbackStyle.FlexContainer style={{ width: 'fit-content', marginRight: '24px' }}>
                      <ClassFeedbackStyle.CustomRadio value={value.toSend}>
                        {value.toShow}
                      </ClassFeedbackStyle.CustomRadio>
                    </ClassFeedbackStyle.FlexContainer>
                  ))}
                </Radio.Group>
                {status.key === 'rescheduledDateProvided' && this.state.rescheduledDateProvided && (
                  this.renderRescheduleAction()
                )}
                {(this.state.showError && this.state.showError[status.key]) && (
                  <ClassFeedbackStyle.Error>Mandatory*</ClassFeedbackStyle.Error>
                )}
              </ClassFeedbackStyle.FeedbackLayout>
            </ClassFeedbackStyle.FeedbackContainer>
          )}
        </>
      ))}
    </>
  )

  renderClassChallenges = () => (
    <>
      <div ref={this.targetScrollContainer} />
      <ClassFeedbackStyle.FeedbackTitle>
        {this.state.demoCompleted ? 'Any Challenges' : 'Incomplete Reasons'}
        {!this.state.demoCompleted && (
          <ClassFeedbackStyle.FeedbackSubTitle
            style={{
              fontStyle: 'italic'
            }}
          >
            Please choose atleast one option from the below
          </ClassFeedbackStyle.FeedbackSubTitle>
        )}
      </ClassFeedbackStyle.FeedbackTitle>
      {this.state.challenges.map(challenge => (
        this.evaluateRenderConditions(challenge.conditionalRender) && (
          <ClassFeedbackStyle.FeedbackContainer>
            <ClassFeedbackStyle.FeedbackLayout placement='left'>
              <ClassFeedbackStyle.FeedbackDescription>
                {challenge.label}
              </ClassFeedbackStyle.FeedbackDescription>
            </ClassFeedbackStyle.FeedbackLayout>
            <ClassFeedbackStyle.FeedbackLayout>
              <ClassFeedbackStyle.FlexContainer style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                {(challenge.inputType && challenge.inputType === 'textArea') && (
                  <>
                    <ClassFeedbackStyle.CustomTextArea
                      allowClear
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      disabled={this.state.readOnly}
                      value={this.state[challenge.key]}
                      placeholder='Add response here'
                      onChange={(e) => {
                        this.setState({
                          [challenge.key]: e.target.value,
                          showError: {
                            ...this.state.showError,
                            challengesError: false
                          }
                        })
                      }}
                    />
                  </>
                )}
                {(challenge.inputType && challenge.inputType === 'select') && (
                  <>
                    <ClassFeedbackStyle.Select
                      placeholder='Choose one language'
                      style={{ minWidth: '300px', marginBottom: 12 }}
                      value={this.state.languageBarrier}
                      disabled={this.state.readOnly}
                      onChange={(values) => {
                        this.setState({
                          languageBarrier: [values],
                          showError: {
                            ...this.state.showError,
                            challengesError: false,
                          }
                        })
                      }}
                    >
                      {challenge.values && challenge.values.map(reason => (
                        <Select.Option key={reason.toSend} value={reason.toSend}>
                          {reason.toShow}
                        </Select.Option>
                      ))}
                    </ClassFeedbackStyle.Select>
                    {(this.state.languageBarrier
                      && this.state.languageBarrier.includes('otherLanguage')) && (
                      <ClassFeedbackStyle.CustomTextArea
                        allowClear
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        style={{ marginTop: 12 }}
                        disabled={this.state.readOnly}
                        value={this.state.otherLanguageBarrier}
                        placeholder='Add response here'
                        onChange={(e) => {
                          this.setState({
                            otherLanguageBarrier: e.target.value,
                            showError: {
                              ...this.state.showError,
                              otherLanguageBarrier: false
                            }
                          })
                        }}
                      />
                    )}
                  </>
                )}
                {!challenge.inputType && (
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={(selectedValue) => {
                        this.setState({
                          [challenge.key]: selectedValue,
                          showError: {
                            ...this.state.showError,
                            challengesError: false
                          }
                        })
                    }}
                    disabled={this.state.readOnly}
                    value={this.state[challenge.key]}
                  >
                    {challenge.values && challenge.values.map(challengOption => (
                      <>
                        <Modal.CustomCheckbox
                          value={challengOption.toSend}
                          style={{ width: 'fit-content', lineHeight: 1, padding: '0 0 18px 0px' }}
                        >
                          <ClassFeedbackStyle.CheckboxLabel>
                            {challengOption.toShow}
                          </ClassFeedbackStyle.CheckboxLabel>
                        </Modal.CustomCheckbox>
                        {challengOption.toSend === 'otherTechnicalReasonRadio' && (
                          <ClassFeedbackStyle.CustomTextArea
                            allowClear
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            disabled={this.state.readOnly
                              || (this.state.technicalIssue
                                && !this.state.technicalIssue.includes('otherTechnicalReasonRadio'))}
                            value={this.state.otherTechnicalReason}
                            placeholder='Add response here'
                            onChange={(e) => {
                              this.setState({
                                otherTechnicalReason: e.target.value,
                                showError: {
                                  ...this.state.showError,
                                  otherTechnicalReason: false
                                }
                              })
                            }}
                          />
                        )}
                      </>
                    ))}
                  </Checkbox.Group>
                )}
              </ClassFeedbackStyle.FlexContainer>
            </ClassFeedbackStyle.FeedbackLayout>
          </ClassFeedbackStyle.FeedbackContainer>
        )
      ))}
      {(this.state.showError && this.state.showError.challengesError) && (
        <ClassFeedbackStyle.Error>Please Select Atleast One Reason*</ClassFeedbackStyle.Error>
      )}
    </>
  )

  renderCounsellingSection = () => (
    <>
      <ClassFeedbackStyle.FeedbackTitle>
        Parent Counselling
      </ClassFeedbackStyle.FeedbackTitle>
      {this.state.mentorPitch.map(counselling => (
        <ClassFeedbackStyle.FeedbackContainer style={{ paddingBottom: '8px' }}>
          <ClassFeedbackStyle.FeedbackLayout placement='left'>
            <ClassFeedbackStyle.FeedbackDescription>
              {counselling.label}
              {this.renderRequiredAsterisk(counselling.isRequired || false)}
            </ClassFeedbackStyle.FeedbackDescription>
          </ClassFeedbackStyle.FeedbackLayout>
          <ClassFeedbackStyle.FeedbackLayout>
            <Radio.Group
              disabled={this.state.readOnly}
              onChange={e => {
                this.setState({
                  [counselling.key]: e.target.value,
                  showError: {
                    ...this.state.showError,
                    [counselling.key]: false
                  }
                })
              }}
              style={{ display: 'flex', flexDirection: 'row' }}
              value={this.state[counselling.key]}
            >
              {counselling.values.map(value => (
                <ClassFeedbackStyle.FlexContainer style={{ width: 'fit-content', marginRight: '24px' }}>
                  <ClassFeedbackStyle.CustomRadio value={value.toSend}>
                    {value.toShow}
                  </ClassFeedbackStyle.CustomRadio>
                </ClassFeedbackStyle.FlexContainer>
              ))}
            </Radio.Group>
            {(this.state.showError && this.state.showError[counselling.key]) && (
              <ClassFeedbackStyle.Error>Mandatory*</ClassFeedbackStyle.Error>
            )}
          </ClassFeedbackStyle.FeedbackLayout>
        </ClassFeedbackStyle.FeedbackContainer>
      ))}
    </>
  )

  renderStudentPersonaSection = () => (
    <>
      <ClassFeedbackStyle.FeedbackTitle>
        Student Persona
      </ClassFeedbackStyle.FeedbackTitle>
      {this.state.studentPersona.map(persona => (
        <>
          {this.evaluateRenderConditions(persona.conditionalRender) && (
            <ClassFeedbackStyle.FeedbackContainer style={{ paddingBottom: '8px' }}>
              <ClassFeedbackStyle.FeedbackLayout placement='left'>
                <ClassFeedbackStyle.FeedbackDescription>
                  {persona.label}
                  {this.renderRequiredAsterisk(persona.isRequired || false)}
                </ClassFeedbackStyle.FeedbackDescription>
              </ClassFeedbackStyle.FeedbackLayout>
              <ClassFeedbackStyle.FeedbackLayout>
                {(persona.inputType && persona.inputType === 'checkbox') ? (
                  <Checkbox.Group
                    disabled={this.state.readOnly}
                    onChange={(selectedValue) => {
                      this.setState({ [persona.key]: selectedValue[0] })
                    }}
                    value={[this.state[persona.key]]}
                  >
                    {persona.values && persona.values.map(personaOption => (
                      <Modal.CustomCheckbox
                        value={personaOption.toSend}
                        style={{ width: 'fit-content', lineHeight: 1, padding: '0 0 18px 0px' }}
                      >
                        <ClassFeedbackStyle.CheckboxLabel>
                          {personaOption.toShow}
                        </ClassFeedbackStyle.CheckboxLabel>
                      </Modal.CustomCheckbox>
                    ))}
                  </Checkbox.Group>
                ) : (
                  <Radio.Group
                    disabled={this.state.readOnly}
                    onChange={e => {
                      this.setState({
                        [persona.key]: e.target.value,
                        showError: {
                          ...this.state.showError,
                          [persona.key]: false
                        }
                      })
                    }}
                    style={{ display: 'flex', flexDirection: 'row' }}
                    value={this.state[persona.key]}
                  >
                    {persona.values.map(value => (
                      <ClassFeedbackStyle.FlexContainer style={{ width: 'fit-content', marginRight: '24px' }}>
                        <ClassFeedbackStyle.CustomRadio value={value.toSend}>
                          {value.toShow}
                        </ClassFeedbackStyle.CustomRadio>
                      </ClassFeedbackStyle.FlexContainer>
                    ))}
                  </Radio.Group>
                )}
                {(this.state.showError && this.state.showError[persona.key]) && (
                  <ClassFeedbackStyle.Error>
                    Fill this field before going further*
                  </ClassFeedbackStyle.Error>
                )}
              </ClassFeedbackStyle.FeedbackLayout>
            </ClassFeedbackStyle.FeedbackContainer>
          )}
        </>
      ))}
    </>
  )

  renderConcludeSection = () => (
    <>
      <ClassFeedbackStyle.FeedbackTitle>
        Conclude
      </ClassFeedbackStyle.FeedbackTitle>
      <ClassFeedbackStyle.FeedbackContainer style={{ paddingBottom: '28px' }}>
        <ClassFeedbackStyle.FeedbackLayout placement='left'>
          <ClassFeedbackStyle.FeedbackDescription>
            Comments / Suggestions
            {this.renderRequiredAsterisk(true)}
          </ClassFeedbackStyle.FeedbackDescription>
        </ClassFeedbackStyle.FeedbackLayout>
        <ClassFeedbackStyle.FeedbackLayout>
          <ClassFeedbackStyle.CustomTextArea
            allowClear
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ width: '100%', margin: '0px 16px 0px 0px' }}
            disabled={this.state.readOnly}
            value={this.state.sessionCommentByMentor}
            placeholder='Add response here'
            onChange={(e) => {
              this.setState({
                sessionCommentByMentor: e.target.value,
                showError: {
                  ...this.state.showError,
                  sessionCommentByMentor: false
                }
              })
            }}
          />
          {(this.state.showError && get(this.state, 'showError.sessionCommentByMentor')) && (
            <ClassFeedbackStyle.Error>
              Fill this field before going further*
            </ClassFeedbackStyle.Error>
          )}
        </ClassFeedbackStyle.FeedbackLayout>
      </ClassFeedbackStyle.FeedbackContainer>
    </>
  )

  renderFooter = () => (
    <ClassFeedbackStyle.FlexRow justifyContent='space-between' style={{ marginTop: 0 }}>
      <ClassFeedbackStyle.FooterText>
        {!this.state.readOnly && (
          'Please check the responses before submitting the feedback'
        )}
      </ClassFeedbackStyle.FooterText>
      <ClassFeedbackStyle.FlexRow justifyContent='flex-end' style={{ marginTop: 0, flexWrap: 'no-wrap', width: 'fit-content' }}>
        <Modal.SecondaryButton
          onClick={() => {
            this.navigateBack()
          }}
          disabled={this.state.isLoading}
          style={{ marginRight: '10px' }}
        >
          Cancel
        </Modal.SecondaryButton>
        <Modal.PrimaryButton
          disabled={this.state.readOnly}
          onClick={() => this.onSave()}
          loading={this.state.isLoading}
        >
          {this.state.isLoading &&
            <Modal.Spinner />}
          Submit Feedback
        </Modal.PrimaryButton>
      </ClassFeedbackStyle.FlexRow>
    </ClassFeedbackStyle.FlexRow>
  )

  getSessionType = (sessionType) => {
    if (sessionType === 'batch') {
      return 'PAID'
    }
    if (sessionType === 'trial') {
      return 'DEMO'
    }
    return sessionType
  }

  getClassDuration = (session) => {
    if (get(session, 'sessionStartDate') && get(session, 'sessionEndDate')) {
      return getDuration(get(session, 'sessionStartDate'), get(session, 'sessionEndDate'))
    }
    return moment(get(session, 'sessionStartDate')).format('DD MMM hh:mm A')
  }

  renderTopSessionBlock = (session) => (
    <ClassFeedbackStyle.FlexContainer style={{ justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
      <ClassFeedbackStyle.FlexContainer style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <ClassFeedbackStyle.HeaderTitle>Class Feedback</ClassFeedbackStyle.HeaderTitle>
        <ClassFeedbackStyle.HeaderDetailsContainer>
          <ClassFeedbackStyle.TopicThumbnail
            bgImage={get(session, 'topic.thumbnailSmall.uri')}
          />
          <ClassFeedbackStyle.HeaderDetails>
            <ClassFeedbackStyle.FlexContainer style={{ paddingBottom: '12px' }}>
              <ClassFeedbackStyle.HeaderSessionIndicator bgColor='#01AA93' />
              <ClassFeedbackStyle.PreHeaderText>
                B2C
              </ClassFeedbackStyle.PreHeaderText>
              <ClassFeedbackStyle.HeaderTag
                bgColor={get(session, 'mentorSessionData.sessionType') === 'trial' ? '#333333' : null}
              >
                {this.getSessionType(get(session, 'mentorSessionData.sessionType'))}
              </ClassFeedbackStyle.HeaderTag>
            </ClassFeedbackStyle.FlexContainer>
            <ClassFeedbackStyle.HeaderCourse>
              {get(session, 'course.title', '-')}
            </ClassFeedbackStyle.HeaderCourse>
            <ClassFeedbackStyle.HeaderTopic>
              {get(session, 'topic.title', '-')}
            </ClassFeedbackStyle.HeaderTopic>
            <ClassFeedbackStyle.HeaderDescription>
              <ClassFeedbackStyle.Icon theme='twoTone' component={ClockSVG} />
              {get(session, 'menteeSessionData') && (
                `${getSlotTime(get(session, 'menteeSessionData')).startTime}-${getSlotTime(get(session, 'menteeSessionData')).endTime}`
              )}
              {' '} &bull; {' '}
              {new Date(get(session, 'menteeSessionData.bookingDate')).toDateString()}
            </ClassFeedbackStyle.HeaderDescription>
          </ClassFeedbackStyle.HeaderDetails>
        </ClassFeedbackStyle.HeaderDetailsContainer>
      </ClassFeedbackStyle.FlexContainer>
      <ClassFeedbackStyle.FlexContainer style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <ClassFeedbackStyle.SummaryText>Class Summary</ClassFeedbackStyle.SummaryText>
        <div>
          {!this.state.isSessionFromLog && (
            this.renderClassDetails({
              type: 'Duration',
              value: this.getClassDuration(session),
              icon: ClockSVG
            })
          )}
          {this.renderClassDetails({ type: 'Students', value: get(session, 'menteeSessionData.userData.name'), icon: RatioSVG })}
          {this.renderClassDetails({ type: 'Type', value: 'Learning', icon: TypeSVG })}
        </div>
      </ClassFeedbackStyle.FlexContainer>
    </ClassFeedbackStyle.FlexContainer>
  )
  render() {
    // const session = this.props.mentorMenteeSession && this.props.mentorMenteeSession.toJS()
    const { session } = this.state
    return (
      <div>
        {this.state.isFetching ? (
          <>
            <div className='loading-container show'>
              <div className='loading-bar-container'>
                <div />
              </div>
            </div>
            <div className='mentor-dashboard-calender-loading-container'>
              <Spin indicator={loadingIcon} />
              <div className='mentor-dashboard-calender-loading'>Fetching Sessions...</div>
            </div>
          </>
        ) : (null)}
        {/* Session Details Block */}
        <ClassFeedbackStyle.Container>
          {this.renderTopSessionBlock(session)}
        </ClassFeedbackStyle.Container>
        {/* Class Status Block */}
        <ClassFeedbackStyle.Container>
          {this.renderAboutClassStatus()}
        </ClassFeedbackStyle.Container>
        {/* Class Challenges, Counselling, Persona and Conclude Block */}
        {this.state.demoCompleted !== null && (
          <ClassFeedbackStyle.Container>
            {((this.state.demoCompleted === true) ||
              (this.state.demoCompleted === false && this.state.didNotTurnUpInSession) ||
              (this.state.demoCompleted === false && this.state.notResponseAndDidNotTurnUp)
            ) && (
              <>
                {this.renderClassChallenges()}
                <ClassFeedbackStyle.Divider />
                {(this.state.demoCompleted === true
                  || (this.state.demoCompleted === false
                  && (this.state.notResponseAndDidNotTurnUp || this.state.didNotTurnUpInSession)
                  )) && (
                  <>
                    {this.renderCounsellingSection()}
                    <ClassFeedbackStyle.Divider />
                  </>
                )}
                {(this.state.demoCompleted === true || this.state.didNotTurnUpInSession) && (
                  <>
                    {this.renderStudentPersonaSection()}
                    <ClassFeedbackStyle.Divider />
                  </>
                )}
              </>
            )}
            {this.renderConcludeSection()}
            <ClassFeedbackStyle.Divider />
            {this.renderFooter()}
          </ClassFeedbackStyle.Container>
        )}
      </div>
    )
  }
}

export default MentorDashboard
