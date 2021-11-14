import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
import ActionPanel from '../../../components/ActionsPanel'
import formatDate from '../../../utils/formatDate'
import { PUBLISHED_STATUS } from '../../../constants/questionBank'
/** @returns a row of course */
const CourseRow = (props) => {
  const [isHovering, setIsHovering] = useState(false)
  const { course: { id, order, title, description, chaptersMeta, category, status } } = props
  const createdAt = formatDate(props.course.createdAt)
  const updatedAt = formatDate(props.course.updatedAt)

  const onMouseEnter = () => {
    setIsHovering(true)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
  }
  return (
    <Table.Row
      isHovering={isHovering}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{title}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{description}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{chaptersMeta.count}</MainTable.Item></Table.Item>
      <Table.Item><MainTable.Item>{category}</MainTable.Item></Table.Item>
      <Table.Item>
        <MainTable.DateItem>
          <div>{createdAt.date}</div>
          <div>{createdAt.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.DateItem>
          <div>{updatedAt.date}</div>
          <div>{updatedAt.time}</div>
        </MainTable.DateItem>
      </Table.Item>
      <Table.Item>
        <MainTable.Status status={status} />
      </Table.Item>
      <Table.Item>
        <ActionPanel
          id={id}
          title='Course'
          deleteItem={props.deleteCourse}
          openEdit={props.openEditModal}
          publish={props.publishCourse}
          unpublish={props.unpublishCourse}
          isPublished={status === PUBLISHED_STATUS}
        />
      </Table.Item>
    </Table.Row>
  )
}
CourseRow.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string,
    order: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    status: PropTypes.string,
    chaptersMeta: PropTypes.shape({
      count: PropTypes.number
    })
  }).isRequired,
  // function to open edit modal
  openEditModal: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  publishCourse: PropTypes.func.isRequired,
  unpublishCourse: PropTypes.func.isRequired
}
export default CourseRow
