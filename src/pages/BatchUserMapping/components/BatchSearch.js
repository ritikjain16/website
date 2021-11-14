import { Icon, Spin } from 'antd'
import React, { Component } from 'react'
import BatchUserMappingStyle from '../BatchUserMapping.style'

const initialState = {
  searchKey: 'All',
  searchValue: '',
}

class BatchSearch extends Component {
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
            <BatchUserMappingStyle.StyledInput
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
            <BatchUserMappingStyle.SearchIcon
              onClick={this.setParentState}
            >
              <Icon type='search'
                style={{
                  fontSize: 18
                }}
              />
            </BatchUserMappingStyle.SearchIcon>
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
            <BatchUserMappingStyle.AutoComplete
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
                <BatchUserMappingStyle.Option
                  key={id}
                  value={id}
                >{name}
                </BatchUserMappingStyle.Option>
              ))}
            </BatchUserMappingStyle.AutoComplete>
          </div>
        )
      }
    }
    return null
  }

  render() {
    const filterDropdownOptions = ['All', 'Batch Code', 'Allotted Mentor']
    return (
      <div style={{ marginRight: '20px', minWidth: '438px' }}>
        <BatchUserMappingStyle.Select
          value={this.state.searchKey}
          onChange={(value) => this.setState({
            ...initialState,
            searchKey: value
          }, this.setParentState)}
        >
          {
            filterDropdownOptions.map((option) =>
              <BatchUserMappingStyle.Option
                key={option}
                value={option}
              >{option}
              </BatchUserMappingStyle.Option>
            )
          }
        </BatchUserMappingStyle.Select>
        {this.renderInnerInputs()}
      </div>
    )
  }
}

export default BatchSearch
