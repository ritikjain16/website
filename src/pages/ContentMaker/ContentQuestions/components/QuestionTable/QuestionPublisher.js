import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { QuestionContainer, StyledSwitch } from '../../ContentQuestions.style'
import { updateQuestionBank } from '../../../../../actions/contentMaker'
import {
  PUBLISHED_STATUS, UNPUBLISHED_STATUS
} from '../../../../../constants/questionBank'

const QuestionPublisher = (props) => {
  const { questionId, status, assessmentType } = props
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
    setShowPopup(true)
    const { updateQuestionBank: data } =
      await updateQuestionBank({
        questionId,
        input,
        key: assessmentType
      })
    if (data && data.id) {
      setShowPopup(false)
    } else {
      setShowPopup(false)
    }
  }
  const checkStatus = () => status === PUBLISHED_STATUS
  return (
    <QuestionContainer
      style={{
      justifyContent: 'center',
      padding: '0px'
    }}
    >
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this ${assessmentType} ?`}
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        placement='topRight'
        okText='Yes'
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
    </QuestionContainer>
  )
}

export default QuestionPublisher
