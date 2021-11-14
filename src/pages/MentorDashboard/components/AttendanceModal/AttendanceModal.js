import React from 'react'
import { get, debounce } from 'lodash'
import Styles from './AttendanceModal.style'
import Modal from '../Modal.styles'
import updateBatchSession from '../../../../actions/mentorSessions/updateBatchSessions'
import AttendanceStatus from '../../../../constants/attendanceStatus'
import TriStateButton from '../TriStateButton'
import { AttendanceSvg, CheckSvg, CircleFilledSvg, CrossSvg } from '../../../../constants/icons'
import { TekieGreen, TekieRed } from '../../../../constants/colors'

const AvailabilityModal = ({
  isModalVisible = true,
  selectedSession,
  setModalVisibility,
  updateBatchSessionStatus,
  updateExistingLocalSessionData
}) => {
  const [students, setStudents] = React.useState([])
  const [markAllPresent, setMarkAllPresent] = React.useState(false)

  const getStudentAttendanceInfo = (studentId) => {
    let status = ''
    get(selectedSession, 'record.attendance', []).forEach(attendance => {
      if (get(attendance, 'student.id') === studentId) {
        status = get(attendance, 'status', '')
      }
    })
    return status
  }

  React.useEffect(() => {
    const allStudents = get(selectedSession, 'record.batch.students', [])
    const mappedStudents = allStudents.map(student => (
      {
        ...student,
        status: getStudentAttendanceInfo(student.id)
      }
    ))
    setStudents(mappedStudents)
  }, [selectedSession])

  /** Utils */

  const updateLocalStudentAttendanceState = (studentId, status) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, status }
      }
      return student
    }))
  }

  const closeModal = () => {
    const updateObj = {
      attendance: students.map(student => (
        {
          status: student.status,
          student: {
            id: student.id,
            user: student.userData
          }
        }
      ))
    }
    updateExistingLocalSessionData(updateObj, get(selectedSession, 'record'))
    setModalVisibility(false)
  }

  /** Queries */

  const checkIfAllStudentsPresent = () => {
    let isAllPresent = true
    students.forEach(student => {
      if (student.status !== AttendanceStatus.PRESENT) {
        isAllPresent = false
      }
    })
    return isAllPresent
  }

  const onConfirm = async () => {
    const batchSessionID = get(selectedSession, 'record.id', null)
    let input = {}
    if (markAllPresent || checkIfAllStudentsPresent()) {
      input = {
        attendance: {
          updateAll: {
            status: AttendanceStatus.PRESENT
          }
        }
      }
      await updateBatchSession(batchSessionID, input).then(res => {
        if (res) {
          closeModal(false)
        }
      })
      return
    }
    closeModal(false)
  }
  const updateBatchSessionAttendance = async (studentId, status) => {
    const batchSessionID = get(selectedSession, 'record.id', null)
    const input = {
      attendance: {
        updateWhere: {
          studentReferenceId: studentId
        },
        updateWith: {
          status,
        }
      }
    }
    await updateBatchSession(batchSessionID, input)
  }

  /** Render Methods */
  const renderModalHeader = () => (
    <>
      <Styles.HeaderIcon>
        <Modal.Icon theme='twoTone'
          marginRight='0px'
          fillSvg='#01AA93'
          component={AttendanceSvg}
        />
      </Styles.HeaderIcon>
      <Styles.HeaderDetails>
        <Modal.HeaderTitle>
          Take Attendance
        </Modal.HeaderTitle>
      </Styles.HeaderDetails>
    </>
  )
  const renderModalFooter = () => (
    <Modal.FlexContainer style={{ alignItems: 'center', width: '100%', padding: 0, justifyContent: 'flex-end' }}>
      <Modal.FlexContainer style={{ padding: 0 }}>
        <Modal.SecondaryButton
          onClick={closeModal}
          style={{ marginRight: '10px' }}
        >
          Cancel
        </Modal.SecondaryButton>
        <Modal.PrimaryButton
          loading={get(updateBatchSessionStatus, 'loading')}
          onClick={debounce(onConfirm, 500)}
        >
          {get(updateBatchSessionStatus, 'loading') && <Modal.Spinner />}
          Confirm
        </Modal.PrimaryButton>
      </Modal.FlexContainer>
    </Modal.FlexContainer>
  )

  return (
    <Modal.WithBackdrop visible={isModalVisible}>
      <Modal.ModalBox visible={isModalVisible}>
        <Modal.CloseIcon theme='twoTone'
          onClick={closeModal}
        />
        <Modal.Header bgColor='#F5F5F5'>
          {renderModalHeader()}
        </Modal.Header>
        <Modal.Content style={{ paddingTop: '12px' }}>
          <Modal.CustomCheckbox
            style={{ padding: '0px 0px 22px', height: 'fit-content', alignItems: 'center' }}
            justifyContent='flex-end'
            checked={markAllPresent}
            onChange={(e) => {
              setMarkAllPresent(e.target.checked)
              setStudents(students.map(el =>
              ({
                ...el,
                status: e.target.checked === true
                  ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT
              })))
            }}
          >
            <Styles.CheckboxLabel> Mark All Present </Styles.CheckboxLabel>
          </Modal.CustomCheckbox>
          {students.map((student) => (
            <Modal.FlexContainer style={{ justifyContent: 'space-between', padding: '0px 0px 22px' }}>
              <Modal.FlexContainer style={{ padding: '0px 12vw 0px 0px', alignItems: 'center' }}>
                {get(student, 'userData.profilePic.uri') && <Styles.UserProfilePic bgImage={get(student, 'userData.profilePic.uri')} />}
                <Styles.StudentName>{get(student, 'userData.name')}</Styles.StudentName>
              </Modal.FlexContainer>
              <Modal.FlexContainer style={{ padding: 0, alignItems: 'center' }}>
                <Styles.StatusText style={{ paddingRight: '12px' }}>
                  {get(student, 'status', '')}
                </Styles.StatusText>
                <TriStateButton
                  handleChange={(status) => {
                    setMarkAllPresent(false)
                    updateLocalStudentAttendanceState(get(student, 'id'), status)
                    updateBatchSessionAttendance(get(student, 'id'), status)
                  }}
                  values={[
                    { val: AttendanceStatus.ABSENT, icon: <CrossSvg />, bg: TekieRed },
                    { val: AttendanceStatus.NOTASSIGNED, icon: <CircleFilledSvg />, bg: '#d0d0d0' },
                    { val: AttendanceStatus.PRESENT, icon: <CheckSvg />, bg: TekieGreen }
                  ]}
                  selected={get(student, 'status')}
                />
              </Modal.FlexContainer>
            </Modal.FlexContainer>
          ))}
        </Modal.Content>
        {/* Modal Footer */}
        <Modal.Footer>
          {renderModalFooter()}
        </Modal.Footer>
      </Modal.ModalBox>
    </Modal.WithBackdrop>
  )
}

export default AvailabilityModal
