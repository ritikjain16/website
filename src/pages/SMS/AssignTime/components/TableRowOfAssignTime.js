// import { filter } from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'
import cx from 'classnames'
import { Popconfirm } from 'antd'
import { get } from 'lodash'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import deleteBatchSession from '../../../../actions/assignTime/deleteBatchSession'
import getSlotLabel from '../../../../utils/slots/slot-label'
import updateMentorSession from '../../../../actions/assignTime/updateMentorSession'
import styles from '../icon.module.scss'
import SessionUpdateModal from './Modals/SessionUpdateModal'

class TableRowOfAssignTime extends Component {
  state = {
    linkModalVisible: false,
    editType: ''
  }
  setHoursZero = (date) => new Date(date).setHours(0, 0, 0, 0)
  showButtons = (input) => <>
    <MainTable.ActionItem.IconWrapper style={{ marginRight: '15px' }} onClick={() => this.props.showModal('edit', this.props.data)}>
      <MainTable.ActionItem.EditIcon />
    </MainTable.ActionItem.IconWrapper>
    <div>
      <Popconfirm
        title='Do you want to delete this session?'
        placement='topRight'
        onConfirm={() => {
          updateMentorSession(input, this.props.mentorUserId)
          deleteBatchSession(this.props.data.id).call()
        }}
        okText='Yes'
        cancelText='Cancel'
        key='delete'
        overlayClassName='popconfirm-overlay-primary'
      >
        <MainTable.ActionItem.IconWrapper>
          <MainTable.ActionItem.DeleteIcon />
        </MainTable.ActionItem.IconWrapper>
      </Popconfirm>
    </div>
  </>
  showEditButtons = (type, status) =>
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={cx(this.getIconName(type, status), styles.icon)}
      onClick={() => {
        this.setState({
          editType: type
        }, () => this.openLinkModal())
      }}
    />

  openLinkModal = () => {
    this.setState({
      linkModalVisible: true
    })
  }

  getIconName = (type, status) => {
    if (type === 'comment') {
      return status ? styles.completedIcon : styles.notCompletedIcon
    } else if (type === 'link') {
      return status ? styles.videoLinkYes : styles.videoLinkNo
    } else if (type === 'feedback') {
      return status ? styles.feedbackYes : styles.feedbackNo
    }
    return ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isUpdatingBatchSession && this.props.hasUpdatedBatchSession) {
      this.setState({
        linkModalVisible: false,
        editType: ''
      })
    }
  }
  render() {
    const { linkModalVisible, editType } = this.state
    const {
      columnsTemplate,
      minWidth,
      index,
      isUpdatingBatchSession,
      hasUpdatedBatchSession
    } = this.props
    const {
      mentorSession,
      bookingDate,
      sessionStartDate,
      sessionEndDate,
      sessionRecordingLink,
      sessionCommentByMentor,
      topic,
      sessionStatus,
      id
    } = this.props.data
    // console.log('data', this.props.data)
    const allottedMentor = get(mentorSession, 'user')
    const topicTitle = this.props.topic.filter(topicData => topicData.id === topic.id)
    let timeToDisplay = '-'
    let slot = ''
    for (let i = 0; i <= 23; i += 1) {
      if (this.props.data[`slot${i}`] === true) {
        slot = `slot${i}`
        timeToDisplay = `${getSlotLabel(i).startTime}`
      }
    }
    let input = {}
    if (slot !== '') {
      const slotStatusObj = { [slot]: false }
      input = {
        availabilityDate: `${bookingDate}`,
        ...slotStatusObj,
      }
    }
    let intervalToDisplay = ''
    if (sessionStartDate && sessionEndDate) {
      const duration = moment(sessionEndDate).diff(moment(sessionStartDate))
      const d = moment.duration(duration)
      intervalToDisplay = `${Math.floor(d.asHours())}${moment.utc(duration).format(':mm')}`
    }
    return (
      <>
        <MainTable.Row
          columnsTemplate={columnsTemplate}
          minWidth={minWidth}
          backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
        >
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{index + 1}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{!topicTitle || !topicTitle[0] ? '-' : topicTitle[0].title}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{moment(bookingDate).format('MMMM Do YYYY')}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{timeToDisplay}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{!allottedMentor ? '-' : allottedMentor.name}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>-</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{!sessionStartDate || sessionStatus === 'allotted' ? '-' : moment(sessionStartDate).format('h:mm a')}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{!sessionEndDate ? '-' : moment(sessionEndDate).format('h:mm a')}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{intervalToDisplay}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{this.showEditButtons('link', sessionRecordingLink)}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            <MainTable.Item>{this.showEditButtons('comment', sessionCommentByMentor)}</MainTable.Item>
          </Table.Item>
          <Table.Item
            backgroundColor={sessionStatus === 'completed' ? '#B5F2D3' : '#FAFCD8'}
          >
            {sessionStatus !== 'completed' ? this.showButtons(input) : ''}
          </Table.Item>
        </MainTable.Row>
        <SessionUpdateModal
          closeModal={() => this.setState({
            linkModalVisible: false,
            editType: ''
          })}
          visible={linkModalVisible}
          title={editType === 'link' ? 'Session Link' : 'Mentor Comment'}
          sessionRecordingLink={sessionRecordingLink}
          sessionCommentByMentor={sessionCommentByMentor}
          topicTitle={topicTitle}
          timeToDisplay={timeToDisplay}
          bookingDate={moment(bookingDate).format('MMMM Do YYYY')}
          batchSessionId={id}
          editType={editType}
          defaultVal={editType === 'link' ? sessionRecordingLink : sessionCommentByMentor}
          isUpdatingBatchSession={isUpdatingBatchSession}
          hasUpdatedBatchSession={hasUpdatedBatchSession}
          mentorSession={mentorSession}
        />
      </>
    )
  }
}


export default TableRowOfAssignTime
