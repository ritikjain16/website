import React, { Component } from 'react'
import { get } from 'lodash'
import moment from 'moment'
import { DatePicker, Input, Modal, notification, Pagination, Button, Select, Icon, Checkbox, Tooltip } from 'antd'
import SchoolProductMappingStyle from './schoolProductMapping.style'
import SchoolProductMappingTableMain from './components/SchoolProductMappingTableMain'
import fetchExistingSchoolProduct from '../../actions/SchoolProductMapping/fetchExistingSchoolProduct'
import { oneToOne, oneToTwo, oneToThree, oneToFour, oneToFive, oneToSix, oneToSeven, oneToEight, oneToNine, oneToTen, oneToEleven, oneToTwelve } from '../../constants/modelType'
import updateSchoolProduct from '../../actions/SchoolProductMapping/updateSchoolProduct'
import fetchSchoolProductWithCount from './common-util/fetchSchoolProductWithCount'
import addDiscount from '../../actions/SchoolProductMapping/addDiscount'
import editDiscount from '../../actions/SchoolProductMapping/editDiscount'
import addSchoolProduct from '../../actions/SchoolProductMapping/addSchoolProduct'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'
import checkExistence from './common-util/checkTypeExistence'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { SCHOOL_ADMIN } from '../../constants/roles'
import fetchAllSchools from '../../actions/smsDashboard/fetchAllSchools'
import SearchBox from './components/SearchBox'
import convertModelTypeFromTextToNumber from '../../utils/convertModalTypeFromTextToNumber'

