import React, { memo } from 'react'
import { Tag, Divider } from 'antd'
import MainModal from '../../../components/MainModal'

// const titleStyle = { fontSize: '23px', fontWeight: '500', color: '#1c91ff' }

const TagsModal = ({
  visible,
  timeStampIndex,
  timeStampComment,
  closeModal,
  tagList,
  onTagsChange,
  onTagsDelete }) => {
  const renderTags = () => (
    tagList.map((quality) => {
      const existTag = timeStampComment[timeStampIndex].answerTimestampTags.find(tagValue =>
        tagValue.title === quality.title)
      if (!existTag) {
        return (
          <>
            <Tag
              key={quality.title}
              style={{
                cursor: 'pointer',
                borderRadius: '100px',
                padding: '9px 16px 8px 15px',
                color: '#fff',
                margin: '5px 10px',
                backgroundColor: '#8C61CB'
            }}
              onClick={() => onTagsChange(quality.title, timeStampIndex)}
            >
              {quality.title}
            </Tag>
        </>
        )
      }
    })
  )

  const renderSelectedTags = () => (
    tagList.map((quality) => {
      const existTag = timeStampComment[timeStampIndex].answerTimestampTags.find(tagValue =>
        tagValue.title === quality.title)
      if (existTag) {
        return (
          <>
            <Tag
              key={quality.title}
              closable
              style={{
                borderRadius: '100px',
                padding: '9px 16px 8px 15px',
                color: '#fff',
                margin: '5px 10px',
                backgroundColor: '#8C61CB'
            }}
              onClose={() => onTagsDelete(quality.title, timeStampIndex)}
            >
              {quality.title}
            </Tag>
        </>
        )
      }
    })
  )
  return (
    <>
      {timeStampComment[timeStampIndex] && (
      <MainModal
        visible={visible}
        title='Add Tags'
        onCancel={closeModal}
        maskClosable
        width='568px'
        centered
        destroyOnClose
        footer={null}
      >
        {renderTags()}
        <Divider />
        <p>Selected Tags</p>
        {renderSelectedTags()}
      </MainModal>

      )}
    </>
  )
}

export default memo(TagsModal)
