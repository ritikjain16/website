/* eslint-disable */
import React, { Component, Fragment } from 'react'
import MentorConversionStyle from '../MentorConversion.style'
import { Row, Col, Select, Input, Button, DatePicker, Switch } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { filter, get } from 'lodash'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import addUserPaymentPlan from './../../../../actions/mentorConversion/addUserPaymentPlan'
import updateUserPaymentPlan from './../../../../actions/mentorConversion/updateUserPaymentPlan'
import removeDiscountFromPlan from './../../../../actions/mentorConversion/removeDiscountFromPlan'
import requestToGraphql from '../../../../utils/requestToGraphql'
import {
  oneToOne, oneToTwo, oneToThree, oneToFour, oneToFive, oneToSix,
  oneToSeven, oneToEight, oneToNine, oneToTen, oneToEleven, oneToTwelve, oneToThirty
} from '../../../../constants/modelType'
import gql from 'graphql-tag'
import moment from 'moment'
import convertModelTypeFromTextToNumber from '../../../../utils/convertModalTypeFromTextToNumber'

const MODAL_TYPE = [
  oneToOne,
  oneToTwo,
  oneToThree,
  oneToFour,
  oneToFive,
  oneToSix,
  oneToSeven,
  oneToEight,
  oneToNine,
  oneToTen,
  oneToEleven,
  oneToTwelve,
  oneToThirty
]

class Plan extends Component {
  state = {
    model: [
      {
        type: 'oneToOne',
        value: '1:1'
      },
      {
        type: 'oneToTwo',
        value: '1:2'
      },
      {
        type: 'oneToThree',
        value: '1:3'
      }
    ],
    installments: [
      {
        type: 'auto',
        values: [1, 2, 3, 4, 5, 6]
      },
      {
        type: 'manual',
        values: [1, 2, 3, 4, 5, 6]
      }
    ],
    addUserPaymentPlan: {
      sessionsPerMonth: 6,
      installmentType: 'auto',
      installmentNumber: 1,
      finalSellingPrice: null,
      comment: '',
      dateOfEnrollment: ''
    },
    productConnectId: '',
    product: '',
    discountCode: null,
    discountData: {
      status: null,
      data: null,
      err: null
    },
    discountConnectID: null,
    isDemoPack: false
  }

  componentDidMount() {
    this.setDefaultPlan()
  }

  componentDidUpdate(prevProps) {
    if (get(this.props, 'data') !== get(prevProps, 'data')) {
      this.setDefaultPlan()
    }else if (
      get(this.props, 'data.paymentPlan[0]') &&
      get(prevProps, 'data.paymentPlan') !== get(this.props, 'data.paymentPlan')
    ) {
      this.setDefaultPlan()
    }
  }

  setDefaultPlan = () => {
    if (!get(this.props, 'data.paymentPlan[0]')) {
      this.setState({
        addUserPaymentPlan: {
          sessionsPerMonth: 6,
          installmentType: 'auto',
          installmentNumber: 1,
          finalSellingPrice: null,
          comment: '',
          dateOfEnrollment: ''
        },
        productConnectId: '',
        product: '',
        discountCode: null,
        discountData: {
          status: null,
          data: null,
          err: null
        },
        discountConnectID: null,
        isDemoPack: false
      })
    } else {
      const product = filter(
        get(this.props, 'products'),
        item => item.id === get(this.props, 'data.paymentPlan[0].product.id')
      )
      const productDetails = product.length ?
        { ...product[0], discounts: get(product, '[0].discounts', []).filter(discount => discount.isDefault) } : {}
      this.setState({
        addUserPaymentPlan: get(this.props, 'data.paymentPlan[0]'),
        product: productDetails,
        productConnectId: get(this.props, 'data.paymentPlan[0].product.id'),
        discountCode: get(this.props, 'data.paymentPlan[0].discount.code'),
        discountData: {
          status: get(this.props, 'data.paymentPlan[0].discount') ? 'success' : 'failure',
          data: get(this.props, 'data.paymentPlan[0].discount'),
          err: null
        },
        discountConnectID: get(this.props, 'data.paymentPlan[0].discount.id'),
        isDemoPack: get(product, '0.isDemoPack')
      })
    }
  }

