/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import { Button, Popconfirm, Table as AntTable } from 'antd'
import { Link } from 'react-router-dom'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
import deleteSchool from '../../../actions/SchoolOverviewTable/deleteSchool'
import addSchoolAdmin from '../../../actions/SchoolOverviewTable/addSchoolAdmin'
import updateSchoolAdmin from '../../../actions/SchoolOverviewTable/updateSchoolAdmin'
import deleteSchoolAdmin from '../../../actions/SchoolOverviewTable/deleteSchoolAdmin'
import SchoolOverviewTableStyle from '../SchoolOverviewTable.style'
import SchoolAdminModal from './SchoolAdmin/SchoolAdminModal'
import { SCHOOL_ADMIN } from '../../../constants/roles'
import getFullPath from '../../../utils/getFullPath'


const SchoolOverviewTableRow = (props) => {
  const { columnsTemplate, minWidth, index, data, showModal } = props
  const [showPopup, setShowPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeKey, setActiveKey] = useState(index === 0 ? get(data, 'id', '') : '')
  const [admins, setAdmins] = useState(get(data, 'admins', []))
  const [columns, setColumns] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [operation, setOperation] = useState('')
  const [editData, setEditData] = useState(null)

  const onAddAdmin = () => {
    setOpenModal(true)
    setOperation('add')
  }
  const onEditAdmin = (userData) => {
    setOperation('edit')
    setOpenModal(true)
    setEditData(userData)
  }

  const closeModal = () => {
    setOperation('')
    setOpenModal(false)
    setEditData(null)
  }

  const onDeleteAdmin = (id) => {
    deleteSchoolAdmin(id).then(res => {
      if (res && res.deleteUser && res.deleteUser.id) {
        const newAdmins = [...admins].filter(admin => get(admin, 'id') !== get(res.deleteUser, 'id'))
        setAdmins([...newAdmins])
      }
    })
  }

  const setAdmin = () => {
    if (data && get(data, 'admins') || admins && admins.length > 0) {
      const newColumn = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          align: 'center',
        },
        {
          title: 'Phone No.',
          dataIndex: 'phone',
          key: 'phone',
          align: 'center',
          render: (phone) => get(phone, 'countryCode', '') + get(phone, 'number')
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          render: (createdAt) => moment(createdAt).format('MM-DD-YY')
        },
        {
          title: 'Action',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          render: (id, record) => (
            <>
              <MainTable.ActionItem.IconWrapper style={{ marginRight: '10px' }}>
                <MainTable.ActionItem.EditIcon onClick={() => onEditAdmin(record)} />
              </MainTable.ActionItem.IconWrapper>
              <MainTable.ActionItem.IconWrapper>
                <Popconfirm
                  title='Do you want to delete this admin ?'
                  placement='topRight'
                  onConfirm={() => onDeleteAdmin(id)}
                  okText='Yes'
                  cancelText='Cancel'
                  key='delete'
                  overlayClassName='popconfirm-overlay-primary'
                >
                  <MainTable.ActionItem.IconWrapper>
                    <MainTable.ActionItem.DeleteIcon />
                  </MainTable.ActionItem.IconWrapper>
                </Popconfirm>
              </MainTable.ActionItem.IconWrapper>
            </>
          )
        },
      ]
      setColumns(newColumn)
    }
  }
  useEffect(() => {
    setAdmin()
  }, [admins, data])
  const deleteAction = async () => {
    setIsSubmitting(true)
    setShowPopup(true)
    await deleteSchool(get(data, 'id'))
    setIsSubmitting(false)
    setShowPopup(false)
  }

  const handleAddAdmin = (value) => {
    const { name, email, phoneNumber, countryCode, username, password } = value
    addSchoolAdmin({
      name,
      email,
      phone: {
        countryCode,
        number: phoneNumber
      },
      role: SCHOOL_ADMIN,
      username,
      password
    }, data.id).then(res => {
      if (res && res.addUser && res.addUser.id) {
        const newAdmins = [...admins, res.addUser]
        setAdmins(newAdmins)
        setActiveKey(data.id)
        setAdmin()
      }
    })
  }

  const handleEditAdmin = (value) => {
    const { name, email, phoneNumber, countryCode, username } = value
    updateSchoolAdmin({
      name,
      email,
      phone: {
        countryCode,
        number: phoneNumber
      },
      role: SCHOOL_ADMIN,
      username
    }, get(editData, 'id')).then(res => {
      if (res && res.updateUser && res.updateUser.id) {
        const newAdmins = [...admins].filter(admin => get(admin, 'id') !== get(res.updateUser, 'id'))
        setAdmins([...newAdmins, res.updateUser])
        setAdmin()
      }
    })
  }
  return (
    <SchoolOverviewTableStyle.StyledCollapse activeKey={activeKey} accordion >
      <SchoolOverviewTableStyle.StyledPanel
        showArrow={false}
        key={data.id}
        header={(
          <MainTable.Row
            columnsTemplate={columnsTemplate}
            minWidth={minWidth}
            style={{
              height: 'fit-content',
              border: 'none',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <SchoolAdminModal
              openModal={openModal}
              operation={operation}
              editData={editData}
              schoolId={data.id}
              closeModal={closeModal}
              handleAddAdmin={handleAddAdmin}
              handleEditAdmin={handleEditAdmin}
            />
            <Table.Item >
              <MainTable.Item>{index + 1}</MainTable.Item>
            </Table.Item>
            <Table.Item >
              {
                get(data, 'logo') ? (
                  <img src={getFullPath(get(data, 'logo.uri'))} style={{ width: '100px' }} alt='schoolLogo' />
                ) : (
                  <span>-</span>
                )
              }
            </Table.Item>
            <Table.Item >
              <MainTable.Item>{data.name ?
                <Link to={`/sms/dashboard/${data.id}`} >{data.name}</Link> : '-'}
              </MainTable.Item>
            </Table.Item>
            <Table.Item >
              <MainTable.Item
                style={{
                  height: 'fit-content'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'

                  }}
                >
                  {
                    data.coordinatorName &&
                    <div>
                      Name:  {data.coordinatorName}
                    </div>
                  }
                  {
                    data.coordinatorEmail &&
                    <div>
                      Email:  {data.coordinatorEmail}
                    </div>
                  }
                  {
                    (get(data.coordinatorPhone, 'countryCode') && get(data.coordinatorPhone, 'number')) &&
                    <div>
                      Phone:  {get(data.coordinatorPhone, 'countryCode')} {get(data.coordinatorPhone, 'number')}
                    </div>
                  }
                  {
                    data.coordinatorRole &&
                    <div>
                      Role:  {data.coordinatorRole}
                    </div>
                  }
                  {
                    get(data, 'hubspotId') && (
                      <div>
                        hubspotId: {get(data, 'hubspotId')}
                      </div>
                    )
                  }
                  {
                    data.city &&
                    <div>
                      City:  {data.city}
                    </div>
                  }

                </div>


              </MainTable.Item>
            </Table.Item>


            <Table.Item >
              <MainTable.Item>{data.city ? data.city : '-'}</MainTable.Item>
            </Table.Item>
            <Table.Item >
              <MainTable.Item>{data.enrollmentType ? (data.enrollmentType === 'free' ? 'Free' : 'Paid') : '-'}</MainTable.Item>
            </Table.Item>
            <Table.Item >
              <MainTable.Item>
                {moment(get(data, 'createdAt')).format('ll')}
              </MainTable.Item>
            </Table.Item>
            <Table.Item>
              <Button type='primary' icon='plus' style={{ marginRight: '10px' }} onClick={onAddAdmin}>
                Add Admin
              </Button>
              <Button type={activeKey ? 'dashed' : 'primary'} icon='eye' onClick={() => setActiveKey(activeKey ? '' : data.id)}>
                View Admin
              </Button>
            </Table.Item>
            <Table.Item >
              <MainTable.ActionItem.IconWrapper >
                <MainTable.ActionItem.EditIcon style={{ marginRight: '15px' }} onClick={() => showModal('edit', data)} />
              </MainTable.ActionItem.IconWrapper>
              <MainTable.ActionItem.IconWrapper style={{ marginLeft: '10px' }}>
                <Popconfirm
                  title='Do you want to delete this School ?'
                  placement='top'
                  visible={showPopup}
                  onConfirm={deleteAction}
                  onCancel={() => setShowPopup(!showPopup)}
                  okText='Yes'
                  cancelText='Cancel'
                  key='delete'
                  okButtonProps={{ loading: isSubmitting }}
                  overlayClassName='popconfirm-overlay-primary'
                >
                  <MainTable.ActionItem.DeleteIcon
                    onClick={() => setShowPopup(!showPopup)}
                  />
                </Popconfirm>
              </MainTable.ActionItem.IconWrapper>
            </Table.Item>
          </MainTable.Row>
        )}
      >
        {
          admins.length > 0 ? (
            <AntTable
              dataSource={sortBy(admins, 'createdAt')}
              columns={columns}
              pagination={false}
            />
          ) : (
            <h4 style={{ textAlign: 'center' }}>No Admin added yet, Click
              {' '}<Button type='primary' icon='plus' onClick={onAddAdmin}>Add Admin</Button> to create new Admin.
            </h4>
          )
        }
      </SchoolOverviewTableStyle.StyledPanel>
    </SchoolOverviewTableStyle.StyledCollapse>
  )
}

export default SchoolOverviewTableRow
