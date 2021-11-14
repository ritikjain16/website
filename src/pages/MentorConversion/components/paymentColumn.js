/* eslint-disable */
import React, { Component, Fragment } from 'react'
// import getDataFromLocalStorage from "../../../utils/extract-from-localStorage"
import MentorConversionStyle from '../MentorConversion.style'
import { Row, Col, DatePicker, Input, Switch } from 'antd'
import { CaretDownOutlined, InfoCircleTwoTone } from '@ant-design/icons'
import { filter, get } from 'lodash'
import commaNumber from 'comma-number'
import moment from 'moment'
import updateUserPaymentInstallment from '../../../actions/mentorConversion/updateUserPaymentInstallment'
// .format('DD/MM/YYYY')

class Payment extends Component {
  state = {
    amountPerInstallment: 0,
    installmentsDueDate: [],
    status: 'pending',
    amountBeingPaid: 0,
    overDueStyle: {
      backgroundColor: 'crimson',
      borderRadius: '5px',
      color: 'white',
      padding: '3px',
    },
    currentDueDate: null,
    isPaymentRequested: true,
    installmentWiseTopics: [],
    totalTopics: 39,
    currency: '₹'
  }

  componentDidMount() {
    this.setInstallmentPlan()
  }

  componentDidUpdate(prevProps) {
    if (
      get(this.props, 'data.paymentPlan[0]') &&
      get(prevProps, 'data.paymentPlan') !== get(this.props, 'data.paymentPlan')
    ) {
      this.setInstallmentPlan()
    }
  }
  getInstallmentWiseTopics = (installmentNumber) => {
    const { totalTopics } = this.state
    const perInstallment = Math.ceil(totalTopics / installmentNumber)
    const installmentWiseTopics = []
    for (let index = 0; index < installmentNumber; index++) {
      installmentWiseTopics.push(index * perInstallment)
    }
    return installmentWiseTopics
  }

