import { Popconfirm } from 'antd'
import React, { useState } from 'react'
import { deleteProject } from '../../../../actions/projects'
import MainTable from '../../../../components/MainTable'
import { StyledDivider } from './ProjectTable.style'

const TableAction = (props) => {
  const { id, record, setEditModal } = props
  const [isSubmitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const deleteAction = async () => {
    setSubmitting(true)
    setShowPopup(true)
    const { deleteWorkbook: data } = await deleteProject(id)
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
    } else {
      setSubmitting(false)
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
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon onClick={() => setEditModal(record)} />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <Popconfirm
          title='Do you want to delete this project ?'
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
