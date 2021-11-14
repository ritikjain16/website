import { Popconfirm } from 'antd'
import React, { memo, useState } from 'react'
import { deleteAuditQuestion } from '../../../../actions/auditQuestion'
import MainTable from '../../../../components/MainTable'
import { StyledDivider } from '../../AuditBuilder.style'

const AuditTableAction = (props) => {
  const { auditQuestionId,
    openEdit, onAuditView } = props
  const [showPopup, setShowPopup] = useState(false)
  const deleteAction = async () => {
    const { deleteAuditQuestion: data } = await deleteAuditQuestion({ auditQuestionId })
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
        onClick={onAuditView}
      >
        <MainTable.ActionItem.EyeIcon />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <MainTable.ActionItem.EditIcon
          onClick={() => {
            openEdit()
            // if (get(record, 'status') === PUBLISHED_STATUS) {
            //   notification.warn({
            //     message: 'Cannot edit published question'
            //   })
            // } else {
            //   openEdit()
            // }
          }}
        />
      </MainTable.ActionItem.IconWrapper>
      <StyledDivider type='vertical' />
      <MainTable.ActionItem.IconWrapper>
        <Popconfirm
          title='Do you want to delete this audit question ?'
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
            <MainTable.ActionItem.DeleteIcon onClick={() => {
              setShowPopup(!showPopup)
              // if (get(record, 'status') === PUBLISHED_STATUS) {
              //   notification.warn({
              //     message: 'Cannot delete published question'
              //   })
              // } else {
              //   setShowPopup(!showPopup)
              // }
            }}
            />
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
      </MainTable.ActionItem.IconWrapper>
    </div>
  )
}

export default memo(AuditTableAction)
