import { Button, Radio } from 'antd'
import { get, remove } from 'lodash'
import React from 'react'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import gql from 'graphql-tag'
import fetchClassProgress from '../../actions/classProgress/fetchClassProgress'
import ClassProgressStyle from './ClassProgress.styles'
import FilterBox from './components/FilterBox'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { MENTOR, SALES_EXECUTIVE } from '../../constants/roles'
import SearchBox from './components/SearchBox'
import fetchMentorForSales from '../../actions/classProgress/fetchMentorsForSales'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import TableTags from './components/TableTags'
import TableLink from './components/TableLink'
import LastClass from './components/LastClass'
import Pagination from './components/Pagination'
// import DownloadReport from './components/DownloadReport'
import fetchAllProgress from '../../actions/classProgress/fetchAllProgress'
import headerConfig from './components/headerConfig'
import fetchReportData from '../../actions/StudentJourney/fetchReportData'
import convertModalTypeFromStringToNumber from '../../utils/convertModalTypeFromTextToNumber'
import requestToGraphql from '../../utils/requestToGraphql'
import { financeReportConfig } from '../../utils/financialReportHeaders'

class ClassProgress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      column: [],
      aheadChecked: false,
      onTimeChecked: false,
      delayedChecked: false,
      activeChecked: false,
      dormantChecked: false,
      downgradedChecked: false,
      classStatus: [],
      enrollmentStatus: [],
      paymentStatus: '',
      filterQuery: '',
      currentPage: 1,
      perPage: 20,
      skip: 0,
      searchKey: 'All',
      searchText: '',
      filterDropdownOptions: [
        'All',
        'Mentor\'s Name',
        'Sales Executive',
        'Student\'s Name',
        'Parent\'s Name',
        'Parent\'s Email',
        'Parent\'s Phone'
      ],
      mentorQuery: [],
      mentors: [],
      salesExecutives: [],
      allReports: [],
      financeReport: []
    }
  }
  downloadRef = React.createRef()
  componentDidMount = async () => {
    const { perPage, skip, filterQuery, filterDropdownOptions } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === SALES_EXECUTIVE) {
      fetchMentorForSales(getDataFromLocalStorage('login.id')).then(res => {
        const mentors = get(res, 'user.salesExecutiveProfile.mentors', [])
        this.setState({
          mentors: mentors.map(({ user }) => user),
          filterDropdownOptions: filterDropdownOptions.filter(op => op !== 'Sales Executive')
        }, () => this.searchByFilter())
      })
    } else if (savedRole && savedRole === MENTOR) {
      this.setState({
        mentorQuery: [getDataFromLocalStorage('login.id')],
        filterDropdownOptions: filterDropdownOptions.filter(op => op !== 'Mentor\'s Name' && op !== 'Sales Executive')
      }, () => this.searchByFilter())
    } else {
      await fetchClassProgress(perPage, skip, filterQuery)
    }
  }
  componentDidUpdate = (prevProps) => {
    const { isClassProgressFetching, hasClassProgressFetched,
      studentReportFetchStatus } = this.props
    if (!isClassProgressFetching && hasClassProgressFetched) {
      if (
        get(prevProps, 'classProgress') !== get(this.props, 'classProgress')
      ) {
        this.createTableFromData()
      }
    }
    if (studentReportFetchStatus && !get(studentReportFetchStatus.toJS(), 'loading')
      && get(studentReportFetchStatus.toJS(), 'success') &&
      (prevProps.studentReportFetchStatus !== studentReportFetchStatus)) {
      this.setReportData()
    }
  }
  fetchMentorsForSalesData = () => {
    const savedId = getDataFromLocalStorage('login.id')
    const { searchKey, searchText } = this.state
    if (searchKey === 'Mentor\'s Name' && searchText === '') {
      fetchMentorForSales(savedId, 'mentor').then(res => {
        const { users } = res
        this.setState({
          mentors: users ? users.filter(({ id, name }) => name && { id, name }) : []
        })
      })
    } else if (searchKey === 'Sales Executive' && searchText === '') {
      fetchMentorForSales(savedId, 'salesExecutive').then(res => {
        const { users } = res
        this.setState({
          salesExecutives: users ? users.filter(({ id, name }) => name && { id, name }) : []
        })
      })
    } else if (searchKey === 'Sales Executive' && searchText !== '') {
      this.setState({ mentorQuery: [] })
      fetchMentorForSales(searchText).then(res => {
        const mentorQuery = get(res, 'user.salesExecutiveProfile.mentors', [])
        this.setState({
          mentorQuery: mentorQuery.map(({ user: { id } }) => id)
        }, () => this.searchByFilter())
      })
    }
  }
  searchByFilter = () => {
    const {
      classStatus,
      perPage,
      skip,
      enrollmentStatus,
      paymentStatus,
      searchKey,
      searchText,
      mentorQuery,
      mentors
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    let filteredQuery = ''
    if (classStatus.length > 0) {
      filteredQuery = `{userPaymentPlan_some:{sessionVelocityStatus_in:[${classStatus}]}}`
    }
    if (enrollmentStatus.length > 0) {
      filteredQuery += `{userPaymentPlan_some:{enrollmentStatus_in:[${enrollmentStatus}]}}`
    }
    if (paymentStatus !== '') {
      if (paymentStatus.includes('pending')) {
        filteredQuery += `{ userPaymentPlan_some: {and:[{isPaid:false},{
        nextPaymentDate_gte:"${moment().format('l')}"}]} }`
      } else if (paymentStatus.includes('paid')) {
        filteredQuery += '{ userPaymentPlan_some: { isPaid: true } }'
      } else if (paymentStatus.includes('overdue')) {
        filteredQuery += `{ userPaymentPlan_some: {and:[{isPaid:false},{
        nextPaymentDate_lt:"${moment().format('l')}"}]} }`
      }
    }
    if (savedRole === SALES_EXECUTIVE && mentors.length > 0) {
      filteredQuery += `{ allottedMentor_some: { id_in: [${getIdArrForQuery(mentors.map(({ id }) => id))}] } }`
    }
    if (savedRole === MENTOR) {
      filteredQuery += `{ allottedMentor_some: { id_in: [${getIdArrForQuery([getDataFromLocalStorage('login.id')])}] } }`
    }
    if ((searchKey === 'Mentor\'s Name' || searchKey === 'Sales Executive') && mentorQuery.length > 0) {
      filteredQuery += `{ allottedMentor_some: { id_in: [${getIdArrForQuery(mentorQuery)}] } }`
    }
    if ((searchKey === 'Student\'s Name' || searchKey === 'Parent\'s Name'
    || searchKey === 'Parent\'s Email' || searchKey === 'Parent\'s Phone')
      && searchText !== '') {
      let studentName = ''
      let parentName = ''
      let parentEmail = ''
      let parentPhone = ''
      if (searchKey === 'Student\'s Name') studentName = `{ name_contains: "${searchText}" }`
      if (searchKey === 'Parent\'s Name') parentName = `{ name_contains: "${searchText}" }`
      if (searchKey === 'Parent\'s Email') parentEmail = `{ email_contains: "${searchText}" }`
      if (searchKey === 'Parent\'s Phone') parentPhone = `{ phone_number_subDoc_contains: "${searchText}" }`
      filteredQuery += `{
          client_some: {
            and: [
              ${studentName}
              ${parentName || parentPhone || parentEmail ? `
              {
                studentProfile_some: {
                  parents_some: {
                    user_some: {
                      and: [
                        ${parentName}
                        ${parentEmail}
                        ${parentPhone}
                      ]
                    }
                  }
                }
              }
              ` : ''}
            ]
          }
        }`
    }
    this.setState(
      {
        filterQuery: filteredQuery,
      },
      () => fetchClassProgress(perPage, skip, this.state.filterQuery)
    )
  }
  setClassStatus = (value, type) => {
    const { classStatus, enrollmentStatus } = this.state
    if (type === 'sessionStatus') {
      if (classStatus.includes(value)) {
        remove(classStatus, (item) => item === value)
      } else {
        classStatus.push(value)
      }
      this.setState(
        {
          classStatus,
        },
        () => this.searchByFilter()
      )
    } else if (type === 'enrollmentStatus') {
      if (enrollmentStatus.includes(value)) {
        remove(enrollmentStatus, (item) => item === value)
      } else {
        enrollmentStatus.push(value)
      }
      this.setState(
        {
          enrollmentStatus,
        },
        () => this.searchByFilter()
      )
    } else if (type === 'paymentStatus') {
      this.setState(
        {
          paymentStatus: value,
        },
        () => this.searchByFilter()
      )
    }
  }
  createTableFromData = () => {
    const data = this.props.classProgress && this.props.classProgress.toJS()
    this.setState(
      {
        tableData: data,
      },
      () => this.setTableHeader()
    )
  }
  setTableHeader = () => {
    const data = this.props.classProgress && this.props.classProgress.toJS()
    let column = []
    if (data.length > 0) {
      column = [
        {
          title: 'Sr. No',
          dataIndex: 'srNo',
          key: 'srNo',
          align: 'center',
          fixed: 'left',
        },
        {
          title: 'Student name',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          fixed: 'left',
          render: (name, row) => <TableLink data={name} id={row.id} />,
        },
        {
          title: 'Class Type',
          dataIndex: 'classType',
          key: 'classType',
          align: 'center',
        },
        {
          title: 'Class Status',
          dataIndex: 'classStatus',
          key: 'classStatus',
          align: 'center',
          render: (classStatus) => <TableTags data={classStatus} type='classStatus' />,
        },
        {
          title: 'Avg Day/Class',
          dataIndex: 'avgDayPerClass',
          key: 'avgDayPerClass',
          align: 'center',
        },
        {
          title: 'Last Class On',
          dataIndex: 'lastClassOn',
          key: 'lastClassOn',
          align: 'center',
          render: (date, row) => <LastClass date={date} msg={row.dateMsg} />,
        },
        {
          title: 'Enrollment Status',
          dataIndex: 'enrollmentStatus',
          key: 'enrollmentStatus',
          align: 'center',
          render: (eStatus) => <TableTags data={eStatus} type='enrollmentStatus' />,
        },
        {
          title: 'Mentor',
          dataIndex: 'mentor',
          key: 'mentor',
          align: 'center',
        },
        {
          title: 'Payment Status',
          dataIndex: 'paymentStatus',
          key: 'paymentStatus',
          align: 'center',
          render: (pStatus, row) =>
            <TableTags data={pStatus} type='paymentStatus' id={row.id} />,
        },
        {
          title: 'Current Topic Order',
          dataIndex: 'completedSessionPercent',
          key: 'completedSessionPercent',
          align: 'center',
          render: (d, { completedSession, completedSessionPercent }) =>
            <div>{`${completedSession}  (${completedSessionPercent})`}</div>
        },
        {
          title: 'Current Topic',
          dataIndex: 'topicTitle',
          key: 'topicTitle',
          align: 'center',
        }
        // {
        //   title: 'Download',
        //   dataIndex: 'name',
        //   key: 'names',
        //   align: 'center',
        //   render: (name, row) => <DownloadReport name={name} row={row} />
        // }
      ]
    }
    this.setState({
      column,
    })
  }
  fetchAllProgress = async () => {
    const { filterQuery } = this.state
    await fetchAllProgress(filterQuery)
    const { isClassProgressAllFetching, hasClassProgressAllFetched, classProgressAll } = this.props
    if (!isClassProgressAllFetching && hasClassProgressAllFetched && classProgressAll) {
      this.setAllReports()
    }
  }
  setAllReports = () => {
    const reports = this.props.classProgressAll && this.props.classProgressAll.toJS()
    this.setState({
      allReports: reports
    }, () => setTimeout(() => {
      this.downloadRef.current.link.click()
    }))
  }
  onChange = (e) => {
    const { value, name, checked } = e.target
    if (value === 'ahead' || value === 'onTime' || value === 'delayed') {
      this.setState(
        {
          [name]: checked,
        },
        () => this.setClassStatus(value, 'sessionStatus')
      )
    } else if (
      value === 'active' ||
      value === 'dormant' ||
      value === 'downgraded'
    ) {
      this.setState(
        {
          [name]: checked,
        },
        () => this.setClassStatus(value, 'enrollmentStatus')
      )
    } else if (value === 'paid' || value === 'pending' || value === 'overdue') {
      this.setClassStatus(value, 'paymentStatus')
    }
  }
  renderInput = () => {
    const { searchKey, searchText, mentors, salesExecutives } = this.state
    if (searchKey === 'Student\'s Name' || searchKey === 'Parent\'s Name'
      || searchKey === 'Parent\'s Email' || searchKey === 'Parent\'s Phone') {
      return (
        <SearchBox
          placeholder={`Search by ${searchKey}`}
          value={searchText}
          onChange={(e) => this.setState({ searchText: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
          searchByFilter={this.searchByFilter}
        />
      )
    } else if (searchKey === 'Mentor\'s Name') {
      return (
        <SearchBox
          datasArray={mentors}
          autoComplete
          handleValueSelect={(value) =>
            this.setState({ mentorQuery: [value] }, () => this.searchByFilter())}
          searchByFilter={this.searchByFilter}
          placeholder='Search by Mentor name'
          onChange={(value) => this.setState({
            mentorQuery: [value]
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') { this.searchByFilter() }
          }}
        />
      )
    } else if (searchKey === 'Sales Executive') {
      return (
        <SearchBox
          datasArray={salesExecutives}
          autoComplete
          handleValueSelect={(value) =>
            this.setState({ searchText: value }, () => this.fetchMentorsForSalesData())}
          searchByFilter={() => this.fetchMentorsForSalesData()}
          placeholder='Search by Sales Executive name'
          onChange={(value) => this.setState({
            searchText: value
          })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.fetchMentorsForSalesData()
            }
          }}
        />
      )
    }
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      () => this.searchByFilter()
    )
  }
  renderBoxes = (data) => {
    const progressData = data && data.toJS()
    const {
      paymentStatus,
      aheadChecked,
      onTimeChecked,
      delayedChecked,
      activeChecked,
      dormantChecked,
      downgradedChecked,
      searchKey,
      filterDropdownOptions
    } = this.state
    const {
      active,
      ahead,
      delayed,
      dormant,
      downgraded,
      onTime,
      total,
      pending,
      overdue,
      paid,
    } = progressData
    const divStyle = {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }
    const boxStyle = (color) => ({
      backgroundColor: color,
      margin: '0 10px',
      minWidth: 120,
    })
    return (
      <>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <FilterBox
              name='aheadChecked'
              checked={aheadChecked}
              onChange={this.onChange}
              value='ahead'
              label='Ahead'
              data={ahead}
              total={total}
              boxStyle={boxStyle('#17d978')}
              divStyle={divStyle}
            />
            <FilterBox
              name='onTimeChecked'
              checked={onTimeChecked}
              onChange={this.onChange}
              value='onTime'
              label='OnTime'
              data={onTime}
              total={total}
              boxStyle={boxStyle('#17d978')}
              divStyle={divStyle}
            />
            <FilterBox
              name='delayedChecked'
              checked={delayedChecked}
              onChange={this.onChange}
              value='delayed'
              label='Delayed'
              data={delayed}
              total={total}
              boxStyle={boxStyle('rgba(255, 87, 68, 0.75)')}
              divStyle={divStyle}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <FilterBox
              name='activeChecked'
              checked={activeChecked}
              onChange={this.onChange}
              value='active'
              label='Active'
              data={active}
              total={total}
              boxStyle={boxStyle('#17d978')}
              divStyle={divStyle}
            />
            <FilterBox
              name='dormantChecked'
              checked={dormantChecked}
              onChange={this.onChange}
              value='dormant'
              label='Dormant'
              data={dormant}
              total={total}
              boxStyle={boxStyle('yellow')}
              divStyle={divStyle}
            />
            <FilterBox
              name='downgradedChecked'
              checked={downgradedChecked}
              onChange={this.onChange}
              value='downgraded'
              label='Downgraded'
              data={downgraded}
              total={total}
              boxStyle={boxStyle('#ff5744')}
              divStyle={divStyle}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            margin: '10px 0',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ minWidth: '412px' }} >
            <ClassProgressStyle.StyledSelect
              value={searchKey}
              onChange={(value) => this.setState({
                searchKey: value,
                searchText: '',
                mentorQuery: []
              }, () => {
                if (this.state.searchKey === 'Mentor\'s Name'
                  && this.state.mentors.length === 0) {
                  this.fetchMentorsForSalesData()
                } else if (this.state.searchKey === 'Sales Executive'
                  && this.state.salesExecutives.length === 0) {
                  // fetching salesExecutives List when set to sales Executive
                  this.fetchMentorsForSalesData()
                }
              })}
            >
              {
                filterDropdownOptions.map((option) =>
                  <ClassProgressStyle.StyledOption
                    key={option}
                    value={option}
                  >{option}
                  </ClassProgressStyle.StyledOption>
                )
              }
            </ClassProgressStyle.StyledSelect>
            {this.renderInput()}
          </div>
          <div style={{ display: 'flex', flex: '0.7', justifyContent: 'flex-start' }}>
            <Radio.Group value={paymentStatus} onChange={this.onChange}>
              <FilterBox
                value='paid'
                checked={paymentStatus === 'paid'}
                label='Paid'
                boxStyle={boxStyle('#16d877')}
                divStyle={divStyle}
                total={total}
                data={paid}
                radio
              />
              <FilterBox
                value='pending'
                checked={paymentStatus === 'pending'}
                label='Pending'
                boxStyle={boxStyle('yellow')}
                divStyle={divStyle}
                total={total}
                data={pending}
                radio
              />
              <FilterBox
                value='overdue'
                checked={paymentStatus === 'overdue'}
                label='OverDue'
                boxStyle={boxStyle('#ff5744')}
                divStyle={divStyle}
                total={total}
                data={overdue}
                radio
              />
            </Radio.Group>
          </div>
          <Button onClick={this.clearFilter} type='primary'>
            Clear Filter
          </Button>
        </div>
      </>
    )
  }
  clearFilter = () => {
    this.setState(
      {
        aheadChecked: false,
        onTimeChecked: false,
        delayedChecked: false,
        activeChecked: false,
        dormantChecked: false,
        downgradedChecked: false,
        classStatus: [],
        enrollmentStatus: [],
        paymentStatus: '',
        filterQuery: '',
        currentPage: 1,
        perPage: 20,
        skip: 0,
        searchKey: 'All',
        searchText: '',
        mentorQuery: []
      },
      () => this.searchByFilter()
    )
  }

  fetchFinanceReport = async () => {
    await fetchReportData({
      studentId: null,
      financeReport: true
    })
  }

  setReportData = async () => {
    const salesOperations = this.props.studentReport && this.props.studentReport.toJS()
    const reportData = []
    const userIds = []
    if (salesOperations && salesOperations.length > 0) {
      salesOperations.forEach(sales => {
        userIds.push(`"${get(sales, 'client.id')}"`)
      })
    }
    const { data: { mentorMenteeSessions = [] } } = await requestToGraphql(gql`
      {
        mentorMenteeSessions(
        filter: {
          and: [
            { menteeSession_some: { user_some: { id_in: [${userIds}] } } }
            { sessionStatus: completed }
          ]
        }
      ) {
        id
        menteeSession {
          id
          user {
            id
          }
        }
        sessionStartDate
        sessionEndDate
      }
      }
      `)
    if (salesOperations && salesOperations.length > 0) {
      salesOperations.forEach((user, index) => {
        const usersData = get(user, 'client', {})
        const startDate = moment().subtract('1', 'M')
        const endDate = moment()
        const allottedMentor = get(user, 'allottedMentor.name')
        const userPaymentPlan = get(user, 'userPaymentPlan')
        const city = get(usersData, 'city')
        const userId = get(usersData, 'id')
        const totalClasses = get(userPaymentPlan, 'product.course.topicsMeta.count')
        const finalPrice = get(userPaymentPlan, 'finalSellingPrice')
        let typeNumber = ''
        if (get(userPaymentPlan, 'product.type')) {
          typeNumber = convertModalTypeFromStringToNumber(get(userPaymentPlan, 'product.type'))
        }

        // getting the array of dueDates and finding the mim date
        const userPaymentInstallmentsDueDates = get(userPaymentPlan,
          'userPaymentInstallments', []).map(payment => moment(get(payment, 'dueDate')))
        const userPaymentInstallmentsPaidDates = []
        let paidAmount = 0
        let cumulativeAmount = 0
        let cumulativeCGST = 0
        let cumulativeIGST = 0
        let cumulativeSGST = 0
        get(userPaymentPlan, 'userPaymentInstallments', []).forEach(payment => {
          if (get(payment, 'paidDate') && get(payment, 'status') === 'paid') {
            if (moment(get(payment, 'paidDate')).isBetween(startDate, endDate)) {
              paidAmount += get(payment, 'amount')
              const gstAmount = paidAmount - ((paidAmount * 100) / 118)
              cumulativeAmount += (get(payment, 'amount') - gstAmount)
              if (city === 'delhi' || city === 'Delhi') {
                cumulativeCGST += (gstAmount / 2)
                cumulativeSGST += (gstAmount / 2)
              } else {
                cumulativeIGST += gstAmount
              }
              userPaymentInstallmentsPaidDates.push(moment(get(payment, 'paidDate')))
            }
          }
        })
        let paidAmountExGST = 0
        if (paidAmount > 0) {
          paidAmountExGST = (paidAmount * 100) / 118
        }
        let collectedCGST = 0
        let collectedSGST = 0
        let collectedIGST = 0
        const gstAmount = paidAmount - paidAmountExGST
        if (paidAmount > 0 && paidAmountExGST > 0) {
          if (city === 'delhi' || city === 'Delhi') {
            collectedCGST = (gstAmount / 2)
            collectedSGST = (gstAmount / 2)
          } else {
            collectedIGST = gstAmount
          }
        }

        let priceExGST = 0
        if (finalPrice && finalPrice > 0) {
          priceExGST = (finalPrice * 100) / 118
        }
        let pricePerClassExGST = 0
        if (priceExGST > 0 && totalClasses > 0) {
          pricePerClassExGST = priceExGST / totalClasses
        }
        const numberOfInstallments = get(userPaymentPlan, 'installmentNumber')
        const courseBeginDate = moment(get(userPaymentPlan, 'dateOfEnrollment')).format('ll')

        // getting total Session count
        const sessions = mentorMenteeSessions.filter(mmSessions => get(mmSessions, 'menteeSession.user.id') === userId)
        // session completed in month
        let totalClassInMonth = 0
        sessions.forEach(session => {
          if (moment(get(session, 'sessionEndDate')).isBetween(startDate, endDate)) {
            totalClassInMonth += 1
          }
        })
        const revenueForMonth = pricePerClassExGST * totalClassInMonth
        const overAllRevenue = pricePerClassExGST * sessions.length
        let deferredAmount = 0
        if ((cumulativeAmount - 0) > overAllRevenue) {
          deferredAmount = (cumulativeAmount - 0) - overAllRevenue
        }
        let accruedAmount = 0
        if (overAllRevenue > cumulativeAmount) {
          accruedAmount = overAllRevenue - cumulativeAmount
        }
        reportData.push({
          no: index + 1,
          userName: get(usersData, 'name'),
          city,
          region: get(usersData, 'region'),
          state: get(usersData, 'state'),
          country: get(usersData, 'country'),
          grade: get(usersData, 'studentProfile.grade'),
          userId,
          allottedMentor,
          type: `'${typeNumber.trim()}`,
          courseName: get(userPaymentPlan, 'product.course.title', '-'),
          courseBeginDate,
          totalClasses,
          numberOfInstallments,
          priceExGST: priceExGST.toFixed(2),
          pricePerClassExGST: pricePerClassExGST.toFixed(2),
          totalClassCompleted: totalClassInMonth,
          overAllCompletedClass: sessions.length,
          invoiceGenerateDate: moment.min(userPaymentInstallmentsDueDates).format('ll'),
          installmentCollectDate:
            userPaymentInstallmentsPaidDates.length > 0 ?
              moment.min(userPaymentInstallmentsPaidDates).format('ll') : '-',
          paidAmountExGST: paidAmountExGST.toFixed(2),
          collectedCGST: collectedCGST.toFixed(2),
          collectedSGST: collectedSGST.toFixed(2),
          collectedIGST: collectedIGST.toFixed(2),
          cumulativeAmount: cumulativeAmount.toFixed(2),
          cumulativeCGST: cumulativeCGST.toFixed(2),
          cumulativeIGST: cumulativeIGST.toFixed(2),
          cumulativeSGST: cumulativeSGST.toFixed(2),
          revenueForMonth: revenueForMonth.toFixed(2),
          overAllRevenue: overAllRevenue.toFixed(2),
          deferredAmount: deferredAmount.toFixed(2),
          accruedAmount: accruedAmount.toFixed(2)
        })
      })
    }
    this.setState({
      financeReport: reportData
    }, () => setTimeout(() => {
      this.financeReportRef.current.link.click()
    }))
  }
  financeReportRef = React.createRef()
  render() {
    const { isClassProgressFetching, salesCount, classProgressData,
      isClassProgressAllFetching, studentReportFetchStatus } = this.props
    const { tableData, column, currentPage, perPage, allReports, financeReport } = this.state
    return (
      <>
        {classProgressData && this.renderBoxes(classProgressData)}
        <Pagination
          currentPage={currentPage}
          perPage={perPage}
          salesCount={salesCount}
          onChange={this.onPageChange}
          fetchAllProgress={this.fetchAllProgress}
          fetchFinanceReport={this.fetchFinanceReport}
          reportFetchLoading={studentReportFetchStatus && get(studentReportFetchStatus.toJS(), 'loading')}
        />
        <CSVLink
          style={{ display: 'none' }}
          filename='AllReport.csv'
          data={allReports}
          headers={headerConfig}
          ref={this.downloadRef}
        />
        <CSVLink
          style={{ display: 'none' }}
          filename='FinanceReport.csv'
          data={financeReport}
          headers={financeReportConfig}
          ref={this.financeReportRef}
        />
        <ClassProgressStyle.MDTable
          dataSource={tableData}
          columns={column}
          loading={(isClassProgressFetching && isClassProgressFetching) ||
            (isClassProgressAllFetching && isClassProgressAllFetching)}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default ClassProgress
