import React, { Component } from 'react'
import { Button, Form, DatePicker, Input, Checkbox, Select, Tooltip, Tag } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import moment from 'moment'
import MainModal from '../../../../components/MainModal'
import addSalesOperationData from '../../../../actions/ums/addSalesOperationData'
import updateMentorMenteeReschedule from '../../../../actions/ums/updateMentorMenteeReschedule'
import { loadStateFromLocalStorage } from '../../../../utils/localStorage'
import updateSalesOperationData from '../../../../actions/ums/updateSalesOperationData'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import formatDate from '../../../../utils/formatDate'
import addSalesOperationLog from '../../../../actions/ums/addSalesOperationLog'
import updateSalesOperationLog from '../../../../actions/ums/updateSalesOperationLog'
import duck from '../../../../duck'
import { ADMIN, TRANSFORMATION_ADMIN, TRANSFORMATION_TEAM } from '../../../../constants/roles'
import UmsDashboardStyle from './SalesOperationModal.style'
import requestToGraphql from '../../../../utils/requestToGraphql'
import withNoScrollBar from '../../../../components/withNoScrollbar'

export const leadStatusNextStepOptions = [
  { value: 'findReferralPartner', label: 'Need to find partner for referral' },
  { value: 'needFamilyDiscussion', label: 'Need to discuss with family' },
  { value: 'checkChildInterest', label: "Need to check child's interest" },
  { value: 'tryOtherDemoSessions', label: 'Need to try other demo sessions' },
  { value: 'didNotRespond', label: "Didn't respond will follow up" },
  { value: 'otherReasons', label: 'Other reason' }
]
class SalesOperationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      showFullEditor: false,
      placeholder: 'Write a comment...',
      logs: [],
      logStatus: [],
      logsId: [],
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
      hasRescheduled: false,
      reschedulingReasons: [
        { name: 'internetIssue', displayName: 'Slow/Unstable internet', selected: false },
        { name: 'zoomIssue', displayName: 'Zoom not installed', selected: false },
        { name: 'laptopIssue', displayName: 'No laptop - Joined over the phone', selected: false },
        { name: 'chromeIssue', displayName: 'Google chrome not installed', selected: false },
        { name: 'powerCut', displayName: 'Power Cut', selected: false },
        {
          name: 'notResponseAndDidNotTurnUp',
          displayName: "No response and didn't turn up",
          selected: false
        },
        {
          name: 'turnedUpButLeftAbruptly',
          displayName: 'Turned up but left abruptly',
          selected: false
        },
        {
          name: 'leadNotVerifiedProperly',
          displayName: 'Lead is not verified properly',
          selected: false
        },
        { name: 'otherReasonForReschedule', displayName: 'Other reasons', selected: false }
      ],
      mentorPitch: [
        {
          name: 'pricingPitched',
          displayName: 'Pricing pitched*',
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ],
          value: null
        },
        {
          name: 'parentCounsellingDone',
          displayName: 'Parent counselling done?*',
          values: [
            { toShow: 'Yes', toSend: true },
            { toShow: 'No', toSend: false }
          ],
          value: null
        },
        {
          name: 'courseInterestedIn',
          displayName: 'Courses interested in?',
          values: [
            { toShow: '1:1', toSend: 'oneToOne' },
            { toShow: '1:2', toSend: 'oneToTwo' },
            { toShow: '1:3', toSend: 'oneToThree' }
          ],
          value: ''
        },
        {
          name: 'leadStatus',
          displayName: 'Potential lead(highly interested)',
          values: [
            { toShow: 'Yes', toSend: 'hot' },
            { toShow: 'No', toSend: 'pipeline' }
          ],
          value: null
        }
      ],
      prodigyChild: null,
      studentPersona: [
        {
          name: 'extrovertStudent',
          displayName: 'Extrovert*',
          values: [
            { toShow: 'Yes', toSend: 'yes' },
            { toShow: 'No', toSend: 'no' },
            { toShow: 'Average', toSend: 'average' }
          ],
          value: null
        },
        {
          name: 'studentEnglishSpeakingSkill',
          displayName: "Student's English speaking*",
          values: [
            { toShow: 'Very fluent', toSend: 'veryFluent' },
            { toShow: 'Fluent', toSend: 'fluent' },
            { toShow: 'Not fluent', toSend: 'notFluent' }
          ],
          value: null
        },
        {
          name: 'fastLearner',
          displayName: 'Fast learner?*',
          values: [
            { toShow: 'Yes', toSend: 'yes' },
            { toShow: 'No', toSend: 'no' },
            { toShow: 'Average', toSend: 'average' }
          ],
          value: null
        },
        {
          name: 'parentEnglishSpeakingSkill',
          displayName: "Parent's English speaking*",
          values: [
            { toShow: 'Very fluent', toSend: 'veryFluent' },
            { toShow: 'Fluent', toSend: 'fluent' },
            { toShow: 'Not fluent', toSend: 'notFluent' }
          ],
          value: null
        }
      ],
      nextCallOn: null,
      rescheduledDate: null,
      rescheduledDateProvided: null,
      leadStatusNextStepOptions,
      showError: false,
      nextSteps: '',
      otherReasonForNextStep: null,
      sessionCommentByMentor: ''
    }
  }

  onCancel = () => {
    const { form } = this.props
    form.resetFields()
    this.props.closeSOModal()
    this.setState({
      showFullEditor: false,
      logsId: [],
      showError: false
    })
  }

  setDefaultValues = () => {
    const {
      form,
      salesOperationData,
      actionType,
      opsCommentSection,
      topic,
      session,
      path
    } = this.props
    const { reschedulingReasons, unQualifiedLeadReasons, mentorPitch, studentPersona } = this.state
    let {
      hasRescheduled,
      notAQualifiedLeadComment,
      prodigyChild,
      rescheduledDate,
      rescheduledDateProvided,
      sessionCommentByMentor
    } = this.state
    const placeholder = 'Write a comment...'
    if (path.split('/').pop() === 'mentor-sales-dashboard') {
      this.setState({
        sessionCommentByMentor: salesOperationData.sessionCommentByMentor
      })
    } else if (actionType === 'EDIT') {
      // console.log('EDIT')
      if (salesOperationData) {
        form.setFieldsValue({
          salesStatus: salesOperationData.userVerificationStatus,
          userResponseStatus: salesOperationData.userResponseStatus
        })
        if (salesOperationData.log) {
          const logs = []
          const logStatus = []
          salesOperationData.log.forEach(l => {
            const date = get(l, 'updatedAt') || get(l, 'createdAt')
            const logsObj = {
              id: get(l, 'id'),
              name: get(l, 'loggedBy.name'),
              date: `${formatDate(new Date(date)).date} ${formatDate(new Date(date)).formattedTime}`,
              log: get(l, 'log'),
              status: 'added'
            }
            if (opsCommentSection && l.type === 'operation') {
              if (l.topic && topic && l.topic.id === topic.id) {
                logs.push(logsObj)
                logStatus.push(false)
              }
            } else if (!opsCommentSection && l.type === 'sales') {
              logs.push(logsObj)
              logStatus.push(false)
            }
          })
          this.setState({
            logs,
            logStatus
          })
        } else if (salesOperationData.salesOperationLog) {
          const logs = []
          const logStatus = []
          salesOperationData.salesOperationLog.forEach(l => {
            const date = get(l, 'updatedAt') || get(l, 'createdAt')
            const logsObj = {
              id: get(l, 'id'),
              name: get(l, 'loggedBy.name'),
              date: `${formatDate(new Date(date)).date} ${formatDate(new Date(date)).formattedTime}`,
              log: get(l, 'log'),
              status: 'added'
            }
            if (opsCommentSection && l.type === 'operation') {
              if (l.topic && topic && l.topic.id === topic.id) {
                logs.push(logsObj)
                logStatus.push(false)
              }
            } else if (!opsCommentSection && l.type === 'sales') {
              logs.push(logsObj)
              logStatus.push(false)
            }
          })
          this.setState({
            logs,
            logStatus
          })
        }
        if (session) {
          // from Mentor Mentee Session
          hasRescheduled =
            get(session, 'hasRescheduled') === null ? false : get(session, 'hasRescheduled')
          reschedulingReasons.forEach((item, key) => {
            reschedulingReasons[key].selected = get(session, item.name)
            // ? salesOperationData[item.name]
            // : null
          })
          if (session.rescheduledDateProvided === false) {
            rescheduledDate = ''
            rescheduledDateProvided = false
          } else if (session.rescheduledDateProvided === null) {
            rescheduledDate = session.rescheduledDate === null ? '' : session.rescheduledDate
          } else if (session.rescheduledDateProvided === true) {
            rescheduledDate = get(session, 'rescheduledDate')
          }
        }
        sessionCommentByMentor = get(session, 'sessionCommentByMentor')
        // ---------- //
        notAQualifiedLeadComment = salesOperationData.notAQualifiedLeadComment
          ? salesOperationData.notAQualifiedLeadComment
          : ''
        prodigyChild = salesOperationData.prodigyChild ? salesOperationData.prodigyChild : false
        unQualifiedLeadReasons.forEach((item, key) => {
          unQualifiedLeadReasons[key].selected = salesOperationData[item.name]
          // ? salesOperationData[item.name]
          // : null
          return null
        })
        mentorPitch.forEach((item, key) => {
          if (item.name !== 'courseInterestedIn') {
            // if (salesOperationData[item.name] !== null || salesOperationData[item.name] !== '') {
            mentorPitch[key].value = salesOperationData[item.name]
            // }
          }
          if (item.name === 'courseInterestedIn') {
            item.value = ''
            item.values.forEach(value => {
              if (salesOperationData[value.toSend]) {
                // console.log(salesOperationData.id, salesOperationData[value.toSend])
                item.value += `${value.toSend}-`
              }
            })
          }
        })
        studentPersona.forEach((item, key) => {
          studentPersona[key].value = salesOperationData[item.name]
          // ? salesOperationData[item.name]
          // : null
        })
        this.setState({
          hasRescheduled,
          prodigyChild,
          notAQualifiedLeadComment,
          reschedulingReasons,
          unQualifiedLeadReasons,
          mentorPitch,
          studentPersona,
          nextCallOn: salesOperationData.nextCallOn
            ? moment(salesOperationData.nextCallOn)
              .toDate()
              .toISOString()
            : '',
          rescheduledDate,
          rescheduledDateProvided,
          nextSteps: salesOperationData.nextSteps ? salesOperationData.nextSteps : '',
          otherReasonForNextStep: salesOperationData.otherReasonForNextStep
            ? salesOperationData.otherReasonForNextStep
            : null,
          sessionCommentByMentor
        })
      }
    } else {
      unQualifiedLeadReasons.forEach((item, key) => {
        unQualifiedLeadReasons[key].selected = null
      })
      mentorPitch.forEach((item, key) => {
        if (item.name === 'courseInterestedIn') {
          mentorPitch[key].value = ''
        }
        mentorPitch[key].value = null
      })
      studentPersona.forEach((item, key) => {
        studentPersona[key].value = null
      })
      // from Mentor Mentee Session
      hasRescheduled =
        get(session, 'hasRescheduled') === null ? false : get(session, 'hasRescheduled')
      reschedulingReasons.forEach((item, key) => {
        if (reschedulingReasons[key] && session) {
          reschedulingReasons[key].selected = session[item.name]
        }
        // ? salesOperationData[item.name]
        // : null
      })
      if (get(session, 'rescheduledDateProvided') === false) {
        rescheduledDate = ''
        rescheduledDateProvided = false
      } else if (get(session, 'rescheduledDateProvided') === null) {
        rescheduledDate = session.rescheduledDate === null ? '' : session.rescheduledDate
      } else if (get(session, 'rescheduledDateProvided') === true) {
        rescheduledDate = get(session, 'rescheduledDate')
      }
      sessionCommentByMentor = get(session, 'sessionCommentByMentor')
      // ---------- //
      this.setState({
        logs: [],
        hasRescheduled,
        prodigyChild: false,
        notAQualifiedLeadComment: '',
        reschedulingReasons,
        unQualifiedLeadReasons,
        mentorPitch,
        studentPersona,
        nextCallOn: '',
        rescheduledDate,
        rescheduledDateProvided,
        sessionCommentByMentor,
        nextSteps:
          salesOperationData && salesOperationData.nextSteps ? salesOperationData.nextSteps : '',
        otherReasonForNextStep:
          salesOperationData && salesOperationData.otherReasonForNextStep
            ? salesOperationData.otherReasonForNextStep
            : null
      })
    }
    this.setState({
      placeholder,
      editorState: EditorState.createEmpty()
    })
  }

  async componentDidUpdate(prevProps) {
    const {
      addSuccess,
      updateSuccess,
      notification,
      newSalesOperationLog,
      addError,
      updateError,
      newSalesOperationStatus,
      salesOperation,
      updateSalesOperationStatus,
      updatedSalesOperationLog,
      salesOperationData
      // updateMentorMenteeSessionStatus
    } = this.props
    if (
      (this.props.visible && !prevProps.visible) ||
      salesOperationData !== prevProps.salesOperationData
    ) {
      this.setDefaultValues()
    } else {
      if (addSuccess && !prevProps.addSuccess) {
        notification.success({
          message: 'Sales Operation Data Added!'
        })
        this.setState({
          logsId: []
        })
        this.onCancel()
      }
      if (
        updateSuccess &&
        !prevProps.updateSuccess
        // || updateMentorMenteeSessionStatus && !prevProps.updateMentorMenteeSessionStatus
      ) {
        notification.success({
          message: 'Sales Operation Data Updated!'
        })
        this.onCancel()
      }
      if (addError && !prevProps.addError) {
        notification.error({
          message: 'Sales Operation Data Adding Failed!'
        })
      }
      if (updateError && !prevProps.updateError) {
        notification.error({
          message: 'Sales Operation Data Updating Failed!'
        })
      }
    }
    if (newSalesOperationStatus && !prevProps.newSalesOperationStatus) {
      if (newSalesOperationLog) {
        const currLogs = this.state.logs
        const currLog = currLogs[this.state.logs.length - 1]
        if (!currLog.id) {
          currLog.id = newSalesOperationLog.toJS()[0].id
          currLogs.splice(this.state.logs.length - 1, 1, currLog)
          this.setState({
            logs: currLogs
          })
        }
        const currLogIds = this.state.logsId
        currLogIds.push(newSalesOperationLog.toJS()[0].id)
        this.setState({
          logsId: currLogIds
        })
      }
    }
    if (updateSalesOperationStatus && !prevProps.updateSalesOperationStatus) {
      if (updatedSalesOperationLog && salesOperation) {
        const currSO = salesOperation.toJS()
        let changeCount = 0
        for (let i = 0; i < currSO.length; i += 1) {
          const sO = currSO[i]
          const sOLog = sO.log
          for (let j = 0; j < sOLog.length; j += 1) {
            const logObj = sOLog[j]
            if (logObj.id === updatedSalesOperationLog.toJS()[0].id) {
              logObj.log = updatedSalesOperationLog.toJS()[0].log
              sOLog.splice(j, 1, logObj)
              changeCount += 1
              break
            }
          }
          if (changeCount === 1) {
            currSO.splice(i, 1, sO)
            break
          }
        }
        duck.merge(() => ({
          salesOperation: currSO
        }))
      }
    }
  }

  onSave = async () => {
    const { form, actionType, userIdToEdit, salesOperationData, path, topic, session } = this.props
    const savedState = loadStateFromLocalStorage()
    const savedId = get(savedState, 'login.id')
    let input = {}
    if (path.split('/').pop() === 'mentor-sales-dashboard') {
      // console.log(this.state.logsId, this.getLogIdArrayInput(this.state.logsId))
      await updateMentorMenteeReschedule(get(salesOperationData, 'id'), {
        sessionCommentByMentor: this.state.sessionCommentByMentor
          ? this.state.sessionCommentByMentor
          : ''
      }).then(() => {
        this.props.notification.success({
          message: 'Sales Operation Data Updated!'
        })
        this.onCancel()
      })
    } else {
      form.validateFields(async (err, values) => {
        if (!err) {
          const { salesStatus, userResponseStatus } = values
          const {
            hasRescheduled,
            reschedulingReasons,
            nextCallOn,
            unQualifiedLeadReasons,
            notAQualifiedLeadComment,
            mentorPitch,
            prodigyChild,
            studentPersona,
            rescheduledDate,
            rescheduledDateProvided,
            nextSteps,
            otherReasonForNextStep,
            sessionCommentByMentor
          } = this.state
          const dataToBeSended = {}
          const reschedulingDataToBeSended = {}
          if (this.isUnQualifiedLead()) {
            unQualifiedLeadReasons.forEach(item => {
              if (item.selected !== null) {
                dataToBeSended[item.name] = item.selected
              }
            })
            dataToBeSended.notAQualifiedLeadComment = notAQualifiedLeadComment
            dataToBeSended.leadStatus = 'unfit'
          } else if (hasRescheduled) {
            reschedulingDataToBeSended.sessionCommentByMentor = this.state.sessionCommentByMentor
              ? this.state.sessionCommentByMentor
              : ''
            reschedulingDataToBeSended.hasRescheduled = hasRescheduled
            reschedulingReasons.forEach(item => {
              if (item.selected !== null) {
                reschedulingDataToBeSended[item.name] = item.selected
              }
            })
            if (rescheduledDateProvided === false) {
              reschedulingDataToBeSended.rescheduledDateProvided = rescheduledDateProvided
              reschedulingDataToBeSended.rescheduledDate = ''
            } else if (rescheduledDateProvided === true) {
              reschedulingDataToBeSended.rescheduledDateProvided = true
              reschedulingDataToBeSended.rescheduledDate = moment(rescheduledDate)
                .toDate()
                .toISOString()
            }
            dataToBeSended.leadStatus = 'unassigned'
            dataToBeSended.notAQualifiedLeadComment = notAQualifiedLeadComment || ''
          } else {
            reschedulingDataToBeSended.sessionCommentByMentor = this.state.sessionCommentByMentor
              ? this.state.sessionCommentByMentor
              : ''
            reschedulingDataToBeSended.hasRescheduled = hasRescheduled
            reschedulingReasons.forEach(item => {
              if (item.selected !== null) {
                reschedulingDataToBeSended[item.name] = item.selected
              }
            })
            dataToBeSended.leadStatus = 'unassigned'
            mentorPitch.forEach(item => {
              if (item.name === 'courseInterestedIn' && item.value) {
                item.value.split('-').map(value => {
                  if (value !== '') {
                    dataToBeSended[value] = true
                  }
                  return null
                })
              } else if (item.name === 'leadStatus' && item.value === 'pipeline') {
                dataToBeSended[item.name] = item.value
                if (nextSteps) {
                  dataToBeSended.nextSteps = nextSteps
                  if (nextCallOn) {
                    dataToBeSended.nextCallOn = moment(nextCallOn)
                      .toDate()
                      .toISOString()
                  }
                  if (nextSteps === 'otherReasons') {
                    dataToBeSended.otherReasonForNextStep = otherReasonForNextStep
                  }
                } else {
                  dataToBeSended.nextCallOn = ''
                  dataToBeSended.otherReasonForNextStep = ''
                }
              } else if (item.name === 'leadStatus' && item.value === 'hot') {
                dataToBeSended[item.name] = item.value
                if (nextCallOn) {
                  dataToBeSended.nextCallOn = moment(nextCallOn)
                    .toDate()
                    .toISOString()
                }
              } else if (item.name === 'leadStatus' && item.value === 'unfit') {
                dataToBeSended[item.name] = 'unassigned'
              } else if (item.name !== 'courseInterestedIn' && item.value !== null) {
                dataToBeSended[item.name] = item.value
              }
            })
            studentPersona.forEach(item => {
              if (item.value !== null) {
                dataToBeSended[item.name] = item.value
              }
            })
            dataToBeSended.hasRescheduled = hasRescheduled
            dataToBeSended.prodigyChild = prodigyChild
          }
          if (this.props.path.includes('completedSessions') && topic.order === 1) {
            input = {
              ...dataToBeSended
            }
          } else {
            input = {
              userVerificationStatus: salesStatus,
              userResponseStatus
            }
          }
          if (this.props.path.includes('completedSessions') && topic.order !== 1) {
            input = {}
            await requestToGraphql(gql`
            query{
              salesOperations(
                filter: { and: [
                  { client_some: { id: "${userIdToEdit}" } },
                { course_some: { id: "${get(this.props, 'sessionDetails.sessionCourse.id')}" } }
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
                  this.props.sessionDetails.sessionId,
                  this.props.sessionDetails.mentorId,
                  get(this.props, 'sessionDetails.sessionCourse.id')
                )
              }
            })
          } else if (actionType === 'ADD') {
            unQualifiedLeadReasons.forEach(item => {
              if (item.selected !== null) {
                input[item.name] = item.selected
              }
            })
            const salesInput = {
              ...input, notAQualifiedLeadComment: notAQualifiedLeadComment || ''
            }
            const addInput = {
              ...reschedulingDataToBeSended,
              leadStatus: get(dataToBeSended, 'leadStatus', ''),
              sessionCommentByMentor: sessionCommentByMentor || ''
            }
            await addSalesOperationData(
              userIdToEdit,
              savedId,
              salesInput,
              this.props.sessionDetails.sessionId,
              this.props.sessionDetails.mentorId,
              get(this.props, 'sessionDetails.sessionCourse.id')
            ).then(() => {
              updateMentorMenteeReschedule(get(session, 'id'), {
                ...addInput
              })
            })
          } else if (actionType === 'EDIT') {
            unQualifiedLeadReasons.forEach(item => {
              if (item.selected !== null) {
                input[item.name] = item.selected
              }
            })
            const salesInput = {
              ...input, notAQualifiedLeadComment: notAQualifiedLeadComment || ''
            }
            const editInput = {
              ...reschedulingDataToBeSended,
              leadStatus: get(dataToBeSended, 'leadStatus', ''),
              sessionCommentByMentor: sessionCommentByMentor || ''
            }
            if (get(this.props, 'session.salesOperation.id')) {
              await updateSalesOperationData(salesOperationData.id, salesInput).then(() => {
                updateMentorMenteeReschedule(get(session, 'id'), {
                  ...editInput
                })
              })
            } else {
              await updateSalesOperationData(salesOperationData.id, salesInput, get(session, 'id')).then(
                () => {
                  updateMentorMenteeReschedule(get(session, 'id'), {
                    ...editInput
                  })
                }
              )
            }
          }
        }
      })
    }
  }

  onChange = editorState => {
    this.setState({
      editorState
    })
  }

  onChangeEditLogs = (editorState, index) => {
    this.setState({
      [`editorState${index}`]: editorState
    })
  }

  focus = () => {
    const logsStatus = this.state.logStatus
    logsStatus.forEach((status, i) => {
      logsStatus[i] = false
    })
    if (!this.state.showFullEditor) {
      this.editor.focus()
      this.setState({
        showFullEditor: true,
        placeholder: null,
        editorState: EditorState.createEmpty(),
        logStatus: logsStatus
      })
    }
  }

  setPlaceholder = () => {
    const placeholder = 'Write a comment...'
    this.setState({
      placeholder
    })
  }

  handleClickOutside = () => {
    const placeholder = 'Write a comment...'
    const logsStatus = this.state.logStatus
    logsStatus.forEach((status, i) => {
      logsStatus[i] = false
    })
    this.setState({
      showFullEditor: false,
      editorState: EditorState.createEmpty(),
      placeholder,
      logStatus: logsStatus
    })
  }

  onSaveLogs = async () => {
    const { topic, opsCommentSection } = this.props
    const log = convertToRaw(this.state.editorState.getCurrentContent())
    const count = log && log.blocks && log.blocks.length
    const latestBlock = log && log.blocks && log.blocks[count - 1]
    const name = getDataFromLocalStorage('login.name')
    const userId = getDataFromLocalStorage('login.id')
    if (latestBlock && latestBlock.text && latestBlock.text.length) {
      const prevLogs = this.state.logs
      const prevLogStatus = this.state.logStatus
      const date = `${formatDate(new Date()).date} ${formatDate(new Date()).formattedTime}`
      const logObj = {
        name,
        date,
        log: JSON.stringify(log),
        status: 'notAdded'
      }
      prevLogs.push(logObj)
      prevLogStatus.push(false)
      this.setState(
        {
          logs: prevLogs,
          logStatus: prevLogStatus
        },
        async () => {
          this.handleClickOutside()
          const logInput = {
            log: logObj.log,
            type: this.props.opsCommentSection ? 'operation' : 'sales'
          }
          if (opsCommentSection) {
            if (!topic) {
              await addSalesOperationLog(userId, logInput)
            } else {
              await addSalesOperationLog(userId, logInput, topic.id)
            }
          } else {
            await addSalesOperationLog(userId, logInput)
          }
        }
      )
    }
  }

  onEditLogs = async index => {
    const prevLogs = this.state.logs
    const prevLogObj = prevLogs[index]
    const log = JSON.stringify(convertToRaw(this.state[`editorState${index}`].getCurrentContent()))
    prevLogObj.log = log
    prevLogObj.date = `${formatDate(new Date()).date} ${formatDate(new Date()).formattedTime}`
    prevLogs.splice(index, 1, prevLogObj)
    this.setState(
      {
        logs: prevLogs
      },
      () => {
        this.handleClickOutside()
      }
    )

    // Updating log in db.
    const input = {
      log
    }
    await updateSalesOperationLog(prevLogObj.id, input)
  }

  toggleLogStatus = (index, log) => {
    const prevLogsStatus = this.state.logStatus
    if (!prevLogsStatus[index]) {
      prevLogsStatus[index] = true
      const placeholder = 'Write a comment...'
      this.setState({
        logStatus: prevLogsStatus,
        [`editorState${index}`]: EditorState.createWithContent(convertFromRaw(JSON.parse(log))),
        showFullEditor: false,
        placeholder
      })
    }
  }

  getSavedLog = index => {
    const logObj = this.state.logs[index]
    const { log } = logObj
    if (this.state.logStatus[index]) {
      return this.state[`editorState${index}`]
    }

    return EditorState.createWithContent(convertFromRaw(JSON.parse(log)))
  }

  getModalTitle = title => {
    const { opsCommentSection, name, topic, sessionDetails, mentorName } = this.props
    const userRole = getDataFromLocalStorage('login.role')
    if (!topic) {
      return ''
    }
    if (opsCommentSection && !this.props.path.split('/').pop() === 'mentor-sales-dashboard') {
      const titleArr = [
        `${title}`,
        <br />,
        <br />,
        `(${name} | ${topic.title} | ${sessionDetails.sessionDate} : ${sessionDetails.sessionTime})`
      ]
      if (userRole === ADMIN) {
        titleArr.push(<br />)
        titleArr.push(<br />)
        titleArr.push(`Session Taken By: ${mentorName}`)
      }
      return titleArr
    }
    return title
  }

  returnTagColor = color => {
    if (color === 'green') {
      return '#7fd5a1'
    } else if (color === 'red') {
      return '#ffbcbc'
    }
    return null
  }

  toggleUnQualifiedLeadReasons = key => {
    const { unQualifiedLeadReasons, hasRescheduled } = this.state
    if (hasRescheduled) this.setState({ hasRescheduled: false })
    unQualifiedLeadReasons[key].selected = !unQualifiedLeadReasons[key].selected
    this.setState({
      unQualifiedLeadReasons
    })
  }

  unQualifiedLeadReasons = () => {
    const { unQualifiedLeadReasons } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    return unQualifiedLeadReasons.map((item, key) => (
      <UmsDashboardStyle.redOptions
        key={`${key + 1}${item.name}`}
        style={{
          boxShadow: item.selected ? '#00000033 1px 5px 6px' : 'none',
          border: item.selected ? '2px solid #de2b20' : '0'
        }}
        onClick={() => this.toggleUnQualifiedLeadReasons(key)}
        disabled={savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM}
      >
        {item.displayName ? item.displayName : item.name}
      </UmsDashboardStyle.redOptions>
    ))
  }

  toggleReschedulingReason = key => {
    const { reschedulingReasons } = this.state
    reschedulingReasons[key].selected = !reschedulingReasons[key].selected
    this.setState({
      reschedulingReasons
    })
  }

  renderReschedulingReasons = () => {
    const { reschedulingReasons } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    return reschedulingReasons.map((item, key) => (
      <UmsDashboardStyle.yellowOptions
        key={`${key + 1}${item.name}`}
        style={{
          boxShadow: item.selected ? '#00000033 1px 5px 6px' : 'none',
          border: item.selected ? '2px solid #deb720' : '0'
        }}
        onClick={() => this.toggleReschedulingReason(key)}
        disabled={savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM}
      >
        {item.displayName ? item.displayName : item.name}
      </UmsDashboardStyle.yellowOptions>
    ))
  }

  disabledDate = current => current && current < moment().startOf('day')

  onChangeNextCallOn = dateTime => {
    // console.log(moment(dateTime).toDate().toISOString())
    this.setState({
      nextCallOn: dateTime
    })
  }

  handleNotAQualifiedLeadComment = e => {
    const { hasRescheduled } = this.state
    if (hasRescheduled) this.setState({ hasRescheduled: false })
    e.persist()
    this.setState({
      notAQualifiedLeadComment: e.target.value
    })
  }

  handleGeneralOptionsClick = (variable, key, value) => {
    const item = this.state[variable]
    item[key].value = value
    this.setState({
      [variable]: item
    })
  }

  handleCourseInterestedIn = (variable, key, value) => {
    const item = this.state[variable]
    if (item[key].value && item[key].value.includes(value)) {
      item[key].value = item[key].value.replace(`${value}-`, '')
    } else if (item[key].value) {
      item[key].value += `${value}-`
    } else {
      item[key].value = `${value}-`
    }
    this.setState({
      [variable]: item
    })
  }

  handleLeadStatusNextStep = value => {
    this.setState({
      nextSteps: value
    })
  }

  renderLeadStatusNextStepOptions = () => {
    const { Option } = Select
    return this.state.leadStatusNextStepOptions.map(nextStep => (
      <Option value={nextStep.value}>
        <Tooltip title={nextStep.label}>
          <span>{nextStep.label}</span>
        </Tooltip>
      </Option>
    ))
  }

  renderMentorPitch = () => {
    const { mentorPitch, showError } = this.state
    return mentorPitch.map((item, key) => {
      if (item.name !== 'courseInterestedIn') {
        return (
          <UmsDashboardStyle.Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              alignItems: 'flex-start'
            }}
          >
            <p style={{ margin: 0, minWidth: 'max-content' }}> {item.displayName} </p>
            {item.name !== 'leadStatus' ? (
              <div>
                {item.values.map(value => (
                  <UmsDashboardStyle.OutlinedOptions
                    style={{
                      backgroundColor: item.value === value.toSend ? '#4c4c4c59' : '#efefef',
                      borderColor: item.value === value.toSend ? '#fff' : '#000',
                      color: item.value === value.toSend ? '#fff' : '#4a4a4a',
                      boxShadow: item.value === value.toSend ? '0px 3px 5px #00000057' : 'none'
                    }}
                    onClick={() => this.handleGeneralOptionsClick('mentorPitch', key, value.toSend)}
                  >
                    {value.toShow}
                  </UmsDashboardStyle.OutlinedOptions>
                ))}
              </div>
            ) : null}
            {item.name === 'leadStatus' &&
              (item.value === null ||
                (item.value && item.value === 'hot') ||
                item.value === 'pipeline' ||
                item.value === 'unassigned') ?
              (
                <div>
                  {item.values.map(value => (
                    <UmsDashboardStyle.OutlinedOptions
                      style={{
                        backgroundColor: item.value === value.toSend ? '#4c4c4c59' : '#efefef',
                        borderColor: item.value === value.toSend ? '#fff' : '#000',
                        color: item.value === value.toSend ? '#fff' : '#4a4a4a',
                        boxShadow: item.value === value.toSend ? '0px 3px 5px #00000057' : 'none'
                      }}
                      onClick={() => this.handleGeneralOptionsClick('mentorPitch', key, value.toSend)}
                    >
                      {value.toShow}
                    </UmsDashboardStyle.OutlinedOptions>
                  ))}
                </div>
              ) : (
                item.name === 'leadStatus' && item.value && <Tag color='cyan'> {item.value} </Tag>
              )}
            {item.name === 'leadStatus' && item.value === 'pipeline' ? (
              <React.Fragment>
                <Select
                  onChange={this.handleLeadStatusNextStep}
                  style={{ margin: '10px 0', width: 300 }}
                  placeholder='Select Next Step'
                  value={this.state.nextSteps ? this.state.nextSteps : undefined}
                >
                  {this.renderLeadStatusNextStepOptions()}
                </Select>
                <DatePicker
                  format='ll'
                  disabledDate={this.disabledDate}
                  showTime={{
                    // defaultValue: moment('00:00', 'HH:mm'),
                    minuteStep: 10,
                    format: 'HH:mm',
                    value: moment(this.state.nextCallOn).format('HH:mm')
                  }}
                  style={{ margin: '10px 0' }}
                  value={this.state.nextCallOn ? moment(this.state.nextCallOn) : ''}
                  onChange={this.onChangeNextCallOn}
                  placeholder='Next Call On'
                />
              </React.Fragment>
            ) : null}
            {item.name === 'leadStatus' && item.value === 'hot' ? (
              <React.Fragment>
                <DatePicker
                  format='ll'
                  disabledDate={this.disabledDate}
                  showTime={{
                    // defaultValue: moment('00:00', 'HH:mm'),
                    minuteStep: 10,
                    format: 'HH:mm',
                    value: moment(this.state.nextCallOn).format('HH:mm')
                  }}
                  style={{ margin: '10px 0' }}
                  value={this.state.nextCallOn ? moment(this.state.nextCallOn) : ''}
                  onChange={this.onChangeNextCallOn}
                  placeholder='Next Call On'
                />
              </React.Fragment>
            ) : null}
            {item.name === 'leadStatus' &&
              item.value === 'pipeline' &&
              this.state.nextSteps === 'otherReasons' ?
              (
                <Input
                  placeholder='Other reason'
                  value={this.state.otherReasonForNextStep}
                  onChange={e => {
                    e.persist()
                    this.setState({ otherReasonForNextStep: e.target.value })
                  }}
                  style={{ gridColumn: '1/3' }}
                />
              ) : null}
            {showError && (item.value === null || item.value === '') ? (
              <UmsDashboardStyle.errMsg>Mandatory</UmsDashboardStyle.errMsg>
            ) : null}
          </UmsDashboardStyle.Box>
        )
      }
      return (
        <UmsDashboardStyle.Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'flex-start'
          }}
        >
          <p style={{ margin: 0 }}> {item.displayName} </p>
          <div>
            {item.values.map(value => (
              <UmsDashboardStyle.OutlinedOptions
                style={{
                  backgroundColor:
                    item.value && item.value.includes(value.toSend) ? '#4c4c4c59' : '#efefef',
                  borderColor: item.value && item.value.includes(value.toSend) ? '#fff' : '#000',
                  color: item.value && item.value.includes(value.toSend) ? '#fff' : '#4a4a4a',
                  boxShadow:
                    item.value && item.value.includes(value.toSend)
                      ? '0px 3px 5px #00000057'
                      : 'none'
                }}
                onClick={() => this.handleCourseInterestedIn('mentorPitch', key, value.toSend)}
              >
                {value.toShow}
              </UmsDashboardStyle.OutlinedOptions>
            ))}
          </div>
          {showError && (item.value === null || item.value === '') ? (
            <UmsDashboardStyle.errMsg>
              Fill this field before going further
            </UmsDashboardStyle.errMsg>
          ) : null}
        </UmsDashboardStyle.Box>
      )
    })
  }

  renderStudentPersona = () => {
    const { studentPersona, showError } = this.state
    return studentPersona.map((item, key) => (
      <UmsDashboardStyle.Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content max-content',
          alignItems: 'center'
        }}
      >
        <p style={{ margin: 0 }}> {item.displayName} </p>
        <div>
          {item.values.map(value => (
            <UmsDashboardStyle.OutlinedOptions
              style={{
                backgroundColor: item.value === value.toSend ? '#4c4c4c59' : '#efefef',
                borderColor: item.value === value.toSend ? '#fff' : '#000',
                color: item.value === value.toSend ? '#fff' : '#4a4a4a',
                boxShadow: item.value === value.toSend ? '0px 3px 5px #00000057' : 'none'
              }}
              onClick={() => this.handleGeneralOptionsClick('studentPersona', key, value.toSend)}
            >
              {value.toShow}
            </UmsDashboardStyle.OutlinedOptions>
          ))}
        </div>
        {showError && (item.value === null || item.value === '') ? (
          <UmsDashboardStyle.errMsg>Fill this field before going further</UmsDashboardStyle.errMsg>
        ) : null}
      </UmsDashboardStyle.Box>
    ))
  }

  isUnQualifiedLead = () => {
    const { unQualifiedLeadReasons, notAQualifiedLeadComment } = this.state
    for (let i = 0; i < unQualifiedLeadReasons.length; i += 1) {
      if (unQualifiedLeadReasons[i].selected) {
        return true
      }
    }
    return notAQualifiedLeadComment && notAQualifiedLeadComment !== ''
  }

  handleSaveButton = () => {
    const { mentorPitch, studentPersona, hasRescheduled, rescheduledDateProvided } = this.state
    if (
      this.props.path.split('/').pop() === 'mentor-sales-dashboard' ||
      (this.props.topic && this.props.topic.order !== 1)
    ) {
      this.onSave()
      return
    }
    let canSave = this.isUnQualifiedLead()
    if (canSave) {
      this.onSave()
      return
    }
    if ((hasRescheduled || hasRescheduled === false) && rescheduledDateProvided !== null) {
      this.onSave()
      return
    }
    canSave =
      mentorPitch[0].value === null ||
      mentorPitch[1].value === null ||
      studentPersona[0].value === null ||
      studentPersona[1].value === null ||
      studentPersona[2].value === null ||
      studentPersona[3].value === null
    if (!canSave) {
      this.onSave()
    } else {
      this.setState({
        showError: true
      })
    }
  }

  onChangeRescheduledDate = dateTime => {
    this.setState({
      rescheduledDate: dateTime,
      rescheduledDateProvided: dateTime == null ? null : true
    })
  }

  render() {
    const { id, visible, title, adding, updating, path, showSessionLogs } = this.props
    const { hasRescheduled, showError, sessionCommentByMentor } = this.state
    const topicOrder = this.props.topic && this.props.topic.order
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <MainModal
        visible={visible}
        title={this.getModalTitle(title)}
        onCancel={() => this.onCancel()}
        maskClosable={false}
        width='65vw'
        style={{
          minWidth: 1000
        }}
        footer={showSessionLogs ? [<Button onClick={this.onCancel}>CANCEL</Button>] : [
          <Button onClick={this.onCancel}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={this.handleSaveButton}
            disabled={
              savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM
            }
          >
            {' '}
            {adding || updating ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <UmsDashboardStyle.PrevBtn onClick={this.props.prevSession}>
          <LeftOutlined />
        </UmsDashboardStyle.PrevBtn>
        <Form>
          {path.includes('completedSessions') && topicOrder === 1 ? (
            <React.Fragment>
              <p>Not a qualified lead? Please tag the students.</p>
              <UmsDashboardStyle.boxDivision>
                {this.unQualifiedLeadReasons()}
              </UmsDashboardStyle.boxDivision>
              <Input
                placeholder='tell us more...'
                value={this.state.notAQualifiedLeadComment}
                onChange={this.handleNotAQualifiedLeadComment}
                disabled={
                  savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM
                }
              />
              <UmsDashboardStyle.hl />
              {this.isUnQualifiedLead() ? null : (
                <React.Fragment>
                  <UmsDashboardStyle.boxDivision>
                    <p style={{ margin: 0 }}>Is your session rescheduled?</p>
                    <div
                      style={{
                        display: 'flex',
                        width: '140px',
                        justifyContent: 'space-between',
                        marginLeft: 30
                      }}
                    >
                      <UmsDashboardStyle.OutlinedOptions
                        style={{
                          width: 60,
                          backgroundColor: this.state.hasRescheduled ? '#75cd60' : '#fff',
                          borderColor: !this.state.hasRescheduled ? '#7fd5a1' : '#fff',
                          color: !this.state.hasRescheduled ? '#322e2a' : '#fff',
                          boxShadow: this.state.hasRescheduled ? '0px 3px 5px #00000057' : 'none'
                        }}
                        onClick={() => this.setState({ hasRescheduled: true })}
                        disabled={
                          savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM
                        }
                      >
                        Yes
                      </UmsDashboardStyle.OutlinedOptions>
                      <UmsDashboardStyle.OutlinedOptions
                        style={{
                          width: 60,
                          backgroundColor: hasRescheduled === false ? '#f8cccc' : '#fff',
                          borderColor: hasRescheduled === false ? '#fff' : '#ff6b6b',
                          color: hasRescheduled === false ? '#fff' : '#7c86a2',
                          boxShadow: hasRescheduled === false ? '0px 3px 5px #00000057' : 'none'
                        }}
                        onClick={() => this.setState({ hasRescheduled: false })}
                        disabled={
                          savedRole === TRANSFORMATION_ADMIN || savedRole === TRANSFORMATION_TEAM
                        }
                      >
                        No
                      </UmsDashboardStyle.OutlinedOptions>
                    </div>
                    {hasRescheduled ? (
                      <div style={{ margin: '20px 0' }}>
                        <span>Rescheduled for: </span>
                        <DatePicker
                          format='ll'
                          disabledDate={this.disabledDate}
                          showTime={{
                            // defaultValue: moment('00:00', 'HH:mm'),
                            minuteStep: 10,
                            format: 'HH:mm',
                            value: moment(this.state.rescheduledDate).format('HH:mm')
                          }}
                          value={
                            this.state.rescheduledDate ? moment(this.state.rescheduledDate) : ''
                          }
                          onChange={this.onChangeRescheduledDate}
                          disabled={
                            this.state.rescheduledDateProvided === false ||
                            savedRole === TRANSFORMATION_ADMIN ||
                            savedRole === TRANSFORMATION_TEAM
                          }
                        />
                        <Button
                          style={{
                            backgroundColor:
                              this.state.rescheduledDateProvided === false ? '#2a8ef7' : '#fff',
                            color: this.state.rescheduledDateProvided === false ? '#fff' : '#979797'
                          }}
                          onClick={() => {
                            const { rescheduledDateProvided, rescheduledDate } = this.state
                            this.setState({
                              rescheduledDateProvided:
                                rescheduledDateProvided === false ? null : false,
                              rescheduledDate:
                                rescheduledDateProvided === false ? '' : rescheduledDate
                            })
                          }}
                          disabled={
                            this.state.rescheduledDateProvided ||
                            savedRole === TRANSFORMATION_ADMIN ||
                            savedRole === TRANSFORMATION_TEAM
                          }
                        >
                          Not Provided
                        </Button>
                      </div>
                    ) : null}
                    {showError &&
                      this.state.hasRescheduled &&
                      this.state.rescheduledDateProvided === null ?
                      (
                        <UmsDashboardStyle.errMsg style={{ width: '100%' }}>
                          Is the Reschedule Date Provided?
                        </UmsDashboardStyle.errMsg>
                      ) : null}
                    <UmsDashboardStyle.boxDivision>
                      {this.renderReschedulingReasons()}
                    </UmsDashboardStyle.boxDivision>
                  </UmsDashboardStyle.boxDivision>
                  {showError && hasRescheduled === null ? (
                    <UmsDashboardStyle.errMsg>
                      Fill this field before going further
                    </UmsDashboardStyle.errMsg>
                  ) : null}
                  <UmsDashboardStyle.hl />
                  {hasRescheduled ||
                    savedRole === TRANSFORMATION_TEAM ||
                    savedRole === TRANSFORMATION_ADMIN ?
                    null :
                    (
                      <React.Fragment>
                        <UmsDashboardStyle.boxDivision
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2,1fr)',
                            margin: 0,
                            padding: 0,
                            gridRowGap: 10
                          }}
                        >
                          {this.renderMentorPitch()}
                        </UmsDashboardStyle.boxDivision>
                        <UmsDashboardStyle.hl />
                        <UmsDashboardStyle.boxDivision>
                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '0 0 12px'
                            }}
                          >
                            <span>Student Persona</span>
                            <span>
                              <Checkbox
                                checked={this.state.prodigyChild}
                                onChange={e => this.setState({ prodigyChild: e.target.checked })}
                              >
                                Prodigy Child
                              </Checkbox>
                            </span>
                          </div>
                          <UmsDashboardStyle.Box
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '4fr 6fr',
                              alignItems: 'center',
                              width: '100%',
                              gridRowGap: 20
                            }}
                          >
                            {this.renderStudentPersona()}
                          </UmsDashboardStyle.Box>
                        </UmsDashboardStyle.boxDivision>
                        <UmsDashboardStyle.hl />
                      </React.Fragment>
                    )
                  }
                </React.Fragment>
              )}
            </React.Fragment>
          ) : null}
          {path.includes('completedSessions') && !hasRescheduled ? (
            <p>Conclude the Session</p>
          ) : null}
          {/* salesLogs */}
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder='Conclude the session'
            value={sessionCommentByMentor}
            onChange={e => this.setState({ sessionCommentByMentor: e.target.value })}
            allowClear
            disabled={savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN}
          />
        </Form>
        <UmsDashboardStyle.NextBtn onClick={this.props.nextSession}>
          <RightOutlined />
        </UmsDashboardStyle.NextBtn>
      </MainModal>
    )
  }
}

SalesOperationModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  adding: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  closeSOModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func
  }).isRequired,
  actionType: PropTypes.string.isRequired,
  salesOperationsData: PropTypes.shape({}).isRequired,
  addSuccess: PropTypes.bool.isRequired,
  updateSuccess: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}).isRequired,
  addError: PropTypes.bool.isRequired,
  updateError: PropTypes.bool.isRequired
}

export default withNoScrollBar(Form.create()(SalesOperationModal))
