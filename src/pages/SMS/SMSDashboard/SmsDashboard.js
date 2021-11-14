import React, { Component } from 'react'
import { Row, Select, Button, Table, Pagination, notification } from 'antd'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import fetchAllSchools from '../../../actions/smsDashboard/fetchAllSchools'
import fetchSchoolStudents from '../../../actions/smsDashboard/fetchSchoolStudents'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { SCHOOL_ADMIN } from '../../../constants/roles'
import SchoolModal from './component/SchoolModal'
import MainTable from '../../../components/MainTable'
import studentHeaders from './component/studentHeader'
import fetchSchoolStudentData from '../../../actions/smsDashboard/fetchSchoolStudentData'
import { filterKey } from '../../../utils/data-utils'
// import SchoolDetails from './component/SchoolDetails'

class SmsDashboard extends Component {
  state = {
    selectedSchool: 'none',
    redirectedSchool: this.props.match.params.id,
    columns: [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => index + 1
      }, {
        title: 'Student Name',
        dataIndex: 'studentName',
        key: 'studentName',
        render: (studentName, record) => this.renderName(studentName, record.id)
      }, {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
      }, {
        title: 'Section',
        dataIndex: 'section',
        key: 'section',
      }, {
        title: 'Parent Name',
        dataIndex: 'parentName',
        key: 'parentName',
      }, {
        title: 'Phone No.',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: 'Email ID',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Edit',
        dataIndex: 'id',
        key: 'id',
        render: (id, record) => this.renderEditIcon(id, record)
      }
    ],
    data: [],
    currentPage: 1,
    perPage: 20,
    admins: null,
    visible: false,
    editData: null,
    downloadData: []
  }
  componentDidMount = async () => {
    const savedRole = getDataFromLocalStorage('login.role')
    let savedId = ''
    if (savedRole === SCHOOL_ADMIN) {
      savedId = getDataFromLocalStorage('login.id')
      const { schools } = await fetchAllSchools(savedId, savedRole)
      this.setState({
        selectedSchool: get(schools[0], 'id')
      }, () => this.state.selectedSchool && this.getSelectedSchoolStudents())
    } else if (this.state.redirectedSchool) {
      await fetchAllSchools()
      fetchSchoolStudents({
        schoolId: get(this.state, 'redirectedSchool'),
        page: get(this.state, 'perPage'),
        skip: get(this.state, 'currentPage'),
        // admin: true
      })
      this.setState({
        selectedSchool: this.state.redirectedSchool
      })
    } else {
      fetchAllSchools()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (get(prevProps, 'studentsOfSchoolFetch') && get(prevProps, 'studentsOfSchoolFetch').toJS().loading) &&
      (get(this.props, 'studentsOfSchoolFetch') && get(this.props, 'studentsOfSchoolFetch').toJS().success)
    ) {
      this.convertDataForTable()
    }
    const { schoolStudentDataFetchStatus } = this.props
    const { selectedSchool } = this.state
    const currStatus = schoolStudentDataFetchStatus.getIn([`schoolStudentData/${selectedSchool}`])
    const prevStatus = prevProps.schoolStudentDataFetchStatus.getIn([`schoolStudentData/${selectedSchool}`])
    if (currStatus && !get(currStatus.toJS(), 'loading')
      && get(currStatus.toJS(), 'success') &&
      (prevStatus !== currStatus)) {
      this.convertDataForDownload()
    }
  }
  convertDataForDownload = () => {
    let { schoolStudentData } = this.props
    const { selectedSchool } = this.state
    schoolStudentData = schoolStudentData && filterKey(schoolStudentData, `schoolStudentData/${selectedSchool}`).toJS()
    const downloadData = []
    if (schoolStudentData) {
      schoolStudentData.forEach((student, index) => {
        downloadData.push({
          no: index + 1,
          studentName: get(student, 'user.name', '-'),
          grade: get(student, 'grade', '-'),
          section: get(student, 'section') || '-',
          parentName: get(student, 'parents.0.user.name', '-'),
          phone: `${get(student, 'parents.0.user.phone.countryCode', '')} ${get(student, 'parents.0.user.phone.number', '-')}`,
          email: get(student, 'parents.0.user.email', '-'),
        })
      })
    }
    if (downloadData.length > 0) {
      this.setState({
        downloadData
      }, () => setTimeout(() => {
        this.reportRef.current.link.click()
      }))
    } else {
      notification.warn({
        message: 'No data available to download'
      })
    }
  }
  renderEditIcon = (id, record) => (
    <MainTable.ActionItem.IconWrapper>
      <MainTable.ActionItem.EditIcon
        onClick={() => this.setState({ visible: true, editData: record })}
      />
    </MainTable.ActionItem.IconWrapper>
  )
  renderAllSchools() {
    const schools = get(this.props, 'schools') && get(this.props, 'schools').toJS()
    return (
      schools &&
      schools.map(school => (
        <Select.Option value={get(school, 'id')}>{get(school, 'name')}</Select.Option>
      ))
    )
  }
  renderName = (name, id) => (
    <Link to={`/sms/studentJourney/${id}`} target='_blank' >
      {name}
    </Link>
  )

  convertDataForTable = () => {
    const students = get(this.props, 'studentsOfSchool') && get(this.props, 'studentsOfSchool').toJS()
    const tableData = []
    if (students) {
      students.forEach((student, index) => {
        tableData.push({
          ...student,
          no: index + 1,
          id: get(student, 'id'),
          studentName: get(student, 'user.name', '-'),
          grade: get(student, 'grade', '-'),
          section: get(student, 'section') || '-',
          parentName: get(student, 'parents.0.user.name', '-'),
          phone: `${get(student, 'parents.0.user.phone.countryCode', '')} ${get(student, 'parents.0.user.phone.number', '-')}`,
          email: get(student, 'parents.0.user.email', '-'),
        })
      })
    }
    this.setState({
      data: tableData
    })
  }

  onChange = value => {
    if (value !== 'none') {
      this.setState({
        selectedSchool: value,
        redirectedSchool: value
      }, () => {
        this.props.history.push(`/sms/dashboard/${value}`)
        this.getSelectedSchoolStudents()
      })
    } else {
      this.setState({
        selectedSchool: value
      })
    }
  }

  getSelectedSchoolStudents = () => {
    // const isSchoolAdmin = getDataFromLocalStorage('login.role') === SCHOOL_ADMIN
    fetchSchoolStudents({
      schoolId: get(this.state, 'redirectedSchool') ?
        get(this.state, 'redirectedSchool') : get(this.state, 'selectedSchool'),
      page: get(this.state, 'perPage'),
      skip: get(this.state, 'currentPage'),
      // admin: true
    })
  }

  onPageChange = page => {
    this.setState({
      currentPage: page
    }, this.getSelectedSchoolStudents)
  }

  // renderSchoolDetails = () => (
  //   <SchoolDetails
  //     visible={Boolean(this.state.admins)}
  //     data={this.state.admins}
  //     onClose={() => this.setState({ admins: null })}
  //   />
  // )
  getSchoolName = () => {
    const { selectedSchool } = this.state
    let { schools } = this.props
    schools = schools && schools.toJS() || []
    let schoolName = ''
    if (selectedSchool) {
      schoolName = get(schools.find(school => get(school, 'id') === selectedSchool), 'name')
    }
    return schoolName
  }
  reportRef = React.createRef()
  render() {
    // const savedRole = getDataFromLocalStorage('login.role')
    // const admins = this.props.schoolAdmin && this.props.schoolAdmin.toJS()
    const { schoolStudentDataFetchStatus } = this.props
    const { selectedSchool, redirectedSchool, visible, editData, downloadData } = this.state
    const downloadLoading = schoolStudentDataFetchStatus.getIn([`schoolStudentData/${selectedSchool}`])
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <SchoolModal
            visible={visible}
            editData={editData}
            onClose={() =>
              this.setState({ visible: false, editData: null })}
            getSelectedSchoolStudents={this.getSelectedSchoolStudents}
          />
          <Row style={{ marginBottom: 20 }}>
            <Select
              showSearch
              value={selectedSchool || redirectedSchool}
              style={{ width: 200 }}
              placeholder='Select a School'
              optionFilterProp='children'
              onChange={this.onChange}
              filterOption={(input, option) =>
                get(option, 'props.children')
                  ? get(option, 'props.children')
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              <Select.Option value='none'>Select a School</Select.Option>
              {this.renderAllSchools()}
            </Select>
            <Button type='primary' onClick={this.getSelectedSchoolStudents}>
              <SearchOutlined />
            </Button>
          </Row>
          {/* {
            savedRole === SCHOOL_ADMIN && (
              <>
                <Button type='primary' onClick={() => this.setState({ admins })}>
                  View School Owner Details
                </Button>
                {admins && this.renderSchoolDetails()}
              </>
            )
          } */}
          <CSVLink
            headers={studentHeaders}
            data={downloadData}
            filename={`${this.getSchoolName()} students.csv`}
            style={{ display: 'none' }}
            ref={this.reportRef}
          />
          <Button type='primary'
            disabled={!selectedSchool}
            loading={downloadLoading && get(downloadLoading.toJS(), 'loading')}
            onClick={() => fetchSchoolStudentData({ schoolId: selectedSchool })}
          >
            <DownloadOutlined /> {'Download Student\'s Data'}
          </Button>
        </div>
        <Table
          loading={(get(this.props, 'studentsOfSchoolFetch') && get(this.props, 'studentsOfSchoolFetch').toJS().loading)}
          dataSource={this.state.data}
          columns={this.state.columns}
          bordered
          pagination={false}
        />
        <Pagination
          total={get(this.props, 'studentsOfSchoolCount')}
          onChange={this.onPageChange}
          current={this.state.currentPage}
          defaultPageSize={this.state.perPage}
        />
      </div>
    )
  }
}

export default SmsDashboard
