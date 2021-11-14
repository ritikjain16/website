import { Select, Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import parseChatStatement from '../../../utils/parseStatement'

const SelectInput = (props) => {
  const { loading, placeholder, values, onChange,
    onSelect, data, searchVal, onDeselect,
    assignmentList, assignmentListOfQuiz } = props
  const getLoaderData = () => {
    if (loading) return <Spin size='small' />
    if (searchVal.length < 3) {
      return <p>Type atleast 3 characters</p>
    }
    return <p>No result found</p>
  }
  return (
    <Select
      mode='multiple'
      labelInValue
      placeholder={placeholder}
      loading={loading}
      filterOption={(input, option) => {
        if (!assignmentList) {
          return get(option, 'props.children')
            ? get(option, 'props.children')
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
            : false
        }
          return get(option.props, 'label')
              ? get(option.props, 'label').toLowerCase().indexOf(input.toLowerCase()) >= 0
              : false
      }}
      value={values}
      disabled={assignmentList || assignmentListOfQuiz ? false : values.length >= 1}
      notFoundContent={getLoaderData()}
      onSelect={onSelect}
      onChange={onChange}
      onDeselect={onDeselect}
      style={{ width: '300px', marginTop: '10px' }}
    >
      {
        data.map(item =>
          <Select.Option
            value={get(item, 'id')}
            key={get(item, 'id')}
            label={`${get(item, 'statement')}`}
          >
            {assignmentList ?
              parseChatStatement({ statement: get(item, 'statement') }) : get(item, 'title')}
          </Select.Option>
        )
      }
    </Select>
  )
}

export default SelectInput
