import React, { Component } from 'react'
import { Icon, Spin } from 'antd'
import PropTypes from 'prop-types'
import BatchAttendanceStyle from '../BatchAttendance.style'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { MENTOR } from '../../../constants/roles'

const initialState = {
  searchKey: 'All',
  searchValue: ''
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  setParentState = () => {
    this.props.setFilters(this.state)
  }

  renderInnerInputs = () => {
    const filterOptions = ['Batch Code', 'Allotted Mentor']
    const { searchKey } = this.state
    const { datasArray, isFetchingMentors } = this.props
    if (filterOptions.includes(searchKey)) {
      if (searchKey === 'Batch Code') {
        return (
          <div style={{
            marginLeft: '20px',
            display: 'inline-flex',
            flexDirection: 'row'
          }}
          >
            <BatchAttendanceStyle.StyledInput
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
            <BatchAttendanceStyle.SearchIcon
              onClick={this.setParentState}
            >
              <Icon type='search'
                style={{
                  fontSize: 18
                }}
              />
            </BatchAttendanceStyle.SearchIcon>
          </div>
        )
      } else if (searchKey === 'Allotted Mentor') {
        return (
          <div style={{
            marginLeft: '20px',
            display: 'inline-flex',
            flexDirection: 'row'
          }}
          >
            <BatchAttendanceStyle.AutoComplete
              option={datasArray}
              filterOption={(inputValue, option) => (
                option.props.children &&
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              )}
              placeholder='Type Mentor Name'
              onSelect={(value) => {
                this.setState({
                  searchValue: value
                }, () => this.setParentState())
              }}
              notFoundContent={isFetchingMentors ? <Spin /> : 'No Match Found'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.setParentState()
                }
              }}
              onChange={(value) => {
                this.setState({
                  searchValue: value
                })
              }}
            >
              {datasArray && datasArray.map(({ id, name }) => (
                <BatchAttendanceStyle.Option
                  key={id}
                  value={id}
                >{name}
                </BatchAttendanceStyle.Option>
              ))}
            </BatchAttendanceStyle.AutoComplete>
          </div>
        )
      }
    }
    return null
  }

  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    let filterDropdownOptions = savedRole === MENTOR ? ['All', 'Batch Code'] : ['All', 'Batch Code', 'Allotted Mentor']
    const { paramBatchCode } = this.props
    if (paramBatchCode) filterDropdownOptions = filterDropdownOptions.filter(option => option !== 'Batch Code')
    return (
      <div style={{ marginRight: '20px', minWidth: '438px' }}>
        <BatchAttendanceStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option) =>
              <BatchAttendanceStyle.Option
                key={option}
                value={option}
              >{option}
              </BatchAttendanceStyle.Option>
            )
          }
        </BatchAttendanceStyle.Select>
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
