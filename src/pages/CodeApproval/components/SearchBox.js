/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Radio } from 'antd'
import CodeApprovalStyle from '../CodeApproval.style'

const initialState = {
  searchKey: 'Search By',
  searchValue: '',
  selectedTags: [],
  approvalStatus: 'all'
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  setParentState = (TagIds = '') => {
    if (this.state.searchKey === 'Tags') {
      this.props.setFilters(this.state, TagIds)
    } else if (this.state.searchValue !== '' || this.state.searchKey === 'Search By') {
      this.props.setFilters(this.state)
    }
  }

  handleApprovalStatusChange = (e) => {
    this.setState({
      searchValue: e.target.value
    }, this.setParentState)
  }

  handleTagsChange = (value) => {
    const { userApprovedCodeTags } = this.props
    this.setState({
      selectedTags: value
    }, () => {
      const filteredTagIds = userApprovedCodeTags.filter(
        tags => this.state.selectedTags.includes(tags.title)
      ).map(tags => tags.id)
      this.setParentState(filteredTagIds)
    })
  }

  renderInnerInputs = () => {
    const filterOptions = ['Student Name', 'Title']
    const { searchKey } = this.state
    if (filterOptions.includes(searchKey)) {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <CodeApprovalStyle.StyledInput
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
          <CodeApprovalStyle.SearchIcon
            onClick={this.setParentState}
          >
            <Icon type='search'
              style={{
                fontSize: 18
              }}
            />
          </CodeApprovalStyle.SearchIcon>
        </div>
      )
    } else if (searchKey === 'Approval Status') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <Radio.Group onChange={this.handleApprovalStatusChange} value={this.state.searchValue}>
            <Radio value='accepted'>Accepted</Radio>
            <Radio value='pending'>Pending</Radio>
            <Radio value='rejected'>Rejected</Radio>
          </Radio.Group>
        </div>
      )
    } else if (searchKey === 'Published Status') {
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <Radio.Group onChange={this.handleApprovalStatusChange} value={this.state.searchValue}>
            <Radio value='published'>Published</Radio>
            <Radio value='unpublished'>Unpublished</Radio>
          </Radio.Group>
        </div>
      )
    } else if (searchKey === 'Tags') {
      const { userApprovedCodeTags } = this.props
      return (
        <div style={{
          marginLeft: '20px',
          display: 'inline-flex',
          flexDirection: 'row'
        }}
        >
          <CodeApprovalStyle.Select
            mode='multiple'
            allowClear
            placeholder='Please select'
            onChange={this.handleTagsChange}
            value={this.state.selectedTags}
          >
            {
            userApprovedCodeTags.map((tags) =>
              <CodeApprovalStyle.Option
                key={tags.id}
                value={tags.title}
              >{tags.title}
              </CodeApprovalStyle.Option>
            )
          }
          </CodeApprovalStyle.Select>
        </div>
      )
    }
    return null
  }

  render() {
    const filterDropdownOptions = [
      'Search By',
      'Student Name',
      'Title',
      'Approval Status',
      'Published Status',
      'Tags'
    ]
    return (
      <div style={{
        marginRight: '10px',
        minWidth: '438px',
        display: 'flex',
        alignItems: 'center'
      }}
      >
        <CodeApprovalStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, () => this.state.searchKey === 'Search By' && this.setParentState())}
        >
          {
            filterDropdownOptions.map((option, index) =>
              <CodeApprovalStyle.Option
                key={index}
                value={option}
              >{option}
              </CodeApprovalStyle.Option>
            )
          }
        </CodeApprovalStyle.Select>
        {this.renderInnerInputs()}
      </div>
    )
  }
}

SearchBox.propTypes = {
  setFilters: PropTypes.func.isRequired
}

export default SearchBox
