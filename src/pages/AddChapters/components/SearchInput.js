import { Select, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { StyledSelect } from '../AddChapter.style'

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
      filterOption={(input, option) =>
        get(option, 'props.children')
          ? get(option, 'props.children')
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
          : false
      }
    >
      {
        dataArray.map((data) =>
          <Option value={get(data, 'id')} key={get(data, 'id')}>{get(data, 'title')}</Option>)
      }
    </StyledSelect>
  )
}

export default SearchInput
