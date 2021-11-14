import { Input, Radio, Select, Spin } from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import { get } from 'lodash'
import React from 'react'
import { ASSIGNMENT, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE, PRACTICE, PROJECT, QUIZ } from '../../../constants/CourseComponents'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import getComponentName from '../../../utils/getComponentName'

const width = { width: 200 }

const SearchInput = (props) => {
  const { searchKey, coursesList = [], searchValue,
    onInputChange, topicsList, selectedCourse, onSearchTypeChange,
    selectedTopic, courseLoading, onTopicOrCourseChange,
    onKeyPress, componentName } = props
  let searchType = ['course', 'topic', 'title', 'Unallocated', 'published Status']
  if (componentName && componentName === ASSIGNMENT || componentName === HOMEWORK_ASSIGNMENT) {
    searchType = ['course', 'topic', 'Unallocated', 'published Status']
  } else if (componentName && componentName === PROJECT) {
    searchType = ['course', 'topic', 'Unallocated', 'published Status']
  } else if (componentName && componentName === PRACTICE) {
    searchType = ['course', 'topic', 'isSubmitAnswer', 'Unallocated', 'published Status']
  } else if (componentName && componentName === QUIZ) {
    searchType = ['course', 'topic', 'questionType', 'Unallocated', 'published Status']
  }
  const filterOption = (input, option) => (
    get(option, 'props.children')
      ? get(option, 'props.children')
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
      : false
  )
  const getLoaderData = () => {
    if (courseLoading && courseLoading) return <Spin size='small' />
    return <p>No Data found</p>
  }
  let componentNameValue = getComponentName(componentName)
  if (componentName === LEARNING_OBJECTIVE) componentNameValue = 'LO'
  if (componentName === ASSIGNMENT) componentNameValue = ASSIGNMENT
  const renderFilters = () => {
    if (searchKey === 'course') {
      return (
        <Select
          showSearch
          placeholder='Select Course'
          filterOption={filterOption}
          notFoundContent={getLoaderData()}
          value={selectedCourse}
          onChange={(value) => onTopicOrCourseChange(value, 'selectedCourse')}
          style={width}
          loading={courseLoading && courseLoading}
        >
          {
            coursesList.map(item =>
              <Select.Option
                value={get(item, 'id')}
                key={get(item, 'id')}
              >
                {get(item, 'title')}
              </Select.Option>
            )
          }
        </Select>
      )
    } else if (searchKey === 'topic') {
      return (
        <Select
          showSearch
          placeholder='Select Topic'
          filterOption={filterOption}
          notFoundContent={getLoaderData()}
          value={selectedTopic}
          onChange={(value) => onTopicOrCourseChange(value, 'selectedTopic')}
          style={width}
          loading={courseLoading && courseLoading}
        >
          {
            topicsList.map(item =>
              <Select.Option
                value={get(item, 'id')}
                key={get(item, 'id')}
              >
                {get(item, 'title')}
              </Select.Option>
            )
          }
        </Select>
      )
    } else if (searchKey === 'title') {
      return (
        <Input
          style={width}
          onChange={({ target: { value } }) => onInputChange(value, false)}
          placeholder='Enter title'
          value={searchValue}
          onKeyPress={onKeyPress}
        />
      )
    } else if (searchKey === 'Unallocated') {
      return (
        <RadioGroup
          value={searchValue}
          buttonStyle='solid'
          onChange={({ target: { value } }) => onInputChange(value, true)}
        >
          <Radio.Button value='all'>{`All ${componentNameValue}`}</Radio.Button>
          <Radio.Button value='Unallocated course'>Unallocated with Course</Radio.Button>
          <Radio.Button value='UnAllocated topics'>UnAllocated with Topic</Radio.Button>
        </RadioGroup>
      )
    } else if (searchKey === 'published Status') {
      return (
        <RadioGroup
          value={searchValue}
          buttonStyle='solid'
          onChange={({ target: { value } }) => onInputChange(value, true)}
        >
          <Radio.Button value={PUBLISHED_STATUS}>{PUBLISHED_STATUS}</Radio.Button>
          <Radio.Button value={UNPUBLISHED_STATUS}>{UNPUBLISHED_STATUS}</Radio.Button>
        </RadioGroup>
      )
    } else if (searchKey === 'isHomework' || searchKey === 'isSubmitAnswer') {
      return (
        <RadioGroup
          value={searchValue}
          buttonStyle='solid'
          onChange={({ target: { value } }) => onInputChange(value, true)}
        >
          <Radio.Button value>Yes</Radio.Button>
          <Radio.Button value={false}>No</Radio.Button>
        </RadioGroup>
      )
    } else if (searchKey === 'questionType') {
      return (
        <Select
          placeholder='Select Type'
          value={searchValue}
          onChange={(value) => onInputChange(value, true)}
          style={width}
        >
          {
            ['mcq', 'fibInput', 'fibBlock', 'arrange'].map(type =>
              <Select.Option
                value={type}
                key={type}
              >
                {type}
              </Select.Option>
            )
          }
        </Select>
      )
    }
    return null
  }
  return (
    <div style={{ display: 'flex' }}>
      <Select
        value={searchKey}
        onChange={onSearchTypeChange}
        style={{
          ...width, marginRight: '15px', textTransform: 'capitalize'
        }}
      >
        {
          searchType.map(type => <Select.Option style={{ textTransform: 'capitalize' }} key={type} value={type}>{type}</Select.Option>)
        }
      </Select>
      {renderFilters()}
    </div>
  )
}

export default SearchInput
