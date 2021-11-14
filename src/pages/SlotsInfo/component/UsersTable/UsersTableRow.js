/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import moment from 'moment'
import { Button, Select, Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import { MENTEE, MENTOR } from '../../../../constants/roles'
import SlotsInfoStyle from '../../SlotsInfo.style'
import addMentorMenteeSession from '../../../../actions/sessions/addMentorMenteeSession'
import deleteMentorMenteeSession from '../../../../actions/sessions/deleteMentorMenteeSession'
import updateUser from '../../../../actions/ums/updateUser'
import getSlotLabel from '../../../../utils/slots/slot-label'
import MainModal from '../../../../components/MainModal'
import hs from '../../../../utils/scale'
import {
  checkIfNotOldSlot, getMentorFromBatch,
  getMentorMenteeSession, getSelectedSlots
} from './slots-utils'
import deleteBatchSession from '../../../../actions/ums/deleteBatchSession'

const { Option } = Select

const parentInfoStyles = {
  display: 'flex',
  width: '100%',
  height: '26px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'start'
}

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: 'black' }} spin />

class UsersTableRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMenteeSlotId: '',
      verificationStatus: props.verificationStatus,
      gender: props.gender,
      defaultMentorId: '',
      selectedMentorId: '',
      selectedCourse: get(props, 'course', ''),
      showSessionExist: false,
      sessionExistData: null,
      batchSession: null,
      dataFromSessionLogs: get(props, 'dataFromSessionLogs', false),
      assignLoading: ''
    }
  }

  componentDidMount() {
    this.setDefaultDetails()
  }

  setDefaultDetails = () => {
    const { mentors, mentorMenteeSessionObj, sessionId, coursesList, course } = this.props
    mentors.forEach(mentor => {
      if (
        mentorMenteeSessionObj[sessionId] &&
        get(mentorMenteeSessionObj[sessionId].mentor, '0.sessionId') === mentor.sessionId &&
        !get(mentorMenteeSessionObj[sessionId].mentor, '0.showRed') &&
        !this.state.defaultMentorId.length
      ) {
        this.setState({
          defaultMentorId: mentor.id
        })
      }
    })
    if (course) {
      this.setState({
        selectedCourse: course
      })
    } else if (coursesList && coursesList.length > 0) {
      this.setState({
        selectedCourse: get(coursesList, '[0].id')
      })
    }
  }
  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.setDefaultDetails()
    }
  }

  getMentor = () => {
    const { mentors = [] } = this.props
    for (const mentor of mentors) {
      if (get(mentor, 'sessionId') === this.state.selectedMenteeSlotId) {
        return mentor
      }
    }
    return {}
  }

  getMentorBgAndStatus = (mentor) => {
    const { mentorMenteeSessionObj, sessionId, userInfoKeys: { time }, id } = this.props
    const batchSessions = get(mentor, 'batchSessions', [])
    const menteeSessions = get(mentor, 'existMenteeSession', [])
    let menteeExistMessage = ''
    const { showMentor, batchExistWithEmptyStudent } = getMentorFromBatch(batchSessions, time)
    const mentorSlotsArray = []
    if (menteeSessions && menteeSessions.length > 0) {
      menteeSessions.forEach(mmSession => {
        if (get(mmSession, 'user.id') !== id) {
          const selectedSlots = getSelectedSlots(mmSession)
          mentorSlotsArray.push(...selectedSlots)
          if (selectedSlots.length > 0 && selectedSlots.includes(`slot${time}`)
            && get(mmSession, 'user.name')) {
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
      prevOrNextSlotExist = `Mentor is already booked at ${prevSlot ? `${prevSlot}` : ''}
       ${nextSlot ? `${prevSlot ? 'or' : ''} ${nextSlot}` : ''}, but you can assign it anyway.`
    }
    const isActive = this.state.selectedMenteeSlotId === mentor.sessionId ||
                      (
                        mentorMenteeSessionObj[sessionId] &&
                        get(mentorMenteeSessionObj[sessionId].mentor, '0.sessionId') === mentor.sessionId &&
                        !get(mentorMenteeSessionObj[sessionId].mentor, '0.showRed') &&
                        !this.state.selectedMenteeSlotId.length
                      )
    // const keys = Object.keys(mentorMenteeSessionObj)
    let color = '#ffffff'
    let status = 'noStatus'
    if (isActive) {
      color = 'rgba(158,247,114,0.8)'
      status = 'active'
    }
    // else {
    //   for (let i = 0; i < keys.length; i += 1) {
    //     if (get(mentorMenteeSessionObj[keys[i]], 'mentor.0.id') === mentor.id
    //       && !(mentor.id === this.state.defaultMentorId)) {
    //       color = '#F1F1F1'
    //       status = 'inactive'
    //       break
    //     }
    //   }
    // }
    if (menteeExistMessage !== '') {
      if (get(mentorMenteeSessionObj[sessionId], 'mentor.0.id') !== get(mentor, 'id')) {
        color = '#F1F1F1'
        status = 'inactive'
      }
    }
    let batchExistMessage = ''
    if (batchExistWithEmptyStudent) {
      batchExistMessage = `${get(mentor, 'name')} is assigned to batch 
      ${get(batchExistWithEmptyStudent, 'batch.code')} with 0 students, but you can select and assign it anyway.`
    }
    return {
      color,
      status,
      menteeExistMessage,
      prevOrNextSlotExist,
      showMentor,
      batchExistWithEmptyStudent,
      batchExistMessage
    }
  }

  onAssignClick = async () => {
    const {
      topicId,
      sessionId,
      notification,
      userInfoKeys: { date, time },
    } = this.props
    const { selectedCourse } = this.state
    if (
      this.props.mentorMenteeSessionObj &&
      this.props.mentorMenteeSessionObj[sessionId] &&
      this.props.mentorMenteeSessionObj[sessionId].id
    ) {
      if (get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) !== 'allotted') {
        this.setState({
          selectedMenteeSlotId: get(this.props.mentorMenteeSessionObj, `${sessionId}.mentor.0.sessionId`)
        }, () => notification.error({
          message: 'Session already started/completed!'
        }))
      } else if (this.state.verificationStatus === 'notQualified') {
        notification.error({
          message: 'Cannot assign mentor to notQualified lead'
        })
      } else if (checkIfNotOldSlot(date, time)) {
        await getMentorMenteeSession(sessionId)
          .then(async (res) => {
            if (get(res, 'data.mentorMenteeSessions', []).length > 0) {
              this.setState({
                showSessionExist: true,
                sessionExistData: get(res, 'data.mentorMenteeSessions', [])
              })
            } else {
              this.setState({
                defaultMentorId: this.state.selectedMentorId
              }, async () => {
                await this.props.updateLinkedMentorId(
                  get(this.props.mentorMenteeSessionObj, `${sessionId}.mentor.0.id`),
                  get(this.props.mentorMenteeSessionObj, `${sessionId}.present`)
                )
                await this.props.updateAssignedMentor(
                  get(this.props.mentorMenteeSessionObj, `${sessionId}.id`),
                  this.state.selectedMenteeSlotId,
                  sessionId, topicId, date, time, selectedCourse
                )
              })
            }
          })
      } else {
        this.setState({
          selectedMenteeSlotId: get(this.props.mentorMenteeSessionObj, `${sessionId}.mentor.0.sessionId`)
        }, () => notification.error({
          message: 'Cannot update old slots!'
        }))
      }
    } else if (this.state.selectedMenteeSlotId
      && this.state.selectedMenteeSlotId.length) {
      if (this.state.verificationStatus === 'notQualified') {
        notification.error({
          message: 'Cannot assign mentor to notQualified lead'
        })
      } else if (checkIfNotOldSlot(date, time)) {
        await getMentorMenteeSession(sessionId)
          .then(async (res) => {
            if (get(res, 'data.mentorMenteeSessions', []).length > 0) {
              this.setState({
                showSessionExist: true,
                sessionExistData: get(res, 'data.mentorMenteeSessions', [])
              })
            } else {
              this.setState({
                defaultMentorId: this.state.selectedMentorId
              }, async () => {
                await addMentorMenteeSession(
                  this.state.selectedMenteeSlotId, sessionId, topicId, date, time,
                  { sessionStatus: 'allotted' },
                  null,
                  selectedCourse
                )
                await this.props.updateCurrMenteeSessionId(sessionId)
              })
            }
          })
      } else if (
        this.props.mentorMenteeSessionObj &&
        this.props.mentorMenteeSessionObj[sessionId] &&
        get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) &&
        get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) !== 'allotted') {
        this.setState({
          selectedMenteeSlotId: get(this.props.mentorMenteeSessionObj, `${sessionId}.mentor.0.sessionId`)
        }, () => notification.error({
          message: 'Session already started/completed!'
        }))
      } else {
        this.setState({
          selectedMenteeSlotId: ''
        }, () => notification.error({
          message: 'Cannot assign mentor for old slots!'
        }))
      }
    }
  }
  getBatchWithEmptyStudent = () => {
    const { mentors,
      mentorMenteeSessionObj,
      sessionId } = this.props
    let mentorList = mentors && mentors.length ? mentors : []
    mentorList = mentorList.filter(mentor => (get(mentorMenteeSessionObj[sessionId], 'mentor.0.id')
      === get(mentor, 'id') && get(mentor, 'role') === MENTOR)
      || (get(mentor, 'role') === MENTOR && get(mentor, 'sessionType') === 'trial'))
    const { selectedMenteeSlotId, selectedMentorId } = this.state
    const findMentor = mentorList.find(mentor => get(mentor, 'id') === selectedMentorId
      && get(mentor, 'sessionId') === selectedMenteeSlotId)
    if (findMentor) {
      return {
        mentor: findMentor,
        batchExistWithEmptyStudent: get(this.getMentorBgAndStatus(findMentor), 'batchExistWithEmptyStudent')
      }
    }
    return null
  }
  renderAssignButton = () => {
    const { selectedMenteeSlotId, verificationStatus, assignLoading } = this.state
    const batchData = this.getBatchWithEmptyStudent()
    return (
      <SlotsInfoStyle.StyledButton
        allowHover={
          (selectedMenteeSlotId ? selectedMenteeSlotId.length
            && verificationStatus !== 'notQualified' : 0) || !assignLoading
        }
        fontSize='12px'
        width='66px'
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
      </SlotsInfoStyle.StyledButton>
    )
  }
  renderMentors = () => {
    const {
      mentors,
      mentorMenteeSessionObj,
      sessionId
    } = this.props
    if (mentors) {
      if (mentors) {
        return (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
            {mentors.filter(mentor => (get(mentorMenteeSessionObj[sessionId], 'mentor.0.id') === get(mentor, 'id') && get(mentor, 'role') === MENTOR)
              || (get(mentor, 'role') === MENTOR && get(mentor, 'sessionType') === 'trial')).map(mentor => {
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
                                    !mentor.showRed &&
                                    !(this.state.selectedMenteeSlotId === mentor.sessionId) &&
                                    !(this.getMentorBgAndStatus(mentor).status === 'inactive')
                                    && !this.getMentorBgAndStatus(mentor).menteeExistMessage
                                ) {
                                  this.setState({
                                    selectedMenteeSlotId: mentor.sessionId,
                                    selectedMentorId: mentor.id
                                  })
                                }
                        }}
                        showRed={
                                mentorMenteeSessionObj[sessionId] &&
                                get(mentorMenteeSessionObj[sessionId].mentor, '0.id') === mentor.id &&
                                !mentorMenteeSessionObj[sessionId].present
                        }
                        disabled={
                                (
                                    mentorMenteeSessionObj[sessionId] &&
                                    get(mentorMenteeSessionObj[sessionId].mentor, '0.id') === mentor.id &&
                                    !mentorMenteeSessionObj[sessionId].present
                                ) ||
                                this.state.selectedMenteeSlotId === mentor.sessionId
                                || (
                                    mentorMenteeSessionObj[sessionId] &&
                                    get(mentorMenteeSessionObj[sessionId].mentor, '0.sessionId') === mentor.sessionId &&
                                    !get(mentorMenteeSessionObj[sessionId].mentor, '0.showRed') &&
                                    !this.state.selectedMenteeSlotId.length
                                ) ||
                                this.getMentorBgAndStatus(mentor).status === 'inactive'
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
  getDefaultMentor = () => {
    // const { defaultMentorId } = this.state
    const { mentors, mentorMenteeSessionObj, sessionId } = this.props
    let mentorData = null
    if (mentors && mentors.length > 0) {
      mentorData = mentors.find(mentor => (get(mentorMenteeSessionObj[sessionId], 'mentor.0.id') === get(mentor, 'id') && get(mentor, 'role') === MENTOR)
        || (get(mentor, 'role') === MENTOR && get(mentor, 'sessionType') === 'trial'))
    }
    if (mentorData) {
      return (
        <Tooltip title={this.getMentorBgAndStatus(mentorData).menteeExistMessage ||
          this.getMentorBgAndStatus(mentorData).prevOrNextSlotExist}
        >
          <MainTable.ItemContainer
            backgroundColor={this.getMentorBgAndStatus(mentorData).color}
            showRed={
                    mentorMenteeSessionObj[sessionId] &&
                    get(mentorMenteeSessionObj[sessionId].mentor, '0.id') === mentorData.id &&
                    !mentorMenteeSessionObj[sessionId].present
            }
            disabled={
                    (
                        mentorMenteeSessionObj[sessionId] &&
                        get(mentorMenteeSessionObj[sessionId].mentor, '0.id') === mentorData.id &&
                        !mentorMenteeSessionObj[sessionId].present
                    ) ||
                    this.state.selectedMenteeSlotId === mentorData.sessionId
                    || (
                        mentorMenteeSessionObj[sessionId] &&
                        get(mentorMenteeSessionObj[sessionId].mentor, '0.sessionId') === mentorData.sessionId &&
                        !get(mentorMenteeSessionObj[sessionId].mentor, '0.showRed') &&
                        !this.state.selectedMenteeSlotId.length
                    ) ||
                    this.getMentorBgAndStatus(mentorData).status === 'inactive'
            }
            showDisabledFontColor={this.getMentorBgAndStatus(mentorData).status === 'inactive'}
          >
            {mentorData.name}
          </MainTable.ItemContainer>
        </Tooltip>
      )
    }
    return null
  }
  renderCourseSelector = () => {
    const { coursesList } = this.props
    const { selectedCourse } = this.state
    if (coursesList && coursesList.length > 0) {
      return (
        <Select
          style={{ width: 200 }}
          showSearch
          placeholder='Select a Course'
          optionFilterProp='children'
          name='selectedCourse'
          value={selectedCourse}
          disabled
          onChange={(value) => this.setState({ selectedCourse: value })}
          // filterOption={(input, option) =>
          //   option.props.children
          //     ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          //     : false
          // }
        >
          {
            coursesList && coursesList.map(({ title, id }) =>
              <Option key={id}
                value={id}
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

  closeSessionModal = () => {
    this.setState({
      showSessionExist: false,
      sessionExistData: null
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
              <h3>
                <Button loading={assignLoading === 'batch'}
                  onClick={async () => {
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
                  }}
                >Click
                </Button> here to countinue.
              </h3>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3>session is already assigned to {existUser}</h3>
              <h3>
                <Button loading={assignLoading === 'sessionExist'}
                  onClick={async () => {
                  this.setState({
                    assignLoading: 'sessionExist'
                  })
                  await this.onProceedClick()
                  this.setState({
                    assignLoading: ''
                  })
              }}
                >Click
                </Button> here to update the mentor, or{' '}
                <Button onClick={() => window.location.reload()} icon='reload'>Refresh</Button> the page to see latest mentors.
              </h3>
            </div>
          )
        }
      </MainModal>
    )
  }

  onProceedClick = async () => {
    const { sessionId, topicId, userInfoKeys: { date, time } } = this.props
    const { selectedCourse } = this.state
    if (
      this.props.mentorMenteeSessionObj &&
      this.props.mentorMenteeSessionObj[sessionId] &&
      this.props.mentorMenteeSessionObj[sessionId].id
    ) {
      this.setState({
        defaultMentorId: this.state.selectedMentorId
      }, async () => {
        await this.props.updateLinkedMentorId(
          get(this.props.mentorMenteeSessionObj, `${sessionId}.mentor.0.id`),
          get(this.props.mentorMenteeSessionObj, `${sessionId}.present`)
        )
        await this.props.updateAssignedMentor(
          get(this.props.mentorMenteeSessionObj, `${sessionId}.id`),
          this.state.selectedMenteeSlotId,
          sessionId, topicId, date, time, selectedCourse
        )
      })
    } else if (this.state.selectedMenteeSlotId
      && this.state.selectedMenteeSlotId.length) {
      this.setState({
        defaultMentorId: this.state.selectedMentorId
      }, async () => {
        await addMentorMenteeSession(
          this.state.selectedMenteeSlotId, sessionId, topicId, date, time,
          { sessionStatus: 'allotted' },
          null,
          selectedCourse
        )
        await this.props.updateCurrMenteeSessionId(sessionId)
      })
    }
    this.setState({
      showSessionExist: false,
      sessionExistData: null
    })
  }

  renderLogMentor = () => {
    if (get(this.props, 'mentor')) {
      return (
        <MainTable.ItemContainer
          backgroundColor='#ecdffb'
          disabled
          showDisabledFontColor
        >
          {get(this.props, 'mentor.name')}
        </MainTable.ItemContainer>
      )
    }
  }
  render() {
    const {
      id,
      order,
      name,
      username,
      email,
      phone,
      parentName,
      columnsTemplate,
      noBorder,
      minWidth,
      role,
      topicOrder,
      sessionId,
      notification,
      grade,
      userInfoKeys: { date, time },
      source
    } = this.props
    const { gender, verificationStatus, dataFromSessionLogs } = this.state
    const key = `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}`
    const backgroundColor = source === 'transformation' ? 'rgba(0, 0, 0, 0.03)' : '#fff'
    const canSendSessionLink = moment().isBefore(moment(date).hours(time).add(1, 'h')) &&
      get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) === 'allotted'
    return (
      <MainTable.Row
        columnsTemplate={columnsTemplate}
        noBorder={noBorder}
        minWidth={minWidth}
        height={this.props.currentRole === MENTEE ? '90px' : '48px'}
        backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}
      >
        {this.renderExistModal()}
        <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}><MainTable.Item isInlineItem>{order}</MainTable.Item></Table.Item>
        <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}><MainTable.Item>{name || username}</MainTable.Item></Table.Item>
        {
              role === MENTEE
                  && (
                  <Table.Item alignItems='flex-start' justifyContent='flex-start' backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}>
                    <MainTable.Item isHeightAuto>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div style={parentInfoStyles}>{parentName}</div>
                        <div style={parentInfoStyles}>{email}</div>
                        <div style={parentInfoStyles}>{phone}</div>
                      </div>
                    </MainTable.Item>
                  </Table.Item>
              )
        }
        {
          role !== MENTEE && <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}><MainTable.Item>{email}</MainTable.Item></Table.Item>
        }
        {
          role !== MENTEE && <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}><MainTable.Item>{phone}</MainTable.Item></Table.Item>
        }
        {
          role === MENTEE
          && <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}><MainTable.Item>{grade ? grade.substr(5, grade.length) : ''}</MainTable.Item></Table.Item>
        }
        {
          role === MENTEE
          && (
            <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}>
              <MainTable.Item isHeightAuto>
                <SlotsInfoStyle.StatusBox
                  width='70px'
                  backgroundColor={gender === 'male' ? 'rgba(158,247,114,0.6)' : '#fff'}
                  hoverBackgroundColor='rgba(158,247,114,0.6)'
                  hoverCursor={gender !== 'male' && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                  onClick={() => {
                    if (!dataFromSessionLogs) {
                      if (gender !== 'male') {
                        this.setState({ gender: 'male' })
                        updateUser(id, { gender: 'male' })
                      }
                    }
                  }}
                >
                  Male
                </SlotsInfoStyle.StatusBox>
                <SlotsInfoStyle.StatusBox
                  width='70px'
                  backgroundColor={gender === 'female' ? 'rgba(158,247,114,0.6)' : '#fff'}
                  hoverBackgroundColor='rgba(158,247,114,0.6)'
                  hoverCursor={gender !== 'female' && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                  onClick={() => {
                    if (!dataFromSessionLogs) {
                      if (gender !== 'female') {
                        this.setState({ gender: 'female' })
                        updateUser(id, { gender: 'female' })
                      }
                    }
                  }}
                >
                  Female
                </SlotsInfoStyle.StatusBox>
                <SlotsInfoStyle.StatusBox
                  width='70px'
                  backgroundColor={gender === 'others' ? 'rgba(158,247,114,0.6)' : '#fff'}
                  hoverBackgroundColor='rgba(158,247,114,0.6)'
                  hoverCursor={gender !== 'others' && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                  onClick={() => {
                    if (!dataFromSessionLogs) {
                      if (gender !== 'others') {
                        this.setState({ gender: 'others' })
                        updateUser(id, { gender: 'others' })
                      }
                    }
                  }}
                >
                  Others
                </SlotsInfoStyle.StatusBox>
              </MainTable.Item>
            </Table.Item>
          )
        }
        {
          role === MENTEE
          && (
            <Table.Item backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <MainTable.Item isHeightAuto>
                  <SlotsInfoStyle.StatusBox
                    backgroundColor={verificationStatus === 'verified' ? 'rgba(158,247,114,0.6)' : '#fff'}
                    hoverBackgroundColor='rgba(158,247,114,0.6)'
                    hoverCursor={verificationStatus !== 'verified' && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                    onClick={() => {
                      if (verificationStatus !== 'verified' && !dataFromSessionLogs) {
                        this.setState({ verificationStatus: 'verified' })
                        updateUser(id, { verificationStatus: 'verified' })
                      }
                    }}
                  >
                    Verified
                  </SlotsInfoStyle.StatusBox>
                  <SlotsInfoStyle.StatusBox
                    backgroundColor={verificationStatus === 'notQualified' ? 'rgba(187, 0, 34, 0.3)' : '#fff'}
                    hoverBackgroundColor='rgba(187, 0, 34, 0.3)'
                    hoverCursor={verificationStatus !== 'notQualified' && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                    onClick={() => {
                      if (verificationStatus !== 'notQualified' && !dataFromSessionLogs) {
                        const mentorSessionExist = this.props.mentorMenteeSessionObj[sessionId]
                        this.setState({ verificationStatus: 'notQualified' })
                        updateUser(id, { verificationStatus: 'notQualified' }).then(() => {
                          if (mentorSessionExist && mentorSessionExist.id) {
                            deleteMentorMenteeSession(mentorSessionExist.id, key)
                            .catch(error => console.log(error))
                          }
                        })
                      }
                    }}
                  >
                    Not qualified
                  </SlotsInfoStyle.StatusBox>
                  <SlotsInfoStyle.StatusBox
                    backgroundColor={verificationStatus === 'empty' || verificationStatus === 'unverified' ? 'rgba(0, 0, 0, 0.1)' : '#fff'}
                    hoverBackgroundColor='rgba(0, 0, 0, 0.1)'
                    hoverCursor={verificationStatus !== 'empty' && verificationStatus !== 'unverified'
                      && !dataFromSessionLogs ? 'pointer' : 'not-allowed'}
                    onClick={() => {
                      if (verificationStatus !== 'empty' && verificationStatus !== 'unverified'
                        && !dataFromSessionLogs) {
                        this.setState({ verificationStatus: 'unverified' })
                        updateUser(id, { verificationStatus: 'unverified' })
                      }
                    }}
                  >
                    Unverified
                  </SlotsInfoStyle.StatusBox>
                </MainTable.Item>
                {/* <div style={{ marginTop: '3px' }}>
                  <MainTable.ActionItem.EditIcon size='18px' onClick={() => {}} />
                </div> */}
              </div>
            </Table.Item>
          )
        }
        {
          role === MENTEE && (
            <Table.Item overflowY='scroll' alignItems='flex-start' backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}>
              <MainTable.Item isHeightAuto>{
                dataFromSessionLogs ?
                this.renderLogMentor() : this.renderMentors()}
              </MainTable.Item>
            </Table.Item>
          )
        }
        {
          role === MENTEE
          && (
            <Table.Item overflowY='scroll' alignItems='flex-start' backgroundColor={dataFromSessionLogs ? '#faf6ff' : 'white'}>
              <MainTable.Item isHeightAuto>
                {this.renderCourseSelector()}
                {/* {this.getDefaultMentor()} */}
              </MainTable.Item>
            </Table.Item>
          )
        }
        {
          role === MENTEE && !dataFromSessionLogs &&
          <Table.Item backgroundColor={backgroundColor}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <MainTable.Item style={{ width: '100%' }}>
                {this.renderAssignButton()}
              </MainTable.Item>
              <MainTable.Item>
                <SlotsInfoStyle.StyledButton
                  allowHover={
                    (this.state.selectedMenteeSlotId && this.state.selectedMenteeSlotId.length) ||
                    (
                        this.props.mentorMenteeSessionObj[sessionId] &&
                        this.props.mentorMenteeSessionObj[sessionId].id
                    )
                  }
                  fontSize='12px'
                  width='66px'
                  height='26px'
                  hoverFontSize='14px'
                  marginTop='0'
                  refresh
                  hoverColor='rgba(196, 248, 255, 1)'
                  onClick={async () => {
                    if (this.props.mentorMenteeSessionObj &&
                        this.props.mentorMenteeSessionObj[sessionId] &&
                        get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) &&
                      get(this.props.mentorMenteeSessionObj, `${sessionId}.sessionStatus`) === 'completed') {
                        notification.error({
                          message: 'Cannot clear completed session'
                        })
                    } else {
                      if (this.state.selectedMenteeSlotId.length) {
                        this.setState({ selectedMenteeSlotId: '' })
                      }
                      if (
                          this.props.mentorMenteeSessionObj[sessionId] &&
                          this.props.mentorMenteeSessionObj[sessionId].id
                      ) {
                        this.setState({
                          defaultMentorId: ''
                        }, async () => {
                          const mentorSessionData = this.props.mentorMenteeSessionObj[sessionId]
                          await deleteMentorMenteeSession(
                            mentorSessionData.id, key
                          ).then((res) => {
                            this.props.updateLinkedMentorId(
                              mentorSessionData.mentor[0].id,
                              mentorSessionData.present,
                              get(res, 'deleteMentorMenteeSession.menteeSession.id')
                            )
                            this.setState({
                              defaultMentorId: ''
                            })
                          })
                        })
                      }
                    }
                  }}
                >
                    Clear
                </SlotsInfoStyle.StyledButton>
              </MainTable.Item>
            </div>
          </Table.Item>
        }
        {role === MENTEE && !dataFromSessionLogs && (
          <Table.Item backgroundColor={backgroundColor}>
            <MainTable.Item>
              {(topicOrder === 1 && !!Object.keys(this.props.mentorMenteeSessionObj).length) ? (
                <>
                  {get(this.props.mentorMenteeSessionObj, `${sessionId}.sendSessionLink`, false) ? (
                    <span style={{ color: '#73d13d' }}>Link sent</span>
                  ) : (
                    <Button
                      type='primary'
                      disabled={!canSendSessionLink}
                      onClick={() => {
                        this.props.openSendSessionModal(
                          this.props.id,
                          sessionId,
                          get(this.getMentor(), 'mentorProfile.sessionLink')
                        )
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
        )}
      </MainTable.Row>
    )
  }
}

UsersTableRow.propTypes = {
  order: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  minWidth: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  topicOrder: PropTypes.number.isRequired,
  mentors: PropTypes.shape([]).isRequired,
  userInfoKeys: PropTypes.shape({}).isRequired,
  currentRole: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  mentorMenteeSessionObj: PropTypes.shape({}).isRequired,
  usedMentorSlots: PropTypes.shape([]).isRequired,
  notification: PropTypes.shape({}).isRequired,
  updateAssignedMentor: PropTypes.func.isRequired,
  updateCurrMenteeSessionId: PropTypes.func.isRequired,
  updateLinkedMentorId: PropTypes.func.isRequired
}

export default UsersTableRow