class SchoolProductMapping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      schoolId: this.props.match.params.schoolId,
      schoolsCount: null,
      existingProductData: [],
      showLoading: true,
      showExistingProductLoading: true,
      modalVisible: false,
      actionType: '',
      addProductInput: {
        title: '',
        price: '',
        currentModalType: '',
        status: UNPUBLISHED_STATUS
      },
      addProductData: {},
      editProductData: {
        title: '',
        price: '',
        modalType: '',
        id: ''
      },
      addDiscountData: {
        code: '',
        percentage: null,
        expirydate: null,
        id: ''
      },
      editDiscountData: {
        code: '',
        percentage: null,
        expirydate: null,
        id: ''
      },
      modelType: [
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
        oneToTwelve],
      searchFilterOptions: ['All', 'School name'],
      searchKey: 'All',
      searchQuery: null,
      searchValue: null,
      currentPage: 1,
      perPageQueries: 10,
      fromDate: null,
      toDate: null,
      schools: [],
      AllSchools: []
    }
  }

  componentDidMount = async () => {
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    if (savedRole === SCHOOL_ADMIN) {
      const { schools } = await fetchAllSchools(savedId, 'schoolProducts')
      this.setState({
        schools
      }, () => fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools))
    } else if (this.state.schoolId) {
      this.setState({
        searchQuery: `{id:"${this.state.schoolId}"}`
      }, () => fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate))
    } else {
      const { schools } = await fetchAllSchools(null, 'schoolProducts')
      this.setState({
        AllSchools: schools
      })
      fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate)
    }
  }
  async componentDidUpdate(prevProps) {
    const {
      fetchSchoolProductSuccess,
      fetchSchoolProductLoading,
      fetchSchoolProductFailure,
      schoolsCount,
      fetchSchoolsCountSuccess,
      existingProductData,
      fetchExistingProductSuccess,
      fetchExistingProductLoading,
      addProductSuccess,
      addProductFailure,
      addProductErrors,
      updateProductSuccess,
      updateProductFailure,
      updateProductErrors,
      deleteProductSuccess,
      deleteProductFailure,
      deleteProductErrors,
      addDiscountSuccess,
      addDiscountFailure,
      addDiscountErrors,
      updateDiscountSuccess,
      updateDiscountFailure,
      updateDiscountErrors,
      deleteDiscountSuccess,
      deleteDiscountFailure,
      deleteDiscountErrors
    } = this.props
    if (fetchSchoolProductSuccess !== prevProps.fetchSchoolProductSuccess) {
      if (fetchSchoolProductSuccess) {
        this.setState({
          showLoading: false,
        })
      }
    }
    if (fetchSchoolsCountSuccess !== prevProps.fetchSchoolsCountSuccess) {
      if (fetchSchoolsCountSuccess) {
        this.setState({
          schoolsCount: schoolsCount || null,
        })
      }
    }
    if (fetchSchoolProductLoading !== prevProps.fetchSchoolProductLoading) {
      if (fetchSchoolProductLoading) {
        this.setState({
          showLoading: true
        })
      }
    }
    if (fetchSchoolProductFailure !== prevProps.fetchSchoolProductFailure) {
      if (fetchSchoolProductFailure) {
        notification.error({
          message: 'Failed to fetch'
        })
      }
    }
    if (fetchExistingProductSuccess !== prevProps.fetchExistingProductSuccess) {
      if (fetchExistingProductSuccess) {
        this.setState({
          existingProductData: existingProductData ? existingProductData.toJS() : [],
          showExistingProductLoading: false
        })
      }
    }
    if (fetchExistingProductLoading !== prevProps.fetchExistingProductLoading) {
      if (fetchExistingProductLoading) {
        this.setState({
          showExistingProductLoading: true
        })
      }
    }
    if (addProductSuccess !== prevProps.addProductSuccess) {
      if (addProductSuccess) {
        notification.success({
          message: 'Added Product Successfully'
        })
        fetchSchoolProductWithCount({
          page: this.state.currentPage,
          perPage: this.state.perPageQueries
        }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
        this.closeModal()
      }
    }
    if (addProductFailure !== prevProps.addProductFailure) {
      if (addProductFailure) {
        const currentError = addProductErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
    if (updateProductSuccess !== prevProps.updateProductSuccess) {
      if (updateProductSuccess) {
        notification.success({
          message: 'Updated Product Successfully'
        })
        this.closeModal()
      }
    }
    if (updateProductFailure !== prevProps.updateProductFailure) {
      if (updateProductFailure) {
        const currentError = updateProductErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
    if (deleteProductSuccess !== prevProps.deleteProductSuccess) {
      if (deleteProductSuccess) {
        notification.success({
          message: 'Deleted Product Successfully'
        })
        this.closeModal()
      }
    }
    if (deleteProductFailure !== prevProps.deleteProductFailure) {
      if (deleteProductFailure) {
        const currentError = deleteProductErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
    if (addDiscountSuccess !== prevProps.addDiscountSuccess) {
      if (addDiscountSuccess) {
        notification.success({
          message: 'Added Discount Successfully '
        })
        this.closeModal()
      }
    }
    if (addDiscountFailure !== prevProps.addDiscountFailure) {
      if (addDiscountFailure) {
        const currentError = addDiscountErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
    if (updateDiscountSuccess !== prevProps.updateDiscountSuccess) {
      if (updateDiscountSuccess) {
        notification.success({
          message: 'updated Discount Successfully'
        })
        this.closeModal()
      }
    }
    if (updateDiscountFailure !== prevProps.updateDiscountFailure) {
      if (updateDiscountFailure) {
        const currentError = updateDiscountErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
    if (deleteDiscountSuccess !== prevProps.deleteDiscountSuccess) {
      if (deleteDiscountSuccess) {
        notification.success({
          message: 'Deleted Discount Successfully'
        })
        this.closeModal()
      }
    }
    if (deleteDiscountFailure !== prevProps.deleteDiscountFailure) {
      if (deleteDiscountFailure) {
        const currentError = deleteDiscountErrors.pop()
        notification.error({
          message: currentError.error.errors &&
          currentError.error.errors[0] &&
          currentError.error.errors[0].message
        })
      }
    }
  }

  closeModal = () => {
    this.setState({
      modalVisible: false,
      addProductInput: {
        title: '',
        price: '',
        currentModalType: '',
        status: UNPUBLISHED_STATUS
      },
      addDiscountData: {
        code: '',
        percentage: null,
        expirydate: null,
        id: ''
      },
    })
  }
  showModal = (actionType, data) => {
    this.setState({
      modalVisible: true,
      actionType
    })
    if (actionType === 'addproduct') {
      fetchExistingSchoolProduct()
      this.setState({
        addProductData: data
      })
    } else if (actionType === 'editproduct') {
      this.setState({
        editProductData: {
          title: get(data, 'title'),
          price: get(data, 'price.amount'),
          modalType: get(data, 'type'),
          id: get(data, 'id')
        }
      })
    } else if (actionType === 'adddiscount') {
      this.setState({
        addDiscountData: {
          ...this.state.addDiscountData,
          id: get(data, 'id')
        }
      })
    } else if (actionType === 'editdiscount') {
      this.setState({
        editDiscountData: {
          code: get(data, 'code'),
          percentage: get(data, 'percentage'),
          expirydate: get(data, 'expiryDate'),
          id: get(data, 'id')
        }
      })
    }
  }
  handleSearchSubmit = () => {
    const { searchValue, searchKey } = this.state
    if (searchKey === 'School name') {
      if (searchValue) {
        this.setState({
          searchQuery: `
          {id:"${searchValue}"}
          `
        },
        () => {
          this.props.history.push(`/sms/schoolProductMapping/${searchValue}`)
          fetchSchoolProductWithCount({
            page: this.state.currentPage,
            perPage: this.state.perPageQueries
          }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
        })
      }
    }
  }
  handleEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      const { searchValue, searchKey } = this.state
      if (searchKey === 'School name') {
        this.setState({
          searchQuery: `
          {id:"${searchValue}"}  
          `
        },
        () => fetchSchoolProductWithCount({
          page: this.state.currentPage,
          perPage: this.state.perPageQueries
        }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
        )
      }
    }
  }
  onPageChange = (page) => {
    this.setState({
      currentPage: page
    },
    () => fetchSchoolProductWithCount({
      page: this.state.currentPage,
      perPage: this.state.perPageQueries
    }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
    )
  }
  handleDateFilter = (value, type) => {
    if (type === 'from') {
      this.setState({
        fromDate: new Date(value),
        currentPage: 1
      },
      () => fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
      )
    } else if (type === 'to') {
      this.setState({
        toDate: new Date(value),
      },
      () => fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
      )
    }
  }
  handleClearFilter = () => {
    if (this.state.searchValue) {
      this.props.history.push('/sms/schoolProductMapping')
    }
    this.setState({
      searchQuery: null,
      searchValue: null,
      currentPage: 1,
      perPageQueries: 10,
      fromDate: null,
      toDate: null,
      searchKey: 'All',
      schoolId: ''
    },
    () => fetchSchoolProductWithCount({
      page: this.state.currentPage,
      perPage: this.state.perPageQueries
    }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
    )
  }
  handleExistingProductChange = (checked, productData, sts) => {
    const { id, title, price, type, status } = productData
    if (sts) {
      this.setState(prevState => ({
        existingProductData:
          prevState.existingProductData.map(data =>
            data.id === id ? Object.assign(data, {
              title,
              price: {
                amount: price.amount,
                currency: 'RS'
              },
              type,
              status: productData.status === PUBLISHED_STATUS ?
                UNPUBLISHED_STATUS : PUBLISHED_STATUS
            })
              : data
          )
      })
      )
    } else {
      this.setState(prevState => ({
        existingProductData:
          prevState.existingProductData.map(data =>
            data.id === id ? Object.assign(data, {
              title,
              price: {
                amount: price.amount,
                currency: 'RS'
              },
              type,
              checked,
              status
            })
              : data
          )
      })
      )
    }
  }

  handleModalTypeChange = (value) => {
    this.setState({
      addProductInput: {
        ...this.state.addProductInput,
        currentModalType: value
      }
    })
  }
  handleAddDiscountExpiryDate = (value) => {
    this.setState({
      addDiscountData: {
        ...this.state.addDiscountData,
        expirydate: new Date(value)
      }
    })
  }

  handleEditDiscountExpiryDate = (value) => {
    this.setState({
      editDiscountData: {
        ...this.state.editDiscountData,
        expirydate: new Date(value)
      }
    })
  }
  handleSearchKeyChange = (value) => {
    if (this.state.searchValue) {
      this.props.history.push('/sms/schoolProductMapping')
    }
    if (value === 'All') {
      this.setState({
        searchQuery: null,
        searchValue: '',
        searchKey: value,
        fromDate: null,
        toDate: null,
        schoolId: ''
      },
      () => fetchSchoolProductWithCount({
        page: this.state.currentPage,
        perPage: this.state.perPageQueries
      }, this.state.searchQuery, this.state.fromDate, this.state.toDate, this.state.schools)
      )
    }
    this.setState({
      searchKey: value
    })
  }

  renderModalContent = () => {
    const { actionType, existingProductData, } = this.state

    if (actionType === 'addproduct') {
      const { Option } = Select
      const { title, price, currentModalType } = this.state.addProductInput
      const { showExistingProductLoading } = this.state
      return (
        <div>
          {
            showExistingProductLoading ? (
              <div
                style={{
                display: 'grid',
                placeItems: 'center'
              }}
              >
                <Icon type='loading'
                  style={{
                  fontSize: '30px', }}
                />
                <h5>Please wait loading Existing Products</h5>
              </div>
            )
            :

              existingProductData.map(productData => (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Checkbox
                        onChange={(e) => {
                          this.handleExistingProductChange(e.target.checked, productData)
                        }}
                        checked={productData.checked ? productData.checked : false}
                      />
                    </div>
                    <p>{productData.title}</p>
                    <p>{productData.price.amount} {productData.price.currency}</p>
                    <p>{convertModelTypeFromTextToNumber(productData.type)}</p>
                    <div>
                      <Tooltip title={`Status: ${productData.status}`}>
                        <SchoolProductMappingStyle.StyledSwitch
                          bgcolor={get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
                          onChange={(checked) =>
                          this.handleExistingProductChange(checked, productData, 'status')}
                          checked={productData.status === PUBLISHED_STATUS}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))

          }
          <div
            style={{
              border: '2px solid lightgray',
              padding: '20px',
              borderRadius: '10px',
              margin: '15px'
            }}
          >
            <div>
              Select new Product
            </div>
            <div >
              <form onSubmit={(e) => this.handleSubmit(e)} >
                <div
                  style={{
                  display: 'flex',
                  rowGap: '15px',
                  flexDirection: 'column'
                }}
                >
                  <div>
                    <h5>Title</h5>
                    <Input
                      placeholder='Title'
                      required
                      value={title}
                      onChange={(e) =>
                    this.setState({
                      addProductInput: { ...this.state.addProductInput, title: e.target.value } })}
                    />
                  </div>
                  <div>
                    <h5>Price</h5>
                    <Input
                      placeholder='Price'
                      required
                      type='number'
                      value={price}
                      onChange={(e) =>
                    this.setState({
                      addProductInput: { ...this.state.addProductInput, price: e.target.value } })}
                    />
                  </div>
                  <div>
                    <h5>Model type</h5>
                    <Select
                      placeholder='Select a  modal type'
                      value={currentModalType}
                      onChange={this.handleModalTypeChange}
                    >
                      {
                    this.state.modelType.map(type => (
                      <Option key={type} >{convertModelTypeFromTextToNumber(type) }</Option>
                    ))
                  }
                    </Select>
                  </div>
                </div>
                <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10px 5px'
              }}
                >
                  <Button htmlType='submit' >Select new Product</Button>
                </div>

              </form>
            </div>
          </div>
          <div
            style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '15px 5px'
          }}
          >
            <Button type='primary' onClick={this.handleAddProductConfirm} >{this.getModalbtnText()}</Button>
          </div>
        </div>
      )
    } else if (actionType === 'editproduct') {
      const { Option } = Select
      const { title, price, modalType } = this.state.editProductData
      return (
        <div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div
              style={{
              display: 'flex',
              rowGap: '15px',
              flexDirection: 'column'
            }}
            >
              <Input
                value={title}
                placeholder='Title'
                onChange={(e) =>
                this.setState({
                  editProductData: { ...this.state.editProductData, title: e.target.value } })}
              />
              <Input
                value={price}
                placeholder='Price'
                onChange={(e) =>
                this.setState({
                  editProductData: { ...this.state.editProductData, price: e.target.value } })}
              />
              <Select
                value={modalType}
              // label={type}
                onChange={(value) => {
                this.setState({
                  editProductData: { ...this.state.editProductData, modalType: value } })
              }}
              >
                {
              this.state.modelType.map(modaltype => (
                <Option key={modaltype} >{modaltype}</Option>
              ))
            }
              </Select>
            </div>

            <div
              style={{
               display: 'flex',
               justifyContent: 'flex-end',
              margin: '10px 5px'
           }}
            >
              <Button htmlType='submit' type='primary' >{this.getModalbtnText()}</Button>
            </div>

          </form>
        </div>
      )
    } else if (actionType === 'adddiscount') {
      const { expirydate } = this.state.addDiscountData
      return (
        <div>
          <form onSubmit={(e) => this.handleSubmit(e)} >
            <div
              style={{
              display: 'flex',
              rowGap: '15px',
              flexDirection: 'column'
            }}
            >
              <div>
                <h3>Code</h3>
                <Input
                  placeholder='Type code'
                  type='text'
                  required
                  onChange={(e) =>
                this.setState({
                  addDiscountData: { ...this.state.addDiscountData, code: e.target.value } })
              }
                />
              </div>
              <div>
                <h3>Percantage</h3>
                <Input
                  placeholder='Type percentage'
                  type='number'
                  min='0'
                  max='100'
                  required
                  onChange={(e) =>
                this.setState({
                  addDiscountData: { ...this.state.addDiscountData, percentage: e.target.value } })
              }
                />
              </div>
              <div>
                <h3>Expiry Date</h3>
                <DatePicker
              // required
                  isClearable
                  allowClear
                  dateRender={current => {
                const currentDate = new Date().setHours(0, 0, 0, 0)
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
                  value={expirydate !== null ? moment(expirydate) : undefined}
                  onChange={(value) => this.handleAddDiscountExpiryDate(value)}
                />
              </div>

            </div>
            <div
              style={{
               display: 'flex',
               justifyContent: 'flex-end',
              margin: '10px 5px'
           }}
            >
              <Button htmlType='submit' type='primary' >{this.getModalbtnText()}</Button>
            </div>
          </form>
        </div>
      )
    } else if (actionType === 'editdiscount') {
      const { code, percentage, expirydate
      } = this.state.editDiscountData
      return (
        <div>
          <form onSubmit={(e) => this.handleSubmit(e)} >
            <div
              style={{
              display: 'flex',
              rowGap: '15px',
              flexDirection: 'column'
            }}
            >
              <Input
                value={code}
                onChange={(e) => this.setState({
                editDiscountData: { ...this.state.editDiscountData, code: e.target.value }
              })}
              />
              <Input
                value={percentage}
                onChange={(e) => this.setState({
                editDiscountData: { ...this.state.editDiscountData, percentage: e.target.value }
              })}
              />
              <DatePicker
                value={expirydate !== null ? moment(expirydate) : undefined}
                onChange={(value) => this.handleEditDiscountExpiryDate(value)}
              />
            </div>

            <div
              style={{
               display: 'flex',
               justifyContent: 'flex-end',
              margin: '10px 5px'
           }}
            >
              <Button htmlType='submit' type='primary' >{this.getModalbtnText()}</Button>
            </div>

          </form>
        </div>
      )
    }
  }
  handleAddProductConfirm = () => {
    const { existingProductData, addProductData } = this.state
    const { id, addedProduct } = addProductData
    const checkedProduct = existingProductData.filter(data => data.checked)
    if (checkedProduct.length !== 0) {
      if (checkExistence(addedProduct, checkedProduct)) {
        let addSchoolProductQuery = ''
        let querycount = 0
        checkedProduct.forEach(data => {
          querycount += 1
          addSchoolProductQuery += `
          
            addProduct_${querycount}: addProduct (input: {
      title:"${data.title}",
              price:{
                amount:${data.price.amount},
                currency:"${data.price.currency}"
              },
              country:india,
              targetUserType:b2b2c,
              status:${data.status},
              type:${data.type}
            },
              courseConnectId: "cjs8skrd200041huzz78kncz5"
              schoolConnectId:"${id}"
            ) {
              id
              course {
                id
                title
              }
              title
              description
              price {
                amount
                currency
              }
              status
              type
              userRole
              createdAt
              discounts {
                id
                isDefault
                percentage
                expiryDate
                createdAt
                code
              }
              country
            }
          
          `
        })

        addSchoolProduct(addSchoolProductQuery)
      }
    } else {
      notification.error({
        message: 'Pleease select a product'
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { actionType,
    } = this.state
    if (actionType === 'addproduct') {
      if (this.state.addProductInput.currentModalType === '') {
        notification.error({
          message: 'please select a model type'
        })
      } else {
        const {
          addProductInput,
          existingProductData
        } = this.state


        const { title, price, currentModalType, status } = addProductInput

        this.setState({
          existingProductData: [...existingProductData, {
            id: existingProductData.length + 1,
            title,
            price: {
              amount: price,
              currency: 'RS'
            },
            type: currentModalType,
            checked: true,
            status
          }],
          addProductInput: {
            title: '',
            price: '',
            currentModalType: '',
            status: UNPUBLISHED_STATUS
          }
        })
      }
    } else if (actionType === 'editproduct') {
      const {
        editProductData
      } = this.state

      const { title, price, modalType, id } = editProductData
      const editProductInput = {
        title,
        price: {
          amount: parseFloat(price)
        },
        type: modalType
      }
      updateSchoolProduct(editProductInput, id)
    } else if (actionType === 'adddiscount') {
      const { addDiscountData } = this.state

      const { code, percentage, expirydate, id } = addDiscountData
      const addDiscountInput = {
        code,
        percentage: parseFloat(percentage),
        expiryDate: expirydate,
        isDefault: false
      }

      addDiscount(addDiscountInput, id)
    } else if (actionType === 'editdiscount') {
      const { code, percentage, expirydate, id } = this.state.editDiscountData
      const editDiscountInput = {
        code,
        percentage: parseFloat(percentage),
        expiryDate: expirydate
      }

      editDiscount(editDiscountInput, id)
    }
  }
  getModalbtnText =() => {
    const {
      addProductLoading,
      updateProductLoading,
      addDiscountLoading,
      updateDiscountLoading,

    } = this.props
    const {
      actionType
    } = this.state
    if (actionType === 'addproduct') {
      if (addProductLoading) {
        return 'Adding... Products'
      }
      return 'Add Products'
    } else if (actionType === 'editproduct') {
      if (updateProductLoading) {
        return 'Updating.. Product'
      }
      return 'Update Product'
    } else if (actionType === 'adddiscount') {
      if (addDiscountLoading) {
        return 'Adding.. Discount'
      }
      return 'Add Discount'
    } else if (actionType === 'editdiscount') {
      if (updateDiscountLoading) {
        return 'Updating... Discount'
      }
      return 'Update Discount'
    }
  }
  getModalTitle = () => {
    const { actionType, addProductData } = this.state
    if (actionType === 'addproduct') {
      return `Add Product: ${get(addProductData, 'name', '')}`
    } else if (actionType === 'editproduct') {
      return 'Update Product'
    } else if (actionType === 'adddiscount') {
      return 'Add Discount'
    } else if (actionType === 'editdiscount') {
      return 'Update Discount'
    }
  }

  render() {
    const {
      showLoading,
      schoolsCount,
      modalVisible,
      fromDate,
      toDate,
      searchFilterOptions,
      searchKey,
      schoolId,
      schools,
      AllSchools
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const { Option } = Select
    return (
      <SchoolProductMappingStyle>
        <Modal
          title={this.getModalTitle()}
          visible={modalVisible}
          onCancel={this.closeModal}
          destroyOnClose='true'
          footer={null}
          width={700}
        >
          {this.renderModalContent()}
        </Modal>
        {
          !schoolId && (
            <SchoolProductMappingStyle.SecondNavWrapper>

              <div style={{ display: 'flex', alignItems: 'center' }}>

                <Select
                  style={{ minWidth: '200px' }}
                  value={searchKey}
                  onChange={this.handleSearchKeyChange}
                >
                  {
    searchFilterOptions.map(option => (
      <Option key={option}>{option}</Option>
    ))
    }
                </Select>
                {
                  searchKey !== 'All' && (
                    <SearchBox
                      datasArray={savedRole === SCHOOL_ADMIN ? schools : AllSchools}
                      onChange={(value) => this.setState({ searchValue: value })}
                      handleValueSelect={(value) => this.setState({ searchValue: value },
                        () => this.handleSearchSubmit())}
                      onKeyPress={(e) => this.handleEnterSubmit(e)}
                      onClick={this.handleSearchSubmit}
                      placeholder='Search School'
                    />
                  )
                }

              </div>
              {
                schoolsCount > 10 && (
                  <Pagination
                    total={schoolsCount}
                    onChange={this.onPageChange}
                    defaultPageSize={this.state.perPageQueries}
                  />
                )
              }

              <div>
                <DatePicker
                  placeholder='Select Start Date'
                  isClearable
                  allowClear
                  dateRender={current => {
                  const currentDate = new Date().setHours(0, 0, 0, 0)
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
                  value={fromDate !== null ? moment(fromDate) : undefined}
                  onChange={(value) => this.handleDateFilter(value, 'from')}
                />
                <DatePicker
                  placeholder='Select To Date'
                  isClearable
                  allowClear
                  dateRender={current => {
                  const currentDate = new Date().setHours(0, 0, 0, 0)
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
                  value={toDate !== null ? moment(toDate) : undefined}
                  onChange={(value) => this.handleDateFilter(value, 'to')}
                />
              </div>

            </SchoolProductMappingStyle.SecondNavWrapper>
          )
        }
        {
          !schoolId && (
            <div
              style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '10px'
            }}
            >
              <Button onClick={this.handleClearFilter} type='primary' >Clear Filter</Button>
            </div>
          )
        }
        <SchoolProductMappingTableMain
          schoolData={this.props.schoolData && this.props.schoolData.toJS()}
          schoolProductData={this.props.schoolProductData && this.props.schoolProductData.toJS()}
          schoolDiscountsData={this.props.schoolDiscountsData
            && this.props.schoolDiscountsData.toJS()}
          showLoading={showLoading}
          showModal={this.showModal}
          schoolsCount={schoolsCount}
        />
      </SchoolProductMappingStyle>
    )
  }
}


export default SchoolProductMapping
