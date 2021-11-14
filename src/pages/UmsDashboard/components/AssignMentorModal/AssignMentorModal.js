/* eslint-disable */
import { notification, Spin, Tooltip, Select, Button } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import fetchAssignMentorInfo from '../../../../actions/slots/fetchAssignMentorInfo'
import addMentorMenteeSession from '../../../../actions/ums/addMentorMenteeSession'
import deleteMentorMenteeSession from '../../../../actions/ums/deleteMentorMenteeSession'
import MainModal from '../../../../components/MainModal'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import { MENTOR } from '../../../../constants/roles'
import { filterKey } from '../../../../utils/data-utils'
import getSlotLabel from '../../../../utils/slots/slot-label'
import SendSessionModalLink from '../../../CompletedSessions/components/SendSessionModalLink'
import UmsDashboardStyle from '../../UmsDashboard.style'
import hs from '../../../../utils/scale'
import {
  checkIfNotOldSlot, getMentorFromBatch,
  getMentorMenteeSession, getSelectedSlots
} from '../../../SlotsInfo/component/UsersTable/slots-utils'
import deleteBatchSession from '../../../../actions/ums/deleteBatchSession'

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: 'black' }} spin />

const parentInfoStyles = {
  display: 'flex',
  width: '100%',
  height: '26px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'start'
}
class AssignMentorModal extends React.Component {
  state = {
    selectedMentorSessionId: '',
    selectedMentorId: '',
    defaultMentorId: '',
    mentorMenteeSessionId: '',
    selectedCourse: '',
    showSendLinkModal: false,
    sessionVideoModalShadowVisible: false,
    sessionLink: '',
    sendSessionLink: '',
    showSessionExist: false,
    sessionExistData: null,
    batchSession: null,
    sessionStatus: '',
    assignLoading: ''
  }
  componentDidMount = () => {
    const { menteeData: { bookingDate:
      { sessionId, bookingDate: date, mentorSession,
        mentorMenteeSessionId, course, sessionStatus,
        slotNumber } } } = this.props
    fetchAssignMentorInfo(date, slotNumber, [sessionId])
    this.setState({
      selectedMentorSessionId: get(mentorSession, 'id'),
      defaultMentorId: get(mentorSession, 'user.id'),
      mentorMenteeSessionId: mentorMenteeSessionId || '',
      selectedCourse: get(course, 'id'),
      sendSessionLink: get(this.props, 'menteeData.bookingDate.sendSessionLink'),
      sessionStatus
    })
  }

