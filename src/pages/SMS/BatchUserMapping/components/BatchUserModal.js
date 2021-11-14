/* eslint-disable max-len */
import { Button, Col, Form, Row, Select, Switch, Checkbox, Spin, notification } from 'antd'
import Text from 'antd/lib/typography/Text'
import { SendOutlined } from '@ant-design/icons'
import RadioGroup from 'antd/lib/radio/group'
import React, { Component } from 'react'
import { get, debounce } from 'lodash'
import MainModal from '../../../../components/MainModal'
import fetchStudents from '../../../../actions/batchUserMap/fetchStudents'
import addStudent from '../../../../actions/batchUserMap/addStudent'
import fetchBatches from '../../../../actions/batchUserMap/fetchBatches'
import deleteStudent from '../../../../actions/batchUserMap/deleteStudent'

const footerButtonStyle = { display: 'block', margin: '0 auto' }

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}
const rawStyle = {
  position: 'relative',
  textAlign: 'center',
  justifyContent: 'center',
  margin: '20px auto auto 125px',
}

const pTagStyle = { fontSize: '16px', fontWeight: 'bold', marginBottom: '0' }

class BatchUserModal extends Component {
  state = {
    isShiftStudent: false,
    selectedStudents: [],
    selectedShiftGroup: [],
    search: '',
    searchShifting: '',
    selectedStudentsShifting: [],
    toBatch: '',
    studentKeys: [],
    searchParam: 'student',
  }
  onSave = () => {
    const { studentKeys } = this.state
    const { selectedBatch } = this.props
    addStudent(studentKeys, selectedBatch.id)
    this.setState({
      studentKeys: [],
      selectedStudents: []
    })
  }
  handleSearch = (value) => {
    const { searchParam } = this.state
    this.setState({ search: value }, () => {
      const { search } = this.state
      if (search.length >= 3) {
        if (searchParam === 'student') {
          debounce(() => {
            fetchStudents(`{name_contains: "${search}"}`)
          }, 800)()
        } else {
          debounce(() => {
            fetchStudents(`{studentProfile_some: {parents_some: {user_some: {phone_number_subDoc_contains: "${search}"}}}}`)
          }, 800)()
        }
      }
    })
  }
  onSaveShifting = () => {
    const { selectedShiftGroup, toBatch } = this.state
    const { selectedBatch } = this.props
    selectedShiftGroup.map(studentId => {
      deleteStudent(studentId, selectedBatch.id)
    })
    addStudent(selectedShiftGroup, toBatch.key)
  }
  handleSearchShifting = (value) => {
    this.setState({ searchShifting: value }, () => {
      const { searchShifting } = this.state
      fetchBatches(searchShifting)
    })
  }
  onSelect = (value) => {
    this.studentsFilter().forEach(student => {
      if (get(student, 'studentProfile.id') === get(value, 'key')) {
        if (get(student, 'studentProfile.batch')) {
          notification.warn({
            message: `Student already added in batch ${get(student, 'studentProfile.batch.code')}`
          })
        } else {
          this.setState({
            studentKeys: [...this.state.studentKeys, get(value, 'key')],
            search: '',
            selectedStudents: [...this.state.selectedStudents, value]
          })
        }
      }
    })
  }
  onDeselect = (value) => {
    const studentKeys = this.state.studentKeys.filter(key => key !== get(value, 'key'))
    const selectedStudents = this.state.selectedStudents.filter(student => get(student, 'key') !== get(value, 'key'))
    this.setState({
      studentKeys,
      selectedStudents
    })
  }
  handleInputChangeShifting = (value) => {
    this.setState({
      toBatch: value,
      searchShifting: ''
    })
  }
  isSaving = () => {
    if (this.props.isAddingStudent) {
      return true
    }
  }
  onCancel() {
    const { selectedStudents } = this.state
    if (selectedStudents.length !== 0) {
      this.setState({
        selectedStudents: []
      })
    }
    this.props.closeBatchUserModal()
  }
  onCancelShifting() {
    const { selectedStudentsShifting } = this.state
    if (selectedStudentsShifting.length !== 0) {
      this.setState({
        toBatch: ''
      })
    }
    this.props.closeBatchUserModal()
  }
  handleStudentSelect(value) {
    this.setState(() => ({
      studentKeys: value
    }))
  }
  handleStudentGroupSelect(value) {
    this.setState(() => ({
      selectedShiftGroup: value
    }))
  }
  getLoaderData = () => {
    const { isFetchingStudents } = this.props
    const { searchParam } = this.state
    if (isFetchingStudents) return <Spin size='small' />
    if (this.state.search.length < 3) {
      if (searchParam === 'student') {
        return <p>Type atleast 3 characters to get students</p>
      }
      return <p>Type atleast 3 digits to get students</p>
    }
    return <p>No students found</p>
  }
  handleModalCancel = () => {
    this.setState({
      selectedStudents: [],
      studentKeys: [],
    }, () => this.props.closeBatchUserModal())
  }
  studentsFilter = () => {
    const { studentsInfo } = this.props
    const { search, searchParam } = this.state
    let allStudentsDataFiltered = studentsInfo.filter(student => get(student, 'name', '').toLowerCase().indexOf(search.toLowerCase()) !== -1)
    if (searchParam === 'number') {
      allStudentsDataFiltered = studentsInfo.slice(0, 30)
    }
    if (search.length < 2) {
      allStudentsDataFiltered = []
    }
    return allStudentsDataFiltered
  }
  onSearchChange = (event) => {
    this.setState({
      searchParam: event.target.value
    })
  }
  render() {
    const { selectedBatch, batchesSearched, isFetchingBatches, isFetchingStudents } = this.props
    const { selectedStudents, searchShifting, toBatch } = this.state
    let allBatchContentFiltered = !batchesSearched ? [] : batchesSearched.filter(item => get(item, 'code', '').toLowerCase().indexOf(searchShifting.toLowerCase()) !== -1)
    if (selectedBatch !== null) {
      allBatchContentFiltered = allBatchContentFiltered.filter(item => item.code !== selectedBatch.code)
    }
    if (searchShifting.length < 2) {
      allBatchContentFiltered = []
    }
    return (
      <MainModal
        title={this.state.isShiftStudent ? 'Shift Student' : 'Add Student'}
        visible={this.props.isAddStudentModalVisible}
        onCancel={this.handleModalCancel}
        width='568px'
        footer={[
          this.state.isShiftStudent ? (
            <Button
              type='primary'
              htmlType='submit'
              form='add-student-form'
              style={footerButtonStyle}
              onClick={this.onSaveShifting}
            >
              {' '}
              {this.isSaving() ? 'Shifting...' : 'Shift to Batch'}
            </Button>
          ) :
            (
              <Button
                type='primary'
                htmlType='submit'
                form='add-student-form'
                style={footerButtonStyle}
                onClick={this.onSave}
              >
                {' '}
                {this.isSaving() ? 'Adding...' : 'Add to Batch'}
              </Button>
            ),
        ]}
      >
        <div style={{ float: 'right' }}>
          <Text
            style={{
              marginRight: '4px',
              color: '#faad14',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Add Student
          </Text>
          <Switch
            onChange={() => {
              this.setState({
                isShiftStudent: !this.state.isShiftStudent,
              })
            }}
          />
          <Text
            style={{
              marginLeft: '4px',
              color: '#36cfc9',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Shift Student
          </Text>
        </div>
        {this.state.isShiftStudent ? (
          <>
            <Form id='form-add' style={{ margin: '30px auto auto' }}>
              <Form.Item label='Selected Student'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Checkbox.Group onChange={(value) => this.handleStudentGroupSelect(value)}>
                    {
                      selectedBatch.students.map(student =>
                        <div key={student.id}>
                          <Checkbox
                            value={student.id}
                            style={radioStyle}
                            defaultChecked
                          >
                            {student.user.name}
                          </Checkbox>
                        </div>
                      )
                    }
                  </Checkbox.Group>
                </div>
              </Form.Item>
              <Form.Item label='Choose Batch'>
                <Select
                  showSearch
                  labelInValue
                  placeholder='Select Batch'
                  value={toBatch}
                  loading={isFetchingBatches}
                  filterOption={false}
                  onSearch={this.handleSearchShifting}
                  onChange={this.handleInputChangeShifting}
                  style={{ width: '100%' }}
                >
                  {
                    allBatchContentFiltered.map(item =>
                      <Select.Option value={item.id}>{item.code}</Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Form>
            <Row style={rawStyle}>
              <Col span={6}>
                <p style={pTagStyle}>Batch</p>
                <small style={{ fontSize: '12px' }}>{selectedBatch.code}</small>
              </Col>
              <Col span={5}>
                <SendOutlined style={{ fontSize: '50px', color: '#009688' }} />
              </Col>
              <Col span={6}>
                <p style={pTagStyle}>Batch</p>
                <small style={{ fontSize: '12px' }}>{toBatch.label}</small>
              </Col>
            </Row>
          </>
        ) :
          (
            <Form id='form-add' style={{ margin: '30px auto auto' }}>
              <Form.Item label={
                <>
                  {'Search by '}
                  <RadioGroup
                    options={[
                      { label: 'Student Name', value: 'student' },
                      { label: 'Phone Number', value: 'number' }
                    ]}
                    defaultValue='student'
                    onChange={this.onSearchChange}
                    value={this.state.searchParam}
                  />
                </>}
              >
                <Select
                  mode='multiple'
                  labelInValue
                  placeholder={this.state.searchParam === 'student' ? 'Type min 3 characters' : 'Type min 3 digits'}
                  loading={isFetchingStudents}
                  filterOption={false}
                  value={this.state.selectedStudents}
                  notFoundContent={this.getLoaderData()}
                  onSearch={debounce(this.handleSearch, 800)}
                  onSelect={this.onSelect}
                  onDeselect={this.onDeselect}
                  style={{ width: '100%' }}
                >
                  {
                    this.studentsFilter().map(item =>
                      <Select.Option
                        value={!item.studentProfile ? null : item.studentProfile.id}
                      >
                        {this.state.searchParam === 'student' ? item.name : `${item.name} - ${get(item, 'studentProfile.parents[0].user.phone.number', 'null')}`}
                      </Select.Option>
                    )
                  }
                </Select>
              </Form.Item>
              <Form.Item label='Select Students'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Checkbox.Group
                    value={this.state.studentKeys}
                    onChange={(value) => this.handleStudentSelect(value)}
                  >
                    {
                      selectedStudents.map(student => (
                        <div key={student.key}>
                          <Checkbox
                            value={student.key}
                            style={radioStyle}
                          >
                            {student.label}
                          </Checkbox>
                        </div>
                      ))
                    }
                  </Checkbox.Group>
                </div>
              </Form.Item>
            </Form>
          )}
      </MainModal>
    )
  }
}

export default BatchUserModal