  setData = (key, value) => {
    const { addUserPaymentPlan, discountData, discountCode, discountConnectID } = this.state
    this.setState(
      {
        addUserPaymentPlan: {
          ...addUserPaymentPlan,
          [key]: value
        }
      },
      () => {
        const newUserPaymentPlan = this.state.addUserPaymentPlan
        if (newUserPaymentPlan.installmentType === 'manual') {
          this.setState({
            discountCode: null,
            discountData: {
              status: null,
              data: null,
              err: null
            },
            discountConnectID: null
          })
        } else if (newUserPaymentPlan.installmentType === 'auto' && addUserPaymentPlan.installmentType === "manual") {
          const defaultDiscounts = filter(this.state.product.discounts, item => item.isDefault)
          const percentage = defaultDiscounts && defaultDiscounts.length ? defaultDiscounts[0].percentage : 0
          const finalSellingPrice = Math.ceil(
            get(addUserPaymentPlan, 'productPrice') -
              (get(addUserPaymentPlan, 'productPrice') / 100) *
                percentage
          )
          this.setState({
            addUserPaymentPlan:{
              ...newUserPaymentPlan,
              finalSellingPrice
            }
          })
        }
      }
    )
  }

  sendData = () => {
    const { paymentPlan, menteeId } = this.props.data
    const userPaymentPlan = this.state.addUserPaymentPlan
    const input = {
      sessionsPerMonth: get(userPaymentPlan, 'sessionsPerMonth'),
      installmentType: get(userPaymentPlan, 'installmentType'),
      installmentNumber: get(userPaymentPlan, 'installmentNumber'),
      finalSellingPrice: get(userPaymentPlan, 'finalSellingPrice'),
      comment: get(userPaymentPlan, 'comment') ? get(userPaymentPlan, 'comment') : '' ,
      productPrice: get(userPaymentPlan, 'productPrice'),
      dateOfEnrollment: moment(get(userPaymentPlan, 'dateOfEnrollment'))
        .toDate()
        .toISOString()
    }
    const userId = menteeId
    const discountConnectID =
      input.installmentType === 'auto' && this.state.discountConnectID
        ? this.state.discountConnectID
        : null
    if (paymentPlan && paymentPlan.length === 0) {
      addUserPaymentPlan(
        userId,
        this.state.productConnectId,
        this.props.data.salesId,
        input,
        discountConnectID
      )
    } else if (paymentPlan && paymentPlan.length !== 0) {
      if (this.state.productConnectId === paymentPlan[0].product.id) {
        const { productConnectId } = this.state
        if(get(userPaymentPlan, 'id') && productConnectId !== get(userPaymentPlan, 'product.id') && get(userPaymentPlan, 'discount')) {
          removeDiscountFromPlan(get(userPaymentPlan, 'id'), get(userPaymentPlan, 'discount.id'))
        }
        if (get(paymentPlan[0], 'discount.id') === discountConnectID) {
          updateUserPaymentPlan(paymentPlan[0].id, null, input)
        } else {
          updateUserPaymentPlan(paymentPlan[0].id, null, input, discountConnectID)
        }
      } else {
        updateUserPaymentPlan(
          paymentPlan[0].id,
          this.state.productConnectId,
          input,
          discountConnectID
        )
      }
    }
  }

  renderSessionPerMonthBtns = () => {
    const { addUserPaymentPlan } = this.state
    const { ToggleButton } = MentorConversionStyle
    return [4, 6, 8].map(perMonth => {
      return (
        <ToggleButton
          style={{
            backgroundColor:
              addUserPaymentPlan.sessionsPerMonth === perMonth ? '#188af3' : '#d6ecff',
            color: addUserPaymentPlan.sessionsPerMonth === perMonth ? '#fff' : '#4a4a4a',
            padding: '0 10px'
          }}
          disabled={
            addUserPaymentPlan.userPaymentInstallments &&
            addUserPaymentPlan.userPaymentInstallments.length
          }
          onClick={() => this.setData('sessionsPerMonth', perMonth)}
        >
          {perMonth}
        </ToggleButton>
      )
    })
  }

