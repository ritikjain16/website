import { Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import {
  ASSIGNMENT, COMICSTRIP,
  LEARNING_OBJECTIVE, PRACTICE, PROJECT, QUIZ, VIDEO
} from '../../../../constants/CourseComponents'
import getComponentName from '../../../../utils/getComponentName'
import { TableTab } from '../../AddSessions.styles'
import ComponentIcon from '../session-utils/ComponentIcon'

const TopicComponents = (props) => {
  const { data } = props
  const statusView = (published, unPublished) => (
    <Table.Item style={{ backgroundColor: 'transparent' }}>
      <Tooltip title='published' placement='left'>
        <MainTable.Status status='published' isInlineItem />
      </Tooltip>
      <MainTable.Item isInlineItem>{published}
      </MainTable.Item>
      <MainTable.Item isInlineItem style={{ opacity: '0.5' }}>|
      </MainTable.Item>
      <Tooltip title='unpublished' placement='left'>
        <MainTable.Status status='unpublished' isInlineItem />
      </Tooltip>
      <MainTable.Item isInlineItem>{unPublished}
      </MainTable.Item>
    </Table.Item>
  )
  const getDataView = () => {
    const dataView = []
    if (get(data, 'publishedLOCount.count', 0) > 0 || get(data, 'unPublishedLOCount.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={LEARNING_OBJECTIVE} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(LEARNING_OBJECTIVE)}
          </strong>
          {statusView(get(data, 'publishedLOCount.count', 0), get(data, 'unPublishedLOCount.count', 0))}
        </TableTab>
      )
    }
    if (get(data, 'publishedVideoCount.count', 0) > 0 || get(data, 'unPublishedVideoCount.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={VIDEO} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(VIDEO)}
          </strong>
          {statusView(get(data, 'publishedVideoCount.count', 0), get(data, 'unPublishedVideoCount.count', 0))}
        </TableTab>
      )
    }
    if (get(data, 'publishedComicCount') || get(data, 'unPublishedComicCount')) {
      let publishedComic = 0
      let unPublishedComic = 0
      get(data, 'publishedComicCount', []).forEach(comic => publishedComic += get(comic, 'comicStripsMeta.count'))
      get(data, 'unPublishedComicCount', []).forEach(comic => unPublishedComic += get(comic, 'comicStripsMeta.count'))
      if (publishedComic > 0 || unPublishedComic > 0) {
        dataView.push(
          <TableTab>
            <ComponentIcon componentName={COMICSTRIP} />
            <strong style={{ margin: '0 10px' }}>
              {getComponentName(COMICSTRIP)}
            </strong>
            {statusView(publishedComic, unPublishedComic)}
          </TableTab>
        )
      }
    }
    if (get(data, 'publishedQuizCount.count', 0) > 0 || get(data, 'unPublishedQuizCount.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={QUIZ} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(QUIZ)}
          </strong>
          {statusView(get(data, 'publishedQuizCount.count', 0), get(data, 'unPublishedQuizCount.count', 0))}
        </TableTab>
      )
    }
    if (get(data, 'publishedAssignment.count', 0) > 0 || get(data, 'unPublishedAssignment.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={ASSIGNMENT} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(ASSIGNMENT)}
          </strong>
          {statusView(get(data, 'publishedAssignment.count', 0), get(data, 'unPublishedAssignment.count', 0))}
        </TableTab>
      )
    }
    if (get(data, 'publishedProjectCount.count', 0) > 0 || get(data, 'unPublishedProjectCount.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={PROJECT} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(PROJECT)}
          </strong>
          {statusView(get(data, 'publishedProjectCount.count', 0), get(data, 'unPublishedProjectCount.count', 0))}
        </TableTab>
      )
    }
    if (get(data, 'publishedPracticeCount.count', 0) > 0 || get(data, 'unPublishedPracticeCount.count', 0) > 0) {
      dataView.push(
        <TableTab>
          <ComponentIcon componentName={PRACTICE} />
          <strong style={{ margin: '0 10px' }}>
            {getComponentName(PRACTICE)}
          </strong>
          {statusView(get(data, 'publishedPracticeCount.count', 0), get(data, 'unPublishedPracticeCount.count', 0))}
        </TableTab>
      )
    }
    return dataView
  }
  return <div style={{ display: 'flex', alignItems: 'center' }}>{getDataView()}</div>
}

export default TopicComponents
