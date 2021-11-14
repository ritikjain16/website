/* eslint-disable no-unused-vars */
import React from 'react'
import { get } from 'lodash'
import { Tooltip } from 'antd'
import moment from 'moment'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { eventIcons } from '../../constants/icons'

import './fullcalendar.scss'

const Calendar = ({
  fetchedEvents,
  initialCalendarView = 'timeGridWeek',
  calendarHeight = '100%',
  showSelected = false,
  customDateToNavigate = null,
  customHeaderToolBar = {
    start: 'prev,next title today',
    right: 'timeGridWeek,dayGridMonth,timeGridDay,listMonth'
  },
  handleEventClick = () => null,
  datesSet = () => null,
  customButtons = {},
  onDateClick,
  customViews = {},
  customCalendarView = null,
  navLinks = false
}) => {
  const calendarComponentRef = React.createRef()
  /** Use this to set Custom Date in Calendar */
  React.useEffect(() => {
    const calendarApi = calendarComponentRef.current.getApi()
    if (calendarApi && customDateToNavigate) {
      calendarApi.gotoDate(customDateToNavigate)
    }
  }, [customDateToNavigate])

  /** Available Options - timeGridDay, timeGridWeek, dayGridMonth, listMonth */
  React.useEffect(() => {
    const calendarApi = calendarComponentRef.current.getApi()
    if (calendarApi && customCalendarView) {
      calendarApi.changeView(customCalendarView || 'timeGridWeek')
    }
  }, [customCalendarView])

  const getEventStatusIconAndLabel = (sessionStatus, record, isSessionClickable, documentType) => {
    if (isSessionClickable && (documentType !== 'demoSession')) {
      if (documentType === 'rescheduled') {
        return { icon: eventIcons.rescheduleRejected, label: 'Class Rescheduled' }
      }
      switch (sessionStatus) {
        case 'allotted':
          return { icon: eventIcons.startClass, label: 'Start Class' }
        case 'started':
          return { icon: eventIcons.endClass, label: 'End Class' }
        case 'completed':
          if (typeof get(record, 'sessionRecordingLink') !== 'string') {
            return { icon: eventIcons.uploadLink, label: 'Upload Recording' }
          }
          if (get(record, 'sessionRecordingLink')) {
            return { icon: eventIcons.viewRecording, label: 'View Recording' }
          }
          if ((get(record, 'sessionType') !== 'batch' && get(record, 'topic.order') === 1)) {
            return { icon: eventIcons.feedBack, label: 'Give Feedback' }
          }
          break
        default:
          return { icon: null, label: null }
      }
    }
    return { icon: null, label: null }
  }
  const renderEventContent = (args) => {
    const isTimeGridWeekView = args.view.type !== 'dayGridMonth'
    const topic = get(args.event.extendedProps.record, 'topic.title') || ''
    const { icon: statusIcon, label: statusLabel } = getEventStatusIconAndLabel(get(args, 'event.extendedProps.record.sessionStatus'),
      get(args, 'event.extendedProps.record'), get(args, 'event.extendedProps.clickable'), get(args, 'event.extendedProps.documentType'))
    const customTheme = get(args, 'event.extendedProps.theme', {})
    const isEmptySlot = get(args, 'event.title') === 'Empty Slot'
    if (showSelected) {
      const eventParent = document.querySelectorAll('.fc-daygrid-day.fc-day') || []
      eventParent.forEach(ele => {
        const elementDate = ele.getAttribute('data-date') && new Date(ele.getAttribute('data-date'))
        const argsDate = args.event.title && new Date(args.event.title)
        if (moment(elementDate).isBefore(moment().subtract(1, 'day'))) {
          ele.classList.add('prev-dates')
        } else {
          ele.classList.add('normal-dates')
        }
        if (ele) {
          if (elementDate && argsDate &&
            (new Date(ele.getAttribute('data-date')).toLocaleDateString()
              === new Date(args.event.title).toLocaleDateString())) {
            ele.classList.add('fc-day-today')
          } else {
            ele.classList.remove('fc-day-today')
          }
        }
      })
    }
    return showSelected ? <div /> : (
      <>
        <Tooltip
          overlayClassName='custom-ant-tooltip-inner'
          title={statusLabel}
          placement='topLeft'
        >
          <div className={`event-container ${isEmptySlot && 'event-empty-slot'}`}
            title={`${args.event.title}${isTimeGridWeekView ? ` • ${topic}` : ''}`}
            style={{
              color: get(customTheme, 'color') || '',
              borderColor: args.borderColor,
              background: args.backgroundColor,
              opacity: `${args.isPast ? 0.5 : 1}`
            }}
          >
            {
              !isEmptySlot && (
                <div className='event-details'
                  style={{
                display: `${isTimeGridWeekView ? 'block' : 'display-inline'}`,
                textDecoration: get(customTheme, 'textDecoration', null) || ''
              }}
                >
                  {!isTimeGridWeekView && (
                  <span
                    className='event-icon'
                    style={{
                    top: 0,
                    fill: get(customTheme, 'color') || ''
                  }}
                  >
                    {statusIcon}
                  </span>
              )}
                  <div className='event-date-indicator'>
                    {isTimeGridWeekView ? (
                  args.timeText
                  ) : (
                    args.event.start.toLocaleTimeString('en', {
                      hour: '2-digit',
                    }).replace(' ', '')
                    )}
                  </div>
                  <div className='event-title'>
                    {isTimeGridWeekView && (
                    <span
                      className='event-icon'
                      style={{
                      fill: get(customTheme, 'color') || ''
                    }}
                    >
                      {statusIcon}
                    </span>
                )}
                    {args.event.title} {isTimeGridWeekView && (<>&bull; {topic}</>)}
                  </div>
                </div>
              )
            }
            {
              !isEmptySlot && (
                <div className='event-noOfStudent-indicator'
                  style={{ fontWeight: '600', color: args.backgroundColor, backgroundColor: args.borderColor }}
                >
                  {args.event.extendedProps.totalStudent}
                </div>
              )
            }
          </div>
        </Tooltip>
      </>
    )
  }

  return (
    <FullCalendar
      ref={calendarComponentRef}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      views={customViews}
      customButtons={customButtons}
      headerToolbar={customHeaderToolBar}
      format
      datesSet={datesSet}
      initialView={initialCalendarView}
      height={calendarHeight}
      nowIndicator
      stickyFooterScrollbar
      selectable
      navLinks={navLinks}
      dayMaxEvents={2}
      events={fetchedEvents}
      eventContent={renderEventContent} // custom render function
      eventClick={handleEventClick}
      dateClick={onDateClick}
    />
  )
}

export default Calendar
