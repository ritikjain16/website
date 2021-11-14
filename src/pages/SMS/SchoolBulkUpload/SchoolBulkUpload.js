import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Select, Button, } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import fetchAllSchools from '../../../actions/smsDashboard/fetchAllSchools'
import fetchSchoolStudents from '../../../actions/smsDashboard/fetchSchoolStudents'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { SCHOOL_ADMIN } from '../../../constants/roles'
import MainComponent from './components/MainComponent'

class SchoolBulkUpload extends Component {
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
      }
    ],
    data: [],
    currentPage: 1,
    perPage: 20,
    admins: null
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
      this.convertDataForMainComponent()
    }
  }

  convertDataForMainComponent = () => {
    const students = get(this.props, 'studentsOfSchool') && get(this.props, 'studentsOfSchool').toJS()
    const tableData = []
    if (students) {
      students.forEach(student => {
        tableData.push({
          id: get(student, 'id'),
          studentName: get(student, 'user.name', '-'),
          grade: get(student, 'grade', '-'),
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
        this.props.history.push(`/sms/bulk-upload/${value}`)
        this.getSelectedSchoolStudents()
      })
    } else {
      this.setState({
        selectedSchool: value
      })
    }
  }
  renderAllSchools() {
    const schools = get(this.props, 'schools') && get(this.props, 'schools').toJS()
    return (
      schools &&
      schools.map(school => (
        <Select.Option value={get(school, 'id')}>{get(school, 'name')}</Select.Option>
      ))
    )
  }

  getSelectedSchoolStudents = () => {
    fetchSchoolStudents({
      schoolId: get(this.state, 'redirectedSchool') ?
        get(this.state, 'redirectedSchool') : get(this.state, 'selectedSchool'),
      page: get(this.state, 'perPage'),
      skip: get(this.state, 'currentPage'),
    })
  }
  render() {
    const { selectedSchool, redirectedSchool } = this.state
    const schools = get(this.props, 'schools') && get(this.props, 'schools').toJS()

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Row style={{ marginBottom: 20 }}>
            {/* <Select
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
            </Button> */}
          </Row>
          <div>
            <Link to='/files/sample-csv-file.csv' target='_blank' download>
              <Button type='primary'>
                <DownloadOutlined /> Download CSV Template
              </Button>
            </Link>
          </div>
        </div>
        <MainComponent
          selectedSchool={selectedSchool}
          redirectedSchool={redirectedSchool}
          schools={schools}
        />
      </div>
    )
  }
}

export default SchoolBulkUpload
