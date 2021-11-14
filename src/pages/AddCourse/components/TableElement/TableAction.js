import { Popconfirm } from 'antd'
import React, { useState } from 'react'
import { deleteCourse } from '../../../../actions/courseMaker'
import MainTable from '../../../../components/MainTable'
import { StyledDivider } from '../../AddCourse.styles'

const TableAction = (props) => {
  const { id, record, openEditModal, searchByFilter } = props
  const [isSubmitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const deleteAction = async () => {
    setSubmitting(true)
    setShowPopup(true)
    const { deleteCourse: data } = await deleteCourse(id)
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
    searchByFilter(false)
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
          title='Do you want to delete this course ?'
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
