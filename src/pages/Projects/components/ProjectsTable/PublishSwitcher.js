import React, { useState } from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { StyledSwitch } from './ProjectTable.style'
import { updateProject } from '../../../../actions/projects'

const PublishSwitcher = (props) => {
  const { projectId, status, searchByFilter } = props
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
    const { updateWorkbook: data } = await updateProject({ id: projectId, ...input })
    if (data && data.id) {
      setSubmitting(false)
      setShowPopup(false)
      searchByFilter()
    } else {
      setSubmitting(false)
      setShowPopup(false)
    }
  }
  const checkStatus = () => status === 'published'
  return (
    <div style={{ justifyContent: 'center' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this project ?`}
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        placement='topRight'
        okText='Yes'
        okButtonProps={{ loading: isSubmitting }}
        cancelText='Cancel'
        key='toggle'
      >
        <Tooltip title={checkStatus() ? ' Published ' : ' Unpublished '} >
          <StyledSwitch
            bgcolor={checkStatus() ? '#64da7a' : '#ff5744'}
            checked={checkStatus()}
            defaultChecked={checkStatus()}
            onChange={() => setShowPopup(!showPopup)}
            size='default'
          />
        </Tooltip>
      </Popconfirm>
    </div>
  )
}

export default PublishSwitcher
