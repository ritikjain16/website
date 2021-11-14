import { Button, DatePicker, notification } from 'antd'
import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import React from 'react'
import { CSVLink } from 'react-csv'
import MainModal from '../../../../components/MainModal'
import requestToGraphql from '../../../../utils/requestToGraphql'
import convertModalTypeFromStringToNumber from '../../../../utils/convertModalTypeFromTextToNumber'
import { schoolFinancialReport } from '../../../../utils/financialReportHeaders'
import { UMS } from '../../../../constants/roles'

/* eslint-disable */
class FinancialReportModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: null,
      toDate: null,
      loading: false,
      reportData: []
    }
  }

  componentDidUpdate = (prevProps) => {
    const { visible } = this.props
    if (prevProps.visible !== visible) {
      this.handleDateChange(moment())
    }
  }
  fetchReportData = async () => {
    const { type } = this.props
    this.setState({ loading: true })
    const { toDate, fromDate } = this.state
    const { data: { salesOperations = [] } } = await requestToGraphql(gql`
      {
          salesOperations(
            filter: {
            and: [
                ${type === UMS ? '{ source_not: school }' : '{ source: school }'}
                { leadStatus: won }
                ${toDate ? `{ createdAt_lte: "${moment(toDate).endOf('day').toDate()}" }` : ''}
            ]
            }
            orderBy: createdAt_ASC
        ) {
            id
            firstMentorMenteeSession {
              sessionStartDate
            }
            client {
            id
            name
            gender
            city
            region
            state
            country
            utmSource
            fromReferral
            source
            studentProfile {
                grade
            }
            }
            allottedMentor {
            name
              mentorProfile {
                salesExecutive {
                  user {
                    name
                  }
                }
              }
            }
            userPaymentPlan {
            product {
                type
                price {
                  currency
                }
                course {
                title
                topicsMeta(filter: { status: published }) {
                    count
                }
                }
            }
            userPaymentInstallments {
                paidDate
                dueDate
                amount
                status
            }
            finalSellingPrice
            lastSessionTopic {
                order
            }
            installmentNumber
            }
        }
      }
    `)
    const mentorMenteeSessions = []
    if (salesOperations && salesOperations.length > 0) {
      for (let index = 0; index < salesOperations.length; index += 1) {
        const userId = get(salesOperations[index], 'client.id')
        const data = await requestToGraphql(gql`
          {
            totalClassCompleted: mentorMenteeSessionsMeta(
          filter: {
            and: [
              { sessionStatus: completed }
              { menteeSession_some: { user_some: { id: "${userId}" } } }
            ]
          }
        ) {
          count
        }
        totalClassCompletedInMonth: mentorMenteeSessionsMeta(
          filter: {
            and: [
              { sessionStatus: completed }
              { sessionStartDate_gte: "${moment(fromDate).startOf('day').toDate()}" }
              { sessionStartDate_lte: "${moment(toDate).endOf('day').toDate()}" }
              { menteeSession_some: { user_some: { id: "${userId}" } } }
            ]
          }
        ) {
          count
          }
          }
      `)
        mentorMenteeSessions.push({
          userId,
          totalClassCompleted: get(data, 'data.totalClassCompleted.count'),
          totalClassInMonth: get(data, 'data.totalClassCompletedInMonth.count')
        })
      }
    }
    this.setState({ loading: false })
    this.generateReport(salesOperations, mentorMenteeSessions)
  }

  getDates = (startDate, stopDate) => {
    const dateArray = []
    let currentDate = moment(startDate).endOf('M')
    while (currentDate <= moment(stopDate).endOf('M')) {
      dateArray.push({
        date: moment(currentDate).endOf('M').format('ll'),
        month: moment(currentDate).month()
      })
      currentDate = moment(currentDate).add(1, 'M')
    }
    return dateArray
  }

  getChannelType = (referral, source) => {
    if (referral) {
      return 'Referral'
    } else if (source === 'website') return 'Organic'
    return source
  }
  generateReport = (salesOperations, mentorMenteeSessions) => {
    const { type } = this.props
    const reportData = []
    const { fromDate, toDate } = this.state
    let startDate = ''
    let endDate = ''
    startDate = moment(fromDate).startOf('day')
    endDate = moment(toDate).endOf('day')
    const datesArray = this.getDates(fromDate, toDate)
    if (salesOperations && salesOperations.length > 0) {
      salesOperations.forEach((user, index) => {
        const usersData = get(user, 'client', {})
        const selectedMonth = datesArray.length > 0 ? datesArray[datesArray.length - 1] : {}
        const allottedMentor = get(user, 'allottedMentor.name')
        const userPaymentPlan = get(user, 'userPaymentPlan')
        const city = get(usersData, 'city')
        const userId = get(usersData, 'id')
        const totalClasses = get(userPaymentPlan, 'product.course.topicsMeta.count')
        const finalPrice = get(userPaymentPlan, 'finalSellingPrice')
        const currency = get(userPaymentPlan, 'product.price.currency')
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
        let cumulativeAmountInUSD = 0
        get(userPaymentPlan, 'userPaymentInstallments', []).forEach(payment => {
          if (get(payment, 'paidDate') && get(payment, 'status') === 'paid') {
            if (moment(get(payment, 'paidDate')).isBetween(startDate, endDate)) {
              paidAmount += get(payment, 'amount')
              userPaymentInstallmentsPaidDates.push(moment(get(payment, 'paidDate')))
            }
            const gstAmount = get(payment, 'amount') - ((get(payment, 'amount') * 100) / 118)
            cumulativeAmount += (get(payment, 'amount') - gstAmount)
            cumulativeAmountInUSD += get(payment, 'amount')
            if ((city === 'delhi' || city === 'Delhi') && currency === 'RS') {
              cumulativeCGST += (gstAmount / 2)
              cumulativeSGST += (gstAmount / 2)
            } else {
              cumulativeIGST += gstAmount
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
        if (paidAmount > 0 && paidAmountExGST > 0 && currency === 'RS') {
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
        let priceExGSTInRS = 0
        let priceExGSTInUSD = 0
        let paidAmountInMonthUSD = 0
        let paidAmountInCumInUSD = 0
        if (currency === 'RS') {
          priceExGSTInRS = priceExGST
        } else {
          priceExGSTInUSD = finalPrice
          paidAmountInMonthUSD = paidAmount
          paidAmountInCumInUSD = cumulativeAmountInUSD
          collectedIGST = 0
          cumulativeIGST = 0
        }
        let pricePerClassExGST = 0
        if (priceExGST > 0 && totalClasses > 0) {
          pricePerClassExGST = priceExGST / totalClasses
        }
        let pricePerClassExGSTInRS = 0
        let pricePerClassExGSTInUSD = 0
        if (currency === 'RS') {
          pricePerClassExGSTInRS = pricePerClassExGST
        } else {
          pricePerClassExGSTInUSD = finalPrice / totalClasses
        }
        const numberOfInstallments = get(userPaymentPlan, 'installmentNumber')
        const courseBeginDate = get(user, 'firstMentorMenteeSession.sessionStartDate') ?
          moment(get(user, 'firstMentorMenteeSession.sessionStartDate')).format('ll') : '-'

        // getting total Session count
        const sessions = mentorMenteeSessions.find(mmSessions => get(mmSessions, 'userId') === userId)
        const overAllCompletedClass = get(sessions, 'totalClassCompleted')
        // session completed in month
        let totalClassInMonth = get(sessions, 'totalClassInMonth')
        const revenueForMonth = pricePerClassExGST * totalClassInMonth
        const overAllRevenue = pricePerClassExGST * overAllCompletedClass
        let deferredAmount = 0
        if ((cumulativeAmount - 0) > overAllRevenue) {
          deferredAmount = (cumulativeAmount - 0) - overAllRevenue
        }
        let accruedAmount = 0
        if (overAllRevenue > cumulativeAmount) {
          accruedAmount = overAllRevenue - cumulativeAmount
        }
        if (currency !== 'RS') {
          paidAmountExGST = 0
          cumulativeAmount = 0
        }
        reportData.push({
          no: index + 1,
          userName: get(usersData, 'name'),
          date: get(selectedMonth, 'date'),
          city,
          region: get(usersData, 'region'),
          state: get(usersData, 'state'),
          country: get(usersData, 'country'),
          grade: get(usersData, 'studentProfile.grade'),
          channel: type === UMS ? 'b2c' : 'b2b2c',
          subChannel: this.getChannelType(get(usersData, 'fromReferral'), get(usersData, 'source')),
          smAssociated: get(user, 'allottedMentor.mentorProfile.salesExecutive.user.name', ''),
          userId,
          allottedMentor,
          currency,
          type: `'${typeNumber.trim()}`,
          courseName: get(userPaymentPlan, 'product.course.title', '-'),
          courseBeginDate,
          totalClasses,
          numberOfInstallments,
          priceExGSTInRS: priceExGSTInRS.toFixed(2),
          priceExGSTInUSD: currency !== 'RS' && priceExGSTInUSD ? priceExGSTInUSD.toFixed(2) : 0,
          pricePerClassExGSTInRS: pricePerClassExGSTInRS.toFixed(2),
          pricePerClassExGSTInUSD: currency !== 'RS' && pricePerClassExGSTInUSD ? pricePerClassExGSTInUSD.toFixed(2) : 0,
          totalClassCompleted: totalClassInMonth,
          overAllCompletedClass,
          invoiceGenerateDate: userPaymentInstallmentsDueDates.length > 0 ? moment.min(userPaymentInstallmentsDueDates).format('ll') : '-',
          installmentCollectDate:
            userPaymentInstallmentsPaidDates.length > 0 ?
              moment.min(userPaymentInstallmentsPaidDates).format('ll') : '-',
          paidAmountExGST: paidAmountExGST ? paidAmountExGST.toFixed(2) : 0,
          paidAmountInMonthUSD: currency !== 'RS' && paidAmountInMonthUSD ? paidAmountInMonthUSD.toFixed(2) : 0,
          paidAmountInCumInUSD: currency !== 'RS' && paidAmountInCumInUSD ? paidAmountInCumInUSD.toFixed(2) : 0,
          collectedCGST: collectedCGST.toFixed(2),
          collectedSGST: collectedSGST.toFixed(2),
          collectedIGST: collectedIGST.toFixed(2),
          cumulativeAmount: cumulativeAmount ? cumulativeAmount.toFixed(2) : 0,
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
    if (reportData.length > 0) {
      this.setState({
        reportData
      }, () => setTimeout(() => {
        this.reportRef.current.link.click()
      }))
    } else {
      notification.warn({
        message: 'No data available to download'
      })
    }
  }

  onCloseModal = () => {
    this.setState({
      fromDate: null,
      toDate: null,
      loading: false
    }, this.props.onClose)
  }

  handleDateChange = (month) => {
    this.setState({
      fromDate: month ? moment(month).startOf('month') : '',
      toDate: month ? moment(month).endOf('month') : '',
    })
  }
  disabledDate = (current) => {
    return current && moment(current).startOf('month') > moment();
  }
  reportRef = React.createRef()
  render() {
    const { visible } = this.props
    const { loading, reportData } = this.state
    const centerStyle = { display: 'flex', justifyContent: 'center', margin: '10px 0' }
    return (
      <MainModal
        visible={visible}
        onCancel={this.onCloseModal}
        title='Generate Monthly Financial Report'
        maskClosable={false}
        width='568px'
        centered
        destroyOnClose
        footer={null}
      >
        <CSVLink
          style={{ display: 'none' }}
          filename='StudentReport.csv'
          data={reportData}
          headers={schoolFinancialReport}
          ref={this.reportRef}
        />
        <div style={centerStyle}>
          <DatePicker.MonthPicker
            defaultValue={moment(new Date())}
            format='MM/YYYY'
            onChange={this.handleDateChange}
            disabledDate={this.disabledDate}
          />
        </div>
        <div style={centerStyle}>
          <Button
            type='primary'
            icon='download'
            onClick={this.fetchReportData}
            loading={loading}
          >Download Financial Reports
          </Button>
        </div>
      </MainModal>
    )
  }
}

export default FinancialReportModal
