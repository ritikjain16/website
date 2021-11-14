import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { StyledSwitch, TopContainer } from '../../AddCourse.styles'
import { updateCourse } from '../../../../actions/courseMaker'

const PublishSwitcher = (props) => {
  const { courseId, status } = props
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
    const { updateCourse: data } = await updateCourse({ courseId, input })
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
    <TopContainer style={{ justifyContent: 'center', padding: '0px 30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Course ?`}
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
      {checkStatus() ? ' Published ' : ' Unpublished '}
    </TopContainer>
  )
}

export default PublishSwitcher
