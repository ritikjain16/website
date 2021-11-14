import { Button, Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { QUIZ } from '../../../constants/CourseComponents'

const AssignedView = ({ record, onAssignClick, componentName }) => {
  const renderDatas = (type) => {
    const dataList = []
    if (get(record, type, []).length > 0) {
      let valueCount = 0
      get(record, type, []).forEach(value => {
        valueCount += 1
        dataList.push(
          <span key={get(value, 'id')}>{`${get(value, 'title')},`}</span>
        )
      })
      if (valueCount > 3) {
        return (
          <Tooltip title={get(record, type, []).map(value => `${get(value, 'title')},`)} >
            {dataList.slice(0, 3)}
          </Tooltip>
        )
      } else if (dataList.length === 0) {
        return '-'
      }
      return dataList
    }
    return '-'
  }
  return (
    <>
      <div style={{ textAlign: 'left' }}><strong>Courses:</strong> {renderDatas('courses')}</div>
      <div style={{ textAlign: 'left' }}><strong>Topics:</strong> {renderDatas('topics')}</div>
      {
        componentName === QUIZ && (
          <div style={{ textAlign: 'left' }}><strong>LO:</strong> {renderDatas('learningObjectives')}</div>
        )
      }
      <Button type='primary' style={{ marginTop: '8px' }} onClick={onAssignClick}>
        Assign More
      </Button>
    </>
  )
}

export default AssignedView
