import moment from 'moment'
import { Button, DatePicker, Pagination } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import fetchMentorData from '../../actions/mentorReport/fetchMentor'
import fetchMentorsList from '../../actions/mentorReport/fetchMentorsList'
import { ADMIN, MENTOR, SALES_EXECUTIVE, UMS_ADMIN, UMS_VIEWER } from '../../constants/roles'
// import { MENTOR } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import MentorReportStyle from './MentorReport.style'
import SearchInput from './components/SearchInput'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import fetchMentorforSales from '../../actions/mentorReport/fetchMentorsForSales'
import DownloadReport from './components/DownloadReport'

class MentorReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      searchKey: 'All',
      searchName: '',
      searchEmail: '',
      searchPhone: '',
      perPage: 20,
      skip: 0,
      currentPage: 1,
      searchSalesName: '',
      selectedUserId: '',
      mentorArray: [],
      mentorNames: [],
      mentorEmails: [],
      mentorPhone: [],
      salesExecutiveList: null,
      filterQuery: '',
      mentorsId: [],
      mentorsData: [],
      totalCount: 0,
      salesExecName: '',
      mentorSalesExecName: '',
      columns: [],
      dateRanges: [
        { label: '1D', subtract: { duration: '0', unit: 'd' } },
        { label: '3D', subtract: { duration: '3', unit: 'd' } },
        { label: '1W', subtract: { duration: '7', unit: 'd' } },
        { label: '2W', subtract: { duration: '14', unit: 'd' } },
        { label: '3W', subtract: { duration: '21', unit: 'd' } },
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: '2M', subtract: { duration: '2', unit: 'M' } },
        { label: '3M', subtract: { duration: '3', unit: 'M' } },
        { label: '6M', subtract: { duration: '6', unit: 'M' } },
        { label: 'A', subtract: { duration: 'all' } },
      ],
      selectedRange: '{"duration":"7","unit":"d"}',
      filterDropdownOptions: [
        'Search By',
        'All',
        'Sale\'s Executive name',
        'Mentor\'s name',
        'Mentor\'s email',
        'Mentor\'s number',
        'Mentor Status(Active/Inactive)'
      ],
      mentorStatus: 'All'
    }
  }
  searchByFilter = () => {
    const {
      fromDate,
      toDate,
      searchKey,
      searchName,
      searchEmail,
      searchPhone,
      searchSalesName,
      mentorsData,
      mentorSalesExecName,
      savedRole,
      mentorStatus,
      mentorsId } = this.state
    if (savedRole && savedRole === MENTOR) {
      let filteredQuery = `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      if (fromDate) {
        filteredQuery += `{reportDate_gte: "${fromDate !== null ?
          moment(fromDate).startOf('day').toDate() : ''}"},`
      }
      if (toDate) {
        filteredQuery += `{reportDate_lte: "${toDate !== null ?
          toDate && moment(toDate).endOf('day').toDate() : ''}"},`
      }
      this.setState({
        filterQuery: filteredQuery
      }, () => fetchMentorData(this.state.filterQuery, mentorsData, mentorSalesExecName))
    } else if (savedRole &&
      (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER)) {
      let filteredQuery = ''
      if (searchKey === 'All') {
        filteredQuery = `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (fromDate) {
        filteredQuery += `{reportDate_gte: "${fromDate !== null ?
          moment(fromDate).startOf('day').toDate() : ''}"},`
      }
      if (toDate) {
        filteredQuery += `{reportDate_lte: "${toDate !== null ?
          toDate && moment(toDate).endOf('day').toDate() : ''}"},`
      }
      if (searchKey === 'Mentor\'s name' && searchName !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor\'s email' && searchEmail !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor\'s number' && searchPhone !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Sale\'s Executive name' && searchSalesName !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor Status(Active/Inactive)' && mentorStatus !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      this.setState({
        filterQuery: filteredQuery
      }, () => fetchMentorData(this.state.filterQuery, mentorsData, mentorSalesExecName))
    } else if (savedRole && savedRole === SALES_EXECUTIVE) {
      let filteredQuery = `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      if (fromDate) {
        filteredQuery += `{reportDate_gte: "${fromDate !== null ?
          moment(fromDate).startOf('day').toDate() : ''}"},`
      }
      if (toDate) {
        filteredQuery += `{reportDate_lte: "${toDate !== null ?
          toDate && moment(toDate).endOf('day').toDate() : ''}"},`
      }
      if (searchKey === 'Mentor\'s name' && searchName !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor\'s email' && searchEmail !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor\'s number' && searchPhone !== '') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'Mentor Status(Active/Inactive)' && mentorStatus !== 'All') {
        filteredQuery += `{mentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}},`
      }
      if (searchKey === 'All') {
        filteredQuery += ''
      }
      this.setState({
        filterQuery: filteredQuery
      }, () => fetchMentorData(this.state.filterQuery, mentorsData, mentorSalesExecName))
    }
  }
  componentDidMount = () => {
    const saveRole = getDataFromLocalStorage('login.role')
    const selectedUId = getDataFromLocalStorage('login.id')
    // first call
    this.handleDateRange(this.state.selectedRange, true)
    if (saveRole && saveRole === MENTOR) {
      const savedName = getDataFromLocalStorage('login.name')
      this.setState({
        mentorNames: [{ id: selectedUId, name: savedName }],
        selectedUserId: selectedUId,
        savedRole: saveRole
      }, () => this.fetchMentorForSaleData(selectedUId))
    } else if (saveRole &&
      (saveRole === ADMIN || saveRole === UMS_ADMIN || saveRole === UMS_VIEWER)) {
      this.setState({
        selectedUserId: selectedUId,
        savedRole: saveRole
      })
      this.fetchMentorsListData(this.state.perPage, this.state.skip)
      fetchMentorsList().then(res =>
        this.setState({ mentorArray: res.users }, () => {
          // getting all the mentor details and passing them in autocomplete
          const mentorNames = [...new Set(this.state.mentorArray.map(({ id, name }) => (
            {
              id,
              name
            }
          )))]
          const mentorEmails = [...new Set(this.state.mentorArray.map(({ id, email }) => (
            {
              id,
              name: email
            }
          )))]
          const mentorPhone = [...new Set(this.state.mentorArray.map(({ id, phone }) => (
            {
              id,
              name: phone.number
            }
          )
          ))]
          this.setState({
            mentorNames,
            mentorEmails,
            mentorPhone
          })
        }))
    } else if (saveRole && saveRole === SALES_EXECUTIVE) {
      this.setState({
        selectedUserId: selectedUId,
        savedRole: saveRole
      }, () => this.fetchMentorsListData())
      this.state.filterDropdownOptions.splice(2, 1)
      fetchMentorforSales(selectedUId)
        .then(res => this.setState({ mentorArray: res.user.salesExecutiveProfile.mentors }, () => {
          // getting all the mentor details and passing them in autocomplete
          const mentorNames = [...new Set(this.state.mentorArray.map(({ user: { id, name } }) => (
            {
              id,
              name
            }
          )))]
          const mentorEmails = [...new Set(this.state.mentorArray.map(({ user: { id, email } }) => (
            {
              id,
              name: email
            }
          )))]
          const mentorPhone = [...new Set(this.state.mentorArray.map(({ user: { id, phone } }) => (
            {
              id,
              name: phone.number
            }
          )
          ))]
          this.setState({
            mentorNames,
            mentorEmails,
            mentorPhone,
            perPage: 50
          })
        }))
    }
  }
  fetchSalesExecutive = () => {
    fetchMentorsList(0, 0, 'salesExecutive').then(res => {
      const { users } = res
      const salesExecutiveList = [...new Set(users.map(({ id, name }) => (
        {
          id,
          name
        }
      )))]
      this.setState({
        salesExecutiveList
      })
    })
  }
  fetchMentorsListData = (first, skip) => {
    const { savedRole, selectedUserId, searchKey, mentorStatus } = this.state
    if (savedRole === SALES_EXECUTIVE) {
      if (searchKey === 'Mentor Status(Active/Inactive)' && mentorStatus !== 'All') {
        let status = ''
        if (mentorStatus === 'Active') status = ' {isMentorActive: true}'
        else if (mentorStatus === 'Inactive') status = '{isMentorActive: false}'
        fetchMentorsList(first, skip, null, `{
          mentorProfile_some: {
            and: [
              ${status}
              { salesExecutive_some: { user_some: { id_in: [${getIdArrForQuery([selectedUserId])}] } } }
            ]
          }
        }`).then(res => {
          const mentorsId = res.users && res.users.map(({ id }) => id)
          const mentorsData = res.users && res.users.map(({ id, name }) => (
            { id, name }
          ))
          this.setState({
            totalCount: 0,
          })
          this.setState({
            mentorsId,
            mentorsData,
            totalCount: res.usersMeta && res.usersMeta.count
          }, () => this.searchByFilter())
        })
      } else {
        fetchMentorforSales(selectedUserId).then(res => {
          const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
          const mentorsData = res.user.salesExecutiveProfile.mentors.map(({ user }) => (
            { id: user.id, name: user.name }
          ))
          this.setState({
            mentorsId,
            mentorsData
          }, () => this.searchByFilter())
        })
      }
    } else if (searchKey === 'Mentor Status(Active/Inactive)' && mentorStatus !== 'All') {
      let status = ''
      if (mentorStatus === 'Active') status = '{ mentorProfile_some: { isMentorActive: true } }'
      else if (mentorStatus === 'Inactive') status = '{ mentorProfile_some: { isMentorActive: false } }'
      fetchMentorsList(first, skip, null, status).then(res => {
        const mentorsId = res.users && res.users.map(({ id }) => id)
        const mentorsData = res.users && res.users.map(({ id, name }) => (
          { id, name }
        ))
        this.setState({
          totalCount: 0,
        })
        this.setState({
          mentorsId,
          mentorsData,
          totalCount: res.usersMeta && res.usersMeta.count
        }, () => this.searchByFilter())
      })
    } else {
      fetchMentorsList(first, skip).then(res => {
        const mentorsId = res.users && res.users.map(({ id }) => id)
        const mentorsData = res.users && res.users.map(({ id, name }) => (
          { id, name }
        ))
        this.setState({
          totalCount: 0,
        })
        this.setState({
          mentorsId,
          mentorsData,
          totalCount: res.usersMeta && res.usersMeta.count
        }, () => this.searchByFilter())
      })
    }
  }
  componentDidUpdate = (prevProps) => {
    const { isReportsFetching, hasReportsFetched } = this.props
    if (!isReportsFetching && hasReportsFetched) {
      if (get(prevProps, 'mentorReports') !==
        get(this.props, 'mentorReports')) {
        this.createTableFromData()
      }
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page
    }, () => this.fetchMentorsListData(this.state.perPage, this.state.currentPage - 1))
  }
  createTableFromData = () => {
    const mentorReports = this.props.mentorReports && this.props.mentorReports.toJS()
    this.setState({
      tableData: mentorReports
    }, () => this.setTableHeader())
  }
  handleDateRange = (rangeInString, first) => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      if (range.duration === 'all') {
        this.handleDateChange([], 'rangeSelector', first)
      } else {
        this.handleDateChange([
          moment().subtract(range.duration, range.unit),
          moment()
        ], 'rangeSelector', first)
      }
    })
  }
  handleDateChange = (event, type, first) => {
    if (type === 'rangeSelector') {
      const dates = event
      this.setState({
        fromDate: dates && dates[0] ? dates[0] : null,
        toDate: dates && dates[1] ? dates[1] : null,
      }, () => !first && this.searchByFilter())
    } else if (type === 'from') {
      if (event != null) {
        this.setState({
          fromDate: new Date(event).toISOString(),
        }, () => !first && this.searchByFilter())
      } else {
        this.setState({
          fromDate: null,
        }, () => !first && this.searchByFilter())
      }
    } else if (type === 'to') {
      if (event !== null) {
        this.setState({
          toDate: new Date(event).toISOString(),
        }, () => !first && this.searchByFilter())
      } else {
        this.setState({
          toDate: null,
        }, () => !first && this.searchByFilter())
      }
    }
  }
  fetchMentorForSaleData = (ID) => {
    const { searchKey, savedRole } = this.state
    if (searchKey === 'Mentor\'s name' || searchKey === 'Mentor\'s email' ||
      searchKey === 'Mentor\'s number' || savedRole === MENTOR) {
      fetchMentorforSales(ID, 'mentors').then(res => {
        const mentorsId = [res.user.id]
        const mentorsData = Array({ id: res.user.id, name: res.user.name })
        this.setState({
          mentorsId,
          mentorsData,
          mentorSalesExecName: res.user
        }, () => this.searchByFilter())
      })
    } else if (searchKey === 'Sale\'s Executive name') {
      fetchMentorforSales(ID).then(res => {
        const mentorsId = res.user.salesExecutiveProfile.mentors.map(({ user }) => user.id)
        const mentorsData = res.user.salesExecutiveProfile.mentors.map(({ user }) => (
          { id: user.id, name: user.name }
        ))
        this.setState({
          mentorsId,
          mentorsData,
          salesExecName: res.user.name
        }, () => this.searchByFilter())
      })
    }
  }
  handleValueSelect = (value, type) => {
    if (type === 'Mentor\'s name') {
      this.setState({
        searchName: value
      }, () => this.fetchMentorForSaleData(this.state.searchName))
    }
    if (type === 'Mentor\'s email') {
      this.setState({
        searchEmail: value
      }, () => this.fetchMentorForSaleData(this.state.searchEmail))
    }
    if (type === 'Mentor\'s number') {
      this.setState({
        searchPhone: value
      }, () => this.fetchMentorForSaleData(this.state.searchPhone))
    }
    if (type === 'Sale\'s Executive name') {
      this.setState({
        searchSalesName: value
      }, () => this.fetchMentorForSaleData(this.state.searchSalesName))
    }
  }
  renderSearchInputs = () => {
    const {
      searchKey,
      mentorNames,
      mentorPhone,
      mentorEmails,
      salesExecutiveList,
      mentorStatus,
      perPage, skip
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (searchKey === 'Mentor\'s name') {
      return (
        <SearchInput
          datasArray={mentorNames}
          handleValueSelect={(value) => this.handleValueSelect(value, searchKey)}
          searchByFilter={() => this.fetchMentorForSaleData(this.state.searchName)}
          placeholder='Search by Mentor name'
          onChange={(value) => this.setState({
            searchName: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.fetchMentorForSaleData(this.state.searchName)
            }
          }}
        />
      )
    } else if (searchKey === 'Mentor\'s email') {
      return (
        <SearchInput
          datasArray={mentorEmails}
          handleValueSelect={(value) => this.handleValueSelect(value, searchKey)}
          searchByFilter={() => this.fetchMentorForSaleData(this.state.searchEmail)}
          placeholder='Search by Mentor Email'
          onChange={(value) => this.setState({
            searchEmail: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.fetchMentorForSaleData(this.state.searchEmail)
            }
          }}
        />
      )
    } else if (searchKey === 'Mentor\'s number') {
      return (
        <SearchInput
          datasArray={mentorPhone}
          handleValueSelect={(value) => this.handleValueSelect(value, searchKey)}
          searchByFilter={() => this.fetchMentorForSaleData(this.state.searchPhone)}
          placeholder='Search by Mentor number'
          onChange={(value) => this.setState({
            searchPhone: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.fetchMentorForSaleData(this.state.searchPhone)
            }
          }}
        />
      )
    } else if (searchKey === 'Sale\'s Executive name') {
      return (
        <SearchInput
          datasArray={salesExecutiveList}
          handleValueSelect={(value) => this.handleValueSelect(value, searchKey)}
          searchByFilter={() => this.fetchMentorForSaleData(this.state.searchSalesName)}
          placeholder='Search by Sales Executive name'
          onChange={(value) => this.setState({
            searchSalesName: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.fetchMentorForSaleData(this.state.searchSalesName)
            }
          }}
        />
      )
    } else if (searchKey === 'Mentor Status(Active/Inactive)') {
      return (
        <MentorReportStyle.Select
          value={mentorStatus}
          onChange={(value) => this.setState({
            mentorStatus: value
          }, () => {
            if (this.state.mentorStatus === 'All') {
              this.setState({
                currentPage: 1
              }, () => {
                if (savedRole === SALES_EXECUTIVE) {
                  this.fetchMentorsListData()
                } else {
                  this.fetchMentorsListData(perPage, skip)
                }
              })
            } else {
              this.fetchMentorsListData(perPage, skip)
            }
          })}
        >
          {
            ['All', 'Active', 'Inactive'].map((option) =>
              <MentorReportStyle.Option
                key={option}
                value={option}
              >{option}
              </MentorReportStyle.Option>
            )
          }
        </MentorReportStyle.Select>
      )
    }
    return null
  }
  renderColumnData = (name, bgColor) => (
    {
      props: {
        style: {
          background: bgColor
        },
      },
      children: name === 0 ? '-' : name
    }
  )
  renderColumnTitle = (title, width) => (
    <div style={{ width }}>
      {title}
    </div>
  )
  setTableHeader = () => {
    const mentorReports = this.props.mentorReports && this.props.mentorReports.toJS()
    let columns = []
    const { savedRole, salesExecName, searchKey } = this.state
    if (mentorReports.length > 0) {
      columns = [
        {
          title: 'Sr. No',
          dataIndex: 'srNo',
          key: 'srNo',
          align: 'center',
          width: 100,
          fixed: 'left'
        },
        {
          title: () => this.renderColumnTitle('Mentors', '100%'),
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: 220,
          fixed: 'left',
          render: (name, row) => (
            <div
              style={{
              display: 'grid',
              gridTemplateColumns: '90% 10%',
              alignItems: 'center',
              width: '100%'
              }}
            >
              <span>{name}</span>
              <MentorReportStyle.StatusIcon
                color={` ${row.isMentorActive ? '#16d877' : 'red'} `}
              />
            </div>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 150,
          align: 'center',
          render: (status) => this.renderColumnData(status)
        },
        {
          title: () => this.renderColumnTitle('Slots Opened', '100px'),
          dataIndex: 'slotsOpened',
          key: 'slotsOpened',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.slotsOpened) - Number(b.slotsOpened),
          sortDirections: ['descend', 'ascend'],
          render: (slotsOpened) => this.renderColumnData(slotsOpened, '#dbe0ff')
        },
        {
          title: () => this.renderColumnTitle('Avg.Slots per.day', '85px'),
          dataIndex: 'avgSlotOpenPerDay',
          key: 'avgSlotOpenPerDay',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.avgSlotOpenPerDay) - Number(b.avgSlotOpenPerDay),
          sortDirections: ['descend', 'ascend'],
          render: (avgSlotOpenPerDay) => this.renderColumnData(avgSlotOpenPerDay, '#dbe0ff')
        },
        {
          title: () => this.renderColumnTitle('Bookings assigned', '90px'),
          dataIndex: 'bookingsAssigned',
          key: 'bookingsAssigned',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.bookingsAssigned) - Number(b.bookingsAssigned),
          sortDirections: ['descend', 'ascend'],
          render: (bookingsAssigned) => this.renderColumnData(bookingsAssigned, '#dbe0ff'),
        },
        {
          title: () => this.renderColumnTitle('Bookings (%)', '90px', '#dbe0ff'),
          dataIndex: 'bookingPercent',
          key: 'bookingPercent',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.bookingPercent) - Number(b.bookingPercent),
          sortDirections: ['descend', 'ascend'],
          render: (bookingPercent) => this.renderColumnData(bookingPercent, '#dbe0ff')
        },
        {
          title: () => this.renderColumnTitle('Bookings Rescheduled', '120px', '#dbf4ff'),
          dataIndex: 'bookingsRescheduled',
          key: 'bookingsRescheduled',
          align: 'center',
          width: 180,
          sorter: (a, b) => Number(a.bookingsRescheduled) - Number(b.bookingsRescheduled),
          sortDirections: ['descend', 'ascend'],
          render: (bookingsRescheduled) => this.renderColumnData(bookingsRescheduled, '#dbf4ff')
        },
        {
          title: () => this.renderColumnTitle('Rescheduled (%)', '115px', '#dbf4ff'),
          dataIndex: 'rescheduledPercent',
          key: 'rescheduledPercent',
          align: 'center',
          width: 180,
          sorter: (a, b) => Number(a.rescheduledPercent) - Number(b.rescheduledPercent),
          sortDirections: ['descend', 'ascend'],
          render: (rescheduledPercent) => this.renderColumnData(rescheduledPercent, '#dbf4ff')
        },
        {
          title: () => this.renderColumnTitle('Feedback form filled(%)', '120px', '#dbfff9'),
          dataIndex: 'feedBackFormFilledPercent',
          key: 'feedBackFormFilledPercent',
          align: 'center',
          width: 180,
          sorter: (a, b) => Number(a.feedBackFormFilledPercent)
            - Number(b.feedBackFormFilledPercent),
          sortDirections: ['descend', 'ascend'],
          render: (feedBackFormFilledPercent) =>
            this.renderColumnData(feedBackFormFilledPercent, '#dbfff9'),
        },
        {
          title: () => this.renderColumnTitle('Video Link Upload (%)', '120px', '#dbfff9'),
          dataIndex: 'videoLinkUploadedPercent',
          key: 'videoLinkUploadedPercent',
          align: 'center',
          width: 180,
          sorter: (a, b) => Number(a.videoLinkUploadedPercent) - Number(b.videoLinkUploadedPercent),
          sortDirections: ['descend', 'ascend'],
          render: (videoLinkUploadedPercent) =>
            this.renderColumnData(videoLinkUploadedPercent, '#dbfff9'),
        },
        {
          title: () => this.renderColumnTitle('Trials Completed', '115px', '#e9ffdb'),
          dataIndex: 'trialsCompleted',
          key: 'trialsCompleted',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.trialsCompleted) - Number(b.trialsCompleted),
          sortDirections: ['descend', 'ascend'],
          render: (trialsCompleted) => this.renderColumnData(trialsCompleted, '#e9ffdb'),
        },
        {
          title: () => this.renderColumnTitle('Trials Qualified', '100px', '#e9ffdb'),
          dataIndex: 'trialsQualified',
          key: 'trialsQualified',
          align: 'center',
          width: 150,
          sorter: (a, b) => Number(a.trialsQualified) - Number(b.trialsQualified),
          sortDirections: ['descend', 'ascend'],
          render: (trialsQualified) => this.renderColumnData(trialsQualified, '#e9ffdb'),
        },
        {
          title: () => this.renderColumnTitle('Lost', '50px'),
          dataIndex: 'lost',
          key: 'lost',
          align: 'center',
          width: 100,
          sorter: (a, b) => Number(a.lost) - Number(b.lost),
          sortDirections: ['descend', 'ascend'],
          render: (lost) => this.renderColumnData(lost, '#fff5db'),
        },
        {
          title: () => this.renderColumnTitle('Cold', '50px'),
          dataIndex: 'cold',
          key: 'cold',
          align: 'center',
          width: 100,
          sorter: (a, b) => Number(a.cold) - Number(b.cold),
          sortDirections: ['descend', 'ascend'],
          render: (cold) => this.renderColumnData(cold, '#fff5db'),
        },
        {
          title: () => this.renderColumnTitle('Pipeline', '75px'),
          dataIndex: 'pipeline',
          key: 'pipeline',
          align: 'center',
          width: 100,
          sorter: (a, b) => Number(a.pipeline) - Number(b.pipeline),
          sortDirections: ['descend', 'ascend'],
          render: (pipeline) => this.renderColumnData(pipeline, '#fff5db'),
        },
        {
          title: () => this.renderColumnTitle('Hot', '50px'),
          dataIndex: 'hot',
          key: 'hot',
          align: 'center',
          width: 100,
          sorter: (a, b) => Number(a.hot) - Number(b.hot),
          sortDirections: ['descend', 'ascend'],
          render: (hot) => this.renderColumnData(hot, '#fff5db'),
        },
        {
          title: () => this.renderColumnTitle('Won', '50px'),
          dataIndex: 'won',
          key: 'won',
          align: 'center',
          width: 100,
          sorter: (a, b) => Number(a.won) - Number(b.won),
          sortDirections: ['descend', 'ascend'],
          render: (won) => this.renderColumnData(won, '#fff5db'),
        },
        {
          title: () => (
            <div style={{ width: '100%' }}>
              <div>Conversion Type</div>
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div>1:1</div>
                <div>1:2</div>
                <div>1:3</div>
              </div>
            </div>
          ),
          dataIndex: 'conversion',
          key: 'converPercent',
          align: 'center',
          width: 200,
          render: (conversion, row) => (
            <div style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-evenly',
              backgroundColor: '#ffdbf8'
              }}
            >
              <div>{row.oneToOneConversion === 0 ? '-' : row.oneToOneConversion}</div>
              <div>{row.oneToTwoConversion === 0 ? '-' : row.oneToTwoConversion}</div>
              <div>{row.oneToThreeConversion === 0 ? '-' : row.oneToThreeConversion}</div>
            </div>
          )
        },
        {
          title: () => this.renderColumnTitle('Conversion (%)', '100%', '#ffecdb'),
          dataIndex: 'conversionPercent',
          key: 'conversionPercent',
          align: 'center',
          width: 180,
          sorter: (a, b) => Number(a.conversionPercent) - Number(b.conversionPercent),
          sortDirections: ['descend', 'ascend'],
          render: (conversionPercent) => this.renderColumnData(conversionPercent, '#ffecdb'),
        },
        {
          title: () => this.renderColumnTitle('Sales Executive', '130px'),
          dataIndex: 'salesExecutive',
          key: 'salesExecutive',
          align: 'center',
          width: 200,
          render: (salesExecutive) => salesExecName !== '' && searchKey === 'Sale\'s Executive name'
            ? this.renderColumnData(salesExecName) :
            this.renderColumnData(salesExecutive)
        },
      ]
      if (savedRole && savedRole === SALES_EXECUTIVE) {
        columns.pop()
      }
    }
    this.setState(({
      columns
    }))
  }
  renderPagination = () => {
    const {
      savedRole,
      perPage,
      currentPage,
      searchKey,
      totalCount,
    } = this.state
    if ((savedRole === UMS_ADMIN || savedRole === UMS_VIEWER || savedRole === ADMIN) &&
    (searchKey !== 'Mentor\'s name' &&
    searchKey !== 'Mentor\'s email' && searchKey !== 'Mentor\'s number'
    && searchKey !== 'Sale\'s Executive name')) {
      return (
        <MentorReportStyle.PaginationHolder>
          {totalCount > perPage && (
            <Pagination
              total={totalCount}
              onChange={this.onPageChange}
              current={currentPage}
              defaultPageSize={perPage}
            />
          )}
          <div style={{ marginLeft: 'auto' }} >
            <MentorReportStyle.Select
              value={perPage}
              onChange={(value) => this.setState({
                currentPage: 1,
                perPage: value
              }, () => this.fetchMentorsListData(this.state.perPage, this.state.currentPage - 1))}
            >
              {
                [10, 20, 50, 100].map((option) =>
                  <MentorReportStyle.Option
                    key={option}
                    value={option}
                  >{option}
                  </MentorReportStyle.Option>
                )
              }
            </MentorReportStyle.Select>
          </div>
        </MentorReportStyle.PaginationHolder>
      )
    } return null
  }
  render() {
    const {
      searchKey,
      perPage,
      skip,
      savedRole,
      mentorNames,
      fromDate,
      toDate
    } = this.state
    return (
    <>
      <MentorReportStyle.TopContainer>
        {(savedRole && savedRole !== MENTOR &&
          (savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
            || savedRole === SALES_EXECUTIVE)) && (
            <div
              style={{
                marginRight: '20px',
                minWidth: '438px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <MentorReportStyle.Select
                value={searchKey}
                onChange={(value) => this.setState({
                  searchKey: value,
                  mentorSalesExecName: ''
                }, () => {
                  if (this.state.searchKey === 'All') {
                    this.setState({
                      searchEmail: '',
                      searchName: '',
                      searchPhone: '',
                      mentorStatus: 'All',
                      currentPage: 1
                    }, () => {
                      if (savedRole === SALES_EXECUTIVE) {
                        this.fetchMentorsListData()
                      } else {
                        this.fetchMentorsListData(perPage, skip)
                      }
                    })
                  } else if (this.state.searchKey === 'Sale\'s Executive name') {
                    this.fetchSalesExecutive()
                  }
                })}
              >
                {
                  this.state.filterDropdownOptions.map((option) =>
                    <MentorReportStyle.Option
                      key={option}
                      value={option}
                    >{option}
                    </MentorReportStyle.Option>
                  )
                }
              </MentorReportStyle.Select>
              {this.renderSearchInputs()}
            </div>
          )}
        {
          this.state.dateRanges.map(range =>
            <Button
              type={JSON.stringify(range.subtract) === this.state.selectedRange ? 'primary' : 'default'}
              shape='circle'
              onClick={() => JSON.stringify(range.subtract) === this.state.selectedRange ? null :
                this.handleDateRange(JSON.stringify(range.subtract))}
              style={{
                margin: '0 5px'
              }}
            >
              {range.label}
            </Button>
          )
        }
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker
            placeholder='Select From Date'
            dateRender={current => {
              const currentDate = this.state.fromDate ?
                new Date(this.state.fromDate).setHours(0, 0, 0, 0) :
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
            onChange={(event) => this.handleDateChange(event, 'from')}
            value={this.state.fromDate !== null ? moment(this.state.fromDate) : undefined}
          />
          <div style={{ marginLeft: '10px' }}>
            <DatePicker
              placeholder='Select To Date'
              dateRender={current => {
                  const currentDate = this.state.toDate ?
                    new Date(this.state.toDate).setHours(0, 0, 0, 0) :
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
              onChange={(event) => this.handleDateChange(event, 'to')}
              value={this.state.toDate !== null ? moment(this.state.toDate) : undefined}
            />
          </div>
        </div>
      </MentorReportStyle.TopContainer>
      {this.renderPagination()}
      <DownloadReport
        mentorNames={mentorNames}
        fromDate={fromDate}
        toDate={toDate}
      />
      <MentorReportStyle.MDTable
        dataSource={this.state.tableData}
        columns={this.state.columns}
        loading={
          this.props.isReportsFetching && this.props.isReportsFetching
        }
        scroll={{ x: 'max-content', y: 580 }}
        pagination={false}
      />
      </>
    )
  }
}

export default MentorReport
