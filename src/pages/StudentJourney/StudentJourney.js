import { filter, get } from 'lodash'
import React from 'react'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import { Button, notification, Select, Spin, Tooltip } from 'antd'
import fetchStudentsDetails from '../../actions/StudentJourney/studentData'
import InfoBox from './components/InfoBox'
import StudentJourneyStyle from './StudentJourney.styles'
import stringTruncate from '../../utils/text-truncate'
import tags from './components/tags'
import { green, red, yellow } from '../../constants/colors'
import updatePaymentPlan from '../../actions/StudentJourney/updatePaymentPlan'
import fetchReportData from '../../actions/StudentJourney/fetchReportData'
import convertModalTypeFromStringToNumber from '../../utils/convertModalTypeFromTextToNumber'
import { studentFinancialHeader } from '../../utils/financialReportHeaders'

class StudentJourney extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      studentId: this.props.match.params.id,
      tags,
      tableData: [],
      column: [],
      status: '',
      dateRanges: [
        { label: '1M', subtract: { duration: '1', unit: 'M' } },
        { label: '2M', subtract: { duration: '2', unit: 'M' } },
        { label: '4M', subtract: { duration: '4', unit: 'M' } },
        { label: '6M', subtract: { duration: '6', unit: 'M' } },
      ],
      fromDate: null,
      toDate: null,
      selectedRange: '{"duration":"2","unit":"M"}',
      reportData: []
    }
  }
  componentDidMount = async () => {
    const { selectedRange, studentId } = this.state
    this.handleDateRange(selectedRange)
    await fetchStudentsDetails(studentId)
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { isStudentJourneyFetching, hasStudentJourneyFetched,
      updatePlanSuccess, updatePlanLoading, studentReportFetchStatus } = this.props
    if (!isStudentJourneyFetching && hasStudentJourneyFetched) {
      if (get(prevProps, 'studentsJourney') !==
        get(this.props, 'studentsJourney')) {
        this.renderStudentsDetails()
        this.createTableFromData()
      }
    }
    if (!updatePlanLoading && updatePlanSuccess) {
      if (this.state.status !== prevState.status) {
        notification.success({
          message: 'Enrollment status successfully updated'
        })
      }
    }

    if (studentReportFetchStatus && !get(studentReportFetchStatus.toJS(), 'loading')
      && get(studentReportFetchStatus.toJS(), 'success') &&
      (prevProps.studentReportFetchStatus !== studentReportFetchStatus)) {
      this.setReportData()
    }
  }

  getDates = (startDate, stopDate) => {
    const dateArray = []
    let currentDate = moment(startDate).endOf('M')
    while (currentDate <= moment(stopDate).endOf('M')) {
      dateArray.push({ date: moment(currentDate).endOf('M').format('ll'), month: moment(currentDate).month() })
      currentDate = moment(currentDate).add(1, 'M')
    }
    return dateArray
  }
  setReportData = () => {
    const data = this.props.studentReport && this.props.studentReport.toJS()
    const { fromDate, toDate } = this.state
    const dateArray = this.getDates(fromDate, toDate)
    const newDateRange = dateArray.slice(0, dateArray.length - 1)
    const newData = []
    const mentorMenteeSessions = get(data, 'mentorMenteeSessions', [])
    const salesOperations = get(data, 'salesOperations', [])
    let cumulativeAmount = 0
    let cumulativeCGST = 0
    let cumulativeSGST = 0
    let cumulativeIGST = 0
    let overAllCompletedClass = 0
    newDateRange.map(({ date, month }) => {
      const usersData = get(salesOperations, '[0].client', {})
      const allottedMentor = get(salesOperations, '[0].allottedMentor.name')
      const userName = get(usersData, 'name')
      const city = get(usersData, 'city')
      const region = get(usersData, 'region')
      const state = get(usersData, 'state')
      const country = get(usersData, 'country')
      const grade = get(usersData, 'studentProfile.grade')
      const userId = get(usersData, 'id')
      const userPaymentPlan = get(salesOperations, '[0].userPaymentPlan')
      const courseName = get(userPaymentPlan, 'product.course.title', '-')
      const totalClasses = get(userPaymentPlan, 'product.course.topicsMeta.count')
      const finalPrice = get(userPaymentPlan, 'finalSellingPrice')
      let typeNumber = ''
      if (get(userPaymentPlan, 'product.type')) {
        typeNumber = convertModalTypeFromStringToNumber(get(userPaymentPlan, 'product.type'))
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

      const userPaymentInstallments = []
      get(userPaymentPlan, 'userPaymentInstallments', []).forEach(installment => {
        if (get(installment, 'dueDate') && moment(get(installment, 'dueDate')).month() === month) {
          userPaymentInstallments.push(installment)
        }
      })
      const invoiceGenerateDate = get(userPaymentInstallments, '[0].dueDate')
      const installmentCollectDate = get(userPaymentInstallments, '[0].paidDate')
      const paidStatus = get(userPaymentInstallments, '[0].status')
      let paidAmount = 0
      if (installmentCollectDate && paidStatus === 'paid') {
        userPaymentInstallments.forEach(installment => paidAmount += get(installment, 'amount'))
      }
      let paidAmountExGST = 0
      if (paidAmount > 0) {
        paidAmountExGST = (paidAmount * 100) / 118
        cumulativeAmount += paidAmountExGST
      }
      let collectedCGST = 0
      let collectedSGST = 0
      let collectedIGST = 0
      if (paidAmount > 0 && paidAmountExGST > 0) {
        if (city === 'delhi' || city === 'Delhi') {
          const gstAmount = paidAmount - paidAmountExGST
          collectedCGST = (gstAmount / 2)
          collectedSGST = (gstAmount / 2)
          cumulativeCGST += collectedCGST
          cumulativeSGST += collectedSGST
        } else {
          collectedIGST = paidAmount - paidAmountExGST
          cumulativeIGST += collectedIGST
        }
      }
      const totalClassCompleted = []
      mentorMenteeSessions.forEach(session => {
        if (get(session, 'sessionStartDate') && moment(get(session, 'sessionStartDate')).month() === month) {
          totalClassCompleted.push(session)
        }
      })
      overAllCompletedClass += totalClassCompleted.length
      const revenueForMonth = pricePerClassExGST * totalClassCompleted.length
      const overAllRevenue = pricePerClassExGST * overAllCompletedClass
      let deferredAmount = 0
      if ((cumulativeAmount - 0) > overAllRevenue) {
        deferredAmount = (cumulativeAmount - 0) - overAllRevenue
      }
      let accruedAmount = 0
      if (overAllRevenue > cumulativeAmount) {
        accruedAmount = overAllRevenue - cumulativeAmount
      }
      newData.push({
        userId,
        date,
        userName,
        grade,
        city,
        region,
        state,
        country,
        courseName,
        totalClasses,
        allottedMentor,
        type: `'${typeNumber.trim()}`,
        priceExGST: priceExGST.toFixed(2),
        pricePerClassExGST: pricePerClassExGST.toFixed(2),
        numberOfInstallments,
        courseBeginDate,
        invoiceGenerateDate: invoiceGenerateDate ? moment(invoiceGenerateDate).format('ll') : '-',
        installmentCollectDate: installmentCollectDate ? moment(installmentCollectDate).format('ll') : '-',
        paidAmountExGST: paidAmountExGST.toFixed(2),
        collectedCGST,
        collectedSGST,
        collectedIGST,
        cumulativeAmount,
        cumulativeCGST,
        cumulativeSGST,
        cumulativeIGST,
        totalClassCompleted: totalClassCompleted.length,
        overAllCompletedClass,
        revenueForMonth,
        overAllRevenue,
        deferredAmount,
        accruedAmount
      })
    })
    this.setState({
      reportData: newData
    }, () => setTimeout(() => {
      this.reportRef.current.link.click()
    }))
  }
  componentWillUnmount = () => {
    this.setState({
      studentId: ''
    })
  }
  createTableFromData = () => {
    const sessions = this.props.studentsJourney && this.props.studentsJourney.toJS()
    this.setState({
      tableData: sessions.sessions
    }, () => this.setTableHeader())
  }
  renderColumnData = (value) => (
    <Tooltip placement='top' title={value}>
      {stringTruncate(value, 25)}
    </Tooltip>
  )
renderZoneColor = zone => {
  switch (zone) {
    case 'green':
      return green
    case 'red':
      return red
    case 'yellow':
      return yellow
    default:
      return 'grey'
  }
}
  renderTags = (value, session) => {
    const tagsToShow = filter(this.state.tags, item => session.tags[item.tag])
    if (tagsToShow.length > 2) {
      return (
        <>
          <StudentJourneyStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[0].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[0].icon}
          </StudentJourneyStyle.TagsIcon>
          <StudentJourneyStyle.TagsIcon
            style={{
              backgroundColor: `${this.renderZoneColor(tagsToShow[1].zone)}`,
              marginLeft: '-8px',
              border: '1px solid #fff'
            }}
          >
            {tagsToShow[1].icon}
          </StudentJourneyStyle.TagsIcon>
          <Tooltip
            placement='right'
            title={() =>
              tagsToShow.map(item => (
                <StudentJourneyStyle.MoreTags>
                  {item.displayTitle ? item.displayTitle : item.tag}
                </StudentJourneyStyle.MoreTags>
              ))
            }
          >
            <StudentJourneyStyle.TagsIcon
              style={{ backgroundColor: '#777', marginLeft: '-8px', border: '1px solid #fff' }}
            >
              +{tagsToShow.length - 2}
            </StudentJourneyStyle.TagsIcon>
          </Tooltip>
        </>
      )
    }
    return tagsToShow.map(item => (
      <StudentJourneyStyle.TagsIcon
        style={{
          backgroundColor: `${this.renderZoneColor(item.zone)}`,
          marginLeft: '-8px',
          border: '1px solid #fff'
        }}
      >
        {item.icon}
      </StudentJourneyStyle.TagsIcon>
    ))
  }
  renderLinkData = (link) => {
    if (link !== '-') {
      return (
        <Tooltip placement='top' title={link}>
          <a target='_blank' rel='noopener noreferrer' href={link}>{stringTruncate(link, 25)}</a>
        </Tooltip>
      )
    }
    return '-'
  }
  renderSessionStatus = (status) => {
    let color = ''
    if (status === 'completed') color = '#16d877'
    else if (status === 'pending') color = '#f9e73f'
    else if (status === 'delayed') color = '#ff5744'
    else color = ''
    return (
      <div style={{
        padding: '5px',
        backgroundColor: color,
        borderRadius: '5px',
        textTransform: 'capitalize' }}
      >
        {status}
      </div>
    )
  }
  renderHomeworkStatus = (status) => {
    let color = ''
    if (status === 'completed') color = '#16d877'
    else if (status === 'incomplete') color = '#ff5744'
    else color = ''
    return (
      <div style={{
        padding: '5px',
        backgroundColor: color,
        borderRadius: '5px',
        textTransform: 'capitalize' }}
      >
        {status}
      </div>
    )
  }
  setTableHeader = () => {
    const sessions = this.props.studentsJourney && this.props.studentsJourney.toJS()
    let column = []
    if (sessions.sessions.length > 0) {
      column = [
        {
          title: 'Sr. No',
          dataIndex: 'srNo',
          key: 'srNo',
          align: 'center',
        },
        {
          title: 'Topic Name',
          dataIndex: 'topicName',
          key: 'topicName',
          align: 'center',
        },
        {
          title: 'Booking on',
          dataIndex: 'bookingOn',
          key: 'bookingOn',
          align: 'center',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          align: 'center',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (status) => this.renderSessionStatus(status)
        },
        {
          title: 'Duration',
          dataIndex: 'duration',
          key: 'duration',
          align: 'center',
        },
        {
          title: 'mentor',
          dataIndex: 'mentor',
          key: 'mentor',
          align: 'center',
        },
        {
          title: 'Class Rating',
          dataIndex: 'classRating',
          key: 'classRating',
          align: 'center',
        },
        {
          title: 'Tags',
          dataIndex: 'tags',
          key: 'tags',
          align: 'center',
          render: (tag, row) => this.renderTags(tag, row)
        },
        {
          title: 'Link',
          dataIndex: 'link',
          key: 'link',
          align: 'center',
          render: (link) => this.renderLinkData(link)
        },
        {
          title: 'Student Comment',
          dataIndex: 'studentComment',
          key: 'studentComment',
          align: 'center',
          render: (studentComment) => this.renderColumnData(studentComment)
        },
        {
          title: 'Homework',
          dataIndex: 'homework',
          key: 'homework',
          align: 'center',
          render: (homework) => this.renderHomeworkStatus(homework)
        },
        {
          title: 'Quiz Test',
          dataIndex: 'quizTest',
          key: 'quizTest',
          align: 'center',
        },
        {
          title: 'F/M/P',
          dataIndex: 'fpm',
          key: 'fpm',
          align: 'center',
        },
        {
          title: 'Mentor Comment',
          dataIndex: 'mentorComment',
          key: 'mentorComment',
          align: 'left',
          render: (mentorComment) => this.renderColumnData(mentorComment)
        },
      ]
    }
    this.setState({
      column
    })
  }
  renderStudentsDetails = () => {
    const studentsDetails = this.props.studentsJourney && this.props.studentsJourney.toJS()
    const infoStyles = {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      marginBottom: '10px'
    }
    const { studentId } = this.state
    const { studentName, grade, parentName, parentEmail, phone, type,
      dateOfEnrollment, classType, trialOn, lastClassOn, avgDayPerClass,
      completedStudentSession, pendingStudentSession, familiar,
      mastered, proficient, homework, coursePrice, paidAmount,
      nextInstallmentOn, paymentStatus, enrollmentStatus, userPaymentPlanId,
      noPayment, classStatus, classMsg } = studentsDetails
    return (
      <StudentJourneyStyle.TopContainer>
        <div style={{ display: 'flex' }} >
          <StudentJourneyStyle.TopContainerInner>
            <div style={infoStyles} >
              <InfoBox value='Student Name' title />
              <InfoBox value={studentName} length={13} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Grade' title />
              <InfoBox value={grade} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Parent Name' title />
              <InfoBox value={parentName} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Email Id' title />
              <InfoBox value={parentEmail} length={14} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Phone No.' title />
              <InfoBox value={phone} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Model' title />
              <InfoBox value={type} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Class Type' title />
              <InfoBox value={classType} />
            </div>
          </StudentJourneyStyle.TopContainerInner>
          <StudentJourneyStyle.TopContainerInner style={{ marginLeft: '15px' }} >
            <div style={infoStyles} >
              <InfoBox value='Trial On' title />
              <InfoBox value={trialOn} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Enrollment On' title />
              <InfoBox value={dateOfEnrollment} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Avg.Days/Class' title />
              <InfoBox value={`${avgDayPerClass}`} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Last Class on' title />
              <InfoBox value={lastClassOn} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Class Status' title />
              <div>
                <StudentJourneyStyle.InfoBoxStatus value={classStatus}
                  style={{ marginBottom: '10px', width: '220px' }}
                >
                  {classMsg === '-' ? '' : `Last Class ${classMsg} Days back`}
                </StudentJourneyStyle.InfoBoxStatus>
                <StudentJourneyStyle.InfoBoxStatus value={classStatus}>
                  {classStatus}
                </StudentJourneyStyle.InfoBoxStatus>
              </div>
            </div>
          </StudentJourneyStyle.TopContainerInner>
        </div>
        <div style={{ display: 'flex', marginLeft: '20px' }} >
          <StudentJourneyStyle.TopContainerInner>
            <div style={infoStyles} >
              <InfoBox value='Completed' title />
              <InfoBox value={completedStudentSession} />
            </div>
            <div style={infoStyles} >
              <InfoBox value='Pending' title />
              <InfoBox value={pendingStudentSession} />
            </div>
            <div style={infoStyles} >
              <InfoBox title fourInOne >
                <div>Familiar</div>
                <div>Master</div>
                <div>Proficient</div>
                <div>Homework</div>
              </InfoBox>
              <InfoBox fourInOne >
                <div>{familiar}</div>
                <div>{mastered}</div>
                <div>{proficient}</div>
                <div>{homework}</div>
              </InfoBox>
            </div>
          </StudentJourneyStyle.TopContainerInner>
          {noPayment !== 'noPayment' ? (
            <StudentJourneyStyle.TopContainerInner style={{ marginLeft: '15px' }} >
              <div style={infoStyles} >
                <InfoBox value='Course Amount' title />
                <InfoBox value={`INR ${coursePrice}`} />
              </div>
              <div style={infoStyles} >
                <InfoBox value='Total Paid' title />
                <InfoBox value={`INR ${paidAmount}`} />
              </div>
              <div style={infoStyles} >
                <InfoBox value='Balance' title />
                <InfoBox value={`INR ${coursePrice !== '-' || paidAmount !== '-' ?
                  coursePrice - paidAmount : 0}`}
                />
              </div>
              <div style={infoStyles} >
                <InfoBox value='Next installment On' title length={16} />
                <InfoBox value={nextInstallmentOn} />
              </div>
              <div style={infoStyles} >
                <InfoBox value='Payment Status' title />
                <StudentJourneyStyle.PaymentStatusBox
                  value={paymentStatus}
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`/ums/mentor-conversion/${studentId}`}
                  style={{ marginLeft: '10px' }}
                >
                  {paymentStatus}
                </StudentJourneyStyle.PaymentStatusBox>
              </div>
            </StudentJourneyStyle.TopContainerInner>
          ) : (
            <div style={{ width: '100%', marginLeft: '25px' }} >
              <InfoBox value='Payment Plan is not selected' title />
            </div>
          )}
        </div>
        {enrollmentStatus && noPayment !== 'noPayment' && (
          <div style={{ width: '90%', marginLeft: '20px' }} >
            <InfoBox value='Enrollment Status' title />
            <StudentJourneyStyle.StyledSelect
              placeholder='Select Status'
              value={this.state.status || enrollmentStatus}
              onChange={(value) => this.setState({
                status: value
              }, () => updatePaymentPlan(this.state.status, userPaymentPlanId))}
              style={{
                width: '100%',
              }}
            >
              {['active', 'dormant', 'downgraded'].map(status => (
                <Select.Option value={status}>
                  <span style={{ textTransform: 'capitalize' }}> {status} </span>
                </Select.Option>
              ))}
            </StudentJourneyStyle.StyledSelect>
          </div>
        )}
      </StudentJourneyStyle.TopContainer>
    )
  }

  handleDateRange = (rangeInString) => {
    const range = JSON.parse(rangeInString)
    this.setState({
      selectedRange: rangeInString
    }, () => {
      this.handleDateChange([
        moment().subtract(range.duration, range.unit),
        moment()
      ])
    })
  }

  handleDateChange = (event) => {
    const dates = event
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : null,
      toDate: dates && dates[1] ? dates[1] : null,
    })
  }
  fetchReportData = async () => {
    const { studentId, fromDate, toDate } = this.state
    await fetchReportData({
      studentId,
      fromDate: fromDate !== null ?
        moment(fromDate).endOf('day').toDate() : '',
      toDate: toDate !== null ?
        moment(toDate).endOf('day').toDate() : ''
    })
  }
  reportRef = React.createRef()
  render() {
    const { isStudentJourneyFetching, studentReportFetchStatus } = this.props
    const { tableData, column, dateRanges, selectedRange, reportData } = this.state
    return (
      <>
        {isStudentJourneyFetching && isStudentJourneyFetching ? <Spin /> :
          (
            <>
              {this.renderStudentsDetails()}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                {
                  dateRanges.map(range =>
                    <Button
                      type={JSON.stringify(range.subtract) === selectedRange ? 'primary' : 'default'}
                      shape='circle'
                      onClick={() => JSON.stringify(range.subtract) === selectedRange
                        || studentReportFetchStatus && get(studentReportFetchStatus.toJS(), 'loading') ? null :
                        this.handleDateRange(JSON.stringify(range.subtract))}
                      style={{
                        margin: '0 5px'
                      }}
                    >
                      {range.label}
                    </Button>
                  )
                }
                <Button
                  loading={studentReportFetchStatus && get(studentReportFetchStatus.toJS(), 'loading')}
                  style={{ marginLeft: '10px' }}
                  type='primary'
                  icon='download'
                  onClick={this.fetchReportData}
                >Download Reports
                </Button>
              </div>
            </>
          )
        }
        <CSVLink
          style={{ display: 'none' }}
          filename='StudentReport.csv'
          data={reportData}
          headers={studentFinancialHeader}
          ref={this.reportRef}
        />
        <StudentJourneyStyle.MDTable
          dataSource={tableData}
          columns={column}
          loading={isStudentJourneyFetching && isStudentJourneyFetching}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default StudentJourney
