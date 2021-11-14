import { Button, Icon, Popconfirm, Collapse, Tooltip } from 'antd'
import React, { useState } from 'react'
import moment from 'moment'
import { get, orderBy } from 'lodash'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
import formatNumber from '../common-util/formatNumber'
import updateIsDefault from '../../../actions/SchoolProductMapping/updateIsDefault'
import SchoolProductMappingStyle from '../schoolProductMapping.style'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import updateSchoolProduct from '../../../actions/SchoolProductMapping/updateSchoolProduct'
import deleteSchoolProduct from '../../../actions/SchoolProductMapping/deleteSchoolProduct'
import deleteDiscount from '../../../actions/SchoolProductMapping/deleteDiscount'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { SCHOOL_ADMIN } from '../../../constants/roles'
import convertModelTypeFromTextToNumber from '../../../utils/convertModalTypeFromTextToNumber'
/* eslint-disable */
const SchoolProductMappingRow = (props) => {
  const [isDefaultChecked, setIsDefaultChecked] = useState(false)
  const [discountId, setDiscountId] = useState('')
  const {
    columnsTemplate,
    minWidth,
    showModal,
    data,
    schoolProductData,
    schoolDiscountsData,
    i
  } = props
  const notSchoolAdmin = getDataFromLocalStorage('login.role') !== SCHOOL_ADMIN
  const productLength = schoolProductData.filter(d => data.id === d.school.id)
  const confirm = () => {
    updateIsDefault(discountId, {
      isDefault: isDefaultChecked
    })
  }
  const cancel = () => {

  }
  const handleIsDefaultChange = (checked, discountID) => {
    setIsDefaultChecked(checked)
    setDiscountId(discountID)
  }
  const updateStatus = (id, status) => {
    let input = {
      status: UNPUBLISHED_STATUS
    }
    if (status === UNPUBLISHED_STATUS) {
      input = {
        status: PUBLISHED_STATUS,
      }
    }
    updateSchoolProduct(input, id)
  }
  const { Panel } = Collapse
  return (
    <div>
      <Collapse accordion defaultActiveKey={i === 0 ? data.id : ''}>
        <Panel
          header={(
            <div
              style={{
                display: 'flex',
                backgroundColor: '#2f8cff',
                opacity: '0.8',
                justifyContent: 'space-between',
                margin: '10px 0px',
                padding: '5px',
                color: 'black'
              }}
            >
              <div />
              <h3
                style={{
                color: '#111827',
                marginLeft: '260px'
              }}
              >
                {data.name ? data.name : '-'}

              </h3>
              <div
                style={{
                display: 'flex'
                }}
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <h3>Total products:{productLength.length} </h3>
                &nbsp;
                {
                  notSchoolAdmin && (
                     <Button
                        style={{
                          backgroundColor: '#f9c235'
                        }}
                        onClick={() => showModal('addproduct', { ...data, addedProduct: schoolProductData.filter((d => d.school.id === data.id)) })}
                      >
                        <Icon type='plus' /> Add New Product
                      </Button>
                  )
                }
              </div>
            </div>
          )}
          key={data.id}
        >
          {
            productLength.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div
                style={{
                display: 'flex',
                      backgroundColor: '#BFDBFE',
                      // opacity: '0.9',
                      justifyContent: 'center',
                      margin: '10px 0px',
                      padding: '5px',
                      color: 'tomato',
                      width: '95%'
              }}
              >
                <h3>No products found</h3>
              </div>
            </div>
            )
          }
          {orderBy(schoolProductData, ['createdAt'], ['desc']).map(productData => (data.id === productData.school.id &&
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div
              style={{ display: 'flex',
            backgroundColor: '#BFDBFE',
            justifyContent: 'space-between',
            padding: '5px',
            color: 'tomato',
            marginTop: '10px',
            marginBottom: '10px',
            width: '95%'
             }}
            >
              <div />
              <h3
                style={{
                marginLeft: '260px'
              }}
              >
                {productData.title}
                &nbsp;
                {convertModelTypeFromTextToNumber(productData.type)}
                &nbsp;&nbsp;
                ({productData.price.currency} { formatNumber(productData.price.amount) })
              </h3>
              <div style={{ color: 'black' }}>
              Status:
              <Popconfirm
                title={`Do you want to ${get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? 'unpublish' : 'publish'} this product ?`}
                onConfirm={() => updateStatus(get(productData, 'id'), get(productData, 'status'))}
                placement='topRight'
                disabled={!notSchoolAdmin}
                okText='Yes'
                cancelText='Cancel'
                key='toggle'
              >
                <Tooltip title={get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? ' Published ' : ' Unpublished '} >
                  <SchoolProductMappingStyle.StyledSwitch
                    bgcolor={get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
                    checked={get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS}
                    defaultChecked={get(productData, 'status', UNPUBLISHED_STATUS) === PUBLISHED_STATUS}
                    size='default'
                  />
                </Tooltip>
              </Popconfirm>
              </div>
                {
                  notSchoolAdmin && (
                    <div>
                      <Button onClick={() => showModal('editproduct', productData)} >
                        <Icon type='edit' style={{ color: 'blue' }} />
                      </Button>
                      <Popconfirm
                        title={'Do you want to delete this product ?'}
                        onConfirm={() => deleteSchoolProduct(get(productData, 'id'))}
                        placement='topRight'
                        okText='Yes'
                        cancelText='Cancel'
                        key='toggle'
                      >
                        <Button type='danger' style={{ marginLeft: '10px' }} >
                          <Icon type='delete' />
                        </Button>
                      </Popconfirm>
                      <Button productLength
                        style={{
                  backgroundColor: '#f9c235',
                  opacity: '1',
                  marginLeft: '10px'
                }}
                        onClick={() => showModal('adddiscount', productData)}
                      >Add Discounts
                      </Button>

                    </div>
                  )
                }
            </div>
          </div>
          <br />
          <div
            style={{ display: 'flex',
            flexDirection: 'column',
           justifyContent: 'center',
           color: 'black'
            }}
          >

              {
    orderBy(schoolDiscountsData, ['createdAt'], ['desc']).map(discountData => (
    productData.id === discountData.product.id && (
    <MainTable.Row
      columnsTemplate={columnsTemplate}
      minWidth={minWidth}
      style={{
        margin: '10px 0px',
          padding: '10px',
          backgroundColor: 'rgba(228, 228, 228, 0.35)',
          border: '2px solid rgba(228, 228, 228, 0.35)',
      }}
    >
      <Table.Item>
        <MainTable.Item>
          {productData.price.currency} { formatNumber(productData.price.amount) }
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          { formatNumber(productData.price.amount * (discountData.percentage / 100)) }

        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          {
          formatNumber(
            productData.price.amount - (productData.price.amount * (discountData.percentage / 100))
            )
          }

        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          {
          discountData.code
          }

        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          {
             moment(discountData.expiryDate).format('DD-MM-YYYY')
          }

        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>

          {
          moment(discountData.createdAt).format('DD-MM-YYYY')
        }
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        {
          notSchoolAdmin && (
            <>
              <MainTable.ActionItem.IconWrapper >
                <MainTable.ActionItem.EditIcon style={{ marginRight: '15px' }}
                  onClick={() => showModal('editdiscount', discountData)
              } />
              </MainTable.ActionItem.IconWrapper>
              <Popconfirm
                title={'Do you want to delete this discount ?'}
                onConfirm={() => deleteDiscount(get(discountData, 'id'))}
                placement='topRight'
                okText='Yes'
                cancelText='Cancel'
                key='toggle'
              >
                <MainTable.ActionItem.IconWrapper >
                  <MainTable.ActionItem.DeleteIcon />
                </MainTable.ActionItem.IconWrapper>
              </Popconfirm>
            </>      
          ) 
        }
        <MainTable.Item
          style={{
          marginLeft: '15px',
          alignItems: 'center',
          padding: 0
        }}
        >

          <Popconfirm
            title={`Are you sure you want to make isDefault to ${isDefaultChecked}`}
            okText='Yes'
            cancelText='No'
            onConfirm={confirm}
            onCancel={cancel}
            disabled={!notSchoolAdmin}
          >
            <SchoolProductMappingStyle.StyledSwitch
              bgcolor={discountData.isDefault ? '#64da7a' : '#ff5744'}
              onChange={(checked) => handleIsDefaultChange(checked, discountData.id)}
              checked={discountData.isDefault}
            />
          </Popconfirm>

          &nbsp; <h3 style={{ margin: 0 }} >isDefault</h3>

        </MainTable.Item>
      </Table.Item>

    </MainTable.Row>

    )
  ))
}

          </div>

        </div>

        )

        )
      }
        </Panel>
      </Collapse>
    </div>

  )
}

export default SchoolProductMappingRow
