import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Icon, Tooltip } from 'antd'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import LearningObjectiveActions from '../LearningObjectiveActions'
import { LOGridItem } from './LearningObjectiveTable.style'

const LearningObjectiveTableRow = ({
  id,
  order,
  title,
  status,
  createdAt,
  updatedAt,
  columnsTemplate,
  noBorder,
  minWidth,
  isDeleting,
  publishedQuizCount,
  unpublishedQuizCount,
  publishedPQCount,
  unpublishedPQCount,
  leftTextMessagesCount,
  rightTextMessagesCount,
  messages,
  stickerMessagesCount,
  terminalMessagesCount,
  pqStory,
  learningObjective,
  ...rest
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const created = formatDate(createdAt)
  const updated = formatDate(updatedAt)
  const isPublished = status === 'published'

  const onMouseEnter = () => {
    setIsHovering(true)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
  }

  const getTotalEmojiCount = () => {
    let totalEmojiCount = 0
    messages.map((message) => (
      totalEmojiCount += message.emojiMessagesCount.count
    ))
    return totalEmojiCount
  }

  return (
    <MainTable.Row
      isDeleting={isDeleting}
      columnsTemplate={columnsTemplate}
      noBorder={noBorder}
      minWidth={minWidth}
      isHovering={isHovering}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={id}
      style={{ height: '100%' }}
    >
      <LOGridItem><Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item></LOGridItem>
      <LOGridItem>
        {title}
      </LOGridItem>
      <LOGridItem>
        <Table.Item>
          <Tooltip title='Left Messages Count' placement='left'>
            <MainTable.ItemBox isLeft title=''>{leftTextMessagesCount.count}</MainTable.ItemBox>
          </Tooltip>
        </Table.Item>
        <Table.Item>
          <Tooltip title='Right Messages Count' placement='right'>
            <MainTable.ItemBox>{rightTextMessagesCount.count}</MainTable.ItemBox>
          </Tooltip>
        </Table.Item>
        <Table.Item>
          <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }}>
            <Tooltip title='Emoji Count' placement='left'>
              <img src='/images/emoji.png' alt='Emoji' />
            </Tooltip>
          </MainTable.Item>
          <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{getTotalEmojiCount()}</MainTable.Item>
          <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|</MainTable.Item>
          <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }}>
            <Tooltip title='Sticker Count' placement='left'>
              <img src='/images/sticker.png' alt='Sticker' />
            </Tooltip>
          </MainTable.Item>
          <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{stickerMessagesCount.count}</MainTable.Item>
          <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|</MainTable.Item>
          <Tooltip title='Terminal Count' placement='right'>
            <Icon type='code' style={{ fontSize: '20px', margin: '2px 0 0 0' }} />
          </Tooltip>
          <MainTable.Item isInlineItem style={{ margin: '2px 0 0 0' }} >{terminalMessagesCount.count}</MainTable.Item>
        </Table.Item>
      </LOGridItem>
      <LOGridItem>
        <Table.Item>
          <Tooltip title='published' placement='left'>
            <MainTable.Status status='published' isInlineItem />
          </Tooltip>
          <MainTable.Item isInlineItem>{publishedQuizCount.count}
          </MainTable.Item>
          <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
          </MainTable.Item>
          <Tooltip title='unpublished' placement='left'>
            <MainTable.Status status='unpublished' isInlineItem />
          </Tooltip>
          <MainTable.Item isInlineItem>{unpublishedQuizCount.count}
          </MainTable.Item>
        </Table.Item>
      </LOGridItem>
      <LOGridItem>
        <Table.Item>
          <Tooltip title='published' placement='left'>
            <MainTable.Status status='published' isInlineItem />
          </Tooltip>
          <MainTable.Item isInlineItem>{publishedPQCount.count}
          </MainTable.Item>
          <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
          </MainTable.Item>
          <Tooltip title='unpublished' placement='left'>
            <MainTable.Status status='unpublished' isInlineItem='true' />
          </Tooltip>
          <MainTable.Item isInlineItem>{unpublishedPQCount.count}
          </MainTable.Item>
        </Table.Item>
      </LOGridItem>
      <LOGridItem>
        {pqStory}
      </LOGridItem>
      <LOGridItem>
        <div>{created.date}</div>
        <div>{created.time}</div>
      </LOGridItem>
      <LOGridItem>
        <div>{updated.date}</div>
        <div>{updated.time}</div>
      </LOGridItem>
      <Table.Item>
        <Tooltip title={status} placement='left'>
          <MainTable.Status status={status} />
        </Tooltip>
      </Table.Item>
      <LearningObjectiveActions
        id={id}
        isPublished={isPublished}
        learningObjective={learningObjective}
        deleteLearningObjective={loId => () => {
          rest.deleteLearningObjective(loId)
        }}
        editLearningObjective={rest.editLearningObjective}
        ordersInUse={rest.ordersInUse}
        publish={rest.publishLearningObjective}
        unpublish={rest.unPublishLearningObjective}
        removeThumbnail={rest.removeThumbnail}
        removePQStoryImage={rest.removePQStoryImage}
      />
    </MainTable.Row>
  )
}
LearningObjectiveTableRow.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  minWidth: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  deleteTopic: PropTypes.func.isRequired,
  publishTopic: PropTypes.func.isRequired,
  unpublishTopic: PropTypes.func.isRequired,
  openEditTopic: PropTypes.func.isRequired,
  practiceQuestionMeta: PropTypes.shape({}).isRequired,
  pqStory: PropTypes.shape({}).isRequired,
  publishedQuizCount: PropTypes.shape({}).isRequired,
  unpublishedQuizCount: PropTypes.shape({}).isRequired,
  publishedPQCount: PropTypes.shape({}).isRequired,
  unpublishedPQCount: PropTypes.shape({}).isRequired,
  leftTextMessagesCount: PropTypes.shape({}).isRequired,
  rightTextMessagesCount: PropTypes.shape({}).isRequired,
  messages: PropTypes.shape({}).isRequired,
  stickerMessagesCount: PropTypes.shape({}).isRequired,
  terminalMessagesCount: PropTypes.shape({}).isRequired,
  learningObjective: PropTypes.shape({}).isRequired
}

export default LearningObjectiveTableRow
