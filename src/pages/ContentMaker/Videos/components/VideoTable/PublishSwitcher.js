import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { FlexContainer, StyledSwitch } from '../../Videos.styles'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../../constants/questionBank'
import { updateVideo } from '../../../../../actions/contentMaker'

const PublishSwitcher = (props) => {
  const { videoId, status } = props
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
    const { updateVideo: data } = await updateVideo({ videoId, input })
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
    <FlexContainer style={{ justifyContent: 'center', padding: '0px 30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Video ?`}
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
    </FlexContainer>
  )
}

export default PublishSwitcher
