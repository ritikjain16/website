import React from 'react'
import { Form, Icon, Popover, Checkbox, Divider } from 'antd'
import MainModal from '../../../../components/MainModal'
import updateSalesExecProfile from '../../../../actions/salesExecProfiles/updateSalesExecProfile'

export default class UpdateSalesExecProfilesModal extends React.Component {
  state = {
    mentorGroupStatus: 'Training',
    mentorGroupActive: false,
    selectedMentorGroup: []
  }
  onSave = () => {
    this.updateSalesExecProfile()
  }
  isSaving = () => {
    if (this.props.isMentorGroupStatusUpdating) {
      return true
    }
  }
  onCancel() {
    this.props.onCancel()
  }
  handleInputChange(value) {
    this.setState({ mentorGroupStatus: value })
  }
  handleSwitchChange(value) {
    this.setState({ mentorGroupActive: value })
  }
  updateSalesExecProfile = () => {
    const input = []
    this.state.selectedMentorGroup.map(item => {
      const object = {}
      const status = this.state.mentorGroupStatus
      let statusFiltered = ''
      if (status === 'Training') {
        statusFiltered = 'onTraining'
      } else if (status === 'Partially Full') {
        statusFiltered = 'paidAndTrial'
      } else if (status === 'Paid Sessions') {
        statusFiltered = 'paidOnly'
      } else if (status === 'Onboarded') {
        statusFiltered = 'onboarded'
      }
      object.id = item
      object.fields = {
        isMentorActive: this.state.mentorGroupActive,
        status: statusFiltered
      }
      input.push(object)
    })
    updateSalesExecProfile({ input })
  }
  handleMentorSelect(value) {
    this.setState(() => ({
      selectedMentorGroup: value
    }))
  }
  render() {
    const { visible, title, mentorDetails } = this.props
    const mentorStatusOptions = ['Training', 'Partially Full', 'Paid Sessions', 'Onboarded']
    const content = (
      <div>
        <div style={{ display: 'flex' }}><p>Email ID:   </p><p>{this.props.salesExecEmail}</p></div>
        <div style={{ display: 'flex' }}><p>Phone No:   </p><p>{this.props.salesExecPhoneNumber}</p></div>
      </div>
    )
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <MainModal
        visible={visible}
        centered
        title={[
          <div>
            <div>{title}<Popover content={content}><Icon height='2px' width='2px' type='info-circle' /></Popover></div>
          </div>]}
        onCancel={() => this.onCancel()}
        maskClosable='true'
        width='500px'
        footer={
          [
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              onClick={this.onSave}
            >
              {' '}
              {this.isSaving() ? 'Saving...' : 'SAVE'}
            </MainModal.SaveButton>
          ]}
      >
        <Form id='mentor-edit-form'>
          <MainModal.FormItem label='Choose Mentors:'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Checkbox.Group onChange={(value) => this.handleMentorSelect(value)}>
                {
                  mentorDetails.map(mentor => (
                    <div key={mentor.id}>
                      <Checkbox value={mentor.id} style={radioStyle}>
                        {mentor.user.username}
                      </Checkbox>
                    </div>
                  ))
                }
              </Checkbox.Group>
            </div>
          </MainModal.FormItem>
          <Divider />
          <MainModal.FormItem label='Is Mentor Active?'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MainModal.StyledSwitch onChange={(value) => this.handleSwitchChange(value)} />
            </div>
          </MainModal.FormItem>
          <MainModal.FormItem label='Status'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MainModal.Select
                showSearch
                placeholder='Select Mentor Status'
                type='text'
                width='50%'
                onChange={(value) => this.handleInputChange(value)}
                defaultValue='Training'
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
