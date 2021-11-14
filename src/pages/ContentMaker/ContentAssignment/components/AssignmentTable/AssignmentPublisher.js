import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { AssignmentContainer, StyledSwitch } from '../../ContentAssignment.style'
import { updateAssignmentQuestion } from '../../../../../actions/contentMaker'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../../constants/questionBank'

const AssignmentPublisher = (props) => {
  const { assignmentId, status, currentComponent } = props
  const [isSubmitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const updateStatus = async () => {
    let input = {
      status: UNPUBLISHED_STATUS
    }
    if (status === UNPUBLISHED_STATUS) {
      input = {
        status: PUBLISHED_STATUS,
      }
    }
    setSubmitting(true)
    setShowPopup(true)
    const { updateAssignmentQuestion: data } =
      await updateAssignmentQuestion({
        assignmentId,
        input,
        componentName: currentComponent
      })
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
  }
  const checkStatus = () => status === PUBLISHED_STATUS
  return (
    <AssignmentContainer style={{ justifyContent: 'center', padding: '0px 30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Assignment ?`}
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        placement='topRight'
        okText='Yes'
        okButtonProps={{ loading: isSubmitting }}
        cancelText='Cancel'
        key='toggle'
      >
        <StyledSwitch
          bgcolor={checkStatus() ? '#64da7a' : '#ff5744'}
          checked={checkStatus()}
          defaultChecked={checkStatus()}
          onChange={() => setShowPopup(!showPopup)}
          size='default'
        />
      </Popconfirm>
    </AssignmentContainer>
  )
}

export default AssignmentPublisher
