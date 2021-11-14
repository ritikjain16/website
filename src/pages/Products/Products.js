import React, { Component } from 'react'
import moment from 'moment'
import { get, orderBy } from 'lodash'
import { Button, Form, DatePicker, Popconfirm, Icon, Spin, Tooltip, notification } from 'antd'
import fetchProducts from '../../actions/products/fetchProducts'
import Main from '../Topics/Topics.style'
import { Table } from '../../components/StyledComponents'
import ProductModal from './ProductModal'
import MainTable from '../../components/MainTable'
import MainModal from '../../components/MainModal'
import validators from '../../utils/formValidators'
import addDiscount from '../../actions/products/addDiscount'
import updateDiscount from '../../actions/products/updateDiscount'
import deleteProduct from '../../actions/products/deleteProduct'
import deleteDiscount from '../../actions/products/deleteDiscount'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'
import StyledSwitch from './Product.style'
import updateProduct from '../../actions/products/updateProduct'

const columnsTemplate = 'repeat(5, 0.25fr) repeat(2, 0.04fr)'
const minWidth = '813px'


const currencies = { RS: '₹', USD: '$' }

const type = {
  oneToOne: '1:1',
  oneToTwo: '1:2',
  oneToThree: '1:3',
  oneToFour: '1:4',
  oneToFive: '1:5',
  oneToSix: '1:6',
  oneToSeven: '1:7',
  oneToEight: '1:8',
  oneToNine: '1:9',
  oneToTen: '1:10',
  oneToEleven: '1:11',
  oneToTwelve: '1:12',
}

const getType = (typeKey) => {
  if (type[typeKey]) return type[typeKey]
  return typeKey
}
class Products extends Component {
    state = {
      isModalVisible: false,
      isProductModalVisible: false,
      selectedProduct: null,
      edit: false,
      editProduct: false,
      discountId: '',
      country: localStorage.getItem('country') || 'india',
      productEditing: {}
    }

    componentDidMount() {
      this.props.fetchCourses()
      fetchProducts(this.state.country).call()

      window.addEventListener('click', () => {
        if (localStorage && this.state.country !== localStorage.getItem('country')) {
          this.setState({
            country: localStorage.getItem('country')
          })
        }
      })
    }

    componentDidUpdate(prevProps, prevState) {
      const { productUpdateStatus, productUpdateFailure, productDeleteStatus,
        productDeleteFailure } = this.props
      if (this.state.country !== prevState.country) {
        fetchProducts(this.state.country).call()
      }
      if (productUpdateStatus && !get(productUpdateStatus.toJS(), 'loading')
        && get(productUpdateStatus.toJS(), 'success') &&
        (prevProps.productUpdateStatus !== productUpdateStatus)) {
        notification.success({
          message: 'Product updated successfully'
        })
      } else if (productUpdateStatus && !get(productUpdateStatus.toJS(), 'loading')
        && get(productUpdateStatus.toJS(), 'failure') &&
        (prevProps.productUpdateFailure !== productUpdateFailure)) {
        if (productUpdateFailure && productUpdateFailure.toJS().length > 0) {
          notification.error({
            message: get(get(productUpdateFailure.toJS()[0], 'error').errors[0], 'message')
          })
        }
      }
      if (productDeleteStatus && !get(productDeleteStatus.toJS(), 'loading')
        && get(productDeleteStatus.toJS(), 'success') &&
        (prevProps.productDeleteStatus !== productDeleteStatus)) {
        notification.success({
          message: 'Product deleted successfully'
        })
      } else if (productDeleteStatus && !get(productDeleteStatus.toJS(), 'loading')
        && get(productDeleteStatus.toJS(), 'failure') &&
        (prevProps.productDeleteFailure !== productDeleteFailure)) {
        if (productDeleteFailure && productDeleteFailure.toJS().length > 0) {
          notification.error({
            message: get(get(productDeleteFailure.toJS()[0], 'error').errors[0], 'message')
          })
        }
      }
    }

