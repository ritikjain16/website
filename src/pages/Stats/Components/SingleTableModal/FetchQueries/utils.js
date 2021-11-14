import React from 'react'
import { Tag } from 'antd'
import { get } from 'lodash'

const flattenObject = (obj) => {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]))
    } else {
      flattened[key] = obj[key]
    }
  })

  return flattened
}

const getColumnsWithBoolFilters = (columnsOriginal, colsToAddBoolFilter) => {
  let columns = columnsOriginal
  const addFilters = (dataIndex) => ({
    filters: [
      {
        text: 'Yes',
        value: true
      },
      {
        text: 'No',
        value: false
      }
    ],
    onFilter: (value, record) => {
      return get(record, dataIndex) == value
    },
    filterMultiple: false
  })

  columns.forEach((ele) => {
    if (colsToAddBoolFilter.includes(ele.title)) {
      ele['render'] = (bool) => <Tag color={bool ? 'green' : 'volcano'}>{bool ? 'Yes' : 'No'}</Tag >
      Object.assign(ele, addFilters(ele.dataIndex))
    }
  })

  return columns
}

export { flattenObject, getColumnsWithBoolFilters }