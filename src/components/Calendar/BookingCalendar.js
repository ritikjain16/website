import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Calendar from 'react-calendar'
import './Calendar.scss'
import CalendarContainer from './BookingCalendar.style'

class BookingCalendar extends Component {
    onClick = (date) => {
      this.props.onDateChange(date)
    }

    render() {
      return (
        <CalendarContainer>
          <Calendar
            onChange={(date) => this.onClick(date)}
            value={this.props.selectedDate}
          />
        </CalendarContainer>
      )
    }
}

BookingCalendar.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired
}

export default BookingCalendar