    renderTableHead = () => (
      <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth}>
        <Table.Item>
          <MainTable.Title>Code</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title>Total Discount</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title>Payable Amount</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title>Expiry Date</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title>Created At</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title>Action</MainTable.Title>
        </Table.Item>
      </Table.Row>
    )

  updateStatus = (id, status) => {
    let input = {
      status: UNPUBLISHED_STATUS
    }
    if (status === UNPUBLISHED_STATUS) {
      input = {
        status: PUBLISHED_STATUS,
      }
    }
    updateProduct(id, input).call()
  }
  renderTableBody = () => orderBy(this.props.products, ['createdAt'], ['desc'])
    .filter(product => this.state.country === 'all' || product.country === this.state.country)
    .map(product => (
        <>
          <Table.Row minWidth={minWidth} style={{ background: '#eee' }} columnsTemplate='3fr 0.8fr 0.5fr 0.12fr 0.12fr'>
            <Table.Item style={{ background: '#eee', zIndex: 'unset', left: 100 }} position='relative'>
              {product.title} {getType(product.type)} - {currencies[get(product, 'price.currency')]} {get(product, 'price.amount')}
            </Table.Item>
            <Table.Item style={{ background: '#eee' }} position='relative'>
              Status:
              <Popconfirm
                title={`Do you want to ${get(product, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? 'unpublish' : 'publish'} this product ?`}
                onConfirm={() => this.updateStatus(get(product, 'id'), get(product, 'status'))}
                placement='topRight'
                okText='Yes'
                cancelText='Cancel'
                key='toggle'
              >
                <Tooltip title={get(product, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? ' Published ' : ' Unpublished '} >
                  <StyledSwitch
                    bgcolor={get(product, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
                    checked={get(product, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS}
                    defaultChecked={get(product, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS}
                    size='default'
                  />
                </Tooltip>
              </Popconfirm>
            </Table.Item>
            <Main.Button
              type='primary'
              icon='plus'
              style={{ marginRight: 20 }}
              onClick={() => this.openDiscountModal(product.id)}
            > ADD DISCOUNT
            </Main.Button>
            <MainTable.ActionItem.IconWrapper
              onClick={
                () => this.setState({
                  isProductModalVisible: true,
                  editProduct: true,
                  productEditing: product
                })
              }
            >
              <MainTable.ActionItem.EditIcon />
            </MainTable.ActionItem.IconWrapper>
            <Popconfirm
              onConfirm={() => {
                deleteProduct(product.id).call()
              }}
              title='Do you want to delete this product?'
              placement='right'
            >
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.DeleteIcon />
              </MainTable.ActionItem.IconWrapper>
            </Popconfirm>
          </Table.Row>
          {orderBy(get(product, 'discounts', []), ['createdAt'], ['desc']).map(discount => (
            <Table.Row columnsTemplate={columnsTemplate} minWidth={minWidth}>
              <Table.Item style={{ fontSize: 14 }}>
                {get(discount, 'code')}
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                {get(discount, 'percentage')}
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                {currencies[get(product, 'price.currency')]} {get(product, 'price.amount') - ((get(product, 'price.amount') * get(discount, 'percentage') / 100))}
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                {moment(get(discount, 'expiryDate')).format('DD-MM-YYYY')}
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                {moment(get(discount, 'createdAt')).format('DD-MM-YYYY')}
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                <MainTable.ActionItem.IconWrapper onClick={() => this.openDiscountModal(product.id, true, get(discount, 'id'))}>
                  <MainTable.ActionItem.EditIcon />
                </MainTable.ActionItem.IconWrapper>
              </Table.Item>
              <Table.Item style={{ fontSize: 14 }}>
                <MainTable.ActionItem.IconWrapper>
                  <Popconfirm
                    onConfirm={() => {
                      deleteDiscount(discount.id).call()
                    }}
                    title='Do you want to delete this discount?'
                    placement='right'
                  >
                    <MainTable.ActionItem.DeleteIcon />
                  </Popconfirm>
                </MainTable.ActionItem.IconWrapper>
              </Table.Item>
            </Table.Row>
          ))}
        </>
    ))

    closeDiscountModal = () => {
      this.setState({ isModalVisible: false })
    }

    openDiscountModal = (selectedProduct, edit = false, selectedDiscount) => {
      if (edit) {
        const product = this.props.products.find(p => {
          if (p.id === selectedProduct) {
            return p
          }
        })
        const discount = get(product, 'discounts', []).find(d => {
          if (d.id === selectedDiscount) {
            return d
          }
        })
        this.props.form.setFieldsValue({
          product: selectedProduct,
          code: get(discount, 'code'),
          discount: get(discount, 'percentage'),
          expiryDate: moment(get(discount, 'expiryDate')),
        })
        this.setState({ isModalVisible: true, selectedProduct, edit: true, expiryDate: moment(get(discount, 'expiryDate')), discountId: get(discount, 'id') })
      } else {
        this.props.form.setFieldsValue({
          product: selectedProduct,
          code: '',
          discount: '',
          expiryDate: moment(),
        })
        this.setState({ isModalVisible: true, selectedProduct, edit: false })
      }
    }

    onSave = (e) => {
      const { form } = this.props
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          if (this.state.edit) {
            this.updateDiscount(values)
          } else {
            this.addDiscount(values)
          }
        }
      })
    }

    addDiscount = (values) => {
      addDiscount({
        percentage: Number(values.discount),
        code: values.code,
        expiryDate: values.expiryDate.toDate()
      }, values.product).call()
      this.closeDiscountModal()
    }

    updateDiscount = (values) => {
      updateDiscount(this.state.discountId, {
        percentage: Number(values.discount),
        code: values.code,
        expiryDate: values.expiryDate.toDate()
      }, values.product, values.product !== this.state.selectedProduct).call()
      this.closeDiscountModal()
    }

    renderModal = () => {
      const { form } = this.props
      return (
        <>
          <MainModal
            title='Add Discount Code'
            visible={this.state.isModalVisible}
            onCancel={this.closeDiscountModal}
            width='568px'
            footer={[
              <Button onClick={this.closeDiscountModal}>CANCEL</Button>,
              <MainModal.SaveButton
                type='primary'
                htmlType='submit'
                form='product-form'
                onClick={this.onSave}
              > SAVE
              </MainModal.SaveButton>
            ]}
          >
            <Form onSubmit={this.checkValidations} id='product-form'>
              <MainModal.FormItem>
                {form.getFieldDecorator(
                ...validators.select('product', this.props.products
                ))(
                  <MainModal.Select
                    showSearch
                    placeholder='Select Product'
                    type='text'
                    width='80%'
                    value={this.state.selectedProduct}
                  >
                    {this.props.products.map(product => (
                      <MainModal.Option value={product.id}>
                        {product.title} {getType(product.type)}
                      </MainModal.Option>
                    ))}
                  </MainModal.Select>
                )}
              </MainModal.FormItem>
              <MainModal.FormItem>
                {form.getFieldDecorator(...validators.code)(
                  <MainModal.Input
                    placeholder='Code'
                    type='text'
                    autoComplete='off'
                    style={{ width: '30%', paddingBottom: 0, top: 5 }}
                  />
                        )}
              </MainModal.FormItem>
              <MainModal.FormItem>
                {form.getFieldDecorator(...validators.discount)(
                  <MainModal.Input
                    placeholder='Discount'
                    type='number'
                    min='1'
                    max='100'
                    autoComplete='off'
                    style={{ width: '30%', paddingBottom: 0, top: 5 }}
                  />
                        )}
              </MainModal.FormItem>
              <MainModal.FormItem>
                {form.getFieldDecorator(...validators.expiryDate)(
                  <DatePicker
                    placeholder='Expiry Date'
                    value={this.state.expiryDate}
                  />
                        )}
              </MainModal.FormItem>
            </Form>
          </MainModal>
        </>
      )
    }

    closeProductModal = () => {
      this.setState({ isProductModalVisible: false })
    }

    render() {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      const { productAddStatus, productAddFailure, productUpdateStatus } = this.props
      return (
        <div>
          <Main.TopContainer>
            <div style={{ flex: 1 }} />
            <Main.TopicsCount>Total Products: {this.props.products.length}</Main.TopicsCount>
            <Main.Button
              type='primary'
              icon='plus'
              style={{ marginRight: 20 }}
              onClick={() => {
                this.setState({ isProductModalVisible: true, editProduct: false })
              }}
            > ADD PRODUCT
            </Main.Button>
          </Main.TopContainer>
          <Table>
            {this.renderTableHead()}
            {this.props.fetchStatus.product && this.props.fetchStatus.product.loading ? (
              <div style={{ width: '100%', padding: '15px', textAlign: 'center' }}>
                <Spin indicator={loadingIcon} />
              </div>
              ) : (this.renderTableBody())
            }
          </Table>
          {this.renderModal()}
          <ProductModal
            productType={type}
            currencies={currencies}
            isProductModalVisible={this.state.isProductModalVisible}
            closeProductModal={this.closeProductModal}
            courses={this.props.courses}
            editProduct={this.state.editProduct}
            productEditing={this.state.productEditing}
            productAddStatus={productAddStatus}
            productAddFailure={productAddFailure}
            productUpdateStatus={productUpdateStatus}
            country={this.state.country}
          />
        </div>
      )
    }
}

export default Form.create()(Products)
