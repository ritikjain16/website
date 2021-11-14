/* eslint-disable max-len */
import React from 'react'
import { Input } from 'antd'
import { get } from 'lodash'
import MainModal from '../../../../../components/MainModal'
import updateBatchSession from '../../../../../actions/batchAttendance/updateAbsentReason'
import { SMS } from '../../../../../constants/roles'
import AttendanceStatus from '../../../../../constants/attendanceStatus'

export default class AbsentReasonModal extends React.Component {
  state = {
    value: ''
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.visible !== this.props.visible) {
      this.setState({
        value: get(this.props, 'absentReason')
      })
    }
  }
  onSave = () => {
    const { value } = this.state
    this.prepareQueryInput(value)
  }
  isSaving = () => {
    if (this.props.isUpdatingBatchSession) {
      return true
    }
  }
  onChange = ({ target: { value } }) => {
    this.setState({ value })
  }
  onCancel() {
    this.setState({ value: '' })
    this.props.closeModal()
  }
  prepareQueryInput = (absentReason) => {
    const { batchSessionId, studentId } = this.props
    updateBatchSession({
      batchSessionId,
      input: {
        attendance: {
          updateWhere: {
            studentReferenceId: studentId
          },
          updateWith: {
            isPresent: false,
            status: AttendanceStatus.ABSENT,
            absentReason
          }
        }
      },
      key: SMS
    })
  }
  render() {
    const { visible, title } = this.props
    const { TextArea } = Input
    const { value } = this.state
    return (
      <MainModal
        visible={visible}
        title={<div style={{ display: 'flex', justifyContent: 'center' }}>{title}</div>}
        onCancel={() => this.onCancel()
        }
        maskClosable='true'
        width='500px'
        footer={
          [
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MainModal.SaveButton
                type='primary'
                htmlType='submit'
                onClick={this.onSave}
              >
                {' '}
                {this.isSaving() ? 'Saving...' : 'SAVE'}
              </MainModal.SaveButton>
            </div>
          ]}
      >
        <div>
          <TextArea rows={4} onChange={this.onChange} value={value} onPressEnter={this.onSave} autoSize={{ minRows: 3, maxRows: 5 }} />
        </div>
      </MainModal>
    )
  }
}
