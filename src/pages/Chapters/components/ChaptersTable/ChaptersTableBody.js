import React from 'react'
import { Icon, Spin } from 'antd'
import PropTypes from 'prop-types'
import ChaptersTableRow from './ChaptersTableRow'
import MainTable from '../../../../components/MainTable'

const ChaptersTableBody = ({
  chapters,
  deletingChaptersId,
  columnsTemplate,
  minWidth,
  isFetchingChapters,
  hasChaptersFetched,
  fetchingChaptersError,
  currentCourse,
  ...rest
}) => {
  if (isFetchingChapters) {
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return (
      <div style={{ width: '100%', padding: '15px' }}>
        <Spin indicator={loadingIcon} />
      </div>
    )
  }

  if (hasChaptersFetched && chapters.length === 0) {
    const emptyText = 'Chapters is empty. Click on \'Add Chapters\' button to add chapters.'
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }

  if (fetchingChaptersError !== null) {
    const emptyText = `Error: ${fetchingChaptersError}`
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }
  const lastChapterIndex = chapters.length - 1
  return chapters.map((chapter, i) => {
    if (chapter.courses[0].id === currentCourse) {
      return (
        <ChaptersTableRow
          {...chapter}
          {...rest}
          key={chapter.id}
          isDeleting={chapter.id === deletingChaptersId}
          columnsTemplate={columnsTemplate}
          minWidth={minWidth}
          noBorder={i === lastChapterIndex}
        />
      )
    }
    return <></>
  })
}

ChaptersTableBody.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.object).isRequired,
  deletingChaptersId: PropTypes.bool.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isFetchingChapters: PropTypes.bool.isRequired
}

export default ChaptersTableBody
