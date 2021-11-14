/* eslint-disable no-nested-ternary */
import React from 'react'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { Button, notification, Popconfirm, Table as AntTable, Tooltip } from 'antd'
import BDManagementStyle from '../BDManagement.style'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import removeSchoolFromBd from '../../../../actions/bdManagement/removeSchoolFromBd'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { BDE, BDE_ADMIN } from '../../../../constants/roles'
import GradesModal from './GradesModal'
import fetchSchoolsMetaData from '../../../../actions/bdManagement/fetchSchoolsMetaData'

const calculatePercentage = (num, den) => {
  if (den === 0) {
    return 0
  }
  return ((num / den) * 100).toFixed(1)
}

class BDTableRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '',
      schoolsData: [],
      isLoading: true,
      isGradesModalVisible: false,
      selectedSchool: null
    }
  }
  componentDidMount = () => {
    this.setBDSchools()
  }
  componentDidUpdate = (prevProps) => {
    const { bdSchoolsMetaDataFetchStatus } = this.props
    if (bdSchoolsMetaDataFetchStatus && get(bdSchoolsMetaDataFetchStatus.toJS(), 'loading')
      && !get(bdSchoolsMetaDataFetchStatus.toJS(), 'success') &&
      (prevProps.bdSchoolsMetaDataFetchStatus !== bdSchoolsMetaDataFetchStatus)) {
      this.setState({ isLoading: true })
    }
    if (bdSchoolsMetaDataFetchStatus && !get(bdSchoolsMetaDataFetchStatus.toJS(), 'loading')
      && get(bdSchoolsMetaDataFetchStatus.toJS(), 'success') &&
      (prevProps.bdSchoolsMetaDataFetchStatus !== bdSchoolsMetaDataFetchStatus)) {
      this.setState({ isLoading: false })
      this.setBDSchools()
    }
    if (get(prevProps, 'data') !== get(this.props, 'data')) {
      this.setBDSchools()
    }
  }
  showGradesModal = (record) => {
    this.setState({
      selectedSchool: record,
      isGradesModalVisible: true
    })
  }
  closeGradesModal = () => {
    this.setState({
      selectedSchool: null,
      isGradesModalVisible: false
    })
  }
  setBDSchools = () => {
    let { bdSchoolsMetaData } = this.props
    bdSchoolsMetaData = bdSchoolsMetaData && bdSchoolsMetaData.toJS() || []
    const { schoolsData } = this.state

    get(this.props, 'data.schools', []).forEach(school => {
      const findMeta = bdSchoolsMetaData.find(sch => get(sch, 'id') === get(school, 'id'))
      let studentCount = 0
      let totalBookings = 0
      let totalConversion = 0
      let attendance = 0
      let bookingPercentage = 0
      let attendancePercentage = 0
      let conversionPercentage = 0
      let totalAmount = 0
      let grades = []
      if (findMeta) {
        studentCount = get(findMeta, 'studentCount')
        totalBookings = get(findMeta, 'totalBookings')
        totalConversion = get(findMeta, 'totalConversion')
        totalAmount = get(findMeta, 'totalAmount') - (18 * get(findMeta, 'totalAmount')) / 100
        attendance = get(findMeta, 'attendance')
        grades = get(findMeta, 'grades')
        bookingPercentage = calculatePercentage(get(findMeta, 'totalBookings'), get(findMeta, 'studentCount'))
        attendancePercentage = calculatePercentage(get(findMeta, 'attendance'), get(findMeta, 'studentCount'))
        conversionPercentage = calculatePercentage(get(findMeta, 'totalConversion'), get(findMeta, 'studentCount'))
        if (!schoolsData.find(sch => get(sch, 'id') === get(findMeta, 'id'))) {
          schoolsData.push({
            ...school,
            studentCount,
            totalBookings,
            totalConversion,
            totalAmount,
            attendance,
            grades,
            bookingPercentage,
            attendancePercentage,
            conversionPercentage
          })
        }
      }
    })
    this.setState({
      schoolsData: sortBy(schoolsData, 'createdAt')
    })
  }
  getSchoolColumn = () => {
    const { data } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    const column = [
      {
        title: 'Sr.No',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        fixed: 'left',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        fixed: 'left'
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        align: 'center',
        render: (_, record) => (
          <div>
            {get(record, 'city') && <span>{get(record, 'city')},</span>}
            {get(record, 'country') && <span>{get(record, 'country')}</span>}
          </div>
        )
      },
      {
        title: 'Enrollment Type',
        dataIndex: 'enrollmentType',
        key: 'enrollmentType',
        align: 'center',
        render: (enrollmentType) => (
          <div>
            {enrollmentType === 'pro' ? 'Paid' : 'Free'}
          </div>
        )
      },
      {
        title: 'Total Registrations',
        dataIndex: 'studentCount',
        key: 'studentCount',
        align: 'center',
        render: (studentCount, record) => (
          <div>
            <Tooltip title='View Breakdown'>
              <Button
                type='link'
                onClick={() => this.showGradesModal(record)}
              >
                {studentCount}
              </Button>
            </Tooltip>
          </div>
        )
      },
      {
        title: 'Total Bookings',
        dataIndex: 'totalBookings',
        key: 'totalBookings',
        align: 'center',
      },
      {
        title: 'Booking %',
        dataIndex: 'bookingPercentage',
        key: 'bookingPercentage',
        align: 'center',
        render: (bookingPercentage) => `${bookingPercentage} %`
      },
      {
        title: 'Attendance',
        dataIndex: 'attendance',
        key: 'attendance',
        align: 'center',
      },
      {
        title: 'Attendance %',
        dataIndex: 'attendancePercentage',
        key: 'attendancePercentage',
        align: 'center',
        render: (attendancePercentage) => `${attendancePercentage} %`
      },
      {
        title: 'No of Conversion',
        dataIndex: 'totalConversion',
        key: 'totalConversion',
        align: 'center',
      },
      {
        title: 'Conversion %',
        dataIndex: 'conversionPercentage',
        key: 'conversionPercentage',
        align: 'center',
        render: (conversionPercentage) => `${conversionPercentage} %`
      },
      {
        title: 'Total Revenue',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        render: (totalAmount) => `Rs. ${totalAmount}`
      },
      // {
      //   title: 'School Co-ordinator',
      //   dataIndex: 'coordinator',
      //   key: 'coordinator',
      //   align: 'center',
      //   render: (_, record) => (
      //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      //       {get(record, 'coordinatorName')
      //  && <span>Name: {get(record, 'coordinatorName')}</span>}
      //       {get(record, 'coordinatorEmail')
      //  && <span>Email: {get(record, 'coordinatorEmail')}</span>}
      //       {
      //         get(record, 'coordinatorPhone.countryCode')
      //  && get(record, 'coordinatorPhone.number') && (
      //           <span>Phone: {get(record, 'coordinatorPhone
      // .countryCode')}{get(record, 'coordinatorPhone.number')}</span>
      //         )
      //       }
      //     </div>
      //   )
      // },
      {
        title: 'Remove',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (id) => (
          <MainTable.ActionItem.IconWrapper style={{ marginLeft: '10px' }}>
            <Popconfirm
              title='Do you want to remove this school ?'
              placement='top'
              onConfirm={() => removeSchoolFromBd({
                schoolId: id,
                bdProfileId: get(data, 'id')
              }).then(res => {
                if (res && res.removeFromBDEProfileSchool) {
                  notification.success({
                    message: 'School removed successfully'
                  })
                }
              })}
              okText='Yes'
              cancelText='Cancel'
              key='delete'
              overlayClassName='popconfirm-overlay-primary'
            >
              <MainTable.ActionItem.DeleteIcon />
            </Popconfirm>
          </MainTable.ActionItem.IconWrapper>
        )
      }
    ]
    if (savedRole === BDE || savedRole === BDE_ADMIN) {
      column.pop()
    }
    return column
  }
  onOpenAddSchool = () => {
    const { onOpenAddSchoolModal, data } = this.props
    onOpenAddSchoolModal(get(data, 'id'), this.state.schoolsData)
  }
  getSchoolsMeta = () => {
    const { data } = this.props
    let schoolsMetaDataQuery = ''
    const schoolsArray = []
    if (get(data, 'schools', []).length > 0) {
      get(data, 'schools', []).forEach((school) => {
        schoolsArray.push({
          id: get(school, 'id'),
          studentCount: get(school, 'studentsMeta.count')
        })
      })
    }
    schoolsArray.forEach((school, index) => {
      schoolsMetaDataQuery += `totalBookings${index}: menteeSessionsMeta(
          filter: {
            and: [
              { user_some: { studentProfile_some: { school_some: { id: "${get(school, 'id')}" } } } }
              { topic_some: { order: 1 } }
            ]
          }
        ) {
          count
        }
        attendance${index}: batchSessions(
          filter: {
            and: [
              { batch_some: { students_some: { school_some: { id: "${get(school, 'id')}" } } } }
              { topic_some: { order: 1 } }
            ]
          }
        ) {
          id
          attendance {
            status
          }
        }
        totalConversion${index}: salesOperationsMeta(
          filter: {
            and: [
              { client_some: { studentProfile_some: { school_some: { id: "${get(school, 'id')}" } } } }
              { leadStatus: won }
            ]
          }
        ) {
          count
        }
        totalAmount${index}: getTotalAmountCollected(input:{
            isSchool:true
            schoolId: "${get(school, 'id')}"
          }){
            totalAmount
          }
        schoolClasses${index}: schoolClasses(filter: {
          and: [
            {school_some: {id: "${get(school, 'id')}"}}
          ]
        }){
          grade
          studentsMeta {
            count
          }
        }
        `
    })
    if (schoolsMetaDataQuery) {
      fetchSchoolsMetaData({
        fetchQuery: schoolsMetaDataQuery, schoolsArray
      })
    }
  }
  render() {
    const { activeKey, schoolsData, isGradesModalVisible, selectedSchool, isLoading } = this.state
    const { data, columnsTemplate, minWidth, index } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    return (
      <>
        <BDManagementStyle.StyledCollapse activeKey={activeKey} accordion >
          <BDManagementStyle.StyledPanel
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
                <Table.Item >
                  <MainTable.Item>{index + 1}</MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item >
                    {get(data, 'user.name')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>{get(data, 'user.phone.countryCode')} {get(data, 'user.phone.number')}</MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>{get(data, 'user.email')}</MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {moment(get(data, 'createdAt')).format('ll')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item>
                  {
                    savedRole !== BDE && savedRole !== BDE_ADMIN && (
                      <Button type='primary' icon='plus' style={{ marginRight: '10px' }} onClick={this.onOpenAddSchool}>
                        Add School
                      </Button>
                    )
                  }
                  <Button type={activeKey ? 'dashed' : 'primary'}
                    icon='eye'
                    onClick={() => this.setState({
                      activeKey: activeKey ? '' : data.id
                    }, () => {
                      if (this.state.activeKey === data.id) {
                        this.getSchoolsMeta()
                      }
                    })}
                  >
                    View Schools
                  </Button>
                </Table.Item>
              </MainTable.Row>
            )}
          >
            {
              schoolsData.length > 0 || (schoolsData.length === 0 && isLoading) ? (
                <AntTable
                  dataSource={sortBy(schoolsData, 'createdAt')}
                  columns={this.getSchoolColumn()}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  loading={isLoading && this.state.activeKey === data.id}
                />
              ) : (
                <h4 style={{ textAlign: 'center' }}>No School added yet
                  {
                    savedRole !== BDE && (
                      <span>
                        , Click
                        {' '}
                        <Button type='primary'
                          icon='plus'
                          onClick={this.onOpenAddSchool}
                        >Add School
                        </Button> to add a School.
                      </span>
                    )
                  }
                </h4>
              )
            }
          </BDManagementStyle.StyledPanel>
        </BDManagementStyle.StyledCollapse>
        <GradesModal
          showGradesModal={isGradesModalVisible}
          onCloseGradesModal={this.closeGradesModal}
          schoolsData={schoolsData}
          selectedSchool={selectedSchool}
          isDataLoading={isLoading}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  bdSchoolsMetaDataFetchStatus: state.data.getIn(['bdSchoolsMetaData', 'fetchStatus', 'bdSchoolsMetaData']),
  bdSchoolsMetaData: state.data.getIn(['bdSchoolsMetaData', 'data'])
})

export default connect(mapStateToProps)(BDTableRow)
