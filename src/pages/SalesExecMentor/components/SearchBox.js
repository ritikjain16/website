/* eslint-disable max-len */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import SalesExecMentorStyle from '../SalesExecMentor.style'

const initialState = {
  searchKey: 'All',
  searchValue: '',
  sessionTimeModalVisible: false,
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
    const filterOptions = ['Sales Exec Name', 'Mentor Name', 'Email', 'Phone']
    const { searchKey } = this.state
    if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <SalesExecMentorStyle.StyledInput
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
          <SalesExecMentorStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </SalesExecMentorStyle.SearchIcon>
        </div>
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = ['All', 'Sales Exec Name', 'Mentor Name', 'Email', 'Phone']
    return (
      <div style={{ marginRight: '20px', minWidth: '438px' }}>
        <SalesExecMentorStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option) =>
              <SalesExecMentorStyle.Option
                key={option}
                value={option}
              >{option}
              </SalesExecMentorStyle.Option>
            )
          }
        </SalesExecMentorStyle.Select>
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
