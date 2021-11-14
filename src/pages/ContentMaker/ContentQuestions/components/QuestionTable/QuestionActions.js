import { Popconfirm } from 'antd'
import React, { useState } from 'react'
import { deleteQuestionBank } from '../../../../../actions/contentMaker'
import MainTable from '../../../../../components/MainTable'
import { StyledDivider } from '../../ContentQuestions.style'

const QuestionActions = (props) => {
  const { questionId, openEmulatorView,
    setEmulatorViewQuestions, questions,
    openEdit, assessmentType } = props
  const [showPopup, setShowPopup] = useState(false)
  const deleteAction = async () => {
    setShowPopup(true)
    const { deleteQuestionBank: data } = await deleteQuestionBank({
      id: questionId,
      key: assessmentType
    })
    if (data && data.id) {
      setShowPopup(false)
    } else {
      setShowPopup(false)
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        padding: '8px 0',
      }}
    >
      <MainTable.ActionItem.IconWrapper
        onClick={() => {
          openEmulatorView(questionId)
          setEmulatorViewQuestions(questions)
        }}
      >
        <MainTable.ActionItem.EyeIcon />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon onClick={() => openEdit(questionId)} />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <Popconfirm
          title={`Do you want to delete this ${assessmentType} ?`}
          placement='topRight'
          visible={showPopup}
          onConfirm={deleteAction}
          onCancel={() => setShowPopup(!showPopup)}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
          overlayClassName='popconfirm-overlay-primary'
        >
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.DeleteIcon onClick={() => setShowPopup(!showPopup)} />
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
      </MainTable.ActionItem.IconWrapper>
    </div>
  )
}

export default QuestionActions
