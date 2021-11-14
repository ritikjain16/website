/* eslint-disable max-len */
import React from 'react'
import { Button } from 'antd'
import { get } from 'lodash'
import MainModal from '../../../../components/MainModal'
import updateBatchSession from '../../../../actions/assignTime/updateLinksAndComment'
import hs from '../../../../utils/scale'

export default class SessionUpdateModal extends React.Component {
  state = {
    value: this.props.defaultVal
  }
  getModalTitle = title => {
    const { mentorSession, topicTitle, timeToDisplay, bookingDate } = this.props
    const titleArr = [
      `${title}`,
      <br />,
      <br />,
      `(${!mentorSession ? '' : get(mentorSession, 'user.name')} | ${!topicTitle || !topicTitle[0] ? '' : topicTitle[0].title} | ${!bookingDate ? '' : bookingDate} : ${!timeToDisplay ? '' : timeToDisplay})`
    ]
    return titleArr
  }
  onSave = () => {
    const { value } = this.state
    this.prepareQueryInput(value)
  }
  isSaving = () => {
    if (this.props.isUpdatingBatchSession) {
      return true
    }
  }
  onChange = ({ target: { value } }) => {
    this.setState({ value })
  }
  onCancel() {
    this.setState({
      value: this.props.defaultVal
    }, () => this.props.closeModal())
  }
  prepareQueryInput = (link) => {
    const { batchSessionId, editType } = this.props
    if (editType === 'link') {
      updateBatchSession(batchSessionId, { sessionRecordingLink: `${link}` })
    } else {
      updateBatchSession(batchSessionId, { sessionCommentByMentor: `${link}` })
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isUpdatingBatchSession && this.props.hasUpdatedBatchSession) {
      this.setState({
        value: this.props.defaultVal
      })
    }
    if (prevProps.defaultVal !== this.props.defaultVal) {
      this.setState({
        value: this.props.defaultVal
      })
    }
  }
  render() {
    const { visible, title, editType } = this.props
    return (
      <MainModal
        visible={visible}
        title={this.getModalTitle(title)}
        onCancel={() => this.onCancel()
        }
        maskClosable='true'
        width={`${hs(1000)}`}
        footer={
          [
            <div>
              <Button
                onClick={() => this.onCancel()}
              >
                CANCEL
              </Button>
              <MainModal.SaveButton
                type='primary'
                htmlType='submit'
                onClick={this.onSave}
              >
                {' '}
                {this.isSaving() ? 'Saving...' : 'SAVE'}
              </MainModal.SaveButton>
            </div>
          ]}
      >
        <div>
          <MainModal.Input
            value={this.state.value}
            placeholder={editType === 'link' ? 'Session Video Link' : 'Session Mentor Comment'}
            type='text'
            autoComplete='off'
            onChange={this.onChange}
            onPressEnter={this.onSave}
          />
        </div>
      </MainModal>
    )
  }
}
