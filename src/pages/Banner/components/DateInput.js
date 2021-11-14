import { DatePicker } from 'antd'
import moment from 'moment'
import React from 'react'

const DateInput = (props) => {
  const { placeholder, date, handleDateChange, type } = props
  return (
    <DatePicker
      placeholder={placeholder}
      dateRender={current => {
        const currentDate = date ?
        new Date(date).setHours(0, 0, 0, 0) :
        new Date().setHours(0, 0, 0, 0)
        const style = {}
        if (currentDate === new Date(current).setHours(0, 0, 0, 0)) {
          style.backgroundColor = '#a8a6ee'
          style.color = '#ffffff'
        }
        style.cursor = 'pointer'
        return (
          <div className='ant-picker-cell-inner' style={style}>
            {current.date()}
          </div>
        )
        }}
      isClearable
      onChange={(event) => handleDateChange(event, type)}
      value={date !== null ? moment(date) : undefined}
    />
  )
}

export default DateInput
