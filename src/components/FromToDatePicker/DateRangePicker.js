import { DatePicker } from 'antd'
import moment from 'moment'
import React from 'react'

const DateRangePicker = (props) => {
  const { fromDate, toDate, handleDateChange } = props
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <DatePicker
          placeholder='Select From Date'
          dateRender={current => {
            const currentDate = fromDate ?
              new Date(fromDate).setHours(0, 0, 0, 0) :
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
          allowClear={false}
          onChange={(event) => handleDateChange(event, 'from')}
          value={fromDate !== null ? moment(fromDate) : undefined}
        />
        <div style={{ marginLeft: '10px' }}>
          <DatePicker
            placeholder='Select To Date'
            dateRender={current => {
              const currentDate = toDate ?
                new Date(toDate).setHours(0, 0, 0, 0) :
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
            allowClear={false}
            onChange={(event) => handleDateChange(event, 'to')}
            value={toDate !== null ? moment(toDate) : undefined}
          />
        </div>
      </div>
    </>
  )
}

export default DateRangePicker
