import React, { useState } from 'react'
import { Popconfirm } from 'antd'
// import updateUserSavedCode from '../../../../actions/userSavedCodes/updateUserSavedCode'
import WorkbookStyle from '../../Workbook.style'
import { updateWorkbook } from '../../../../actions/workbook'

const PublishSwitcher = (props) => {
  const { workbookId, status, searchByFilter } = props
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
    const { updateWorkbook: data } = await updateWorkbook({ id: workbookId, ...input })
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
    <WorkbookStyle.TopContainer style={{ justifyContent: 'center', padding: '0px 30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this workbook ?`}
        visible={showPopup}
        onConfirm={updateStatus}
        onCancel={() => setShowPopup(!showPopup)}
        placement='topRight'
        okText='Yes'
        okButtonProps={{ loading: isSubmitting }}
        cancelText='Cancel'
        key='toggle'
      >
        <WorkbookStyle.StyledSwitch
          bgcolor={checkStatus() ? '#64da7a' : '#ff5744'}
          checked={checkStatus()}
          defaultChecked={checkStatus()}
          onChange={() => setShowPopup(!showPopup)}
          size='default'
        />
      </Popconfirm>
      {checkStatus() ? ' Published ' : ' Unpublished '}
    </WorkbookStyle.TopContainer>
  )
}

export default PublishSwitcher
