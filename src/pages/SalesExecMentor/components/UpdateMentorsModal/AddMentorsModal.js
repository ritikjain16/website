/* eslint-disable max-len */
import React from 'react'
import { Form, Select, Spin } from 'antd'
import { get } from 'lodash'
import MainModal from '../../../../components/MainModal'
import addMentorToSalesExecutive from '../../../../actions/salesExecProfiles/addMentorProfile'

export default class AddMentorsModal extends React.Component {
  state = {
    search: '',
    selectedMentorNames: [],
    selectedMentorIds: []
  }
  onCancel() {
    const { selectedMentorNames } = this.state
    if (selectedMentorNames.length !== 0) {
      this.setState({
        selectedMentorIds: [],
        selectedMentorNames: []
      })
    }
    this.props.onCancel()
  }
  onSave = () => {
    let found = -1
    this.props.mentorsUnderSalesExec.map(mentor => {
      this.state.selectedMentorIds.map(mentorId => {
        if (mentor.user.id === mentorId.key) {
          found = 1
          this.props.handleCannotAddMentor()
        }
      })
    })
    const selectedMentors = []
    this.state.selectedMentorIds.map(mentorId => {
      this.props.allMentorsData.map(mentor => {
        if (mentor.id === mentorId.key) {
          selectedMentors.push(mentor)
        }
      })
    })
    if (found === -1) {
      this.handlePropsForQuery()
    }
    const { selectedMentorNames } = this.state
    if (selectedMentorNames.length !== 0) {
      this.setState({
        selectedMentorIds: [],
        selectedMentorNames: []
      })
    }
  }
  isSaving = () => {
    if (this.props.isAddingMentor) {
      return true
    }
  }
  handleSearch = (value) => {
    this.setState({ search: value })
  }
  handleInputChange = (value, key) => {
    this.setState({
      selectedMentorIds: key,
      selectedMentorNames: value,
      search: ''
    })
  }

  handlePropsForQuery = () => {
    const { salesExecId: salesExecConnectId, allMentorsData } = this.props
    const { selectedMentorIds } = this.state
    let mentorQuery = ''
    selectedMentorIds.map((mentorId, index) => {
      const isExist = allMentorsData.find(mentor => get(mentor, 'id') === mentorId.key)
      const userConnectId = mentorId.key
      if (isExist && get(isExist, 'mentorProfile.id')) {
        mentorQuery += `
        updateMentorProfile_${index}: updateMentorProfile(id: "${get(isExist, 'mentorProfile.id')}", salesExecutiveConnectId: "${salesExecConnectId}") {
          id
        }`
      } else {
        mentorQuery += `
        addMentorProfile_${index}: addMentorProfile(input: {}, userConnectId: "${userConnectId}", salesExecutiveConnectId: "${salesExecConnectId}") {
          id
        }`
      }
    })
    if (mentorQuery) {
      addMentorToSalesExecutive(mentorQuery)
    }
  }
  hasDataFetched() {
    return this.props.hasFetchedAllMentors
  }
  render() {
    const { visible, title, allMentorsData, mentorsUnderSalesExec } = this.props
    const { selectedMentorNames } = this.state
    const { Option } = Select
    const { search } = this.state
    const filteredMentors = mentorsUnderSalesExec.map(mentor => get(mentor, 'user.id'))
    const allMentorsDataFiltered = allMentorsData.filter(mentor =>
      !filteredMentors.includes(mentor.id) && mentor && mentor.name && mentor.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    return (
      <MainModal
        visible={visible}
        title={[
          <div>
            <div>{title}</div>
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
              {this.isSaving() ? 'Adding...' : 'ADD'}
            </MainModal.SaveButton>
          ]}
      >
        <Form id='mentor-edit-form'>
          <MainModal.FormItem label='Choose Mentors to Add:'>
            {
              this.hasDataFetched() ? (
                <Select
                  mode='multiple'
                  labelInValue
                  value={selectedMentorNames}
                  placeholder='Select Mentors'
                  notFoundContent={!this.hasDataFetched() ? <Spin size='small' /> : null}
                  filterOption={false}
                  onSearch={this.handleSearch}
                  onChange={this.handleInputChange}
                  style={{ width: '100%' }}
                >
                  {allMentorsDataFiltered.map(mentor => (
                    <Option key={mentor.id} value={mentor.id}>{mentor.name}</Option>
                  ))}
                </Select>
              ) : <div>Data is not Fetched!</div>
            }
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}
