import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import ActionsPanel from '../../../../components/ActionsPanel'

const ChaptersTableRow = ({
  id,
  order,
  title,
  description,
  status,
  createdAt,
  updatedAt,
  topicsCount,
  columnsTemplate,
  noBorder,
  minWidth,
  isDeleting,
  deleteChapter,
  openEditChapter,
  publishChapter,
  unpublishChapter,
  // courses,
  // coursesInState
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

  return (
    <MainTable.Row
      isDeleting={isDeleting}
      columnsTemplate={columnsTemplate}
      noBorder={noBorder}
      minWidth={minWidth}
      isHovering={isHovering}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{title}</MainTable.Item></Table.Item>
      <Table.Item>
        <MainTable.Item>
          {description}
        </MainTable.Item>
      </Table.Item>
      {/* <SessionTable.Item>
        {courses.filter(course => {
          const stateCoursesLength = coursesInState.length
          for (let count = 0; count < stateCoursesLength; count += 1) {
            if (course.id === coursesInState[count].id) {
              return true
            }
          }
          return false
        }).map(course => <MainTable.Item key={course.id}>{course.title}</MainTable.Item>)}
      </SessionTable.Item> */}
      <Table.Item>
        <MainTable.Item>
          {topicsCount}
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
        <Tooltip title={status} placement='left'>
          <MainTable.Status status={status} />
        </Tooltip>
      </Table.Item>
      <Table.Item>
        <ActionsPanel
          id={id}
          title='Chapter'
          isPublished={isPublished}
          publish={publishChapter}
          unpublish={unpublishChapter}
          deleteItem={deleteChapter}
          openEdit={openEditChapter}
        />
      </Table.Item>
    </MainTable.Row>
  )
}
ChaptersTableRow.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  minWidth: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  topicsCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  deleteChapter: PropTypes.func.isRequired,
  publishChapter: PropTypes.func.isRequired,
  unpublishChapter: PropTypes.func.isRequired,
  openEditChapter: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  coursesInState: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default ChaptersTableRow
