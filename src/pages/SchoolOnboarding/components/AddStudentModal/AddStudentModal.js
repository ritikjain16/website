import { notification } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { updateStudentProfile } from '../../../../actions/SchoolOnboarding'
import parentChildSignUp from '../../../../actions/ums/parentChildSignUp'
import MainModal from '../../../../components/MainModal'
import {
  CloseIcon, FlexContainer, StyledDivider,
} from '../../SchoolOnBoarding.style'
import AddForm from './AddForm'
import EditForm from './EditForm'

class AddStudentModal extends React.Component {
  componentDidUpdate = (prevProps) => {
    const { parentSignUpStatus, onClose,
      parentSignUpFailure, studentProfileUpdateStatus, studentProfileUpdateFailure } = this.props
    if ((parentSignUpStatus && !get(parentSignUpStatus.toJS(), 'loading')
      && get(parentSignUpStatus.toJS(), 'success') &&
      (prevProps.parentSignUpStatus !== parentSignUpStatus))) {
      notification.success({
        message: 'Student added Successfully'
      })
      onClose()
    } else if (parentSignUpStatus && !get(parentSignUpStatus.toJS(), 'loading')
      && get(parentSignUpStatus.toJS(), 'failure') &&
      (prevProps.parentSignUpFailure !== parentSignUpFailure)) {
      if (parentSignUpFailure && parentSignUpFailure.toJS().length > 0) {
        notification.error({
          message: get(get(parentSignUpFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }


    if ((studentProfileUpdateStatus && !get(studentProfileUpdateStatus.toJS(), 'loading')
      && get(studentProfileUpdateStatus.toJS(), 'success') &&
      (prevProps.studentProfileUpdateStatus !== studentProfileUpdateStatus))) {
      notification.success({
        message: 'Student Updated Successfully'
      })
      onClose()
    } else if (studentProfileUpdateStatus && !get(studentProfileUpdateStatus.toJS(), 'loading')
      && get(studentProfileUpdateStatus.toJS(), 'failure') &&
      (prevProps.studentProfileUpdateFailure !== studentProfileUpdateFailure)) {
      if (studentProfileUpdateFailure && studentProfileUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(studentProfileUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }

  handleStudentAdd = async (values) => {
    const {
      parentName, childName, parentEmail,
      countryCode, phoneNumber, grade, section
    } = values
    const { schoolId, schoolName } = this.props
    const input = {
      parentName,
      childName,
      parentEmail,
      parentPhone: { countryCode, number: phoneNumber },
      grade,
      schoolName
    }
    if (section) input.section = section
    await parentChildSignUp(input, schoolId)
  }
  handleStudentEdit = async (values) => {
    const { editStudent } = this.props
    const prevParentName = get(editStudent, 'parentName')
    const prevChildName = get(editStudent, 'studentName')
    const prevParentEmail = get(editStudent, 'parents[0].user.email', '')
    const prevParentNumber = get(editStudent, 'parents[0].user.phone.number', '')
    const prevGrade = get(editStudent, 'grade')
    const prevSection = get(editStudent, 'section')
    const parentId = get(editStudent, 'parents[0].user.id')
    const studentId = get(editStudent, 'user.id')
    const profileId = get(editStudent, 'id')
    const {
      parentName, childName, parentEmail,
      countryCode, phoneNumber, grade, section
    } = values
    let updateQuery = ''
    if (prevParentName !== parentName
      || prevParentEmail !== parentEmail
      || prevParentNumber !== phoneNumber) {
      updateQuery += `
      updateParent: updateUser(
        id: "${parentId}"
        input: { name: "${parentName}", email: "${parentEmail}",
        phone: { countryCode: "${countryCode}", number: "${phoneNumber}" } }
      ) {
        id
      }`
    }
    if (prevChildName !== childName) {
      updateQuery += `updateStudent: updateUser(id: "${studentId}",
      input: { name: "${childName}" }) { id }`
    }
    if (prevGrade !== grade || prevSection !== section) {
      updateQuery += `updateStudentProfile(id: "${profileId}",
      input: { grade: ${grade}, section: ${section} }) {
        id
      }`
    }
    if (updateQuery) {
      await updateStudentProfile(updateQuery)
    } else {
      notification.warn({
        message: 'Please update some data'
      })
    }
  }
  render() {
    const {
      visible, title, schoolName,
      parentSignUpStatus, editStudent, onClose,
      gradeToAdd, sectionToAdd, studentProfileUpdateStatus
    } = this.props
    return (
      <MainModal
        visible={visible}
        onCancel={onClose}
        maskClosable
        bodyStyle={{ padding: 0 }}
        width='650px'
        closable={false}
        centered
        destroyOnClose
        footer={null}
      >
        <FlexContainer noPadding style={{ width: '100%' }}>
          <div style={{ padding: '0.5vw 1.5vw' }}>
            <h1>{title}</h1>
            {
              editStudent ? (
                <h3>
                  {get(editStudent, 'grade')
                  && <span>For <strong>{get(editStudent, 'grade')} </strong></span>}
                  under <strong>{schoolName}</strong>
                </h3>
              ) : (
                <h3>
                  {gradeToAdd
                  && <span>For <strong>{gradeToAdd} </strong></span>}
                  under <strong>{schoolName}</strong>
                </h3>
              )
            }
            <CloseIcon onClick={onClose} />
          </div>
        </FlexContainer>
        <StyledDivider style={{ marginBottom: '1vw' }} />
        <FlexContainer
          justify='center'
          style={{ flexDirection: 'column', paddingBottom: '1vw' }}
        >
          {
            !editStudent ? (
              <AddForm
                parentSignUpStatus={parentSignUpStatus}
                gradeToAdd={gradeToAdd}
                sectionToAdd={sectionToAdd}
                handleStudentAdd={this.handleStudentAdd}
                onModalClose={onClose}
              />
            ) : (
              <EditForm
                studentProfileUpdateStatus={studentProfileUpdateStatus}
                editStudent={editStudent}
                onModalClose={onClose}
                handleStudentEdit={this.handleStudentEdit}
              />
            )
          }
        </FlexContainer>
      </MainModal>
    )
  }
}

export default AddStudentModal