  setProductId = type => {
    const { products } = this.props
    const { addUserPaymentPlan, discountData, isDemoPack } = this.state
    let productConnectId = null
    const allProducts = filter(products, product => product.type === type)
    const productDet = filter(allProducts, product => product.isDemoPack === isDemoPack)
    if (productDet && productDet[0]) {
      productConnectId = productDet[0].id
      let discounts =
        get(productDet[0], 'discounts') && get(productDet[0], 'discounts').length
          ? get(filter(productDet[0].discounts, item => item.isDefault), '[0].percentage', 0)
          : 0
      let finalSellingPrice = discounts
        ? ((100 - discounts) / 100) * (productDet[0].price ? productDet[0].price.amount : 0)
        : Number(get(productDet[0], 'price.amount'))
      const productDetails = { ...productDet[0], discounts: get(productDet, '[0].discounts', []).filter(discount => discount.isDefault) }
      if (get(addUserPaymentPlan, 'id') && get(addUserPaymentPlan, 'discount')) {
        removeDiscountFromPlan(
          get(addUserPaymentPlan, 'id'), get(addUserPaymentPlan, 'discount.id')
        ).then(res => {
          this.setState({
            productConnectId,
            product: productDetails,
            addUserPaymentPlan: {
              ...addUserPaymentPlan,
              productPrice: Number(get(productDet[0], 'price.amount')),
              finalSellingPrice: Math.ceil(finalSellingPrice),
              discount: null
            },
            discountConnectID: null,
            discountCode: null,
            discountData: {
              status: null,
              data: null,
              err: null
            },
            discountConnectID: null,
            selectedProductType: type
          })
        })
      } else {
        this.setState({
          productConnectId,
          product: productDetails,
          addUserPaymentPlan: {
            ...addUserPaymentPlan,
            productPrice: Number(get(productDet[0], 'price.amount')),
            finalSellingPrice: Math.ceil(finalSellingPrice),
            discount: null
          },
          discountConnectID: null,
          discountCode: null,
          discountData: {
            status: null,
            data: null,
            err: null
          },
          discountConnectID: null,
          selectedProductType: type
        })
      }
    }
  }

  calculateTotalDiscount = () => {
    const { productPrice, finalSellingPrice } = this.state.addUserPaymentPlan
    if (!productPrice || !finalSellingPrice) {
      return 0
    }
    let disc = 0
    disc = productPrice - finalSellingPrice
    disc /= productPrice
    // console.log(productPrice, finalSellingPrice, disc)
    return Math.ceil(disc * 100)
  }

