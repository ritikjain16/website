/* eslint-disable no-lonely-if */
import { Button } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import MainModal from '../../../components/MainModal'

class SendConfirmationModal extends Component {
  state = {
    parentEmail: ''
  }
  componentDidMount = () => {
    const { data } = this.props
    const parentEmail = get(data, 'user.studentProfile.parents[0].user.email', '-')
    if (parentEmail) {
      this.setState({
        parentEmail
      })
    }
  }
  componentDidUpdate = (prevProps) => {
    const { sendCertificateUpdateStatus, sendJourneySnapshotUpdateStatus,
      closeModal, asset } = this.props
    if (asset !== 'certificate') {
      if (sendJourneySnapshotUpdateStatus && !get(sendJourneySnapshotUpdateStatus.toJS(), 'loading')
        && get(sendJourneySnapshotUpdateStatus.toJS(), 'success') &&
        (prevProps.sendJourneySnapshotUpdateStatus !== sendJourneySnapshotUpdateStatus)) {
        closeModal()
      }
    } else {
      if (sendCertificateUpdateStatus && !get(sendCertificateUpdateStatus.toJS(), 'loading')
        && get(sendCertificateUpdateStatus.toJS(), 'success') &&
        (prevProps.sendCertificateUpdateStatus !== sendCertificateUpdateStatus)) {
        closeModal()
      }
    }
  }
  render() {
    const { isModalVisible, closeModal, sendCertificateUpdateStatus, asset,
      sendCertificateMail, sendJourneySnapshotMail, sendJourneySnapshotUpdateStatus } = this.props
    const { parentEmail } = this.state
    const isLoading = (asset === 'certificate') ?
      sendCertificateUpdateStatus && get(sendCertificateUpdateStatus.toJS(), 'loading') : sendJourneySnapshotUpdateStatus && (sendJourneySnapshotUpdateStatus.toJS(), 'loading')
    return (
      <MainModal
        visible={isModalVisible}
        title='Confirm Details'
        onCancel={() => closeModal()}
        maskClosable={false}
        width='580px'
        centered
        destroyOnClose
        footer={[
          <Button
            type='primary'
            onClick={() => (asset === 'certificate') ?
              sendCertificateMail() : sendJourneySnapshotMail()}
          >
            {isLoading ? 'SENDING EMAIL...' : 'SEND EMAIL'}
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          Parent Email : <b>{parentEmail}</b>
        </div>
      </MainModal>
    )
  }
}

export default SendConfirmationModal
