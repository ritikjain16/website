import { notification, Popconfirm } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { deleteChapter, fetchChapterCount, fetchChapters, fetchContentCourses } from '../../actions/courseMaker'
import MainTable from '../../components/MainTable'
import { filterKey, getSuccessStatus } from '../../utils/data-utils'
import { ChapterFlex, MDTable, StyledButton } from './AddChapter.style'
import ChapterPublish from './components/ChapterPublish'
import ChapterModal from './components/ChatperModal'
import SearchInput from './components/SearchInput'

class AddChapters extends React.Component {
  state = {
    coursesList: [],
    courseId: '',
    openModal: false,
    operation: '',
    editData: null,
    tableData: [],
    columns: [],
    topicsList: [],
    tableLoading: true
  }
  componentDidMount = async () => {
    await fetchContentCourses(true)
  }

  fetchChaptersData = async (shouldfetch = true) => {
    const { courseId } = this.state
    this.setState({
      tableLoading: false
    })
    if (shouldfetch) await fetchChapters(courseId)
    await fetchChapterCount(courseId)
    this.setState({
      tableLoading: true
    })
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { courseId } = this.state
    const { chapterFetchStatus, coursesFetchStatus, chapterDeleteStatus,
      chapterDeleteFailure, chapterUpdateStatus, chapterUpdateFailure,
      chapterAddStatus, chapterAddFailure, topicFetchingStatus } = this.props

    if (prevState.courseId !== courseId && courseId) {
      await fetchChapters(courseId)
      fetchChapterCount(courseId)
    }

    if (coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')
      && get(coursesFetchStatus.toJS(), 'success') &&
      (prevProps.coursesFetchStatus !== coursesFetchStatus)) {
      this.setState({
        coursesList: this.props.coursesData ? this.props.coursesData.toJS() : [],
      }, () => {
        const { coursesList } = this.state
        if (coursesList.length > 0) {
          this.setState({
            courseId: get(coursesList, '[0].id')
          })
        }
      })
    }

    if (chapterFetchStatus && !get(chapterFetchStatus.toJS(), 'loading')
      && get(chapterFetchStatus.toJS(), 'success') &&
      (prevProps.chapterFetchStatus !== chapterFetchStatus)) {
      this.setTopicForCourse()
    }
    const currTopicsFetchStatus = topicFetchingStatus && topicFetchingStatus.getIn([`topics/${courseId}`])
    const prevTopicFetchStatus = prevProps.topicFetchingStatus && prevProps.topicFetchingStatus.getIn([`topics/${courseId}`])
    if (getSuccessStatus(currTopicsFetchStatus, prevTopicFetchStatus)) {
      this.setState({
        topicsList: this.props.topicsData && filterKey(this.props.topicsData, `topics/${courseId}`).toJS() || []
      })
    }

    if (chapterAddStatus && !get(chapterAddStatus.toJS(), 'loading')
      && get(chapterAddStatus.toJS(), 'success') &&
      (prevProps.chapterAddStatus !== chapterAddStatus)) {
      this.setTopicForCourse()
      this.closeModal()
      this.fetchChaptersData(false)
      notification.success({
        message: 'Chapter Added successfully'
      })
    } else if (chapterAddStatus && !get(chapterAddStatus.toJS(), 'loading')
      && get(chapterAddStatus.toJS(), 'failure') &&
      (prevProps.chapterAddFailure !== chapterAddFailure)) {
      if (chapterAddFailure && chapterAddFailure.toJS().length > 0) {
        const errors = chapterAddFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').includes('E11000 duplicate')) {
          notification.error({
            message: 'Chapter with similar title/description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message')
          })
        }
      }
    }

    if (chapterUpdateStatus && !get(chapterUpdateStatus.toJS(), 'loading')
      && get(chapterUpdateStatus.toJS(), 'success') &&
      (prevProps.chapterUpdateStatus !== chapterUpdateStatus)) {
      this.setTopicForCourse()
      this.closeModal()
      notification.success({
        message: 'Chapter updated successfully'
      })
    } else if (chapterUpdateStatus && !get(chapterUpdateStatus.toJS(), 'loading')
      && get(chapterUpdateStatus.toJS(), 'failure') &&
      (prevProps.chapterUpdateFailure !== chapterUpdateFailure)) {
      if (chapterUpdateFailure && chapterUpdateFailure.toJS().length > 0) {
        const errors = chapterUpdateFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').includes('E11000 duplicate')) {
          notification.error({
            message: 'Chapter with similar title/description already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message')
          })
        }
      }
    }

    if (chapterDeleteStatus && !get(chapterDeleteStatus.toJS(), 'loading')
      && get(chapterDeleteStatus.toJS(), 'success') &&
      (prevProps.chapterDeleteStatus !== chapterDeleteStatus)) {
      notification.success({
        message: 'Chapter deleted successfully'
      })
      this.fetchChaptersData(false)
      this.setTopicForCourse()
    } else if (chapterDeleteStatus && !get(chapterDeleteStatus.toJS(), 'loading')
      && get(chapterDeleteStatus.toJS(), 'failure') &&
      (prevProps.chapterDeleteFailure !== chapterDeleteFailure)) {
      if (chapterDeleteFailure && chapterDeleteFailure.toJS().length > 0) {
        const errors = chapterDeleteFailure.toJS().pop()
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }
  }

  setTopicForCourse = () => {
    const { chapterData } = this.props
    const { courseId } = this.state
    const chapters = chapterData && chapterData.toJS()
    let newChapter = []
    if (chapters && chapters.length > 0) {
      newChapter = chapters.filter(chapter =>
        get(chapter, 'courses', []).map(course => get(course, 'id')).includes(courseId))
    }
    this.setState({
      tableData: sortBy(newChapter, 'order')
    }, () => {
      const { tableData } = this.state
      if (tableData.length > 0) {
        const columns = [
          {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
          },
          {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
            align: 'left',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'left',
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (createdAt) => moment(createdAt).format('MM-DD-YY')
          },
          {
            title: 'Publish',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <ChapterPublish status={status}
                chapterId={record.id}
              />
            )
          },
          {
            title: 'Edit',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id, record) => (
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.EditIcon onClick={() => this.openEditModal(record)} />
              </MainTable.ActionItem.IconWrapper>
            )
          },
          {
            title: 'Delete',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id) => (
              <MainTable.ActionItem.IconWrapper>
                <Popconfirm
                  title='Do you want to delete this Chapter ?'
                  placement='topRight'
                  onConfirm={async () => {
                    await deleteChapter(id)
                  }}
                  okText='Yes'
                  cancelText='Cancel'
                  key='delete'
                  overlayClassName='popconfirm-overlay-primary'
                >
                  <MainTable.ActionItem.IconWrapper>
                    <MainTable.ActionItem.DeleteIcon />
                  </MainTable.ActionItem.IconWrapper>
                </Popconfirm>
              </MainTable.ActionItem.IconWrapper>
            )
          }
        ]
        this.setState({
          columns
        })
      }
    })
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  openEditModal = (data) => {
    this.setState({
      openModal: true,
      operation: 'edit',
      editData: data
    })
  }
  closeModal = () => {
    this.setState({
      openModal: false,
      operation: null,
      editData: null
    })
  }
  render() {
    const { courseId, coursesList, editData,
      openModal, operation, tableData, columns, topicsList, tableLoading } = this.state
    const { chaptersMeta, chapterFetchStatus, coursesFetchStatus } = this.props
    return (
      <>
        <ChapterFlex justify='space-between'>
          <ChapterModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={this.searchByFilter}
            tableData={tableData}
            coursesList={coursesList}
            courseId={courseId}
            topicsList={topicsList}
            closeModal={this.closeModal}
            {...this.props}
          />
          <SearchInput
            value={courseId}
            loading={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
            placeholder='Select a Course'
            onChange={(value) => this.setState({ courseId: value, topicsList: [] })}
            dataArray={coursesList}
          />
          <ChapterFlex>
            <h4>Total Chapter: {chaptersMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={chapterFetchStatus && get(chapterFetchStatus.toJS(), 'loading') || coursesList.length === 0}
            >
              ADD CHAPTER
            </StyledButton>
          </ChapterFlex>
        </ChapterFlex>
        <MDTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading && chapterFetchStatus && get(chapterFetchStatus.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default AddChapters
