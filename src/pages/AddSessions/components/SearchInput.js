import { Select, Spin, Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { StyledSelect } from '../AddSessions.styles'

const { Option } = Select

const SearchInput = (props) => {
  const { value, placeholder, onChange, dataArray = [], loading } = props
  const getLoaderData = () => {
    if (loading) return <Spin size='small' />
    return <p>No result found</p>
  }
  return (
    <StyledSelect
      showSearch
      value={value}
      placeholder={placeholder}
      loading={loading}
      notFoundContent={getLoaderData()}
      optionFilterProp='children'
      onChange={onChange}
      style={{ width: '200px' }}
      filterOption={(input, option) => {
        if (get(option, 'props.courseTitle', '')) {
          return get(option, 'props.courseTitle')
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        return false
      }}
    >
      {
        dataArray.map((course) =>
          <Option value={get(course, 'id')} key={get(course, 'id')} courseTitle={get(course, 'title')}>
            <Tooltip title={get(course, 'title')}>
              {get(course, 'title')}
            </Tooltip>
          </Option>)
      }
    </StyledSelect>
  )
}

export default SearchInput
