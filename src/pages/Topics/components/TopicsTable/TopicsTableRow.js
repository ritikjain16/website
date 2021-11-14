import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import ActionsPanel from '../../../../components/ActionsPanel'
import getFullPath from '../../../../utils/getFullPath'

const TopicsTableRow = ({
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
  isTrial,
  isVideoLOMapping,
  deleteTopic,
  openEditTopic,
  publishTopic,
  thumbnail,
  publishedLOCount,
  unPublishedLOCount,
  videoStatus,
  publishedPQCount,
  unPublishedPQCount,
  publishedQuizCount,
  unPublishedQuizCount,
  publishedBadgesCount,
  unPublishedBadgesCount,
  unpublishTopic
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const created = formatDate(createdAt)
  const updated = formatDate(updatedAt)
  const isPublished = status === 'published'
  const alternateImageValue = 'Thumbnail'
  const onMouseEnter = () => {
    setIsHovering(true)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
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
      isVideoLOMapping={isVideoLOMapping}
    >
      <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
      <Table.Item>
        <MainTable.Item>
          <img src={getFullPath(get(thumbnail, 'uri'))}
            alt={alternateImageValue}
            style={{ height: '100%', width: '100%' }}
          />
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          <Link to={`/learning-objectives/${id}`}>{title}</Link>
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Tooltip title='published' placement='left'>
          <MainTable.Status status='published' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{publishedLOCount && publishedLOCount.count}
        </MainTable.Item>
        <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
        </MainTable.Item>
        <Tooltip title='unpublished' placement='left'>
          <MainTable.Status status='unpublished' isInlineItem='true' />
        </Tooltip>
        <MainTable.Item isInlineItem>{unPublishedLOCount && unPublishedLOCount.count}
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Tooltip title={videoStatus} placement='left'>
          <MainTable.Status status={videoStatus} />
        </Tooltip>
      </Table.Item>
      <Table.Item>
        <Tooltip title='published' placement='left'>
          <MainTable.Status status='published' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{publishedPQCount && publishedPQCount.count}
        </MainTable.Item>
        <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
        </MainTable.Item>
        <Tooltip title='unpublished' placement='left'>
          <MainTable.Status status='unpublished' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{unPublishedPQCount && unPublishedPQCount.count}
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Tooltip title='published' placement='left'>
          <MainTable.Status status='published' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{publishedQuizCount && publishedQuizCount.count}
        </MainTable.Item>
        <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
        </MainTable.Item>
        <Tooltip title='unpublished' placement='left'>
          <MainTable.Status status='unpublished' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{unPublishedQuizCount && unPublishedQuizCount.count}
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Tooltip title='published' placement='left'>
          <MainTable.Status status='published' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{publishedBadgesCount && publishedBadgesCount.count}
        </MainTable.Item>
        <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
        </MainTable.Item>
        <Tooltip title='unpublished' placement='left'>
          <MainTable.Status status='unpublished' isInlineItem />
        </Tooltip>
        <MainTable.Item isInlineItem>{unPublishedBadgesCount && unPublishedBadgesCount.count}
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <MainTable.DateItem>
          <div>{created.date}</div>
          <div>{created.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.DateItem>
          <div>{updated.date}</div>
          <div>{updated.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.Item>
          {isTrial ? 'Free' : 'Paid'}
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Tooltip title={status} placement='left'>
          <MainTable.Status status={status} />
        </Tooltip>
      </Table.Item>
      <Table.Item>
        <ActionsPanel
          id={id}
          title='Topics'
          isPublished={isPublished}
          publish={publishTopic}
          unpublish={unpublishTopic}
          deleteItem={deleteTopic}
          openEdit={openEditTopic}
        />
      </Table.Item>
    </MainTable.Row>
  )
}
TopicsTableRow.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  minWidth: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isTrial: PropTypes.bool.isRequired,
  isVideoLOMapping: PropTypes.bool.isRequired,
  deleteTopic: PropTypes.func.isRequired,
  publishTopic: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired,
  publishedLOCount: PropTypes.shape({}).isRequired,
  unPublishedLOCount: PropTypes.shape({}).isRequired,
  videoStatus: PropTypes.string.isRequired,
  publishedPQCount: PropTypes.shape({}).isRequired,
  unPublishedPQCount: PropTypes.shape({}).isRequired,
  publishedQuizCount: PropTypes.shape({}).isRequired,
  unPublishedQuizCount: PropTypes.shape({}).isRequired,
  publishedBadgesCount: PropTypes.shape({}).isRequired,
  unPublishedBadgesCount: PropTypes.shape({}).isRequired,
  unpublishTopic: PropTypes.func.isRequired,
  openEditTopic: PropTypes.func.isRequired,
}

export default TopicsTableRow
