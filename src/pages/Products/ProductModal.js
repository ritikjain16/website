import React from 'react'
import { Button, Form, notification, Radio, Select, Tooltip } from 'antd'
import { get } from 'lodash'
import RadioGroup from 'antd/lib/radio/group'
import MainModal from '../../components/MainModal'
import validators from '../../utils/formValidators'
import addProduct from '../../actions/products/addProduct'
import updateProduct from '../../actions/products/updateProduct'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'
import StyledSwitch from './Product.style'
import ProductInput from './ProductInput'

class ProductModal extends React.Component {
  state = {
    type: 'oneToOne',
    currency: 'RS',
    courseUpdated: false,
    status: UNPUBLISHED_STATUS,
    showOnWebsite: false,
    features: [{ statement: '' }]
  }

  componentDidUpdate(prevProps) {
    const { productAddStatus, productAddFailure, productUpdateStatus } = this.props
    if (prevProps.isProductModalVisible === false && this.props.isProductModalVisible === true) {
      this.setState({ courseUpdated: false, features: [{ statement: '' }] })
      if (this.props.editProduct) {
        this.props.form.setFieldsValue({
          course: get(this.props.productEditing, 'course.id'),
          title: get(this.props.productEditing, 'title'),
          price: get(this.props.productEditing, 'price.amount'),
        })
        this.setState({
          type: get(this.props.productEditing, 'type'),
          currency: get(this.props.productEditing, 'price.currency'),
          status: get(this.props.productEditing, 'status'),
          showOnWebsite: get(this.props.productEditing, 'showOnWebsite', false),
          features: get(this.props.productEditing, 'features') || []
        })
      } else {
        this.props.form.setFieldsValue({
          course: get(this.props.courses, '[0].id'),
          title: '',
          price: '',
        })
        this.setState({
          type: 'oneToOne',
          currency: localStorage.getItem('country') === 'india' ? 'RS' : 'USD',
          status: UNPUBLISHED_STATUS
        })
      }
    }
    if (productAddStatus && !get(productAddStatus.toJS(), 'loading')
      && get(productAddStatus.toJS(), 'success') &&
      (prevProps.productAddStatus !== productAddStatus)) {
      notification.success({
        message: 'Product added successfully'
      })
      this.props.closeProductModal()
    } else if (productAddStatus && !get(productAddStatus.toJS(), 'loading')
      && get(productAddStatus.toJS(), 'failure') &&
      (prevProps.productAddFailure !== productAddFailure)) {
      if (productAddFailure && productAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(productAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (productUpdateStatus && !get(productUpdateStatus.toJS(), 'loading')
      && get(productUpdateStatus.toJS(), 'success') &&
      (prevProps.productUpdateStatus !== productUpdateStatus) && this.props.editProduct) {
      this.props.closeProductModal()
    }
  }

  onSaveProduct = (e) => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        if (this.props.editProduct) {
          this.updateProduct(values)
        } else {
          this.addProduct(values)
        }
      }
    })
  }

  addProduct = (values) => {
    const { features } = this.state
    const { country } = this.props
    const featuresList = []
    features.forEach((feature, index) => {
      if (feature.statement) {
        featuresList.push({ statement: feature.statement, order: index + 1 })
      }
    })

    const addInput = {
      title: values.title,
      price: {
        amount: Number(values.price),
        currency: this.state.currency
      },
      status: this.state.status,
      type: this.state.type,
      targetUserType: 'b2c',
      showOnWebsite: this.state.showOnWebsite,
      features: featuresList
    }
    if (country && country !== 'all') {
      addInput.country = country
    } else {
      addInput.country = 'india'
    }
    addProduct(addInput, values.course).call()
  }

  updateProduct = (values) => {
    const { features } = this.state
    const { country } = this.props
    const featuresList = []
    features.forEach((feature, index) => {
      if (feature.statement) {
        featuresList.push({ statement: feature.statement, order: index + 1 })
      }
    })
    const updateInput = {
      title: values.title,
      price: {
        amount: Number(values.price),
        currency: this.state.currency
      },
      status: this.state.status,
      type: this.state.type,
      targetUserType: 'b2c',
      showOnWebsite: this.state.showOnWebsite,
      features: {
        replace: featuresList
      }
    }
    if (country && country !== 'all') {
      updateInput.country = country
    } else {
      updateInput.country = 'india'
    }
    updateProduct(get(this.props.productEditing, 'id'),
      updateInput, this.state.courseUpdated ? values.course : null).call()
  }

  addNewFeature = () => {
    const { features } = this.state
    const newFeatures = [...features, { statement: '' }]
    this.setState({
      features: newFeatures
    })
  }
  removeFeature = (index) => {
    const { features } = this.state
    this.setState({
      features: features.filter((f, fInd) => fInd !== index)
    })
  }

  setFeatureValue = (value, index) => {
    const { features } = this.state
    const newFeatures = [...features]
    /* eslint-disable dot-notation */
    newFeatures[index]['statement'] = value
    this.setState({
      features: newFeatures
    })
  }
  renderProductModal = () => {
    const { Option } = Select
    const { form } = this.props
    const { showOnWebsite, features, status } = this.state
    return (
      <>
        <MainModal
          title={this.props.editProduct ? 'Edit Product' : 'Add Product'}
          visible={this.props.isProductModalVisible}
          onCancel={this.props.closeProductModal}
          width='568px'
          footer={[
            <Button onClick={this.props.closeProductModal}>CANCEL</Button>,
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              form='product-form'
              onClick={this.onSaveProduct}
            > SAVE
            </MainModal.SaveButton>
          ]}
        >
          <Form onSubmit={this.checkValidations} id='product-form-add'>
            <MainModal.FormItem>
              {form.getFieldDecorator(
                ...validators.select('course', this.props.courses
              ))(
                <MainModal.Select
                  showSearch
                  placeholder='Select Course'
                  type='text'
                  width='80%'
                  onChange={() => {
                    this.setState({ courseUpdated: true })
                  }}
                >
                  {this.props.courses.map(course => (
                    <MainModal.Option value={course.id}>
                      {course.title}
                    </MainModal.Option>
                  ))}
                </MainModal.Select>
              )}
            </MainModal.FormItem>
            <MainModal.FormItem>
              {form.getFieldDecorator(...validators.title)(
                <MainModal.Input
                  placeholder='Product Title'
                  type='text'
                  autoComplete='off'
                  style={{ width: '80%', paddingBottom: 0, top: 5 }}
                />
              )}
            </MainModal.FormItem>
            <MainModal.FormItem>
              {form.getFieldDecorator(...validators.price)(
                <MainModal.Input
                  placeholder='Price'
                  type='number'
                  min='1'
                  autoComplete='off'
                  style={{ width: '30%', paddingBottom: 0, marginRight: '10px' }}
                />
              )}
              <Select
                defaultValue='RS'
                className='select-before'
                value={this.state.currency}
                style={{ width: 50 }}
                onChange={currencyValue => {
                    this.setState({ currency: currencyValue })
                }}
              >
                {Object.keys(this.props.currencies).map(currency => (
                  <Option value={currency}>{this.props.currencies[currency]}</Option>
                ))}
              </Select>
            </MainModal.FormItem>
            <MainModal.FormItem>
              <Radio.Group
                defaultValue='oneToOne'
                buttonStyle='solid'
                name='type'
                value={this.state.type}
                onChange={e => {
                  this.setState({
                    type: e.target.value
                  })
                }}
              >
                {Object.keys(this.props.productType).map(type => (
                  <Radio.Button value={type} key={type}>
                    {this.props.productType[type]}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </MainModal.FormItem>
            <div style={{ display: 'flex' }} >
              <h3>Status : </h3>
              <StyledSwitch
                bgcolor={status === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
                checked={status === PUBLISHED_STATUS}
                onChange={() =>
                  this.setState({
                    status: this.state.status === PUBLISHED_STATUS
                      ? UNPUBLISHED_STATUS : PUBLISHED_STATUS
                  })}
                size='default'
              />
            </div>
            <div>
              <h3>Features: </h3>
              {
                features.map((feature, index) => (
                  <ProductInput
                    value={feature.statement}
                    onChange={({ target: { value } }) =>
                      this.setFeatureValue(value, index)}
                    deleteField={() => this.removeFeature(index)}
                  />
                ))
              }
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title='Add new Feature'>
                <Button
                  type='primary'
                  icon='plus'
                  onClick={this.addNewFeature}
                />
              </Tooltip>
            </div>
            <div>
              <h3>Show on Website: </h3>
              <RadioGroup
                name='isTrial'
                buttonStyle='solid'
                value={showOnWebsite}
                onChange={({ target: { value } }) => this.setState({ showOnWebsite: value })}
              >
                <MainModal.StyledRadio value>Yes</MainModal.StyledRadio>
                <MainModal.StyledRadio value={false}>No</MainModal.StyledRadio>
              </RadioGroup>
            </div>
          </Form>
        </MainModal>
      </>
    )
  }

  render() {
    return this.renderProductModal()
  }
}

export default Form.create()(ProductModal)
