import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { updateComicStrip } from '../../../../actions/contentMaker'
import { FlexContainer, StyledSwitch } from '../Comic.styles'

const PublishSwitcher = (props) => {
  const { comicId, status } = props
  const [isSubmitting, setSubmitting] = useState(false)
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
    setSubmitting(true)
    setShowPopup(true)
    const { updateComicStrip: data } = await updateComicStrip({ input, comicId })
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
  }
  const checkStatus = () => status === 'published'
  return (
    <FlexContainer style={{ justifyContent: 'flex-end', padding: '30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Comic ?`}
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
        {checkStatus() ? ' Published ' : ' Unpublished '}
      </Popconfirm>
    </FlexContainer>
  )
}

export default PublishSwitcher
