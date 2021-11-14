/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, } from 'antd'
import NetPromoterScoreStyle from '../NetPromoterScore.style'
import SearchInput from './SearchInput'

const initialState = {
  searchKey: 'Search By',
  searchValue: '',
  sessionTimeModalVisible: false,
  verticalType: ""
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  setParentState = () => {
    this.props.setFilters(this.state);
  }

  handleSessionStatusChange = (e) => {
    this.setState({
      searchValue: e.target.value
    }, this.setParentState)
  }

  handleValueSelect = (value, type) => {
    if (type === 'Course') {
      this.setState({
        searchValue: value
      },
        this.setParentState
      )
    }
  }



  fetchCourseData = (courseName) => {

  }

  onAuditTypeChange = (type) => {
    if (this.state.verticalType !== type) {
      this.setState({
        verticalType: type
      })
    }
  }

  renderInnerInputs = () => {
    const filterOptions = ['Student\'s name', 'Parent\'s name', 'Phone number']
    const { searchKey, verticalType } = this.state
    if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <NetPromoterScoreStyle.StyledInput
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
          <NetPromoterScoreStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </NetPromoterScoreStyle.SearchIcon>
        </div>
      )
    }
    else if (searchKey === 'Vertical') {
      return (
        <div style={{ display: 'flex', marginBottom: '15px', marginTop: "10px" }}>
          {
            ['B2B', 'B2C', 'B2B2C'].map(type => (
              <NetPromoterScoreStyle.NPSVerticalTab
                checked={verticalType === type}
                onClick={() => {
                  this.onAuditTypeChange(type);
                  this.setState({
                    searchValue: type.toLowerCase()
                  }, this.setParentState)
                }}
              >
                {type}
              </NetPromoterScoreStyle.NPSVerticalTab>
            ))
          }
        </div>
      )
    }
    else if (searchKey === 'Course') {
      return (
        <SearchInput
          datasArray={this.props.allCourses}
          handleValueSelect={(value) => this.handleValueSelect(value, searchKey)}
          searchByFilter={(value) => { this.setState({ searchValue: value }, this.setParentState) }}
          placeholder='Search by Course name'
          onChange={(value) => this.setState({
            searchValue: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.setParentState()
            }
          }}
        />
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = [
      'Student\'s name',
      'Parent\'s name',
      'Phone number',
      'Course',
      'Vertical',
      'All'
    ]


    return (
      <div style={{ marginRight: '20px', minWidth: '438px' }}>
        <NetPromoterScoreStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option, index) =>
              <NetPromoterScoreStyle.Option
                key={index}
                value={option}
              >{option}
              </NetPromoterScoreStyle.Option>
            )
          }
        </NetPromoterScoreStyle.Select>
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