  checkCouponCode = () => {
    const { discountData, addUserPaymentPlan, productConnectId } = this.state
    this.setState(
      {
        discountData: {
          ...discountData,
          status: 'loading'
        }
      },
      async () => {
        await requestToGraphql(gql`
        query{
          discounts(filter:{
            and:[
              {isDefault:false}
              {code:"${this.state.discountCode}"}
              {expiryDate_gte:"${moment()
                .toDate()
                .toISOString()}"}
              {product_some: {
                id: "${productConnectId}"
              }}
            ]
          }){
            id
            percentage
          }
        }
      `)
          .then(res => {
            if (res.data.discounts && res.data.discounts.length) {
              const { percentage } = res.data.discounts[0]
              const deductPrice = Math.ceil((addUserPaymentPlan.productPrice / 100) * percentage)
              // console.log(addUserPaymentPlan.finalSellingPrice, 'deductPrice', deductPrice)
              this.setState({
                discountData: {
                  status: 'success',
                  data: res.data.discounts[0]
                },
                addUserPaymentPlan: {
                  ...addUserPaymentPlan,
                  finalSellingPrice: addUserPaymentPlan.finalSellingPrice - deductPrice
                },
                discountConnectID: res.data.discounts[0].id
              })
            } else {
              this.setState({
                discountData: {
                  status: 'failure',
                  err: 'Coupon does not exist'
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    )
  }

  getDiscountStatus = () => {
    const {addUserPaymentPlan} = this.state
    switch (this.state.discountData.status) {
      case 'success':
        if (addUserPaymentPlan.userPaymentInstallments &&
          addUserPaymentPlan.userPaymentInstallments.length) {
            return 'Applied'
          }
        return "Remove?"
      case 'loading':
        return 'Wait'
      default:
        return 'Apply'
    }
  }

  getManualSellingPrice = () => {
    const { addUserPaymentPlan, product } = this.state
    const defaultDiscounts = filter(product.discounts, item => item.isDefault)
    const percentage = defaultDiscounts && defaultDiscounts.length ? defaultDiscounts[0].percentage : 0
    const sp = Math.ceil(
      get(addUserPaymentPlan, 'productPrice') -
        (get(addUserPaymentPlan, 'productPrice') / 100) *
          percentage
    )
    // Don't or else Maximum update depth exceeded error comes
    // this.setState({
    //   addUserPaymentPlan: {
    //     ...addUserPaymentPlan,
    //     finalSellingPrice: sp
    //   }
    // })
    return sp
  }

  removeDiscountId = () => {
    const {addUserPaymentPlan, product} = this.state
    const discount = filter(product.discounts, item => get(item, 'isDefault'))
    let discounts =
      discount.length
        ? discount[0].percentage
        : 0
    let finalSellingPrice = discounts
      ? ((100 - discounts) / 100) * (product.price ? product.price.amount : 0)
      : Number(get(product, 'price.amount'))
    if( !get(addUserPaymentPlan, 'discount.id') ) {
      this.setState({
        discountCode: null,
        discountData: {
          status: null,
          data: null,
          err: null
        },
        discountConnectID: null,
        addUserPaymentPlan:{
          ...addUserPaymentPlan,
          finalSellingPrice
        }
      })
    } else {
      removeDiscountFromPlan(
        get(addUserPaymentPlan, 'id'), get(addUserPaymentPlan, 'discount.id')
      ).then(res => {
        this.setState({
          addUserPaymentPlan:{
            ...addUserPaymentPlan,
            finalSellingPrice
          }
        })
      })
    }
  }

  toggleDemoPack = isDemo => {
    this.setState({
      isDemoPack: isDemo
    }, () => {
      this.setProductId(this.state.selectedProductType)
    })
  }

  render() {
    const { addUserPaymentPlan } = this.state
    const { Hl, Title, ToggleButton, SubTitle, NoticeBox } = MentorConversionStyle
    return (
      <Fragment>
        <Row>
          <Col
            span={12}
            style={{
              padding: '5px 0'
            }}
          >
            <Title>Sessions per month</Title>
          </Col>
          <Col
            span={12}
            style={{
              borderLeft: '1px solid #d8d8d8',
              padding: '5px 0',
              paddingLeft: 10
            }}
          >
            {this.renderSessionPerMonthBtns()}
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              padding: '5px 0'
            }}
          >
            <Title>Model</Title>
          </Col>
          <Col
            span={12}
            style={{
              borderLeft: '1px solid #d8d8d8',
              padding: '5px 0',
              paddingLeft: 10
            }}
          >
            <Select
              style={{ width: 100 }}
              onChange={(value) => this.setProductId(value)}
              value={get(this.state.product, 'type')}
              disabled={
                addUserPaymentPlan.userPaymentInstallments &&
                addUserPaymentPlan.userPaymentInstallments.length
              }
            >
              {
                MODAL_TYPE.map(modal => (
                  <Option value={modal} key={modal}>
                    {convertModelTypeFromTextToNumber(modal)}
                  </Option>
                ))
              }
            </Select>
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              padding: '5px 0'
            }}
          >
            <Title>Is it a Demo Pack?</Title>
          </Col>
          <Col
            span={12}
            style={{
              borderLeft: '1px solid #d8d8d8',
              padding: '5px 0',
              paddingLeft: 10
            }}
          >
            <Switch
              checked={this.state.isDemoPack}
              onChange={this.toggleDemoPack}
              disabled={
                !this.state.productConnectId ||
                addUserPaymentPlan.userPaymentInstallments &&
                addUserPaymentPlan.userPaymentInstallments.length
              }
            />
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              padding: '5px 0'
            }}
          >
            <Title>Installments</Title>
          </Col>
          <Col
            span={12}
            style={{
              borderLeft: '1px solid #d8d8d8',
              padding: '5px 0',
              paddingLeft: 10
            }}
          >
            {this.state.installments.map(installment => (
              <ToggleButton
                style={{
                  backgroundColor:
                    addUserPaymentPlan.installmentType === installment.type ? '#188af3' : '#d6ecff',
                  color:
                    addUserPaymentPlan.installmentType === installment.type ? '#fff' : '#4a4a4a',
                  padding: '0 5px'
                }}
                disabled={
                  addUserPaymentPlan.userPaymentInstallments &&
                  addUserPaymentPlan.userPaymentInstallments.length
                }
                onClick={() => this.setData('installmentType', installment.type)}
              >
                {installment.type[0].toUpperCase()}
              </ToggleButton>
            ))}
            <Select
              style={{ width: 50 }}
              value={addUserPaymentPlan.installmentNumber}
              onChange={value => this.setData('installmentNumber', value)}
              disabled={
                addUserPaymentPlan.userPaymentInstallments &&
                addUserPaymentPlan.userPaymentInstallments.length
              }
            >
              {filter(
                this.state.installments,
                item => item.type === addUserPaymentPlan.installmentType
              )[0].values.map(value => (
                <Option value={value}>{value}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              padding: '5px 0'
            }}
          >
            <Title>Date Of Enrollment *</Title>
          </Col>
          <Col
            span={12}
            style={{
              borderLeft: '1px solid #d8d8d8',
              padding: '5px 0',
              paddingLeft: 10
            }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              value={
                addUserPaymentPlan.dateOfEnrollment
                  ? moment(addUserPaymentPlan.dateOfEnrollment)
                  : ''
              }
              onChange={date => this.setData('dateOfEnrollment', date)}
              disabled={
                addUserPaymentPlan.userPaymentInstallments &&
                addUserPaymentPlan.userPaymentInstallments.length
              }
            />
          </Col>
        </Row>
        <Hl />
        {this.state.productConnectId ? (
          <Fragment>
            <Row>
              <Col
                span={12}
                style={{
                  padding: '5px 0'
                }}
              >
                <Title>Course price</Title>
              </Col>
              <Col
                span={12}
                style={{
                  borderLeft: '1px solid #d8d8d8',
                  padding: '5px 0',
                  paddingLeft: 10
                }}
              >
                {get(addUserPaymentPlan, 'productPrice')}
              </Col>
            </Row>
            <Row>
              <Col
                span={12}
                style={{
                  padding: '5px 0'
                }}
              >
                <SubTitle>
                  <span>(-) Discount</span>
                  <span> {get(this.state.product, 'discounts[0].percentage', 0)} %</span>
                </SubTitle>
              </Col>
              <Col
                span={12}
                style={{
                  borderLeft: '1px solid #d8d8d8',
                  padding: '5px 0',
                  paddingLeft: 10
                }}
              >
                <SubTitle>
                  {get(this.state.product, 'discounts[0].percentage') ? Math.ceil(
                    -(get(addUserPaymentPlan, 'productPrice') / 100) *
                      get(this.state.product, 'discounts[0].percentage')
                  ) : 0}
                </SubTitle>
              </Col>
            </Row>
            <Hl />
            {addUserPaymentPlan.installmentType === 'auto' ? (
              <Fragment>
                <Row>
                  <Col
                    span={12}
                    style={{
                      padding: '5px 0'
                    }}
                  >
                    <Title>Price after discount</Title>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      borderLeft: '1px solid #d8d8d8',
                      padding: '5px 0',
                      paddingLeft: 10
                    }}
                  >
                    {get(this.state.product, 'discounts[0].percentage') ? Math.ceil(
                      (get(addUserPaymentPlan, 'productPrice') / 100) *
                        (100 - get(this.state.product, 'discounts[0].percentage'))
                    ) : (get(addUserPaymentPlan, 'productPrice'))}
                  </Col>
                </Row>
                <Hl/>
                {addUserPaymentPlan.installmentType === 'auto' ? (
                  <Row>
                    <Col
                      span={16}
                      style={{
                        padding: '5px 0'
                      }}
                    >
                      <Input
                        placeholder="Apply Code"
                        value={this.state.discountCode}
                        onChange={e =>
                          this.setState({
                            discountCode: e.target.value
                          })
                        }
                        disabled={
                          this.state.discountData.status === 'success' ||
                          (addUserPaymentPlan.userPaymentInstallments &&
                            addUserPaymentPlan.userPaymentInstallments.length)
                        }
                        bordered={true}
                        style={{
                          border: '1px solid #73a5aa'
                        }}
                      />
                    </Col>
                    <Col
                      span={8}
                      style={{
                        padding: '5px 0'
                      }}
                    >
                      <ToggleButton
                        type="primary"
                        onClick={e => {
                          this.getDiscountStatus() === "Remove?" ?
                            this.removeDiscountId() : this.checkCouponCode()
                        }}
                        disabled={
                          (addUserPaymentPlan.userPaymentInstallments &&
                            addUserPaymentPlan.userPaymentInstallments.length)
                        }
                      >
                        {this.getDiscountStatus()}
                      </ToggleButton>
                    </Col>
                  </Row>
                ) : null}
                {addUserPaymentPlan.installmentType === 'auto' &&
                this.state.discountData.status === 'failure' ? (
                  <Row>
                    <Col
                      span={24}
                      style={{
                        color: 'red'
                      }}
                    >
                      {this.state.discountData.err}
                    </Col>
                  </Row>
                ) : null}
                <Row>
                  <Col
                    span={24}
                    style={{
                      padding: '5px 0'
                    }}
                  >
                    <SubTitle>
                      (
                      {Math.ceil(
                        addUserPaymentPlan.finalSellingPrice / addUserPaymentPlan.installmentNumber
                      )}{' '}
                      x {addUserPaymentPlan.installmentNumber} installments)
                    </SubTitle>
                  </Col>
                </Row>
              </Fragment>
            ) : (
              <Row>
                <Col
                  span={12}
                  style={{
                    padding: '5px 0'
                  }}
                >
                  <Title>Selling Price</Title>
                </Col>
                <Col
                  span={12}
                  style={{
                    borderLeft: '1px solid #d8d8d8',
                    padding: '5px 0',
                    paddingLeft: 10
                  }}
                >
                  {this.getManualSellingPrice()}
                </Col>
              </Row>
            )}
            <Hl />
            <Row>
              <Col
                span={12}
                style={{
                  padding: '5px 0'
                }}
              >
                <Title>Final Selling Price</Title>
              </Col>
              <Col
                span={12}
                style={{
                  borderLeft: '1px solid #d8d8d8',
                  padding: '5px 0',
                  paddingLeft: 10
                }}
              >
                {addUserPaymentPlan.installmentType === 'auto' ? (
                  addUserPaymentPlan.finalSellingPrice
                ) : (
                  <Input
                    value={addUserPaymentPlan.finalSellingPrice}
                    suffix={<EditOutlined />}
                    disabled={
                      addUserPaymentPlan.userPaymentInstallments &&
                      addUserPaymentPlan.userPaymentInstallments.length
                    }
                    onChange={e => this.setData('finalSellingPrice', Number(e.target.value))}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{
                  padding: '5px 0'
                }}
              >
                <SubTitle>(Total Discount = {this.calculateTotalDiscount()}%)</SubTitle>
                {addUserPaymentPlan.installmentType === 'manual' ? (
                  <SubTitle>
                    (
                    {Math.ceil(
                      addUserPaymentPlan.finalSellingPrice / addUserPaymentPlan.installmentNumber
                    )}{' '}
                    x {addUserPaymentPlan.installmentNumber} installments)
                  </SubTitle>
                ) : null}
              </Col>
            </Row>
            {addUserPaymentPlan.installmentType === 'manual' ? (
              <NoticeBox>
                <Input.TextArea
                  rows={2}
                  placeholder="The reason for the additional discount goes here."
                  value={addUserPaymentPlan.comment}
                  disabled={
                    addUserPaymentPlan.userPaymentInstallments &&
                    addUserPaymentPlan.userPaymentInstallments.length
                  }
                  onChange={e => this.setData('comment', e.target.value)}
                  bordered={false}
                  style={{
                    backgroundColor: 'transparent',
                    border: 0
                  }}
                />
              </NoticeBox>
            ) : null}
            {addUserPaymentPlan.userPaymentInstallments &&
            addUserPaymentPlan.userPaymentInstallments.length ? null : (
              <ToggleButton
               type="primary"
                style={{
                  float: 'right'
                }}
                disabled={
                  (addUserPaymentPlan.userPaymentInstallments &&
                  addUserPaymentPlan.userPaymentInstallments.length) ||
                  addUserPaymentPlan.dateOfEnrollment === ""
                }
                onClick={this.sendData}
              >
                Save
              </ToggleButton>
            )}
          </Fragment>
        ) : (
          'Select Product'
        )}
      </Fragment>
    )
  }
}
export default Plan
