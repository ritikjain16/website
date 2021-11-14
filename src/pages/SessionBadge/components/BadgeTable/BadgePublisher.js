import React, { useState } from 'react'
import { notification, Popconfirm } from 'antd'
import { BadgeContainer, StyledSwitch } from '../../SessionBadge.style'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../constants/questionBank'
import { updateBadge } from '../../../../actions/courseMaker'

const BadgePublisher = (props) => {
  const { badgeId, status } = props
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
    const { updateBadge: data } = await updateBadge({ badgeId, input })
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
      notification.success({
        message: 'Badge Update Successfully'
      })
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
  }
  const checkStatus = () => status === PUBLISHED_STATUS
  return (
    <BadgeContainer style={{ justifyContent: 'center', padding: '0px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Badge ?`}
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
    </BadgeContainer>
  )
}

export default BadgePublisher
