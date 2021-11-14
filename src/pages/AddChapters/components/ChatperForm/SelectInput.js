import { Select, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'

const SelectInput = (props) => {
  const { loading, values,
    onSelect, data, onDeselect } = props
  const getLoaderData = () => {
    if (loading) return <Spin size='small' />
    return <p>No result found</p>
  }
  return (
    <Select
      mode='multiple'
      labelInValue
      placeholder='Select Topics'
      loading={loading}
      filterOption={(input, option) =>
      get(option, 'props.children')
        ? get(option, 'props.children')
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        : false
      }
      value={values}
      notFoundContent={getLoaderData()}
      onSelect={onSelect}
      onDeselect={onDeselect}
      style={{ width: '100%' }}
    >
      {
        data.map(item =>
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
}

export default SelectInput
