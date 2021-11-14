import { Popconfirm, Tooltip } from 'antd'
import React, { memo, useState } from 'react'
import { updateAuditQuestion } from '../../../../actions/auditQuestion'
import MainTable from '../../../../components/MainTable'
import { PUBLISHED_STATUS } from '../../../../constants/questionBank'
import { AuditStatus } from '../../AuditBuilder.style'

const AuditPublisher = (props) => {
  const { status, auditQuestionId } = props
  const isPublished = status === PUBLISHED_STATUS
  const [showPopup, setShowPopup] = useState(false)
  const updateStatus = async () => {
    let input = {
      status: 'unpublished'
    }
    if (status === 'unpublished') {
      input = {
        status: 'published',
      }
    }
    const { updateBlockBasedProject: data } = await updateAuditQuestion({ input, auditQuestionId })
    if (data && data.id) {
      setShowPopup(false)
    } else {
      setShowPopup(false)
    }
  }
  return (
    <MainTable.ActionItem.IconWrapper>
      <Popconfirm
        title={`Do you want to ${isPublished ? 'unpublish' : 'publish'} this audit question ?`}
        placement='topRight'
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        okText='Yes'
        cancelText='Cancel'
        key='delete'
        overlayClassName='popconfirm-overlay-primary'
      >
        <Tooltip
          title={`${status} Audit`}
          placement='right'
        >
          <AuditStatus
            status={status}
            onClick={() => {
              setShowPopup(!showPopup)
              // if (status === PUBLISHED_STATUS) {
              //   notification.warn({
              //     message: 'Cannot change status of published question'
              //   })
              // } else {
              //   setShowPopup(!showPopup)
              // }
            }}
          />
        </Tooltip>
      </Popconfirm>
    </MainTable.ActionItem.IconWrapper>
  )
}

export default memo(AuditPublisher)
