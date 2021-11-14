/* eslint-disable max-len */
import React from 'react'
import { Form } from 'antd'
import MainModal from '../../../../components/MainModal'
import updateMentorProfile from '../../../../actions/userProfile/updateMentorProfile'

export default class UpdateMentorsModal extends React.Component {
  state = {
    mentorStatus: '',
    mentorActive: false
  }
  onSave = () => {
    this.updateMentorDetails()
  }
  isSaving = () => {
    if (this.props.isMentorStatusUpdating) {
      return true
    }
  }
  onCancel() {
    this.props.closeMentorModal()
  }
  handleInputChange(value) {
    this.setState({ mentorStatus: value })
  }
  handleSwitchChange(value) {
    this.setState({ mentorActive: value })
  }
  updateMentorDetails = () => {
    const input = {}
    const status = this.state.mentorStatus
    if (status === 'Training') {
      input.status = 'onTraining'
    } else if (status === 'Partially Full') {
      input.status = 'paidAndTrial'
    } else if (status === 'Paid Sessions') {
      input.status = 'paidOnly'
    } else if (status === 'Onboarded') {
      input.status = 'onboarded'
    }
    input.isMentorActive = this.state.mentorActive
    const id = this.props.mentorId
    updateMentorProfile(id, input)
  }
  render() {
    const { visible, title, mentorId, mentorDefaultStatus, mentorDefaultIsActive } = this.props
    const mentorStatusOptions = ['Training', 'Partially Full', 'Paid Sessions', 'Onboarded']
    return (
      <MainModal
        visible={visible}
        title={title}
        onCancel={() => this.onCancel()
        }
        maskClosable='true'
        width='500px'
        footer={
          [
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              form={mentorId}
              onClick={this.onSave}
            >
              {' '}
              {this.isSaving() ? 'Saving...' : 'SAVE'}
            </MainModal.SaveButton>
          ]}
      >
        <Form onSubmit={this.checkValidations} id='mentor-edit-form'>
          <MainModal.FormItem label='Is Mentor Active?'>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MainModal.StyledSwitch defaultChecked={mentorDefaultIsActive} onChange={(value) => this.handleSwitchChange(value)} />
            </div>
          </MainModal.FormItem>
          <MainModal.FormItem label='Status'>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MainModal.Select
                showSearch
                placeholder='Select Mentor Status'
                type='text'
                width='50%'
                onChange={(value) => this.handleInputChange(value)}
                defaultValue={mentorDefaultStatus}
              >
                {mentorStatusOptions.map(status => (
                  <MainModal.Option key={status} value={status}>
                    {status}
                  </MainModal.Option>
                ))}
              </MainModal.Select>
            </div>
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}
