/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { Button, Icon, Select } from 'antd'
import { AUDITOR, MENTOR } from '../../../constants/roles'
import MentorAuditListStyle from '../MentorAuditList.style'

const initialState = {
  searchKey: 'Search By',
  searchValue: '',
  sessionTimeModalVisible: false,
  sessionStatus: 'completed',
  rating: 0
}

const batchSession = 'batchSession'

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  clearFilters = () => {
    this.setState({
      ...initialState
    })
  }

  setParentState = () => {
    this.props.setFilters(this.state)
  }

  handleSessionStatusChange = (e) => {
    this.setState({
      searchValue: e.target.value
    }, this.setParentState)
  }
  setRating = (num) => {
    const { rating } = this.state
    if (rating !== num) {
      this.setState({
        rating: num,
        searchValue: num
      }, this.setParentState)
    }
  }
  renderInnerInputs = () => {
    const filterOptions = ['Student Name', 'Topic']
    const { searchKey, searchValue } = this.state
    if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <MentorAuditListStyle.StyledInput
            value={searchValue}
            onKeyPress={(e) => {
              if (e.key === 'Enter') { this.setParentState() }
            }}
            onChange={(event) => {
              this.setState({
                searchValue: event.target.value
              })
            }}
          />
          <MentorAuditListStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </MentorAuditListStyle.SearchIcon>
        </div>
      )
    } else if (searchKey === 'Rating') {
      return [1, 2, 3, 4, 5].map(num =>
        <Button
          type={this.state.rating === num ? 'primary' : 'default'}
          shape='circle'
          onClick={() => this.setRating(num)}
          style={{
            margin: '8px'
          }}
        >
          {num}
        </Button>
      )
    } else if (searchKey === 'Mentor Name') {
      return (
        <Select
          value={searchValue}
          style={{ width: 200, marginLeft: '10px' }}
          showSearch
          optionFilterProp='children'
          filterOption={(input, option) =>
            get(option, 'props.children')
              ? get(option, 'props.children')
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
              : false
          }
          onChange={(value) => this.setState({
            searchValue: value
          }, this.setParentState)}
        >
          {
            this.props.mentorsList
                ? this.props.mentorsList.map(mentor =>
                  <Select.Option key={mentor.id}
                    value={mentor.id}
                  >{get(mentor, 'name')}
                  </Select.Option>
                )
                : ''
          }
        </Select>
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = [
      'Search By',
      'Student Name',
      'Topic',
      'Rating',
    ]
    if (this.props.sessionType === batchSession) {
      filterDropdownOptions.splice(1, 1)
      filterDropdownOptions.splice(2, 1)
    }
    if (this.props.savedRole !== MENTOR && this.props.savedRole !== AUDITOR) {
      filterDropdownOptions.splice(1, 0, 'Mentor Name')
    }
    return (
      <div style={{ marginRight: '10px', minWidth: '438px' }}>
        <MentorAuditListStyle.Select
          value={this.state.searchKey}
          onChange={(value) => {
            this.setState({
              ...initialState,
              searchKey: value,
            }, this.setParentState)
          }}
        >
          {
            filterDropdownOptions.map((option, index) =>
              <MentorAuditListStyle.Option
                key={index}
                value={option}
              >{option}
              </MentorAuditListStyle.Option>
            )
          }
        </MentorAuditListStyle.Select>
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
