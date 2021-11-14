import React, { useState } from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { updateCheatSheet } from '../../../actions/cheatSheet'
import CheatSheetStyle from '../CheetSheet.style'

const PublishSwitcher = (props) => {
  const { cheatSheetId, status } = props
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
    updateCheatSheet(input, cheatSheetId).then(() => {
      setSubmitting(false)
      setShowPopup(false)
      // fetchCheatSheet(topicId)
    }).catch(() => {
      setSubmitting(false)
      setShowPopup(false)
    })
  }
  const checkStatus = () => status === 'published'
  return (
    <CheatSheetStyle.TopContainer style={{ justifyContent: 'center', padding: '0px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this CheatSheet ?`}
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        placement='topRight'
        okText='Yes'
        okButtonProps={{ loading: isSubmitting }}
        cancelText='Cancel'
        key='toggle'
      >
        <Tooltip title={checkStatus() ? ' Published ' : ' Unpublished '}>
          <CheatSheetStyle.StyledSwitch
            bgcolor={checkStatus() ? '#64da7a' : '#ff5744'}
            checked={checkStatus()}
            defaultChecked={checkStatus()}
            onChange={() => setShowPopup(!showPopup)}
            size='default'
          />
        </Tooltip>
      </Popconfirm>
    </CheatSheetStyle.TopContainer>
  )
}

export default PublishSwitcher