  setInstallmentPlan() {
    const { paymentPlan, menteeId } = this.props.data
    if (paymentPlan || paymentPlan.length) {
      let currency = get(paymentPlan, '[0].product.price.currency') === 'RS' ? '₹' : '$'
      const pendingInstallment = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === "pending")
      const { totalAmountCollected, doneInstallments } = this.renderTotalAmount()
      this.setState(
        {
          amountPerInstallment: Math.ceil(
            get(paymentPlan[0], 'finalSellingPrice') / get(paymentPlan[0], 'installmentNumber')
          ),
          installmentsDueDate: this.getDueDates(),
          userConnectId: menteeId,
          planConnectId: get(paymentPlan[0], 'id'),
          status: "pending",
          paidDate: null,
          totalAmountCollected,
          doneInstallments,
          amountBeingPaid: pendingInstallment.length ?
            pendingInstallment[0].amount
            : Math.ceil(
              (get(paymentPlan[0], 'finalSellingPrice') - totalAmountCollected) / (get(paymentPlan[0], 'installmentNumber') - doneInstallments)
            ),
          installmentNumber: get(paymentPlan[0], 'installmentNumber'),
          installmentWiseTopics: this.getInstallmentWiseTopics(get(paymentPlan[0], 'installmentNumber')),
          currency
        },
      )
    }
  }

  getDueDates() {
    const { paymentPlan } = this.props.data
    if (!paymentPlan || paymentPlan.length === 0) {
      return []
    } else {
      const enrollmentDate = new Date(get(paymentPlan[0], 'dateOfEnrollment'))
      if (!enrollmentDate) {
        return []
      } else {
        const dueDate = []
        const perMonth = get(paymentPlan[0], 'sessionsPerMonth') === 8 ? 8 : 6
        var numberOfDays = 0
        if (perMonth === 8) {
          const start = moment(enrollmentDate)
          const end = moment(enrollmentDate).add(5, 'M') // add 5 months; calculated it;
          numberOfDays = moment.duration(end.diff(start)).asDays()
        } else {
          const start = moment(enrollmentDate)
          const end = moment(enrollmentDate).add(6, 'M') // add 6 months; calculated it;
          numberOfDays = moment.duration(end.diff(start)).asDays()
        }
        const gap = Math.floor(numberOfDays / get(paymentPlan[0], 'installmentNumber'))
        // console.log(numberOfDays, gap)
        for (let i = 0; i < get(paymentPlan[0], 'installmentNumber'); i++) {
          // console.log(moment(enrollmentDate).add(ga))
          dueDate.push(moment(enrollmentDate).add(gap * i, 'd').format('DD/MM/YYYY'))
        }
        return dueDate
      }
    }
  }

  getSuffix = i => {
    switch (i) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  sendRequest = () => {
    const { paymentPlan } = this.props.data
    const {userPaymentInstallments} = paymentPlan[0]
    const current = filter(userPaymentInstallments, item => item.status === "pending")
    const { amountBeingPaid, totalAmountCollected } = this.state
    // if we have the final selling price 21275 and 3 installments of 7092 (7092 * 3) = 21276
    // which is 21276 > 21275 i.e amount is greater that final selling price
    // since we have upto 6 installments so we are adding the Rs. 6 while calculating the finalSellingPrice - totalAmountPaid
    if (this.getRequestText() === "Save" || this.getRequestText() === "Send Receipt") {
      if (amountBeingPaid <= 0 || amountBeingPaid > (get(paymentPlan[0], 'finalSellingPrice') - totalAmountCollected) + 6) {
        if(amountBeingPaid <= 0) {
          this.setState({
            err: "Amount can't be negative or zero",
          })
        } else {
          this.setState({
            err: "Amount is greater than final selling price",
          })
        }
        return
      }
      if (this.state.status === 'paid' && this.state.paidDate) {
        const input = {
          paidDate: this.state.paidDate,
          status: this.state.status,
          isPaymentRequested: this.state.isPaymentRequested
        }
        updateUserPaymentInstallment(
          get(current[0], 'id'),
          input
        )
        this.setState({
          err: null,
        })
      } else if (this.state.status === 'paid' && !this.state.paidDate) {
        this.setState({
          err: "Paid Date Required",
        })
      } else if (this.state.status === 'pending') {
        const input = {
          status: this.state.status,
          isPaymentRequested: this.state.isPaymentRequested
        }
        updateUserPaymentInstallment(
          get(current[0], 'id'),
          input
        )
      }
    }else if (this.getRequestText() === "Requested" || this.getRequestText() === "Request Payment") {
      const input = {
        paymentRequestedCount: get(current, '0.paymentRequestedCount') + 1,
        isPaymentRequested: this.state.isPaymentRequested
      }
      updateUserPaymentInstallment(
        get(current, '0.id'),
        input
      )
    }
  }

  getRequestText = () => {
    const { paymentPlan } = this.props.data
    if (this.state.paidDate && this.state.status === 'paid') return 'Save'
    if (moment(this.state.currentDueDate).startOf('day').diff(moment().startOf('day')) > 1) {
      return 'Not Due Yet'
    }
    if (paymentPlan && paymentPlan[0]) {
      const {userPaymentInstallments} = paymentPlan[0]
      if (this.state.isPaymentRequested === false && this.state.status === "paid") {
        return "Save"
      }else if (this.state.isPaymentRequested === true && this.state.status === "paid") {
        return "Send Receipt"
      }else if (userPaymentInstallments.length > 0 && filter(userPaymentInstallments, item => item.status === "pending").length) {
        let lastReqDate = get(filter(userPaymentInstallments, item => item.status === "pending"), '0.lastPaymentRequestedDate')
        lastReqDate = moment(lastReqDate)
        const now = moment()
        if (moment.duration(now.diff(lastReqDate)).asDays() < 1) {
          return "Requested"
        }
      }
    }
    return "Request Payment"
  }

  renderPaidInstallmentDetails = () => {
    const { paymentPlan } = this.props.data
    const { SubTitle } = MentorConversionStyle
    const installmentsDone = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === "paid")
    return installmentsDone.map((installments, index) =>
        <div
        style={{
          display: 'flex',
          // borderColor: '#eb2f96',
        }}
        >
          <InfoCircleTwoTone twoToneColor="#73a5aa" style={{ fontSize: '16px' }}/>
          <SubTitle
            style={{
              padding: '0px 0px 0px 10px',
              textTransform: 'none'
            }}
          >
            {index + 1}{this.getSuffix(index + 1)} installment of {this.state.currency}. {installments.amount} paid on {moment(get(installments, 'paidDate')).format('Do [of] MMMM [,] YYYY')}
          </SubTitle>
        </div>
      )
  }

  shouldRequestPayment = checked => {
    this.setState({
      isPaymentRequested: checked
    })
  }

  renderCurrentInstallment = () => {
    const { paymentPlan, currentTopicStatus } = this.props.data
    const { amountBeingPaid, installmentNumber, totalAmountCollected } = this.state
    const current = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === 'pending')
    const { Hl, SubTitle, CustomSelect } = MentorConversionStyle
    if (moment(this.state.currentDueDate).format('DD/MM/YYYY') !== moment(get(current, '0.dueDate')).format('DD/MM/YYYY')) {
      this.setState({
        currentDueDate: moment(get(current, '0.dueDate'))
      })
    }
    if ((current === get(paymentPlan[0], 'installmentNumber')) || (get(paymentPlan[0], 'finalSellingPrice') <= totalAmountCollected)) {
      return null
    }
    const requestedInstallmentData = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === 'pending')
    let currentInstallment = get(paymentPlan[0], 'installmentNumber') - current.length
    return (
      <Fragment>
        <SubTitle style={{ color: '#73a5aa' }}>
          <span>
            {currentInstallment + 1}{this.getSuffix(currentInstallment + 1)} installment
            {' '}
            (Current Topic #{get(currentTopicStatus, '0.currentTopic.order', '1')})
          </span>
          {
            this.getRequestText() !== "Not Due Yet" &&
            <span>
              Send Email?{' '}
              <Switch
                checked={this.state.isPaymentRequested}
                onChange={this.shouldRequestPayment}
                size="small"
              />
            </span>
          }
        </SubTitle>
          <Hl />
          <Row
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Col span={5}>
              <Input
                value={amountBeingPaid}
                onChange={e => this.setState({
                  amountBeingPaid: e.target.value
                })}
                type='number'
                style={{
                  minWidth: 100
                }}
                min={1}
                disabled={installmentNumber === 1
                  || ((currentInstallment + 1) === installmentNumber)
                }
              />
            </Col>
            <Col span={5} style={moment(get(requestedInstallmentData, '0.dueDate')).diff(moment()) < 0 ? this.state.overDueStyle : null}>
              {moment(get(requestedInstallmentData, '0.dueDate')).format('DD/MM/YYYY')}
            </Col>
            <Col span={7}>
              <DatePicker
                format="DD/MM/YYYY"
                value={this.state.paidDate ? moment(this.state.paidDate) : ''}
                defaultPickerValue={moment(get(requestedInstallmentData, '0.dueDate'))}
                onChange={date => this.setState({
                  paidDate: date
                })}
              />
            </Col>
            <Col span={7}>
              <CustomSelect
                defaultValue="pending"
                suffixIcon={<CaretDownOutlined />}
                onChange={val => this.setState({
                  status: val
                })}
                value={this.state.status}
              >
                <Option value="pending">Pending</Option>
                <Option value="paid">Paid</Option>
              </CustomSelect>
            </Col>
          </Row>
          <Row
            style={{
              marginTop: 10
            }}
          >
            <Col span={24}>
              <MentorConversionStyle.ToggleButton
                type="primary"
                onClick={this.sendRequest}
                disabled={this.getRequestText() === "Requested" || this.getRequestText() === 'Not Due Yet'}
              >
                {this.getRequestText()}
              </MentorConversionStyle.ToggleButton>
            </Col>
          </Row>
          {
            this.getRequestText() === "Requested" ?
            <Row>
              <p
                style={{
                  margin: 0,
                  letterSpacing: 3,
                }}
              >
                <InfoCircleTwoTone twoToneColor="#278af3" style={{
                  fontSize: '16px',
                  marginRight: '6px'
                }}/>
                Already requested. Please wait for a day.
              </p>
            </Row> : null
          }
      </Fragment>
    )
  }

  renderBalance() {
    const { paymentPlan } = this.props.data
    const { Hl, SubTitle, NoticeBox } = MentorConversionStyle
    const { installmentsDueDate, installmentWiseTopics, currency } = this.state
    const installmentsRequested = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === "pending")
    const balance = installmentsRequested.slice(1)
    return balance
      .map((details, index) => (
        <NoticeBox
          style={{
            backgroundColor: '#fbfbfb',
            border: 0,
            borderBottom: '1px solid #73a5aa'
          }}
        >
          <SubTitle style={{ color: '#73a5aa' }}>
            {' '}
            {installmentsDueDate.indexOf(moment(get(details, 'dueDate')).format('DD/MM/YYYY')) + 1}
            {this.getSuffix(installmentsDueDate.indexOf(moment(get(details, 'dueDate')).format('DD/MM/YYYY')) + 1)} installment
            (Upto Topic {installmentWiseTopics[installmentsDueDate.indexOf(moment(get(details, 'dueDate')).format('DD/MM/YYYY'))]})
          </SubTitle>
          <Hl style={{ margin: '5px 0' }}/>
          <Row>
            <Col span={4}>{currency}{' '}{commaNumber(
              Math.floor(
                get(details, 'amount')
              )
            )}</Col>
            <Col span={6}>{moment(get(details, 'dueDate')).format('DD/MM/YYYY')}</Col>
            <Col span={6}>Not Due Yet</Col>
          </Row>
        </NoticeBox>
      ))
  }

  isCurrent = () => {
    const { paymentPlan } = this.props.data
    if (get(paymentPlan[0], 'finalSellingPrice') <= this.state.totalAmountCollected) {
      return false
    }
    const current = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === 'paid').length
    if (current >= get(paymentPlan[0], 'installmentNumber')) {
      return false
    }
    return true
  }

  isBalance = () => {
    const { paymentPlan } = this.props.data
    if (get(paymentPlan[0], 'finalSellingPrice') <= this.state.totalAmountCollected) {
      return false
    }
    const installmentsRequested = filter(get(paymentPlan[0], 'userPaymentInstallments'), item => item.status === "pending").length
    const balance = installmentsRequested + 1
    if (balance >= get(paymentPlan[0], 'installmentNumber')) {
      return false
    }
    return true
  }

  renderTotalAmount = () => {
    const installments = filter(get(this.props, 'data.paymentPlan[0].userPaymentInstallments'), item => get(item, 'status') === "paid")
    let amount = 0
    installments.forEach(installment => {
      amount += get(installment, 'amount')
    })
    return { totalAmountCollected: amount, doneInstallments: installments.length }
  }

  render() {
    const { paymentPlan } = this.props.data
    const { amountPerInstallment, totalAmountCollected, currency } = this.state
    if (!paymentPlan || paymentPlan.length === 0) {
      return (
        <p
          style={{
            textAlign: 'center'
          }}
        >
          No Subscription plan selected
        </p>
      )
    }
    const { Hl, Title, NoticeBox, SubTitle, PaymentSection, Banner } = MentorConversionStyle
    return (
      <PaymentSection>
        <Banner>
          Total Amount Collected: {currency} {commaNumber(totalAmountCollected)}
        </Banner>
        <Row style={{ textAlign: 'center' }}>
          <Col>
            <Title>
              Total amount payable: {currency} {commaNumber(get(paymentPlan[0], 'finalSellingPrice'))}
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <SubTitle style={{ textAlign: 'center', justifyContent: 'center' }}>
             {currency}{' '} {commaNumber(amountPerInstallment)} x {get(paymentPlan[0], 'installmentNumber')}{' '}
              installments
            </SubTitle>
          </Col>
        </Row>
        <Hl />
        {this.renderPaidInstallmentDetails()}
        <Hl />
        {
          this.isCurrent() ?
          <Fragment>
            <Row>
              <Col span={4}>
                <SubTitle>Amount</SubTitle>
              </Col>
              <Col span={6}>
                <SubTitle>Due date</SubTitle>
              </Col>
              <Col span={6}>
                <SubTitle>Paid Date</SubTitle>
              </Col>
              <Col span={7} offset={1}>
                <SubTitle>Status</SubTitle>
              </Col>
            </Row>
            <NoticeBox>
              {this.renderCurrentInstallment()}
            </NoticeBox>
          </Fragment> : null
        }
        {this.state.err ?
          <Row>
            <NoticeBox
              style={{
                backgroundColor: '#ffa8a8',
                color: 'crimson',
                borderColor: 'crimson'
              }}
            >
              {this.state.err}
            </NoticeBox>
          </Row> : null
        }
        <Row style={{ margin: '10px 0' }}>
          <Col>
            <Title style={{ color: '#afafaf' }}>Balance</Title>
          </Col>
        </Row>
        <div
          style={{
            maxHeight: 190,
            overflow: 'scroll',
            border: '1px solid #73a5aa'
          }}
        >
          {this.renderBalance()}
        </div>
      </PaymentSection>
    )
  }
}
export default Payment
