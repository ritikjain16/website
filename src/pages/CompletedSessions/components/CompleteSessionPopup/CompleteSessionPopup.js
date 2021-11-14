import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import MainModal from '../../../../components/MainModal'
import hs from '../../../../utils/scale'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { ADMIN } from '../../../../constants/roles'
import updateMentorMenteeSession from '../../../../actions/sessions/updateMentorMenteeSession'
import updateSheet from '../../../../utils/updateSheet'

class CompleteSessionPopup extends Component {
  componentDidUpdate(prevProps) {
    const { updateStatus, notification, closeModal, visible } = this.props
    if (prevProps.updateStatus && updateStatus && visible) {
      if (!prevProps.updateStatus.success && updateStatus.success) {
        notification.success({
          message: 'Session status Updated!'
        })
        closeModal()
      }
    }
  }

  getModalTitle = (title) => {
    const { studentName, topic, sessionDetails, mentorName } = this.props
    const userRole = getDataFromLocalStorage('login.role')
    const titleArr = [`${title}`, <br />, <br />, `(${studentName} | ${topic.title} | ${sessionDetails.sessionDate} : ${sessionDetails.sessionTime})`]
    if (userRole === ADMIN) {
      titleArr.push(<br />)
      titleArr.push(<br />)
      titleArr.push(`Session Taken By: ${mentorName}`)
    }
    return titleArr
  }

  onSave = async () => {
    const { sessionDetails } = this.props
    const input = {
      sessionStatus: 'completed'
    }
    await updateMentorMenteeSession(sessionDetails.sessionId, input)
    updateSheet({}, {
      Phone: this.props.phone,
      mx_Lead_Status: 'Session Taken',
      ProspectStage: 'Session Taken'
    })
  }

  render() {
    const {
      visible, title, closeModal, updateStatus
    } = this.props

    return (
      <MainModal
        visible={visible}
        title={this.getModalTitle(title)}
        width='620px'
        onCancel={closeModal}
        maskClosable
        styles={{
            marginTop: `${hs(150)}`
        }}
        footer={[
          <Button onClick={() => closeModal()}>NO</Button>,
          <MainModal.SaveButton
            onClick={() => this.onSave()}
          > {updateStatus && updateStatus.loading ? 'YES...' : 'YES'}
          </MainModal.SaveButton>
        ]}
      >
        <div style={{ fontSize: hs(24), fontFamily: 'Nunito', fontWeight: 'bold' }}>
          Do you want to complete this session?
        </div>
      </MainModal>
    )
  }
}

CompleteSessionPopup.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  studentName: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  sessionDetails: PropTypes.shape({}).isRequired,
  mentorName: PropTypes.string.isRequired,
  updateStatus: PropTypes.shape({}),
  notification: PropTypes.shape({}).isRequired,
}

CompleteSessionPopup.defaultProps = {
  updateStatus: {}
}

export default CompleteSessionPopup
