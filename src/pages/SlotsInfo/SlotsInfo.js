/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, sortBy } from 'lodash'
import { Table, Tooltip, Pagination, Radio } from 'antd'
import moment from 'moment'
import fetchMentorsWithSessions from '../../actions/slots/fetchMentorsWithSessions'
import fetchSlotsInfo from '../../actions/slots/fetchSlotsInfo'
import getSlotLabel from '../../utils/slots/slot-label'
import { filterKey } from '../../utils/data-utils'
import config from '../../config/appConfig'
import { appConfig } from '../../config'
import offsetDate from '../../utils/date/date-offset'
import FromToDatePicker from '../../components/FromToDatePicker'
import UsersInfo from './component/UsersInfo'
import { MENTEE, MENTOR } from '../../constants/roles'
import SlotsInfoStyle from './SlotsInfo.style'
import './antdTableStyle.scss'
import hs from '../../utils/scale'
import SendSessionModalLink from '../CompletedSessions/components/SendSessionModalLink'
import Main from '../../components/TopicNav/TopicNav.style'
import fetchMenteeWithSessions from '../../actions/slots/fetchMenteeWithSessions'
import fetchCourses from '../../actions/sessions/fetchCourses'

const boxStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '102%',
  border: '1px solid rgba(0, 0, 0, 0.2)',
  fontSize: '2vh',
  color: 'rgba(0, 0, 0, 0.5)',
  padding: '2px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontWeight: '600'
}

class SlotsInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMentorInfo: false,
      showMenteeInfo: false,
      data: [],
      columns: [],
      fromDate: new Date(),
      toDate: null,
      mentorSessionLink: '',
      userInfoKeys: {},
      sessionVideoModalShadowVisible: false,
      filterSet: {},
      currentPageNumber: 1,
      sessionVideoModalVisible: false,
      userIdSendSession: '',
      sendVideoSessionId: '',
      activeRoute: get(props, 'match.path'),
      loadingMentorInfo: false,
      selectedDateAndSlot: {},
      loadingMenteeInfo: false,
      menteeSessionIdKeys: [],
      country: localStorage.getItem('country'),
      currentCountry: '',
      shouldResetDate: true,
      coursesList: []
    }
  }

  componentDidMount() {
    this.setState({
      activeRoute: get(this.props, 'match.path')
    })
    let numberOfOffsetDays = 0
    if (new Date().getDay() !== 0) {
      numberOfOffsetDays = new Date().getDay() - 1
    } else {
      numberOfOffsetDays = 6
    }
    this.setState({
      fromDate: offsetDate(new Date(), numberOfOffsetDays, 'SUBTRACT')
    }, () => {
      fetchSlotsInfo(
        offsetDate(this.state.fromDate, 1, 'SUBTRACT'),
        offsetDate(new Date(this.state.fromDate), 7, 'ADD'),
        this.state.country
      )
    })
    window.addEventListener('click', () => {
      if (localStorage && this.state.country !== localStorage.getItem('country')) {
        this.setState({
          country: localStorage.getItem('country')
        })
      }
    })
  }

  getInfoNode = (
    data, color,
    title, disableHover = false,
    date, time,
    index, colored = false, backgroundColor
  ) => (
    <Tooltip title={title} placement='left'>
      <SlotsInfoStyle.InfoNode
        index={index}
        disableHover={disableHover}
        colored={colored}
        backgroundColor={backgroundColor}
        onClick={() => {
          if (title === 'Open mentor slots') {
            this.setState({
              userInfoKeys: {
                date,
                time
              },
              showMentorInfo: true
            }, () => {
              if (
                new Date(this.state.selectedDateAndSlot.date).setHours(0, 0, 0, 0) !==
                new Date(date).setHours(0, 0, 0, 0) ||
                this.state.selectedDateAndSlot.time !== time
              ) {
                this.setState({
                  loadingMentorInfo: true,
                  selectedDateAndSlot: {
                    date,
                    time
                  }
                }, async () => {
                  const res = await fetchMentorsWithSessions(date, time, true)
                  if (res) {
                    this.setState({
                      loadingMentorInfo: false
                    })
                  }
                })
              }
            })
          } else if (title === 'Open mentee bookings') {
            this.setState({
              userInfoKeys: {
                date,
                time
              },
              showMenteeInfo: true
            }, () => {
              const { currentCountry } = this.state
              if (
                new Date(this.state.selectedDateAndSlot.date).setHours(0, 0, 0, 0) !==
                new Date(date).setHours(0, 0, 0, 0) ||
                this.state.selectedDateAndSlot.time !== time ||
                (this.state.country === 'all' || currentCountry !== this.state.country)
              ) {
                this.setState({
                  loadingMenteeInfo: true,
                  selectedDateAndSlot: {
                    date,
                    time
                  }
                }, async () => {
                  if (this.state.coursesList.length === 0) {
                    fetchCourses()
                  }
                  const res = await fetchMenteeWithSessions(date, time, true)
                  if (res) {
                    this.setState({
                      loadingMenteeInfo: false
                    })
                  }
                })
              }
            })
          }
        }}
      >
        <SlotsInfoStyle.SlotCount color={color}>{data}</SlotsInfoStyle.SlotCount>
      </SlotsInfoStyle.InfoNode>
    </Tooltip>
  )

    getReportNode = (data, data1, title, colored) => (
      <SlotsInfoStyle.InfoNode
        index={3}
        disableHover
        report
        header
        colored={colored}
        backgroundColor='rgba(239, 120, 120, 0.4)'
      >
        <Tooltip placement='left' title={title}>
          <SlotsInfoStyle.SubInfoNode big>
            <SlotsInfoStyle.SlotCount>{data}</SlotsInfoStyle.SlotCount>
          </SlotsInfoStyle.SubInfoNode>
        </Tooltip>
        <SlotsInfoStyle.SubInfoNode>
          <SlotsInfoStyle.SlotCount>{data1}</SlotsInfoStyle.SlotCount>
        </SlotsInfoStyle.SubInfoNode>
      </SlotsInfoStyle.InfoNode>
    )

  getTableData = () => {
    const { availableSlots, menteeSessions, mentorSessions,
      allottedSessions } = this.props
    const slotsCountObj = {}
    const menteeSlotsObj = {}
    const mentorSlotsObj = {}
    const allotedSessionsObj = {}
    const pendingSlotsCount = {}
    if (availableSlots) {
      availableSlots.toJS().forEach(s => {
        const availSlotsObj = {}
        let total = 0
        config.timeSlots.forEach(t => {
          if (s[`slot${t}`] != null) {
            availSlotsObj[`slot${t}`] = s[`slot${t}`]
            total += s[`slot${t}`]
          }
          availSlotsObj.total = total
        })
        slotsCountObj[moment(new Date(s.date)).format('Do MMM yyyy')] = availSlotsObj
      })
      if (allottedSessions) {
        const mergedSessions = filterKey(allottedSessions, 'slotsInfo')
          ? filterKey(allottedSessions, 'slotsInfo').toJS()
          : []
        const { date, time } = this.state.selectedDateAndSlot
        if (this.state.menteeSessionIdKeys) {
          this.state.menteeSessionIdKeys.forEach(key => {
            const session = filterKey(
              allottedSessions,
              `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}/${key}`
            )
            if (session && session.toJS().length) {
              mergedSessions.push(session.toJS()[0])
            }
          })
        }
        mergedSessions.forEach((s) => {
          for (let i = 0; i < config.timeSlots.length; i += 1) {
            const { sessionInfo } = s
            if (sessionInfo[`slot${config.timeSlots[i]}`] !== null && sessionInfo[`slot${config.timeSlots[i]}`] === true) {
              if (allotedSessionsObj[moment(new Date(sessionInfo.bookingDate)).format('Do MMM yyyy')]) {
                const sessions = allotedSessionsObj[moment(new Date(sessionInfo.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] || []
                sessions.push(sessionInfo.id)
                allotedSessionsObj[moment(new Date(sessionInfo.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = sessions
              } else {
                allotedSessionsObj[moment(new Date(sessionInfo.bookingDate)).format('Do MMM yyyy')] = {}
                allotedSessionsObj[moment(new Date(sessionInfo.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = [sessionInfo.id]
              }
            }
          }
        })
      }

      if (menteeSessions) {
        let mentorMenteeSessions = []
        if (allottedSessions
          && allottedSessions.toJS()) mentorMenteeSessions = allottedSessions.toJS()
        menteeSessions.toJS().forEach(s => {
          const sessionObj = {}
          config.timeSlots.forEach(t => {
            sessionObj[`slot${t}`] = 0
            sessionObj.total = 0
          })
          pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')] = sessionObj
        })
        menteeSessions.toJS().forEach(s => {
          if (this.state.country === 'all' || get(s, 'country') === this.state.country) {
            for (let i = 0; i < config.timeSlots.length; i += 1) {
              const assignedSessions = allotedSessionsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')]
                ? allotedSessionsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] || []
                : []
              const colored = assignedSessions.length ? !assignedSessions.includes(s.id) : true
              if (s[`slot${config.timeSlots[i]}`] != null && s[`slot${config.timeSlots[i]}`] === true) {
                if (menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')]) {
                  menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] =
                      menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`]
                        ? menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] + 1
                        : 1
                  menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].total =
                      menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].total
                        ? menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].total + 1
                        : 1
                  const coloredRows = menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].colored || []
                  if (colored) {
                    coloredRows.push(config.timeSlots[i])
                    menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].colored = coloredRows
                  }
                } else {
                  menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')] = {}
                  menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = 1
                  menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].total = 1
                  if (colored) {
                    menteeSlotsObj[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].colored = [config.timeSlots[i]]
                  }
                }
                const isExistMMSession = mentorMenteeSessions.find(mmSession =>
                  get(mmSession, 'menteeSession.id') === s.id
                  && get(mmSession, `sessionInfo[slot${config.timeSlots[i]}]`) === true)
                if (!isExistMMSession && (get(s, 'user.verificationStatus') !== 'notQualified')) {
                  if (pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')]
                    && pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`]) {
                    let count = pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`]
                    count += 1
                    pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = count
                  } else {
                    pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = 1
                  }
                }
                if (pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')]) {
                  let totalSession = 0
                  const slotsObj = pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')]
                  for (const slot in slotsObj) {
                    if (slot.startsWith('slot') && slotsObj[slot]) {
                      totalSession += 1
                    }
                  }
                  pendingSlotsCount[moment(new Date(s.bookingDate)).format('Do MMM yyyy')].total = totalSession
                }
              }
            }
          }
        })
      }
      if (mentorSessions) {
        mentorSessions.toJS().forEach(s => {
          for (let i = 0; i < config.timeSlots.length; i += 1) {
            if (s[`slot${config.timeSlots[i]}`] != null && s[`slot${config.timeSlots[i]}`] === true) {
              if (mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')]) {
                mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] =
                    mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`]
                      ? mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] + 1
                      : 1
                mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')].total =
                    mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')].total
                      ? mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')].total + 1
                      : 1
              } else {
                mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')] = {}
                mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')][`slot${config.timeSlots[i]}`] = 1
                mentorSlotsObj[moment(new Date(s.availabilityDate)).format('Do MMM yyyy')].total = 1
              }
            }
          }
        })
      }
    }
    const data = []
    const currDate = offsetDate(new Date(this.state.fromDate), (this.state.currentPageNumber - 1) * 7, 'ADD')
    let slotsInfo = []
    for (let i = 0; i <= config.timeSlots.length + 1; i += 1) {
      const dataWeekWise = {}
      for (let j = 0; j < 7; j += 1) {
        const date = moment(offsetDate(currDate, j, 'ADD')).format('Do MMM yyyy')
        slotsInfo = []
        if (i < appConfig.timeSlots.length) {
          const diff1 = ((menteeSlotsObj[date] && menteeSlotsObj[date][`slot${config.timeSlots[i]}`]) || 0) -
              ((mentorSlotsObj[date] && mentorSlotsObj[date][`slot${config.timeSlots[i]}`]) || 0)
          const diff2 = ((mentorSlotsObj[date] && mentorSlotsObj[date][`slot${config.timeSlots[i]}`]) || 0) -
              ((menteeSlotsObj[date] && menteeSlotsObj[date][`slot${config.timeSlots[i]}`]) || 0)
          let colored = false
          let color = ''
          if (
            menteeSlotsObj[date] && menteeSlotsObj[date].colored &&
              menteeSlotsObj[date].colored.includes(config.timeSlots[i])
          ) {
            colored = true
            color = date === moment().format('Do MMM yyyy')
              ? 'rgba(191, 141, 255, 0.6)' : 'rgba(191, 141, 255, 0.3)'
          } else if (
            diff1 > 0
          ) {
            colored = true
            color = 'rgba(239, 120, 120, 0.3)'
          } else if (diff2 !== ((pendingSlotsCount[date] && pendingSlotsCount[date][`slot${config.timeSlots[i]}`]) || 0)) {
            colored = true
            color = 'rgba(128, 128, 128, 0.25)'
            /* eslint-disable brace-style */
          }
          // else if (diff2 !== ((slotsCountObj[date]
          //  && slotsCountObj[date][`slot${config.timeSlots[i]}`]) || 0)) {
          //   colored = true
          //   color = 'rgba(128, 128, 128, 0.25)'
          // }
          else if (
            new Date().setHours(0, 0, 0, 0) === offsetDate(currDate, j, 'ADD').setHours(0, 0, 0, 0)
          ) {
            colored = true
            color = 'rgba(193,235,221, 0.6)'
          }
          if (mentorSlotsObj[date] && mentorSlotsObj[date][`slot${config.timeSlots[i]}`]) {
            slotsInfo.push(
              this.getInfoNode(`${mentorSlotsObj[date][`slot${config.timeSlots[i]}`].toString()}`,
                '#389eb5', 'Open mentor slots', false, offsetDate(currDate, j, 'ADD'), config.timeSlots[i], 1, colored, color)
            )
          } else {
            slotsInfo.push(this.getInfoNode('0', '#389eb5', '', true, offsetDate(currDate, j, 'ADD'),
              config.timeSlots[i], 1, colored, color))
          }
          if (menteeSlotsObj[date] && menteeSlotsObj[date][`slot${config.timeSlots[i]}`]) {
            slotsInfo.push(
              this.getInfoNode(`${menteeSlotsObj[date][`slot${config.timeSlots[i]}`].toString()}`, '#de2cd7',
                'Open mentee bookings', false, offsetDate(currDate, j, 'ADD'), config.timeSlots[i], 2, colored, color)
            )
          } else {
            slotsInfo.push(this.getInfoNode('0', '#de2cd7', '', true, offsetDate(currDate, j, 'ADD'),
              config.timeSlots[i], 2, colored, color))
          }
          if (pendingSlotsCount[date] && pendingSlotsCount[date][`slot${config.timeSlots[i]}`]) {
            slotsInfo.push(
              this.getInfoNode(`${pendingSlotsCount[date][`slot${config.timeSlots[i]}`].toString()}`, '#70cc05',
                '', true, offsetDate(currDate, j, 'ADD'), config.timeSlots[i], 3, colored, color)
            )
          } else {
            slotsInfo.push(this.getInfoNode('0', '#70cc05', '', true, offsetDate(currDate, j, 'ADD'),
              config.timeSlots[i], 3, colored, color))
          }
          // prev remaining slots code
          // if (slotsCountObj[date] && slotsCountObj[date][`slot${config.timeSlots[i]}`]) {
          //   slotsInfo.push(
          //     this.getInfoNode(
          // `${slotsCountObj[date][`slot${config.timeSlots[i]}`].toString()}`, '#70cc05',
          //       '', true, offsetDate(currDate, j, 'ADD'), config.timeSlots[i], 3, colored, color)
          //   )
          // } else {
          //   slotsInfo.push(
          // this.getInfoNode('0', '#70cc05', '', true, offsetDate(currDate, j, 'ADD'),
          //     config.timeSlots[i], 3, colored, color))
          // }
        } else if (i === appConfig.timeSlots.length) {
          // Preparing data for the total row.
          if (mentorSlotsObj[date]) {
            slotsInfo.push(
              this.getInfoNode(`${mentorSlotsObj[date].total.toString()}`,
                '#389eb5', '', true, offsetDate(currDate, j, 'ADD'), 0, 1)
            )
          } else {
            slotsInfo.push(
              this.getInfoNode('0', '#389eb5', '', true, offsetDate(currDate, j, 'ADD'), 0, 1)
            )
          }
          if (menteeSlotsObj[date]) {
            slotsInfo.push(
              this.getInfoNode(`${menteeSlotsObj[date].total.toString()}`,
                '#de2cd7', '', true, offsetDate(currDate, j, 'ADD'), 0, 2)
            )
          } else {
            slotsInfo.push(
              this.getInfoNode('0', '#de2cd7', '', true, offsetDate(currDate, j, 'ADD'), 0, 2)
            )
          }
          if (pendingSlotsCount[date]) {
            slotsInfo.push(
              this.getInfoNode(`${pendingSlotsCount[date].total.toString()}`,
                '#70cc05', '', true, offsetDate(currDate, j, 'ADD'), 0, 3)
            )
          } else {
            slotsInfo.push(
              this.getInfoNode('0', '#70cc05', '', true, offsetDate(currDate, j, 'ADD'), 0, 3)
            )
          }
          // prev remaining slots code
          // if (slotsCountObj[date]) {
          //   slotsInfo.push(
          //     this.getInfoNode(
          //       `${slotsCountObj[date].total.toString()}`,
          //       '#70cc05', '', true, offsetDate(currDate, j, 'ADD'), 0, 3)
          //   )
          // } else {
          //   slotsInfo.push(
          //     this.getInfoNode(
          //       '0', '#70cc05', '', true, offsetDate(currDate, j, 'ADD'), 0, 3)
          //   )
          // }
        } else if (i === appConfig.timeSlots.length + 1) {
          const { salesOperationReport } = this.props
          if (salesOperationReport) {
            const reportDate = moment(offsetDate(currDate, j, 'ADD')).format('DD-MM-yyyy').toString()
            const report = salesOperationReport.toJS().filter(r => r._id === reportDate) || []
            if (report && report.length) {
              const registered = get(report, '0.userRegisteredCount')
              const booked = get(report, '0.menteeFirstSessionBookedCount')
              const allotted = get(report, '0.firstMentorMenteeSessionsCount')
              const completed = get(report, '0.firstSessionCompletedCount')
              const completedPercent = get(report, '0.firstCompletedSessionsPercentage')
              slotsInfo.push(this.getReportNode('Registered:', `${registered && registered != null ? registered.toString() : '0'}`, 'Users registered count'))
              slotsInfo.push(this.getReportNode('1st Booked:', `${booked && booked != null ? booked.toString() : '0'}`, 'Trial session booked count'))
              slotsInfo.push(this.getReportNode('1st Allotted:', `${allotted && allotted != null ? allotted.toString() : '0'}`, 'Trial session allotted count'))
              slotsInfo.push(this.getReportNode('1st Compltd:', `${completed && completed != null ? completed.toString() : '0'}`, 'Trial session completed count'))
              slotsInfo.push(this.getReportNode(
                'Compltd %:', `${completedPercent && completedPercent !== null ? completedPercent.toString() : '0.00'}`, 'Trial session completed %',
                booked && booked != null ? (completed / booked) < 0.5 : true
              ))
            } else {
              slotsInfo.push(this.getReportNode('Registered:', '0', 'Users registered count'))
              slotsInfo.push(this.getReportNode('1st Booked:', '0', 'Trial session booked count'))
              slotsInfo.push(this.getReportNode('1st Started:', '0', 'Trial session started count'))
              slotsInfo.push(this.getReportNode('1st Compltd:', '0', 'Trial session completed count'))
              slotsInfo.push(this.getReportNode('Compltd %:', '0.00', 'Trial session completed %', true))
            }
          }
        }
        dataWeekWise[date] = slotsInfo
        if (i < appConfig.timeSlots.length) {
          dataWeekWise.slotTime = getSlotLabel(appConfig.timeSlots[i]).startTime
        } else if (i === appConfig.timeSlots.length) {
          dataWeekWise.slotTime = 'Total'
        } else if (i === appConfig.timeSlots.length + 1) {
          dataWeekWise.slotTime = 'Report'
        }
      }
      data.push(dataWeekWise)
    }

    return data
  }

  getWeekWiseReportCell = (key, title) => {
    const { salesOperationReport } = this.props
    const currDate = offsetDate(new Date(this.state.fromDate), (this.state.currentPageNumber - 1) * 7, 'ADD')
    const dataWeekWise = {}
    for (let j = 0; j < 7; j += 1) {
      const reportDate = moment(offsetDate(currDate, j, 'ADD')).format('DD-MM-yyyy').toString()
      const report = salesOperationReport.toJS().filter(r => r._id === reportDate) || []
      if (report && report.length) {
        const value = get(report, `0.${key}`) && get(report, `0.${key}`) !== null
          ? get(report, `0.${key}`).toString()
          : '0'
        dataWeekWise[reportDate] = [
          <div
            className={
              new Date().setHours(0, 0, 0, 0) === offsetDate(currDate, j, 'ADD').setHours(0, 0, 0, 0)
                ? 'currDateCell'
                : ''
            }
          >
            {
              key !== 'firstCompletedSessionsPercentage'
                ? value
                : `${value}%`
            }
          </div>
        ]
      } else {
        dataWeekWise[reportDate] = [
          <div
            className={
              new Date().setHours(0, 0, 0, 0) === offsetDate(currDate, j, 'ADD').setHours(0, 0, 0, 0)
                ? 'currDateCell'
                : ''
            }
          >
            {
              key !== 'firstCompletedSessionsPercentage'
                ? '0'
                : '0%'
            }
          </div>
        ]
      }
    }
    dataWeekWise.rowTitle = title

    return dataWeekWise
  }

  getReportData = () => {
    const { salesOperationReport } = this.props
    const data = []
    if (salesOperationReport) {
      data.push(this.getWeekWiseReportCell('userRegisteredCount', 'Registered'))
      data.push(this.getWeekWiseReportCell('menteeFirstSessionBookedCount', 'First Booked'))
      data.push(this.getWeekWiseReportCell('firstMentorMenteeSessionsCount', 'First Assigned'))
      data.push(this.getWeekWiseReportCell('firstSessionCompletedCount', 'First Completed'))
      data.push(this.getWeekWiseReportCell('firstCompletedSessionsPercentage', 'First Completed %'))
      data.push(this.getWeekWiseReportCell('firstUnAssignedSessions', 'First Unassigned'))
      data.push(this.getWeekWiseReportCell('zoomIssue', 'Zoom Issue'))
      data.push(this.getWeekWiseReportCell('internetIssue', 'Internet Issue'))
      data.push(this.getWeekWiseReportCell('laptopIssue', 'Laptop Issue'))
      data.push(this.getWeekWiseReportCell('chromeIssue', 'Chrome Issue'))
      data.push(this.getWeekWiseReportCell('powerCut', 'Power Cut'))
      data.push(this.getWeekWiseReportCell('notResponseAndDidNotTurnUp', 'Did Not Turn Up'))
      data.push(this.getWeekWiseReportCell('turnedUpButLeftAbruptly', 'Left Abruptly'))
      data.push(this.getWeekWiseReportCell('leadNotVerifiedProperly', 'Not Verified Properly'))
      data.push(this.getWeekWiseReportCell('otherReasonForReschedule', 'Other Reason'))

      return data
    }
  }

  getHeaderInfoNode = () => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Tooltip title='Slots booked by mentors' placement='right'>
        <SlotsInfoStyle.InfoNode index={1} disableHover header>
          <SlotsInfoStyle.SlotCount color='rgba(0, 0, 0, 0.65)'>Mnt</SlotsInfoStyle.SlotCount>
        </SlotsInfoStyle.InfoNode>
      </Tooltip>
      <Tooltip title='Slots booked by students' placement='right'>
        <SlotsInfoStyle.InfoNode index={2} disableHover header>
          <SlotsInfoStyle.SlotCount color='rgba(0, 0, 0, 0.65)'>Std</SlotsInfoStyle.SlotCount>
        </SlotsInfoStyle.InfoNode>
      </Tooltip>
      <Tooltip title='Unassiged Leads' placement='right'>
        <SlotsInfoStyle.InfoNode index={3} disableHover header>
          <SlotsInfoStyle.SlotCount color='rgba(0, 0, 0, 0.65)'>Avl</SlotsInfoStyle.SlotCount>
        </SlotsInfoStyle.InfoNode>
      </Tooltip>
    </div>
  )

  getSlotsInfoColumns = (startDate) => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'slotTime',
        width: '130px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(startDate).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(startDate).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 1, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 1, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 2, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 2, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 3, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 3, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 4, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 4, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 5, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 5, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      },
      {
        title: [
          <div style={{ marginTop: '6px', marginBottom: '6px', width: `${hs(400)}px`, display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
            {`${moment(offsetDate(startDate, 6, 'ADD')).format('Do MMM (ddd)')}`}
          </div>,
          this.getHeaderInfoNode()
        ],
        dataIndex: `${moment(offsetDate(startDate, 6, 'ADD')).format('Do MMM yyyy')}`,
        width: '220px',
      }
    ]

    return columns
  }

  getReportColumns = (startDate) => {
    const columns = [
      {
        title: 'Title',
        dataIndex: 'rowTitle'
      },
      {
        title: `${moment(startDate).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(startDate).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 1, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 1, 'ADD')).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 2, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 2, 'ADD')).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 3, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 3, 'ADD')).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 4, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 4, 'ADD')).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 5, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 5, 'ADD')).format('DD-MM-yyyy')}`
      },
      {
        title: `${moment(offsetDate(startDate, 6, 'ADD')).format('Do MMM (ddd)')}`,
        dataIndex: `${moment(offsetDate(startDate, 6, 'ADD')).format('DD-MM-yyyy')}`
      }
    ]

    return columns
  }

  setTableColumnsAndData = () => {
    const startDate = offsetDate(new Date(this.state.fromDate), (this.state.currentPageNumber - 1) * 7, 'ADD')
    let columns
    if (get(this.props, 'match.path') === '/ums/slotsInfo') {
      columns = this.getSlotsInfoColumns(startDate)
    } else if (get(this.props, 'match.path') === '/ums/report') {
      columns = this.getReportColumns(startDate)
    }
    let data
    if (get(this.props, 'match.path') === '/ums/slotsInfo') {
      data = this.getTableData()
    } else if (get(this.props, 'match.path') === '/ums/report') {
      data = this.getReportData()
    }
    // const usersMap = this.getUsersMap(filterKey(this.props.users, 'slotsInfo'))
    this.setState({
      columns,
      data
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      slotsInfoFetchStatus,
      mentorMenteeSessionAddStatus,
      mentorMenteeSessionDeleteStatus,
      courseFetchingStatus
    } = this.props
    if (
      (slotsInfoFetchStatus && get(slotsInfoFetchStatus.toJS(), 'success')) &&
      (prevProps.slotsInfoFetchStatus && !get(prevProps.slotsInfoFetchStatus.toJS(), 'success'))
    ) {
      this.setTableColumnsAndData()
    }
    if (get(this.props, 'match.path') !== get(prevProps, 'match.path')) {
      this.setState({
        activeRoute: get(this.props, 'match.path')
      }, () => this.setTableColumnsAndData())
    }
    const { date, time } = this.state.selectedDateAndSlot
    const { menteeSessionIdKeys } = this.state
    const currMenteeSessionId = menteeSessionIdKeys[menteeSessionIdKeys.length - 1]
    if (
      mentorMenteeSessionAddStatus && prevProps.mentorMenteeSessionAddStatus &&
      get(mentorMenteeSessionAddStatus.toJS(), `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}/${currMenteeSessionId}.success`) &&
      !get(prevProps.mentorMenteeSessionAddStatus.toJS(), `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}/${currMenteeSessionId}.success`)
    ) {
      this.setTableColumnsAndData()
    }

    if (
      mentorMenteeSessionDeleteStatus && prevProps.mentorMenteeSessionDeleteStatus &&
      get(mentorMenteeSessionDeleteStatus.toJS(), `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}.success`) &&
      !get(prevProps.mentorMenteeSessionDeleteStatus.toJS(), `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}.success`)
    ) {
      this.setTableColumnsAndData()
    }
    if (this.state.country !== prevState.country) {
      this.setState({
        showMentorInfo: false,
        showMenteeInfo: false,
        data: [],
        columns: [],
        userInfoKeys: {},
        // usersMap: {},
        filterSet: {},
        toDate: null,
        currentPageNumber: 1,
        shouldResetDate: true
      })
      let numberOfOffsetDays = 0
      if (new Date().getDay() !== 0) {
        numberOfOffsetDays = new Date().getDay() - 1
      } else {
        numberOfOffsetDays = 6
      }
      this.setState({
        fromDate: offsetDate(new Date(), numberOfOffsetDays, 'SUBTRACT')
      }, () => {
        fetchSlotsInfo(
          offsetDate(this.state.fromDate, 1, 'SUBTRACT'),
          offsetDate(new Date(this.state.fromDate), 7, 'ADD'),
          this.state.country
        )
      })
    }
    if ((courseFetchingStatus && !get(courseFetchingStatus.toJS(), 'loading')
      && get(courseFetchingStatus.toJS(), 'success') &&
      (prevProps.courseFetchingStatus !== courseFetchingStatus))) {
      this.setState({
        coursesList: this.props.courses && this.props.courses.toJS()
      })
    }
  }

  // onDateChange = (date) => {
  //   this.setState({
  //     selectedDate: new Date(date)
  //   }, () => {
  //     date = new Date(this.state.selectedDate.setHours(0, 0, 0, 0))
  //     fetchAvailableSlots(date)
  //     fetchSessions(0, null, date)
  //     fetchMenteeSessions(0, null, date)
  //   })
  // }

  shouldShowEmptyMessage = (totalMentorSlots) => {
    const { fetchStatus } = this.props
    if (fetchStatus.session && !fetchStatus.session.loading) {
      const slots = Object.keys(totalMentorSlots)
      return !slots.length
    }

    return false
  }

  closeModal = () => {
    this.setState({
      showMentorInfo: false,
      showMenteeInfo: false
    })
  }

  getUsersMap = (users) => {
    const usersMap = {}
    if (users) {
      const sortedUsers = sortBy(users.toJS(), 'createdAt')
      sortedUsers.forEach((user) => {
        usersMap[user.id] = user
      })
    }

    return usersMap
  }

  getUsers = () => {
    const { users, sessionLogs } = this.props
    const usersInfo = []
    const sessionLogArray = []
    let count = 1
    const { date, time } = this.state.selectedDateAndSlot
    const key = `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}`
    if (this.state.showMentorInfo) {
      const mentors = filterKey(users, key)
      if (mentors) {
        mentors.toJS().forEach((mentor) => {
          if (get(mentor, 'role') === MENTOR) {
            if (!get(mentor, 'sessionType')) {
              usersInfo.push({
                name: get(mentor, 'name'),
                username: get(mentor, 'username'),
                email: get(mentor, 'email'),
                phone: `${get(mentor, 'phone.countryCode')} ${get(mentor, 'phone.number')}`,
                createdAt: get(mentor, 'createdAt'),
                country: get(mentor, 'country') || 'india',
                role: get(mentor, 'role') || MENTOR
              })
            } else if (get(mentor, 'sessionType') && get(mentor, 'sessionType') === 'trial') {
              usersInfo.push({
                name: get(mentor, 'name'),
                username: get(mentor, 'username'),
                email: get(mentor, 'email'),
                phone: `${get(mentor, 'phone.countryCode')} ${get(mentor, 'phone.number')}`,
                createdAt: get(mentor, 'createdAt'),
                country: get(mentor, 'country') || 'india',
                role: get(mentor, 'role') || MENTOR
              })
            }
          }
        })
      }
    } else if (this.state.showMenteeInfo) {
      const mentee = filterKey(users, `menteeSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}`)
      if (mentee) {
        const currentCountry = get(mentee.toJS(), '0.country')
        if (currentCountry !== this.state.currentCountry) {
          this.setState({
            currentCountry
          })
        }
        mentee.toJS().forEach((_m) => {
          const parent = get(_m, 'studentProfile.parents.0') || { }
          if (get(_m, 'role') === 'mentee') {
            usersInfo.push({
              ..._m,
              name: get(_m, 'name'),
              id: get(_m, 'id'),
              username: get(_m, 'username'),
              email: parent ? get(parent, 'user.email') : '',
              parentName: parent ? get(parent, 'user.name') : '',
              phone: parent ? `${get(parent, 'user.phone.countryCode')} ${get(parent, 'user.phone.number')}` : '',
              topicOrder: get(_m, 'topic.order'),
              topicId: get(_m, 'topic.id'),
              sessionId: get(_m, 'sessionId'),
              createdAt: get(_m, 'createdAt'),
              grade: get(_m, 'studentProfile.grade'),
              gender: get(_m, 'gender'),
              verificationStatus: get(_m, 'verificationStatus'),
              source: get(_m, 'source'),
              country: get(_m, 'country') || 'india',
              timezone: get(_m, 'timezone')
            })
          }
        })
      }
      let sessionLogsData = sessionLogs && sessionLogs.toJS()
        && filterKey(sessionLogs, key).toJS() || []
      sessionLogsData = sortBy(sessionLogsData, 'createdAt').reverse()
      let order = 1
      sessionLogsData.forEach(sLog => {
        const childIds = usersInfo.map(user => get(user, 'id'))
        const sessionClientId = sessionLogArray.map(client => get(client, 'id'))
        if (!childIds.includes(get(sLog, 'client.id'))
          && !sessionClientId.includes(get(sLog, 'client.id'))) {
          const parent = get(sLog, 'client.studentProfile.parents.0') || { }
          sessionLogArray.push({
            ...sLog,
            email: parent ? get(parent, 'user.email') : '',
            parentName: parent ? get(parent, 'user.name') : '',
            phone: parent ? `${get(parent, 'user.phone.countryCode')} ${get(parent, 'user.phone.number')}` : '',
            grade: get(sLog, 'client.studentProfile.grade'),
            ...get(sLog, 'client'),
            id: get(sLog, 'client.id'),
            course: get(sLog, 'course.id', ''),
            sessionId: get(sLog, 'id'),
            dataFromSessionLogs: true,
            order
          })
          order += 1
        }
      })
    }
    let sortedUsers = sortBy(usersInfo, 'createdAt')
    if (sessionLogArray.length > 0) sortedUsers = [...sortedUsers, ...sessionLogArray]
    sortedUsers.forEach(user => {
      user.order = count
      count += 1
    })
    return sortedUsers
  }

  renderKeyItem = (data, index) => (
    <div style={{
          height: '20px',
          width: '100%',
          borderBottom: `${index !== 2 ? '1px solid #fab3ff' : 'none'}`,
          display: 'flex',
          flexDirection: 'row',
          marginTop: '8px',
          fontWeight: 'bold'
        }}
    >
      <div style={{
        backgroundColor: `${data.color}`,
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        marginLeft: '10px'
      }}
      />
      <div style={{
        marginTop: '-5px',
        marginLeft: '10px'
      }}
      >{data.name}
      </div>
    </div>
  )

  getTotalPages = () => {
    const startTime = new Date(this.state.fromDate).setHours(0, 0, 0, 0)
    const endTime = new Date(this.state.toDate).setHours(0, 0, 0, 0)
    return (
      this.state.filterSet.from && this.state.filterSet.to ? (endTime - startTime) / 86400000 : 1
    )
  }

  changeTab = (e) => {
    this.setState({
      activeRoute: e.target.value
      // eslint-disable-next-line react/prop-types
    }, () => this.props.history.push(this.state.activeRoute))
  }

  render() {
    const {
      slotsInfoFetchStatus,
      mentorMenteeSessionAddStatus,
      mentorMenteeSessionDeleteStatus
    } = this.props
    const { coursesList } = this.state
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Nunito',
        overflowX: 'hidden'
      }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '15px'
        }}
        >
          <Main.RadioGroup
            value={this.state.activeRoute}
            onChange={(e) => this.changeTab(e)}
            buttonStyle='solid'
            className='sessionTypeRadioGrp'
          >
            <Radio.Button className='sessionTypeRadioBtn' value='/ums/slotsInfo'>Info</Radio.Button>
            <Radio.Button className='sessionTypeRadioBtn' value='/ums/report'>Report</Radio.Button>
          </Main.RadioGroup>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>
            <FromToDatePicker
              showToDate
              defaultToDate={moment()}
              shouldResetDate={this.state.shouldResetDate}
              handleDateChange={(date, type) => {
                const currFilterSet = this.state.filterSet
                if (type === 'from') {
                  if (date !== null) {
                    currFilterSet.from = true
                    this.setState({
                      fromDate: date,
                      toDate: this.state.toDate === null
                          ? offsetDate(new Date(date), 7, 'ADD')
                          : this.state.toDate,
                      filterSet: currFilterSet,
                      shouldResetDate: false
                    })
                  } else {
                    currFilterSet.from = false
                    this.setState({
                      fromDate: offsetDate(new Date(), 1, 'SUBTRACT'),
                      toDate: offsetDate(new Date(), 7, 'ADD'),
                      filterSet: currFilterSet,
                      shouldResetDate: false,
                    })
                  }
                } else if (type === 'to') {
                  currFilterSet.to = true
                  if (date !== null) {
                    this.setState({
                      toDate: offsetDate(new Date(date), 1, 'ADD'),
                      filterSet: currFilterSet,
                      shouldResetDate: false
                    })
                  } else {
                    currFilterSet.to = false
                    this.setState({
                      toDate: offsetDate(new Date(this.state.fromDate), 7, 'ADD'),
                      filterSet: currFilterSet,
                      shouldResetDate: false,
                    })
                  }
                }
              }}
            />
            <SlotsInfoStyle.StyledButton
              allowHover={this.state.filterSet.from}
              marginLeft='30px'
              onClick={
                () => {
                  if (this.state.filterSet.from) {
                    this.setState({
                      data: [],
                      currentPageNumber: 1,
                      menteeSessionIdKeys: []
                    }, () => {
                      const fromDate = offsetDate(new Date(this.state.fromDate), ((this.state.currentPageNumber - 1) * 7) - 1, 'ADD')
                      const toDate = offsetDate(fromDate, 8, 'ADD')
                      fetchSlotsInfo(fromDate, toDate, this.state.country)
                    })
                  }
                }
              }
            >
              Filter
            </SlotsInfoStyle.StyledButton>
          </div>
          {
            this.state.activeRoute === '/ums/slotsInfo'
              ? (
                <div style={{ display: 'flex', flexDirection: 'row', width: '68vh' }}>
                  <div style={{ display: 'flex', width: '60%', border: '1px solid rgba(0, 0, 0, 0.2)', fontSize: '2vh', color: 'rgba(0, 0, 0, 0.5)', padding: '2px', fontWeight: '600' }}>
                    Color Scheme
                  </div>
                  <div style={boxStyle}>
                    <div style={{ width: '10%', height: '20%', backgroundColor: 'rgba(191, 141, 255, 0.6)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', left: '6%' }}>Unassigned students</div>
                  </div>
                  <div style={boxStyle}>
                    <div style={{ width: '8%', height: '20%', backgroundColor: 'rgba(239, 120, 120, 0.3)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', left: '6%' }}>Mentor missing</div>
                  </div>
                  <div style={boxStyle}>
                    <div style={{ width: '11%', height: '20%', backgroundColor: 'rgba(128, 128, 128, 0.25)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', left: '6%' }}>Availability mismatch</div>
                  </div>
                </div>
              )
              : <div />
          }
          <div style={{ display: 'flex', marginRight: '10px' }}>
            <SlotsInfoStyle.StyledButton
              allowHover
              refresh
              hoverColor='rgba(196, 248, 255, 0.7)'
              onClick={
                  () => {
                    this.setState({
                      data: [],
                      selectedDateAndSlot: {},
                      menteeSessionIdKeys: []
                    }, () => {
                      if (this.state.toDate !== null) {
                        const fromDate = offsetDate(new Date(this.state.fromDate), ((this.state.currentPageNumber - 1) * 7) - 1, 'ADD')
                        const toDate = offsetDate(fromDate, 8, 'ADD')
                        fetchSlotsInfo(fromDate, toDate, this.state.country)
                      } else {
                        fetchSlotsInfo(
                            offsetDate(new Date(this.state.fromDate), 1, 'SUBTRACT'),
                            offsetDate(new Date(this.state.fromDate), 7, 'ADD'),
                            this.state.country
                        )
                      }
                    }
              )
            }}
            >
              Refresh
            </SlotsInfoStyle.StyledButton>
          </div>
        </div>
        <div style={{
          width: `${hs(1810)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '15px'
        }}
        >
          <Table
            className={
              this.state.activeRoute === '/ums/slotsInfo'
                ? 'table-striped-rows'
                : 'report-table'
            }
            dataSource={this.state.data}
            columns={this.state.columns}
            rowKey='id'
            size='middle'
            bordered
            loading={slotsInfoFetchStatus && get(slotsInfoFetchStatus.toJS(), 'loading')}
            onChange={this.tableOnChange}
            pagination={{
              total: appConfig.timeSlots.length + 2,
              pageSize: appConfig.timeSlots.length + 2,
              hideOnSinglePage: true
            }}
          />
        </div>
        {
          !(slotsInfoFetchStatus && get(slotsInfoFetchStatus.toJS(), 'loading')) &&
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '25px 10px 10px 0' }}>
            <Pagination
              defaultCurrent={this.state.currentPageNumber}
              pageSize={7}
              total={this.getTotalPages()}
              onChange={(pageNumber) => {
                  this.setState({
                    data: [],
                    currentPageNumber: pageNumber
                  }, () => {
                    const fromDate = offsetDate(new Date(this.state.fromDate), ((pageNumber - 1) * 7) - 1, 'ADD')
                    const toDate = offsetDate(fromDate, 8, 'ADD')
                    fetchSlotsInfo(fromDate, toDate, this.state.country)
                  })
                }}
            />
          </div>
        }
        <UsersInfo
          id='User info'
          openSendSessionModal={(userId, sessionId, mentorSessionLink) => {
            if (mentorSessionLink) {
              this.setState({
                sessionVideoModalShadowVisible: true,
                userIdSendSession: userId,
                sendVideoSessionId: sessionId,
                mentorSessionLink
              })
            } else {
              this.setState({
                sessionVideoModalVisible: true,
                userIdSendSession: userId,
                sendVideoSessionId: sessionId,
              })
            }
          }}
          title={
              (this.state.showMentorInfo &&
                  `Mentors Available (${moment(this.state.userInfoKeys.date).format('Do MMM yyyy')} : ${getSlotLabel(this.state.userInfoKeys.time).startTime})`
              ) ||
              (this.state.showMenteeInfo &&
                  `Mentee Booking (${moment(this.state.userInfoKeys.date).format('Do MMM yyyy')} : ${getSlotLabel(this.state.userInfoKeys.time).startTime})`
              )
            }
          visible={this.state.showMentorInfo || this.state.showMenteeInfo}
          closeModal={this.closeModal}
          currentRole={
              (this.state.showMentorInfo && MENTOR) ||
              (this.state.showMenteeInfo && MENTEE)
            }
          users={this.getUsers()}
          coursesList={coursesList}
          userInfoKeys={this.state.userInfoKeys}
          usersFromStore={this.props.users}
          mentorSessionStatus={this.props.mentorSessionStatus}
          mentorMenteeSessions={this.props.mentorMenteeSessions}
          mentorMenteeSessionAddStatus={mentorMenteeSessionAddStatus}
          mentorMenteeSessionDeleteStatus={mentorMenteeSessionDeleteStatus}
          notification={this.props.notification}
          loadingMentorInfo={this.state.loadingMentorInfo}
          loadingMenteeInfo={this.state.loadingMenteeInfo}
          updateMenteeIdKeys={(currArr) => this.setState({
            menteeSessionIdKeys: currArr
          })}
          country={this.state.country}
        />
        <SendSessionModalLink
          id='SendSessionModalLink'
          visible={this.state.sessionVideoModalVisible}
          userId={this.state.userIdSendSession}
          sessionId={this.state.sendVideoSessionId}
          sessionLink={this.state.mentorSessionLink}
          shadowVisible={this.state.sessionVideoModalShadowVisible}
          close={() => {
            this.setState({
              sessionVideoModalVisible: false,
              sessionVideoModalShadowVisible: false
            })
          }}
        />
      </div>
    )
  }
}

SlotsInfo.propTypes = {
  menteeSessions: PropTypes.shape([]).isRequired,
  mentorSessions: PropTypes.shape([]).isRequired,
  availableSlots: PropTypes.shape([]).isRequired,
  users: PropTypes.shape([]),
  fetchStatus: PropTypes.shape({}).isRequired,
  slotsInfoFetchStatus: PropTypes.shape({}).isRequired,
  salesOperationReport: PropTypes.shape([]).isRequired,
  mentorSessionStatus: PropTypes.shape({}).isRequired,
  mentorMenteeSessions: PropTypes.shape([]).isRequired,
  mentorMenteeSessionAddStatus: PropTypes.shape({}).isRequired,
  notification: PropTypes.shape({}).isRequired,
  mentorMenteeSessionDeleteStatus: PropTypes.shape({}).isRequired,
  allottedSessions: PropTypes.shape([]).isRequired
}


SlotsInfo.defaultProps = {
  users: []
}

export default SlotsInfo