  componentDidUpdate = (prevProps) => {
    const { mentorMenteeSessionDeleteStatus, mentorMenteeSessionDeleteFailure,
      mentorMenteeSessionAddStatus, mentorMenteeSessionAddFailure, sendLinkStatus,
      sendLinkFailure } = this.props
    if (mentorMenteeSessionDeleteStatus && !get(mentorMenteeSessionDeleteStatus.toJS(), 'loading')
      && get(mentorMenteeSessionDeleteStatus.toJS(), 'failure') &&
      (prevProps.mentorMenteeSessionDeleteFailure !== mentorMenteeSessionDeleteFailure)) {
      if (mentorMenteeSessionDeleteFailure && mentorMenteeSessionDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(mentorMenteeSessionDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (mentorMenteeSessionAddStatus && !get(mentorMenteeSessionAddStatus.toJS(), 'loading')
      && get(mentorMenteeSessionAddStatus.toJS(), 'success') &&
      (prevProps.mentorMenteeSessionAddStatus !== mentorMenteeSessionAddStatus)) {
      notification.success({
        message: 'Mentor assigned successfully'
      })
    } else if (mentorMenteeSessionAddStatus && !get(mentorMenteeSessionAddStatus.toJS(), 'loading')
      && get(mentorMenteeSessionAddStatus.toJS(), 'failure') &&
      (prevProps.mentorMenteeSessionAddFailure !== mentorMenteeSessionAddFailure)) {
      if (mentorMenteeSessionAddFailure && mentorMenteeSessionAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(mentorMenteeSessionAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (sendLinkStatus && !get(sendLinkStatus.toJS(), 'loading')
      && get(sendLinkStatus.toJS(), 'success') &&
      (prevProps.sendLinkStatus !== sendLinkStatus)) {
      notification.success({
        message: 'Session link sent'
      })
      this.setState({
        sendSessionLink: true
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
  getMentorBgAndStatus = (mentor) => {
    const { menteeData } = this.props
    const { bookingDate, userId } = menteeData
    const time = get(bookingDate, 'slotNumber')
    const batchSessions = get(mentor, 'batchSessions', [])
    const menteeSessions = get(mentor, 'existMenteeSession', [])
    let menteeExistMessage = ''
    const { showMentor, batchExistWithEmptyStudent } = getMentorFromBatch(batchSessions, time)
    const mentorSlotsArray = []
    if (menteeSessions && menteeSessions.length > 0) {
      menteeSessions.forEach(mmSession => {
        if (get(mmSession, 'user.id') !== userId) {
          const selectedSlots = getSelectedSlots(mmSession)
          mentorSlotsArray.push(...selectedSlots)
          if (selectedSlots.length > 0 && selectedSlots.includes(`slot${time}`)) {
            menteeExistMessage = `Mentor is assigned for ${get(mmSession, 'user.name')}`
          }
        }
      })
    }
    let prevOrNextSlotExist = ''
    const uniqueSlots = [...new Set(mentorSlotsArray)]
    let prevSlot = ''
    let nextSlot = ''
    uniqueSlots.forEach(slot => {
      const slotNumber = Number(slot.split('slot')[1])
      // checking prev, next slots status for the mentor
      if ((time - 1) === slotNumber) {
        prevSlot = getSlotLabel((time - 1)).startTime
      }
      if ((time + 1) === slotNumber) {
        nextSlot = getSlotLabel((time + 1)).startTime
      }
    })
    if (prevSlot || nextSlot) {
      prevOrNextSlotExist = `Mentor is booked at ${prevSlot ?
        `${prevSlot}` : ''} ${nextSlot ? `${prevSlot ? 'or' : ''} ${nextSlot}` : ''}, but you can assign it anyway.`
    }
    const isActive = this.state.selectedMentorSessionId === get(mentor, 'sessionId')
    let color = '#ffffff'
    let status = 'noStatus'
    if (isActive) {
      color = 'rgba(158,247,114,0.8)'
      status = 'active'
    }
    if (menteeExistMessage !== '') {
      if (get(bookingDate, 'mentorSession.user.id') !== get(mentor, 'id')) {
        color = '#F1F1F1'
        status = 'inactive'
      }
    }
    let batchExistMessage = ''
    if (batchExistWithEmptyStudent) {
      batchExistMessage = `${get(mentor, 'name')} is assigned to batch ${get(batchExistWithEmptyStudent, 'batch.code')} with 0 students, but you can select and assign it anyway.`
    }
    return {
      color, status, menteeExistMessage, prevOrNextSlotExist,
      showMentor, batchExistWithEmptyStudent,
      batchExistMessage
    }
  }

  renderMentors = (key) => {
    const {
      usersData
    } = this.props
    if (usersData) {
      const mentors = usersData && filterKey(usersData, key) && filterKey(usersData, key).toJS() || []
      if (mentors && mentors.length > 0) {
        return (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
            {this.getMentorsList(key).map(mentor => {
              if (this.getMentorBgAndStatus(mentor).showMentor) {
                return (
                  <Tooltip title={this.getMentorBgAndStatus(mentor).menteeExistMessage ||
                    this.getMentorBgAndStatus(mentor).prevOrNextSlotExist
                  || this.getMentorBgAndStatus(mentor).batchExistMessage}
                >
                  <MainTable.ItemContainer
                    backgroundColor={this.getMentorBgAndStatus(mentor).color}
                    onClick={() => {
                            if (
                                !(this.state.selectedMentorSessionId === mentor.sessionId) &&
                                !(this.getMentorBgAndStatus(mentor).status === 'inactive')
                                && !this.getMentorBgAndStatus(mentor).menteeExistMessage
                            ) {
                              this.setState({
                                selectedMentorSessionId: mentor.sessionId,
                                selectedMentorId: mentor.id
                              })
                            }
                    }}
                    disabled={
                            this.state.selectedMentorSessionId === mentor.sessionId
                            || this.getMentorBgAndStatus(mentor).status === 'inactive'
                    }
                      showDisabledFontColor={this.getMentorBgAndStatus(mentor).status === 'inactive'
                        || this.getMentorBgAndStatus(mentor).prevOrNextSlotExist
                        || this.getMentorBgAndStatus(mentor).batchExistMessage}
                  >
                    {mentor.name}
                  </MainTable.ItemContainer>
                </Tooltip>
                )
              }
            })}
          </div>
        )
      }
    }
    return <div />
  }

  renderCourseSelector = () => {
    const { courses } = this.props
    const { selectedCourse } = this.state
    if (courses && courses.length > 0) {
      return (
        <Select
          style={{ width: '100%' }}
          showSearch
          placeholder='Select a Course'
          optionFilterProp='children'
          name='selectedCourse'
          value={selectedCourse}
          disabled
          onChange={(value) => this.setState({ selectedCourse: value })}
          filterOption={(input, option) =>
            get(option.props, 'courseTitle')
              ? get(option.props, 'courseTitle').toLowerCase().indexOf(input.toLowerCase()) >= 0
              : false
          }
        >
          {
            courses.map(({ title, id }) =>
              <Option key={id}
                value={id}
                courseTitle={title}
              >
                <Tooltip title={title}>
                  {title}
                </Tooltip>
              </Option>
          )}
        </Select>
      )
    }
    return null
  }
  getMentor = (key) => {
    const { usersData } = this.props
    const mentors = usersData && filterKey(usersData, key) && filterKey(usersData, key).toJS() || []
    for (const mentor of mentors) {
      if (get(mentor, 'sessionId') === this.state.selectedMentorSessionId) {
        return mentor
      }
    }
    return {}
  }

  getMentorsList = (key) => {
    const { usersData } = this.props
    let mentors = usersData && filterKey(usersData, key) && filterKey(usersData, key).toJS() || []
    mentors = mentors.filter(mentor => get(mentor, 'role') === MENTOR && get(mentor, 'sessionType') === 'trial')
    return mentors
  }
  onOpenSessionModal = (sessionLink) => {
    if (sessionLink) {
      this.setState({
        sessionVideoModalShadowVisible: true,
        sessionLink
      })
    } else {
      this.setState({
        showSendLinkModal: true,
        sessionLink
      })
    }
  }
  renderSendLink = () => {
    const { menteeData } = this.props
    const { bookingDate: { sessionId } } = menteeData
    const { showSendLinkModal, sessionLink, sessionVideoModalShadowVisible } = this.state
    return (
      <SendSessionModalLink
        id='SendSessionModalLink'
        visible={showSendLinkModal}
        userId={get(menteeData, 'userId')}
        sessionId={sessionId}
        sessionLink={sessionLink}
        shadowVisible={sessionVideoModalShadowVisible}
        close={() => {
          this.setState({
            showSendLinkModal: false,
            sessionVideoModalShadowVisible: false
          })
        }}
      />
    )
  }
  closeSessionModal = () => {
    this.setState({
      showSessionExist: false,
      sessionExistData: null,
      batchSession: null
    })
  }
  renderExistModal = () => {
    const { showSessionExist, sessionExistData, batchSession, assignLoading } = this.state
    const existUser = get(sessionExistData, '[0].mentorSession.user.name')
    return (
      <MainModal
        visible={showSessionExist}
        title='Session already Booked'
        onCancel={this.closeSessionModal}
        maskClosable={false}
        width={`${hs(1000)}`}
        footer={null}
      >
        {
          batchSession ? (
            <div style={{ textAlign: 'center' }}>
              <h3>{get(batchSession, 'mentor.name')} is assigned to batch{' '}
                {get(batchSession, 'batchExistWithEmptyStudent.batch.code')} with 0 students,
              </h3>
              <h3><Button loading={assignLoading === 'batch'} onClick={async () => {
                this.setState({
                  assignLoading: 'batch'
                })
                await deleteBatchSession(get(batchSession, 'batchExistWithEmptyStudent.id'))
                this.setState({
                  showSessionExist: false,
                  batchSession: null
                })
                await this.onAssignClick()
                this.setState({
                  assignLoading: ''
                })
              }}>Click</Button> here to countinue.</h3>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3>session is already assigned to {existUser}</h3>
                <h3><Button loading={assignLoading === 'sessionExist'} onClick={async () => {
                  this.setState({
                    assignLoading: 'sessionExist'
                  })
                  await this.onProceedClick()
                  this.setState({
                    assignLoading: 'sessionExist'
                  })
              }}>Click</Button> here to update the mentor, or{' '}
                <Button onClick={() => window.location.reload()} icon='reload'>Refresh</Button> the page to see latest mentors.
              </h3>
            </div>
          )
        }
      </MainModal>
    )
  }

  onProceedClick = async () => {
    const { selectedCourse, selectedMentorId, selectedMentorSessionId,
      mentorMenteeSessionId } = this.state
    const { menteeData } = this.props
    const { bookingDate: { sessionId } } = menteeData
    if (sessionId && mentorMenteeSessionId && selectedMentorId) {
      await deleteMentorMenteeSession(mentorMenteeSessionId).then(async (res)=> {
        await addMentorMenteeSession(selectedMentorSessionId, sessionId,
        { sessionStatus: 'allotted' }, get(menteeData, 'bookingDate.topic.id'),
            selectedCourse).then(resp => {
            if (resp && resp.addMentorMenteeSession && resp.addMentorMenteeSession.id) {
            this.setState({
              mentorMenteeSessionId: get(resp, 'addMentorMenteeSession.id'),
              sendSessionLink: get(resp, 'addMentorMenteeSession.sendSessionLink'),
              defaultMentorId: this.state.selectedMentorId
            })
          }
        })
      })
  } else if (selectedMentorSessionId && selectedMentorId) {
    await addMentorMenteeSession(selectedMentorSessionId, sessionId,
      { sessionStatus: 'allotted' }, get(menteeData, 'bookingDate.topic.id'),
      selectedCourse).then(resp => {
        if (resp && resp.addMentorMenteeSession && resp.addMentorMenteeSession.id) {
          this.setState({
            mentorMenteeSessionId: get(resp, 'addMentorMenteeSession.id'),
            sendSessionLink: get(resp, 'addMentorMenteeSession.sendSessionLink'),
            defaultMentorId: this.state.selectedMentorId
          })
        }
      })
    }
    this.setState({
      showSessionExist: false,
      sessionExistData: null,
    })
  }

  getBatchWithEmptyStudent = (key) => {
    const { selectedMentorId, selectedMentorSessionId } = this.state
    const findMentor = this.getMentorsList(key).find(mentor => get(mentor, 'id') === selectedMentorId
      && get(mentor, 'sessionId') === selectedMentorSessionId)
    if (findMentor) {
      return {
        mentor: findMentor,
        batchExistWithEmptyStudent: get(this.getMentorBgAndStatus(findMentor), 'batchExistWithEmptyStudent')
      }
    }
    return null
  }

  onAssignClick = async () => {
    const { menteeData } = this.props
    const { bookingDate: { sessionId, bookingDate: date, slotNumber } } = menteeData
    const { selectedCourse, selectedMentorId, selectedMentorSessionId,
      defaultMentorId, mentorMenteeSessionId, assignLoading } = this.state
    if (sessionId && mentorMenteeSessionId && selectedMentorId) {
        if (get(menteeData, 'bookingDate.sessionStatus') !== 'allotted') {
        this.setState({
          selectedMentorSessionId: get(menteeData, 'bookingDate.mentorSession.id'),
          defaultMentorId: get(menteeData, 'bookingDate.mentorSession.user.id'),
          selectedMentorId: ''
        }, () => notification.error({
          message: 'Session already started/completed!'
        }))
        } else if (checkIfNotOldSlot(date, slotNumber)) {
          await getMentorMenteeSession(sessionId).then(async (response) => {
            if (get(response, 'data.mentorMenteeSessions', []).length > 0
              && get(response, 'data.mentorMenteeSessions[0].mentorSession.user.id') !== defaultMentorId) {
            this.setState({
              showSessionExist: true,
              sessionExistData: get(response, 'data.mentorMenteeSessions', [])
            })
            } else {
            await deleteMentorMenteeSession(mentorMenteeSessionId).then(async (res) => {
              await addMentorMenteeSession(selectedMentorSessionId, sessionId,
              { sessionStatus: 'allotted' }, get(menteeData, 'bookingDate.topic.id'),
                  selectedCourse).then(resp => {
                  if (resp && resp.addMentorMenteeSession && resp.addMentorMenteeSession.id) {
                  this.setState({
                    mentorMenteeSessionId: get(resp, 'addMentorMenteeSession.id'),
                    sendSessionLink: get(resp, 'addMentorMenteeSession.sendSessionLink'),
                    defaultMentorId: this.state.selectedMentorId,
                    selectedMentorId: '',
                    sessionStatus: get(resp, 'addMentorMenteeSession.sessionStatus')
                  })
                  }
              })
            })
            }
          })
        } else {
        this.setState({
          selectedMentorSessionId: get(menteeData, 'bookingDate.mentorSession.id'),
          defaultMentorId: get(menteeData, 'bookingDate.mentorSession.user.id'),
          selectedMentorId: ''
        }, () => notification.error({
          message: 'Cannot update old slots!'
        }))
        }
    } else if (selectedMentorSessionId && selectedMentorId) {
      if (checkIfNotOldSlot(date, slotNumber)) {
        await getMentorMenteeSession(sessionId).then(async (response) => {
          if (get(response, 'data.mentorMenteeSessions', []).length > 0) {
            this.setState({
              showSessionExist: true,
              sessionExistData: get(response, 'data.mentorMenteeSessions', [])
            })
          } else {
            await addMentorMenteeSession(selectedMentorSessionId, sessionId,
            { sessionStatus: 'allotted' }, get(menteeData, 'bookingDate.topic.id'),
            selectedCourse).then(resp => {
              if (resp && resp.addMentorMenteeSession && resp.addMentorMenteeSession.id) {
                this.setState({
                  mentorMenteeSessionId: get(resp, 'addMentorMenteeSession.id'),
                  sendSessionLink: get(resp, 'addMentorMenteeSession.sendSessionLink'),
                  defaultMentorId: this.state.selectedMentorId,
                  selectedMentorId: '',
                  sessionStatus: get(resp, 'addMentorMenteeSession.sessionStatus')
                })
              }
            })
          }
        })
        } else if (get(menteeData, 'bookingDate.sessionStatus') !== 'allotted') {
        this.setState({
          selectedMentorSessionId: get(menteeData, 'bookingDate.mentorSession.id'),
          defaultMentorId: get(menteeData, 'bookingDate.mentorSession.user.id'),
          selectedMentorId: ''
        }, () => notification.error({
            message: 'Session already started/completed!'
        }))
        } else {
          this.setState({
            selectedMentorSessionId: '',
            defaultMentorId: '',
            selectedMentorId: ''
          }, () => notification.error({
            message: 'Cannot assign mentor for old slots!'
          }))
        }
    }
  }

  renderAssignButton = () => {
    const { menteeData } = this.props
    const { bookingDate: { sessionId, bookingDate: date, slotNumber } } = menteeData
    const key = `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${slotNumber}`
    const { selectedMentorId, selectedMentorSessionId, assignLoading } = this.state
    const batchData = this.getBatchWithEmptyStudent(key)
    return (
      <UmsDashboardStyle.SlotButton
        allowHover={sessionId && selectedMentorSessionId
          && selectedMentorId && !assignLoading}
        fontSize='12px'
        width='auto'
        height='26px'
        hoverFontSize='14px'
        padding='10px'
        hoverColor='rgba(196, 248, 255, 1)'
        refresh
        onClick={async () => {
          if (!assignLoading) {
            if (get(batchData, 'batchExistWithEmptyStudent')) {
              this.setState({
                showSessionExist: true,
                batchSession: batchData
              })
            } else {
              this.setState({
                assignLoading: 'assign'
              })
              await this.onAssignClick()
              this.setState({
                assignLoading: ''
              })
            }
          }
        }}
      >
        {assignLoading === 'assign' && <Spin indicator={loadingIcon} />}
          Assign
      </UmsDashboardStyle.SlotButton>
    )
  }
  render() {
    const { visible, onClose, menteeData } = this.props
    const { bookingDate: { sessionId, bookingDate: date, startTime, slotNumber }, menteeName,
      parentName, email, phone, grade } = menteeData
    const key = `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${slotNumber}`
    const { mentorSessionFetchStatus } = this.props
    const loading = mentorSessionFetchStatus && get(mentorSessionFetchStatus.toJS()[key], 'loading')
    const tableStyle = {
      display: 'grid',
      gridTemplateColumns: '280px 65px 400px 300px 150px 140px',
      justifyContent: 'space-between',
      minWidth: 1335
    }
    const { selectedMentorSessionId,
      defaultMentorId, mentorMenteeSessionId } = this.state
    const canSendSessionLink = moment().isBefore(moment(date).hours(slotNumber).add(1, 'h')) &&
      get(this.state, 'sessionStatus') === 'allotted'
    return (
      <MainModal
        visible={visible}
        title={`Assign mentor (${new Date(date).toDateString()}, ${startTime})`}
        onCancel={onClose}
        maskClosable={false}
        width='90%'
        footer={null}
      >
        <Spin spinning={loading}>
          <Table style={{ width: '100%', overflowX: 'scroll' }}>
          <Table.Row style={tableStyle}>
              <Table.StickyItem style={{ left: 0 }}>
                <MainTable.Title style={{ width: 100 }}>Name</MainTable.Title>
                <MainTable.Title style={{ width: 160 }}>Parent Info</MainTable.Title>
              </Table.StickyItem>
            <Table.Item><MainTable.Title>Grade</MainTable.Title></Table.Item>
            <Table.Item><MainTable.Title>Assign a Mentor</MainTable.Title></Table.Item>
            <Table.Item><MainTable.Title>Course</MainTable.Title></Table.Item>
            <Table.Item><MainTable.Title>Action</MainTable.Title></Table.Item>
            <Table.Item><MainTable.Title>Send Link</MainTable.Title></Table.Item>
          </Table.Row>
            {this.renderSendLink()}
            {this.renderExistModal()}
            <MainTable.Row
            style={tableStyle}
            height='90px'
            >
              <Table.StickyItem style={{ left: 0 }}>
                <MainTable.Item style={{ width: 100 }}>{menteeName}</MainTable.Item>
                <MainTable.Item isHeightAuto style={{ width: 160 }}>
                  <div style={parentInfoStyles}>{parentName}</div>
                  <div style={parentInfoStyles}>{email}</div>
                  <div style={parentInfoStyles}>{phone}</div>
                </MainTable.Item>
              </Table.StickyItem>
            <Table.Item><MainTable.Item>{grade}</MainTable.Item></Table.Item>
            <Table.Item overflowY='scroll' alignItems='flex-start'>
            <MainTable.Item isHeightAuto>{this.renderMentors(key)}</MainTable.Item>
            </Table.Item>
            <Table.Item alignItems='flex-start'>
              {this.renderCourseSelector()}
            </Table.Item>
            <Table.Item>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <MainTable.Item>
                {this.renderAssignButton()}
                </MainTable.Item>
                <MainTable.Item>
                <UmsDashboardStyle.SlotButton
                  allowHover={sessionId && selectedMentorSessionId
                    && mentorMenteeSessionId
                    && defaultMentorId}
                  fontSize='12px'
                  width='66px'
                  height='26px'
                  hoverFontSize='14px'
                  marginTop='0'
                  refresh
                  hoverColor='rgba(196, 248, 255, 1)'
                  onClick={async () => {
                    if (sessionId && get(menteeData, 'bookingDate.mentorSession.id') &&
                      get(menteeData, 'bookingDate.sessionStatus') === 'completed') {
                      notification.error({
                        message: 'Cannot clear completed session'
                      })
                    } else if (selectedMentorSessionId && mentorMenteeSessionId) {
                      if (defaultMentorId) {
                        this.setState({
                          selectedMentorId: '',
                          defaultMentorId: '',
                          selectedMentorSessionId: ''
                        }, async () => {
                            await deleteMentorMenteeSession(mentorMenteeSessionId).then(res => {
                            this.setState({
                              mentorMenteeSessionId: ''
                            })
                          })
                        })
                      }
                    }
                  }}
                >
                  Clear
                </UmsDashboardStyle.SlotButton>
                </MainTable.Item>
            </div>
            </Table.Item>
            <Table.Item>
            <MainTable.Item>
              {mentorMenteeSessionId && defaultMentorId ? (
                <>
                  {get(this.state, 'sendSessionLink', false) ? (
                    <span style={{ color: '#73d13d' }}>Link sent</span>
                  ) : (
                    <Button
                      type='primary'
                      disabled={!canSendSessionLink}
                      onClick={() => {
                        this.onOpenSessionModal(get(this.getMentor(key), 'mentorProfile.sessionLink'))
                      }}
                    >
                      Send Link
                    </Button>
                  )}
                </>
              ) : (
                <span>-</span>
              )}
            </MainTable.Item>
          </Table.Item>
          </MainTable.Row>
          </Table>
        </Spin>
      </MainModal>
    )
  }
}

const mapStateToProps = (state) => ({
  mentorSessionFetchStatus: state.data.getIn(['mentorSession', 'fetchStatus']),
  usersData: state.data.getIn(['user', 'data']),
  mentorMenteeSessionDeleteStatus: state.data.getIn(['mentorMenteeSessions', 'deleteStatus', 'bookedSessions']),
  mentorMenteeSessionAddStatus: state.data.getIn(['mentorMenteeSessions', 'addStatus', 'bookedSessions']),
  mentorMenteeSessionAddFailure: state.data.getIn(['errors', 'mentorMenteeSessions/add']),
  mentorMenteeSessionDeleteFailure: state.data.getIn(['errors', 'mentorMenteeSessions/delete']),
  sendLinkStatus: state.data.getIn([
    'sendTransactionalMessage', 'fetchStatus', 'root'
  ]),
  sendLinkFailure: state.data.getIn([
    'errors', 'sendTransactionalMessage/fetch'
  ])
})

export default connect(mapStateToProps)(AssignMentorModal)
