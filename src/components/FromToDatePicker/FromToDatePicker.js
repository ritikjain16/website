import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'

class FromToDatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: undefined,
      toDate: undefined
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldResetDate && !prevProps.shouldResetDate) {
      this.setState({
        fromDate: undefined,
        toDate: undefined
      })
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          justifyContent: 'center',
          ...this.props.style
        }}
      >
        <div>
          <DatePicker
            id='fromDatePicker'
            placeholder='Select From Date'
            style={{ width: '185px' }}
            value={this.state.fromDate}
            dateRender={current => {
              const currentDate = new Date().setHours(0, 0, 0, 0)
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
            onChange={(event) => {
              this.setState({
                fromDate: event
              }, () => this.props.handleDateChange(event, 'from'))
            }}
          />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <DatePicker
            placeholder='Select To Date'
            value={this.state.toDate}
            dateRender={current => {
              const currentDate = new Date().setHours(0, 0, 0, 0)
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
            onChange={(event) => {
              this.setState({
                toDate: event
              }, () => this.props.handleDateChange(event, 'to'))
            }}
          />
        </div>
      </div>
    )
  }
}

FromToDatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  style: PropTypes.shape({})
}

FromToDatePicker.defaultProps = {
  style: {}
}

export default FromToDatePicker
