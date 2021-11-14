import React, { useState } from 'react'
import { Popconfirm } from 'antd'
import { StyledSwitch, ChapterFlex } from '../AddChapter.style'
import { updateChapter } from '../../../actions/courseMaker'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../constants/questionBank'

const ChapterPublish = (props) => {
  const { chapterId, status } = props
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
    const { updateChapter: data } = await updateChapter({ chapterId, input })
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
    <ChapterFlex style={{ justifyContent: 'center', padding: '0px 30px' }}>
      <Popconfirm
        title={`Do you want to ${checkStatus() ? 'unpublish' : 'publish'} this Chapter ?`}
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
    </ChapterFlex>
  )
}

export default ChapterPublish
