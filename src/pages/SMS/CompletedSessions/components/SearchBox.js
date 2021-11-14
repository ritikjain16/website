/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Icon, Radio, Select } from 'antd'
import { MENTOR, SALES_EXECUTIVE } from '../../../../constants/roles'
import SessionTimeModal from './SessionTimeModal'
import CompletedSessionStyle from '../CompletedSessions.style'

const initialState = {
  searchKey: 'Search By',
  searchValue: '',
  sessionTimeModalVisible: false,
  isHomeworkSubmitted: null,
  selectedSlots: [],
  sessionStatus: 'completed'
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  setParentState = () => {
    this.props.setFilters(this.state)
  }

  radioChange = (e) => {
    this.setState(
      { isHomeworkSubmitted: e.target.value },
      this.setParentState)
  }

  handleSessionStatusChange = (e) => {
    this.setState({
      searchValue: e.target.value
    }, this.setParentState)
  }

  closeSessionTimeModal = (selectedSlots) => {
    this.setState(
      { sessionTimeModalVisible: false, selectedSlots: selectedSlots || [] },
      this.setParentState
    )
  }

  renderInnerInputs = () => {
    const filterOptions = ['Mentor Name', 'Student Name', 'Topic']
    const { searchKey } = this.state
    if (this.props.savedRole === SALES_EXECUTIVE &&
        this.props.mentorsName &&
        searchKey === 'Mentor Name') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <AutoComplete
            style={{ width: 200 }}
            placeholder='Select a Mentor'
            onSelect={(value) => {
              this.setState({
                searchValue: value
              }, () => this.setParentState())
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') { this.setParentState() }
            }}
            onChange={(value) => {
              this.setState({
                searchValue: value
              })
            }}
            filterOption={(input, option) =>
              option.props.children
                ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : false
            }
          >
            {this.props.mentorsName.map(mentor => (
              <Select.Option value={mentor}>
                {mentor}
              </Select.Option>
            ))}
          </AutoComplete>
        </div>
      )
    } else if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <CompletedSessionStyle.StyledInput
            value={this.state.searchValue}
            onKeyPress={(e) => {
              if (e.key === 'Enter') { this.setParentState() }
            }}
            onChange={(event) => {
              this.setState({
                searchValue: event.target.value
              })
            }}
          />
          <CompletedSessionStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </CompletedSessionStyle.SearchIcon>
        </div>
      )
    } else if (searchKey === 'Slot Timing') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <CompletedSessionStyle.PickSlotItem
            onClick={() => this.setState({ sessionTimeModalVisible: true })}
          >
            Pick Slots
          </CompletedSessionStyle.PickSlotItem>
          <SessionTimeModal
            title='Pick Time Slots'
            visible={this.state.sessionTimeModalVisible}
            closeSessionTimeModal={this.closeSessionTimeModal}
          />
        </div>
      )
    } else if (searchKey === 'Homework Submitted') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <Radio.Group onChange={this.radioChange} value={this.state.isHomeworkSubmitted}>
            <Radio value> Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </div>
      )
    } else if (searchKey === 'Session Status') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <Radio.Group onChange={this.handleSessionStatusChange} value={this.state.searchValue}>
            <Radio value='completed'> Completed</Radio>
            <Radio value='started'>Started</Radio>
            <Radio value='allotted'>Allotted</Radio>
          </Radio.Group>
        </div>
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = [
      'Search By',
      'Student Name',
      'Topic',
      'Slot Timing',
      'Homework Submitted',
      'Session Status'
    ]
    if (this.props.savedRole !== MENTOR) { filterDropdownOptions.splice(1, 0, 'Mentor Name') }
    return (
      <div style={{ marginRight: '10px', minWidth: '438px' }}>
        <CompletedSessionStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option, index) =>
              <CompletedSessionStyle.Option
                key={index}
                value={option}
              >{option}
              </CompletedSessionStyle.Option>
            )
          }
        </CompletedSessionStyle.Select>
        {this.renderInnerInputs()}
      </div>
    )
  }
}

SearchBox.propTypes = {
  savedRole: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired
}

export default SearchBox
