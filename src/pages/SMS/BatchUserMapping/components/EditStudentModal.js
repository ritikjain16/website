/* eslint-disable max-len */
import { Button, Col, Form, Row, Select, Spin } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import React, { Component } from 'react'
import { debounce } from 'lodash'
import MainModal from '../../../../components/MainModal'
import fetchBatches from '../../../../actions/batchUserMap/fetchBatches'
import addStudent from '../../../../actions/batchUserMap/addStudent'
import deleteStudent from '../../../../actions/batchUserMap/deleteStudent'
import { SMS } from '../../../../constants/roles'

const footerButtonStyle = { display: 'block', margin: '0 auto' }
const rawStyle = {
  position: 'relative',
  textAlign: 'center',
  justifyContent: 'center',
  margin: '20px auto auto 125px',
}

const pTagStyle = { fontSize: '16px', fontWeight: 'bold', marginBottom: '0' }

class EditStudentModal extends Component {
  state = {
    searchShifting: '',
    toBatch: ''
  }
  handleSearchShifting = (value) => {
    this.setState({ searchShifting: value }, () => {
      const { searchShifting } = this.state
      if (searchShifting) {
        fetchBatches(searchShifting, SMS)
      }
    })
  }
  handleInputChangeShifting = (value) => {
    this.setState({
      toBatch: value,
      searchShifting: ''
    })
  }
  onSaveShifting = () => {
    const { toBatch } = this.state
    const { studentId, currentBatchId } = this.props
    deleteStudent(studentId, currentBatchId)
    addStudent(studentId, toBatch.key)
  }
  render() {
    const { studentName, currentBatch, batchesSearched, isBatchSearchFetching } = this.props
    const { searchShifting, toBatch } = this.state
    let allBatchContentFiltered = !batchesSearched ? [] : batchesSearched.filter(item => item.code.toLowerCase().indexOf(searchShifting.toLowerCase()) !== -1)
    if (currentBatch !== '') {
      allBatchContentFiltered = allBatchContentFiltered.filter(item => item.code !== currentBatch)
    }
    if (searchShifting.length < 2) {
      allBatchContentFiltered = []
    }
    return (
      <MainModal
        title='Shift Student'
        visible={this.props.isEditStudentModalVisible}
        onCancel={this.props.closeEditStudentModal}
        width='568px'
        footer={[
          <Button
            type='primary'
            htmlType='submit'
            form='add-student-form'
            style={footerButtonStyle}
            onClick={this.onSaveShifting}
          >
            {' '}
              Shift to Batch
          </Button>,
        ]}
      >
        <>
          <Form id='form-add' style={{ margin: '30px auto auto' }}>
            <Form.Item label='Selected Student' style={{ display: 'flex', justifyContent: 'center' }}>
              <h3>{studentName}</h3>
            </Form.Item>
            <Form.Item label='Choose Batch'>
              <Select
                showSearch
                labelInValue
                placeholder='Select Batch'
                value={toBatch}
                notFoundContent={isBatchSearchFetching ? <Spin size='small' /> : null}
                filterOption={false}
                onSearch={debounce(this.handleSearchShifting, 800)}
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
              <small style={{ fontSize: '12px' }}>{currentBatch}</small>
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
      </MainModal>
    )
  }
}

export default EditStudentModal
