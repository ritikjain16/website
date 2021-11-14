import { Button, DatePicker, Input, notification, Select } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import React, { Component, Fragment } from 'react'
import fetchUserCourseCompletion from '../../actions/CourseCompletion/fetchUserCourseCompletion'
import {
  ADMIN,
  UMS_ADMIN,
  UMS_VIEWER
} from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import CourseCompletionTable from './components/CourseCompletionTable'

class CourseCompletion extends Component {
  state = {
    loading: true,
    perPage: 15,
    skip: 0,
    filterOptions: ['Student Name', 'Parent Name', 'Email Id', 'Phone No.', 'Mentor Name'],
    searchKey: 'All',
    searchValue: '',
    selectedGrades: [],
    grades: ['Grade1', 'Grade2', 'Grade3', 'Grade4', 'Grade5',
      'Grade6', 'Grade7', 'Grade8', 'Grade9', 'Grade10',
      'Grade11', 'Grade12'],
    selectedVerticals: [],
    verticals: ['B2B', 'B2B2C', 'B2C'],
    fromDate: null,
    toDate: null,
    selectedSchool: 'All',
    courseCompletionData: [],
    schoolsData: [],
    windowWidth: window.innerWidth
  }
  componentDidMount = () => {
    this.fetchUserCourseCompletionData()
    window.addEventListener('resize', this.handleResize)
  }
  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth })
  }
  fetchUserCourseCompletionData = async (loading = true) => {
    if (!loading) this.setState({ loading })
    const { searchKey, searchValue, perPage,
      skip, fromDate, toDate, selectedSchool,
      selectedGrades, selectedVerticals } = this.state
    let filterQuery = '{ course_some: {title:"python"} }'
    if (fromDate) {
      filterQuery += ` { createdAt_gte: "${moment(fromDate).startOf('day')}" }`
    }
    if (toDate) {
      filterQuery += ` { createdAt_lte: "${moment(toDate).endOf('day')}" }`
    }
    if (searchKey === 'Phone No.' && searchValue) {
      filterQuery += `{user_some: {studentProfile_some: {parents_some:{user_some: {phone_number_subDoc_contains: "${searchValue}"}}}}}`
    }
    if (searchKey === 'Email Id' && searchValue) {
      filterQuery += `{user_some: {studentProfile_some: {parents_some:{user_some: {email_contains: "${searchValue}"}}}}}`
    }
    if (selectedSchool && selectedSchool !== 'All') {
      filterQuery += `{user_some: {studentProfile_some: {school_some: {name_contains: "${selectedSchool}"}}}}`
    }
    if (searchKey === 'Student Name' && searchValue) {
      filterQuery += `{ user_some: { name_contains: "${searchValue}" } }`
    }
    if (searchKey === 'Parent Name' && searchValue) {
      filterQuery += `{user_some: {studentProfile_some: {parents_some:{user_some: {name_contains: "${searchValue}"}}}}}`
    }
    if (searchKey === 'Mentor Name' && searchValue) {
      filterQuery += `{mentors_some: {name_contains: "${searchValue}"}}`
    }
    if (selectedGrades && selectedGrades.length > 0) {
      filterQuery += ' {user_some: {studentProfile_some: {grade_in: ['
      selectedGrades.forEach(grade => {
        filterQuery += `${grade},`
      })
      filterQuery += ']}}}'
    }

    if (selectedVerticals && selectedVerticals.length > 0) {
      filterQuery += ' {user_some: {studentProfile_some: {batch_some: {type_in: ['
      selectedVerticals.forEach(vertical => {
        switch (vertical) {
          case 'B2B':
            filterQuery += 'b2b,'
            break
          case 'B2C':
            filterQuery += 'normal,'
            break
          case 'B2B2C':
            filterQuery += 'b2b2c,'
            break
          default:
            break
        }
      })
      filterQuery += ']}}}}'
    }

    await fetchUserCourseCompletion({ filterQuery, perPage, skip })
    if (!this.state.loading) this.setState({ loading: true })
  }
  componentDidUpdate = (prevProps) => {
    const { courseCompletionFetchStatus,
      courseCompletionUpdateStatus,
      sendCertificateUpdateStatus,
      sendJourneySnapshotUpdateStatus
    } = this.props
    if (courseCompletionFetchStatus && !get(courseCompletionFetchStatus.toJS(), 'loading')
      && get(courseCompletionFetchStatus.toJS(), 'success') &&
      (prevProps.courseCompletionFetchStatus !== courseCompletionFetchStatus)) {
      this.setCourseCompletions()
    }
    if (courseCompletionUpdateStatus && !get(courseCompletionUpdateStatus.toJS(), 'loading')
      && get(courseCompletionUpdateStatus.toJS(), 'success') &&
      (prevProps.courseCompletionUpdateStatus !== courseCompletionUpdateStatus)) {
      notification.success({
        message: 'Updated comment successfully'
      })
    } else if (courseCompletionUpdateStatus && !get(courseCompletionUpdateStatus.toJS(), 'loading')
      && get(courseCompletionUpdateStatus.toJS(), 'failure') &&
      (prevProps.courseCompletionUpdateStatus !== courseCompletionUpdateStatus)) {
      notification.error({
        message: 'Failed to update comment'
      })
    }
    if (sendCertificateUpdateStatus && !get(sendCertificateUpdateStatus.toJS(), 'loading')
      && get(sendCertificateUpdateStatus.toJS(), 'success') &&
      (prevProps.sendCertificateUpdateStatus !== sendCertificateUpdateStatus)) {
      notification.success({
        message: 'Certificate sent successfully'
      })
    } else if (sendCertificateUpdateStatus && !get(sendCertificateUpdateStatus.toJS(), 'loading')
      && get(sendCertificateUpdateStatus.toJS(), 'failure') &&
      (prevProps.sendCertificateUpdateStatus !== sendCertificateUpdateStatus)) {
      notification.error({
        message: 'Failed to send certificate'
      })
    }
    if (sendJourneySnapshotUpdateStatus && !get(sendJourneySnapshotUpdateStatus.toJS(), 'loading')
      && get(sendJourneySnapshotUpdateStatus.toJS(), 'success') &&
      (prevProps.sendJourneySnapshotUpdateStatus !== sendJourneySnapshotUpdateStatus)) {
      notification.success({
        message: 'Journey Snapshot sent successfully'
      })
    } else if (sendJourneySnapshotUpdateStatus && !get(sendJourneySnapshotUpdateStatus.toJS(), 'loading')
      && get(sendJourneySnapshotUpdateStatus.toJS(), 'failure') &&
      (prevProps.sendJourneySnapshotUpdateStatus !== sendJourneySnapshotUpdateStatus)) {
      notification.error({
        message: 'Failed to send journey snapshot'
      })
    }
  }
  setCourseCompletions = () => {
    let { courseCompletionData, schoolsData } = this.props
    courseCompletionData = courseCompletionData && courseCompletionData.toJS() || []
    schoolsData = schoolsData && schoolsData.toJS() || []
    this.setState({
      courseCompletionData,
      schoolsData
    })
  }
  handleFilterKeyChange = (value) => {
    this.setState({
      searchKey: value,
      searchValue: value === 'All' ? 'All' : ''
    }, () => {
      if (value === 'All') {
        this.fetchUserCourseCompletionData()
      }
    })
  }
  handleSeachValueChange = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  }
  handleGradeChange = (value) => {
    this.setState({
      selectedGrades: value
    })
  }
  handleVerticaChange = (value) => {
    this.setState({
      selectedVerticals: value
    })
  }
  handleDateChange = (dates) => {
    this.setState({
      fromDate: dates && dates[0] ? dates[0] : '',
      toDate: dates && dates[1] ? dates[1] : '',
    }, () => {
      if (this.state.toDate !== '') {
        this.fetchUserCourseCompletionData()
      }
    })
  }
  handleSchoolNameChange = (value) => {
    this.setState({
      selectedSchool: value
    }, () => this.fetchUserCourseCompletionData())
  }
  render() {
    const { Option } = Select
    const { filterOptions,
      searchValue,
      searchKey,
      grades,
      verticals,
      schoolsData,
      courseCompletionData,
      loading,
      windowWidth
    } = this.state
    const {
      courseCompletionFetchStatus,
      courseCompletionUpdateStatus,
      sendCertificateUpdateStatus,
      sendJourneySnapshotUpdateStatus,
      userSavedCodes
    } = this.props
    const savedRole = getDataFromLocalStorage('login.role')
    const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN || savedRole === UMS_VIEWER
    const fetchLoading = loading && courseCompletionFetchStatus && get(courseCompletionFetchStatus.toJS(), 'loading')
    let filterRowStyle = {
      marginBottom: 15,
      display: 'flex',
      justifyContent: 'space-between'
    }
    if (windowWidth <= 900) {
      filterRowStyle = {
        marginBottom: 15,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        minHeight: '120px'
      }
    }
    return (
      <Fragment>
        <div
          style={filterRowStyle}
        >
          <div
            style={{
              width: 520,
              marginTop: '-5px'
            }}
          >
            {'Search By :  '}
            <Select
              style={{ width: 200, marginTop: '5px' }}
              defaultValue='All'
              onChange={this.handleFilterKeyChange}
              value={this.state.searchKey}
            >
              <Option value='All' label='All'>
                All
              </Option>
              {filterOptions.map(option => (
                <Option value={option} label={option.toUpperCase()}>
                  {option}
                </Option>
              ))}
            </Select>
            {searchKey !== 'All' && (
              <Input
                value={searchValue}
                onChange={this.handleSeachValueChange}
                placeholder={`Type ${searchKey}`}
                style={{ width: 200, marginLeft: 15, marginTop: '5px' }}
                onPressEnter={this.fetchUserCourseCompletionData}
              />
            )}
          </div>
          <div>
            {'Grade :  '}
            <Select
              mode='multiple'
              style={{ width: 200 }}
              defaultValue={['Grade1']}
              onChange={this.handleGradeChange}
              value={this.state.selectedGrades}
              maxTagCount={1}
              onPressEnter={this.fetchUserCourseCompletionData}
            >
              {grades.map(grade => (
                <Option value={grade} label={grade.toUpperCase()}>
                  {grade}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            {'Vertical :  '}
            <Select
              mode='multiple'
              style={{ width: 200 }}
              defaultValue={['B2C']}
              onChange={this.handleVerticaChange}
              value={this.state.selectedVerticals}
              maxTagCount={1}
            >
              {verticals.map(grade => (
                <Option value={grade} label={grade.toUpperCase()}>
                  {grade}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div
          style={filterRowStyle}
        >
          <div>
            {'School Name :  '}
            <Select
              style={{ width: 200, marginRight: 15 }}
              defaultValue='All'
              onChange={this.handleSchoolNameChange}
              value={this.state.selectedSchool}
            >
              <Option value='All' label='All'>
                All
              </Option>
              {schoolsData.map(school => (
                <Option value={get(school, 'name')} label={get(school, 'name')}>
                  {get(school, 'name')}
                </Option>
              ))}
            </Select>
            <Button
              type='primary'
              onClick={() => this.fetchUserCourseCompletionData()}
            >
              SEARCH
            </Button>
          </div>
          <div>
            <DatePicker.RangePicker
              format='DD/MM/YYYY'
              onCalendarChange={this.handleDateChange}
            />
          </div>
          {
            isAdmin && (
              <Button
                type='primary'
                disabled
                style={{ width: '200px' }}
              >
                {'Download User\'s Data'}
                {/* <CSVLink
                  headers={this.getCSVHeader()}
                  data={tableData}
                  filename={`${currentRole}_users.csv`}
                >
                  <DownloadOutlined /> {'Download User\'s Data'}
                </CSVLink> */}
              </Button>
            )
          }
        </div>
        <CourseCompletionTable
          showLoading={fetchLoading}
          courseCompletionData={courseCompletionData}
          openModal={this.openModal}
          courseCompletionUpdateStatus={courseCompletionUpdateStatus}
          sendCertificateUpdateStatus={sendCertificateUpdateStatus}
          sendJourneySnapshotUpdateStatus={sendJourneySnapshotUpdateStatus}
          userSavedCodes={userSavedCodes}
        />
      </Fragment>
    )
  }
}

export default CourseCompletion
