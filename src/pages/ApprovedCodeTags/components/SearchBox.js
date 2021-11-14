/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import ApprovedCodeTagsStyle from '../ApprovedCodeTags.style'

const initialState = {
  searchKey: 'Search By',
  searchValue: '',
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  setParentState = () => {
    if (this.state.searchValue !== '' || this.state.searchKey === 'Search By') {
      this.props.setFilters(this.state)
    }
  }

  renderInnerInputs = () => {
    const filterOptions = ['Tag Name']
    const { searchKey } = this.state
    if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <ApprovedCodeTagsStyle.StyledInput
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
          <ApprovedCodeTagsStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </ApprovedCodeTagsStyle.SearchIcon>
        </div>
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = [
      'Search By',
      'Tag Name',
    ]
    return (
      <div style={{
        marginRight: '10px',
        minWidth: '438px',
        display: 'flex',
        alignItems: 'center'
      }}
      >
        <ApprovedCodeTagsStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option, index) =>
              <ApprovedCodeTagsStyle.Option
                key={index}
                value={option}
              >{option}
              </ApprovedCodeTagsStyle.Option>
            )
          }
        </ApprovedCodeTagsStyle.Select>
        {this.renderInnerInputs()}
      </div>
    )
  }
}

SearchBox.propTypes = {
  setFilters: PropTypes.func.isRequired
}

export default SearchBox
