/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import { rgb } from 'polished'
import React, { Component } from 'react'
import { notification, Popconfirm } from 'antd'
import { withRouter } from 'react-router'
import { debounce, get } from 'lodash'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import AbsentReasonModal from '../Modals/AbsentReasonModal'
import TriStateButton from '../../../MentorDashboard/components/TriStateButton'
import updateBatchSession from '../../../../actions/batchAttendance/updateAbsentReason'
import AttendanceStatus from '../../../../constants/attendanceStatus'
import { TekieGreen, TekieRed } from '../../../../constants/colors'
import { CheckSvg, CircleFilledSvg, CrossSvg } from '../../../../constants/icons'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { MENTOR } from '../../../../constants/roles'

class BatchAttendanceTableRow extends Component {
  state = {
    isModalVisible: false,
    absentReason: '',
    attendanceStatus: 'notAssgined'
  }
  getPresentDetails = () => {
    const { student } = this.props
    this.setState({
      attendanceStatus: get(student, 'status'),
      absentReason: get(student, 'absentReason')
    })
  }

  closeModal = () => this.setState({
    isModalVisible: false
  })

  openModal = () => this.setState({
    isModalVisible: true
  })

  onChange = (status) => {
    const { studentId, batchSessionId } = this.props
    notification.info({
      message: 'Updating Attendance...'
    })
    debounce(() => {
      updateBatchSession({
        batchSessionId,
        input: {
          attendance: {
            updateWhere: {
              studentReferenceId: studentId
            },
            updateWith: {
              status
            }
          }
        }
      })
    }, 200)()
    this.setState({
      attendanceStatus: status
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isUpdatingBatchSession && this.props.hasUpdatedBatchSession) {
      this.setState({
        isModalVisible: false
      })
    }
    if (get(prevProps, 'student.absentReason') !== get(this.props, 'student.absentReason')) {
      this.setState({
        absentReason: get(this.props, 'student.absentReason')
      })
    }
    if (get(prevProps, 'student.status') !== get(this.props, 'student.status')) {
      this.setState({
        attendanceStatus: get(this.props, 'student.status')
      })
    }
  }
  componentDidMount() {
    this.getPresentDetails()
  }

  componentWillMount() {
    this.getPresentDetails()
  }

  render() {
    const {
      order,
      studentName,
      parentName,
      parentEmail,
      parentPhone,
      batchSessionId,
      studentId,
      isUpdatingBatchSession,
      hasUpdatedBatchSession,
      isDisabled
    } = this.props
    const { absentReason,
      attendanceStatus
    } = this.state
    const savedRole = getDataFromLocalStorage('login.role')
    const savedId = getDataFromLocalStorage('login.id')
    return (
      <MainTable.Row
        columnsTemplate={this.props.columnsTemplate}
        minWidth={this.props.minWidth}
        style={{ justifyContent: 'flex-start', marginTop: '2px' }}
        noBorder
        backgroundColor={rgb(246, 246, 246)}
      >
        <Table.StickyItem
          style={{ left: 0 }}
          backgroundColor={rgb(246, 246, 246)}
        >
          <MainTable.Item style={{ minWidth: 40 }} >{order}</MainTable.Item>
          {
            studentName ?
              <MainTable.Item style={{ width: 180 }} >
                {studentName}
              </MainTable.Item>
              :
              null
          }
        </Table.StickyItem>
        <Table.Item backgroundColor={rgb(246, 246, 246)}>
          <MainTable.Item>
            {!parentName ? '-' : parentName}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={rgb(246, 246, 246)}>
          <MainTable.Item>
            {!parentPhone ? '-' : parentPhone}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={rgb(246, 246, 246)}>
          <MainTable.Item>
            {!parentEmail ? '-' : parentEmail}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={rgb(246, 246, 246)}>
          {/* <div> */}
          {
            savedRole === MENTOR ?
              <Popconfirm
                title='Please edit attendance from new mentor dashboard'
                placement='topRight'
                okText='Go to new Mentor Dashboard'
                cancelText='Cancel'
                onConfirm={() => {
                  this.props.history.push(`/mentordashboard/${savedId}`)
                }}
                key='view'
                overlayClassName='popconfirm-overlay-primary'
              >
                <MainTable.Item>
                  <h2 style={{ color: 'rgb(238,84,65)', display: 'inline', margin: 0, marginRight: '10px' }}>Absent
                  </h2>
                  <TriStateButton
                    handleChange={this.onChange}
                    disabled
                    values={[
                      { val: AttendanceStatus.ABSENT, icon: <CrossSvg />, bg: TekieRed },
                      { val: AttendanceStatus.NOTASSIGNED, icon: <CircleFilledSvg />, bg: '#d0d0d0' },
                      { val: AttendanceStatus.PRESENT, icon: <CheckSvg />, bg: TekieGreen }
                    ]}
                    selected={attendanceStatus}
                  />
                  <h2 style={{ color: 'rgb(100,217,120)', display: 'inline', margin: 0, marginLeft: '10px' }}>Present
                  </h2>
                </MainTable.Item>
              </Popconfirm>
              :
              <MainTable.Item>
                <h2 style={{ color: 'rgb(238,84,65)', display: 'inline', margin: 0, marginRight: '10px' }}>Absent
                </h2>
                <TriStateButton
                  handleChange={this.onChange}
                  disabled={isDisabled}
                  values={[
                    { val: AttendanceStatus.ABSENT, icon: <CrossSvg />, bg: TekieRed },
                    { val: AttendanceStatus.NOTASSIGNED, icon: <CircleFilledSvg />, bg: '#d0d0d0' },
                    { val: AttendanceStatus.PRESENT, icon: <CheckSvg />, bg: TekieGreen }
                  ]}
                  selected={attendanceStatus}
                />
                <h2 style={{ color: 'rgb(100,217,120)', display: 'inline', margin: 0, marginLeft: '10px' }}>Present
                </h2>
              </MainTable.Item>
          }
          {/* <Radio.Group
              onChange={this.onChange}
              disabled={isDisabled}
              value={isStudentPresent}
            >
              <Radio value>
                <h2 style={{ color: 'rgb(100,217,120)',
                display: 'inline', marginRight: '10px' }}>Present
                </h2>
              </Radio>
              <Radio value={false}>
                <h2 style={{ color: 'rgb(238,84,65)', display: 'inline', marginLeft: '10px' }}>
                  Absent
                </h2>
              </Radio>
            </Radio.Group> */}
          {/* </div> */}
        </Table.Item>
        <Table.Item backgroundColor={rgb(246, 246, 246)}>
          <MainTable.Item>
            {!absentReason ? '' : absentReason}
          </MainTable.Item>
          <MainTable.ActionItem.IconWrapper
            disabled={isDisabled}
            style={isDisabled ? { opacity: '0.7', cursor: 'not-allowed' } : { cursor: 'pointer' }}
            onClick={() => this.openModal()}
          >
            <MainTable.ActionItem.EditIcon />
          </MainTable.ActionItem.IconWrapper>
        </Table.Item>
        <AbsentReasonModal
          studentId={studentId}
          batchSessionId={batchSessionId}
          visible={this.state.isModalVisible}
          title='Update Absent Reason'
          closeModal={this.closeModal}
          sendParent={this.sendParent}
          absentReason={absentReason}
          isUpdatingBatchSession={isUpdatingBatchSession}
          hasUpdatedBatchSession={hasUpdatedBatchSession}
        />
      </MainTable.Row>
    )
  }
}

export default withRouter(BatchAttendanceTableRow)
