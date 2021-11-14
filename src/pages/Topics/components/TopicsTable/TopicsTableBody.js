import React from 'react'
import { Icon, Spin } from 'antd'
import PropTypes from 'prop-types'
import { get, sortBy } from 'lodash'
import TopicsTableRow from './TopicsTableRow'
import MainTable from '../../../../components/MainTable'
import { nestTopicsInChapter, getDataById } from '../../../../utils/data-utils'

const TopicsTableBody = ({
  chapters,
  topics,
  deletingTopicsId,
  columnsTemplate,
  minWidth,
  isFetchingTopics,
  hasTopicsFetched,
  fetchingTopicsError,
  isVideoLOMapping,
  currentCourse,
  ...rest
}) => {
  if (isFetchingTopics) {
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return (
      <div style={{ width: '100%', padding: '15px' }}>
        <Spin indicator={loadingIcon} />
      </div>
    )
  }
  if (hasTopicsFetched && topics.length === 0) {
    const emptyText = 'Topics is empty. Click on \'Add Topics\' button to add topics.'
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }

  if (fetchingTopicsError !== null) {
    const emptyText = `Error: ${fetchingTopicsError}`
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }
  const nestedTopicsInChapter = nestTopicsInChapter(topics)
  const lastChapterIndex = nestedTopicsInChapter - 1
  return sortBy(nestedTopicsInChapter, 'order').map((chapter, chapterIndex) => {
    if (get(chapter, 'courses', []).length && get(chapter, 'courses[0].id') === currentCourse) {
      const lastTopicIndex = chapter.topics.length - 1
      return (
        <div>
          <MainTable.TitleBlock minWidth={minWidth}>
            {getDataById(chapters, chapter.id).title}
          </MainTable.TitleBlock>
          {sortBy(chapter.topics, 'order').map((topic, topicIndex) => (
            <TopicsTableRow
              {...topic}
              {...rest}
              key={topic.id}
              isDeleting={topic.id === deletingTopicsId}
              columnsTemplate={columnsTemplate}
              minWidth={minWidth}
              noBorder={
                chapterIndex === lastChapterIndex &&
                topicIndex === lastTopicIndex
              }
              isVideoLOMapping={isVideoLOMapping}
            />
          ))}
        </div>
      )
    }
    return <></>
  })
}

TopicsTableBody.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletingTopicsId: PropTypes.bool.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isFetchingTopics: PropTypes.bool.isRequired
}

export default TopicsTableBody
