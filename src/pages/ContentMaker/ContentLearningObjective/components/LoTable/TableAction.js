import { Popconfirm } from 'antd'
import React, { useState } from 'react'
import { deleteLearningObjective } from '../../../../../actions/contentMaker'
import MainTable from '../../../../../components/MainTable'
import { StyledDivider } from '../../ContentLearningObjective.styles'

const TableAction = (props) => {
  const { id, record, openEditModal, fetchLOCountValue } = props
  const [isSubmitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const deleteAction = async () => {
    setSubmitting(true)
    setShowPopup(true)
    const { deleteLearningObjective: data } = await deleteLearningObjective(id)
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
    fetchLOCountValue()
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
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon onClick={() => openEditModal(record)} />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <Popconfirm
          title='Do you want to delete this LO ?'
          placement='topRight'
          visible={showPopup}
          onConfirm={deleteAction}
          onCancel={() => setShowPopup(!showPopup)}
          okText='Yes'
          cancelText='Cancel'
          key='delete'
          okButtonProps={{ loading: isSubmitting }}
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

export default TableAction
