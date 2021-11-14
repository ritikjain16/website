import { Select, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { filterOption } from '../contentUtils'

const AssignSelectInput = (props) => {
  const { placeholder, value, loading, onSelect, dataArray } = props
  const divStyle = {
    margin: '8px 0'
  }

  const getLoaderData = () => {
    if (loading) return <Spin size='small' />
    return <p>No Data found</p>
  }
  return (
    <div style={divStyle}>
      <h3>{placeholder}</h3>
      <Select
        showSearch
        placeholder={placeholder}
        filterOption={filterOption}
        notFoundContent={getLoaderData()}
        value={value}
        loading={loading}
        onSelect={onSelect}
        style={{ width: '100%' }}
      >
        {
          dataArray.map(item =>
            <Select.Option
              value={get(item, 'id')}
              key={get(item, 'id')}
            >
              {get(item, 'title')}
            </Select.Option>
          )
        }
      </Select>
    </div>
  )
}

export default AssignSelectInput
