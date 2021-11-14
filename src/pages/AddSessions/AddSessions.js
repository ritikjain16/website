import React from 'react'
import { debounce, get, sortBy } from 'lodash'
import { notification, Popconfirm } from 'antd'
import {
  MDTable, StyledButton, StyledTitle,
  TopContainer, StyledName
} from './AddSessions.styles'
import SessionModal from './components/SessionModal/SessionModal'
import {
  fetchContentCourses, fetchTopicSessions,
  deleteTopicSession, fetchTopicCount
} from '../../actions/courseMaker'
import SearchInput from './components/SearchInput'
import MainTable from '../../components/MainTable'
import TopicComponents from './components/SessionTables/TopicComponents'
import PublishSwitcher from './components/SessionTables/PublishSwitcher'
import { filterKey } from '../../utils/data-utils'

class AddSessions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: null,
      operation: '',
      editData: null,
      courseId: '',
      coursesList: [],
      tableLoading: true,
      topicCount: 0
    }
  }

  componentDidMount = async () => {
    const { courses } = await fetchContentCourses()
    this.setState({ coursesList: sortBy(courses, 'order') || [] }, () => {
      const { coursesList } = this.state
      const { history, match: { params } } = this.props
      if (params.courseId) {
        this.setState({
          courseId: params.courseId,
        }, async () => {
          const { courseId } = this.state
          fetchTopicCount(courseId).then(res => this.setState({ topicCount: get(res, 'topicsMeta.count') }))
          fetchTopicSessions(courseId)
        })
      } else if (coursesList.length > 0) {
        this.setState({
          courseId: get(coursesList[0], 'id'),
        }, async () => {
          const { courseId } = this.state
          fetchTopicCount(courseId).then(res => this.setState({ topicCount: get(res, 'topicsMeta.count') }))
          fetchTopicSessions(courseId)
          history.push(`/course-sessions/${courseId}`)
        })
      }
    })
  }

  componentDidUpdate = async (prevProps) => {
    const { courseId, openModal, operation, coursesList } = this.state
    const { topicAddingStatus, topicAddFailure,
      topicUpdateStatus, topicUpdateFailure,
      topicDeleteStatus,
      topicDeleteFailure, match, history } = this.props
    if (get(match, 'params.courseId') !== get(prevProps, 'match.params.courseId')) {
      if (openModal && operation) {
        if (get(match, 'params.courseId') !== courseId) {
          if (!get(match, 'params.courseId')) {
            debounce(this.onCourseChange(get(coursesList, '[0].id')), 800)()
          } else {
            history.push(`/course-sessions/${courseId}`)
          }
        }
        this.setState({
          openModal: false,
          operation: '',
          editData: null
        })
      } else if (!openModal) {
        if (!get(match, 'params.courseId')) {
          debounce(this.onCourseChange(get(coursesList, '[0].id')), 800)()
        }
      }
    }

    // if (topicFetchingStatus && !get(topicFetchingStatus.toJS(), 'loading')
    //   && get(topicFetchingStatus.toJS(), 'success') &&
    //   (prevProps.topicFetchingStatus !== topicFetchingStatus)) {
    //   this.convertDataToTable()
    // }

    const addingStatus = topicAddingStatus && topicAddingStatus.getIn([`topics/${courseId}`])
    const prevAddingStatus = prevProps.topicAddingStatus && prevProps.topicAddingStatus.getIn([`topics/${courseId}`])

    if (addingStatus && !get(addingStatus.toJS(), 'loading')
      && get(addingStatus.toJS(), 'success') &&
      (prevAddingStatus !== addingStatus)) {
      // this.convertDataToTable()
      notification.success({
        message: 'Session Added successfully'
      })
      this.searchByFilter(false)
      this.closeModal()
    } else if (addingStatus && !get(addingStatus.toJS(), 'loading')
      && get(addingStatus.toJS(), 'failure') &&
      (prevProps.topicAddFailure !== topicAddFailure)) {
      const errors = topicAddFailure.toJS().pop()
      if (topicAddFailure && topicAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }

    const updateStatus = topicUpdateStatus && topicUpdateStatus.getIn([`topics/${courseId}`])
    const prevUpdateStatus = prevProps.topicUpdateStatus && prevProps.topicUpdateStatus.getIn([`topics/${courseId}`])

    if (updateStatus && !get(updateStatus.toJS(), 'loading')
      && get(updateStatus.toJS(), 'success') &&
      (prevUpdateStatus !== updateStatus)) {
      // this.convertDataToTable()
      this.closeModal()
      notification.success({
        message: 'Session updated successfully'
      })
    } else if (updateStatus && !get(updateStatus.toJS(), 'loading')
      && get(updateStatus.toJS(), 'failure') &&
      (prevProps.topicUpdateFailure !== topicUpdateFailure)) {
      if (topicUpdateFailure && topicUpdateFailure.toJS().length > 0) {
        const errors = topicUpdateFailure.toJS().pop()
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }

    if (topicDeleteStatus && !get(topicDeleteStatus.toJS(), 'loading')
      && get(topicDeleteStatus.toJS(), 'success') &&
      (prevProps.topicDeleteStatus !== topicDeleteStatus)) {
      notification.success({
        message: 'Session deleted successfully'
      })
      // this.convertDataToTable()
    } else if (topicDeleteStatus && !get(topicDeleteStatus.toJS(), 'loading')
      && get(topicDeleteStatus.toJS(), 'failure') &&
      (prevProps.topicDeleteFailure !== topicDeleteFailure)) {
      if (topicDeleteFailure && topicDeleteFailure.toJS().length > 0) {
        const errors = topicDeleteFailure.toJS().pop()
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }
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
  searchByFilter = async (shouldfetch = true) => {
    const { courseId } = this.state
    this.setState({
      tableLoading: false
    })
    fetchTopicCount(courseId).then(res => this.setState({ topicCount: get(res, 'topicsMeta.count') }))
    if (shouldfetch) fetchTopicSessions(courseId)
    this.setState({
      tableLoading: true
    })
  }
  onCourseChange = async (value) => {
    this.setState({
      courseId: value
    }, async () => {
      const { history } = this.props
      const { courseId } = this.state
      history.push(`/course-sessions/${courseId}`)
      fetchTopicCount(courseId).then(res => this.setState({ topicCount: get(res, 'topicsMeta.count') }))
      fetchTopicSessions(courseId)
    })
  }
  renderTitle = () => {
    const { openModal, operation,
      coursesList, courseId } = this.state
    let courseTitle = ''
    if (courseId && coursesList.length > 0) {
      courseTitle = get(coursesList.find(course => get(course, 'id') === courseId), 'title', '')
      courseTitle = courseTitle[0].toUpperCase() + courseTitle.slice(1, courseTitle.length)
    }
    if (openModal && operation === 'add') {
      return (
        <StyledTitle onClick={this.closeModal} style={{ cursor: 'pointer' }}>
          / {courseTitle} / All Sessions / Add Session
        </StyledTitle>
      )
    } else if (openModal && operation === 'edit') {
      return (
        <StyledTitle onClick={this.closeModal} style={{ cursor: 'pointer' }}>
          / {courseTitle} / All Sessions / Edit Session
        </StyledTitle>
      )
    }
    return <StyledTitle>{`/ ${courseTitle} / All Sessions`}</StyledTitle>
  }

  getTopics = () => {
    let { topicsData } = this.props
    const { courseId } = this.state
    topicsData = topicsData && filterKey(topicsData, `topics/${courseId}`).toJS() || []
    return sortBy(topicsData, 'order')
  }

  getColumns = () => {
    const { courseId } = this.state
    const columns = [
      {
        title: 'Session Order',
        dataIndex: 'order',
        key: 'order',
        align: 'center',
      },
      {
        title: 'Topic Name',
        dataIndex: 'title',
        key: 'title',
        align: 'left',
        render: (title, record) => (
          <StyledName onClick={() => this.openEditModal(record)} >
            {title}
          </StyledName>
        )
      },
      {
        title: 'Components',
        dataIndex: 'title',
        key: 'title',
        align: 'left',
        render: (title, data) => <TopicComponents data={data} />
      },
      {
        title: 'Paid/Free',
        dataIndex: 'isTrial',
        key: 'isTrial',
        align: 'center',
        render: (isTrial) => isTrial ? 'Free' : 'Paid'
      },
      {
        title: 'Publish',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (status, record) => (
          <PublishSwitcher status={status}
            topicId={record.id}
            courseId={courseId}
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
              title='Do you want to delete this Session ?'
              placement='topRight'
              onConfirm={async () => {
                    await deleteTopicSession(id)
                    this.searchByFilter(false)
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
    return columns
  }
  render() {
    const {
      openModal, operation, editData,
      courseId, coursesList,
      tableLoading, topicCount
    } = this.state
    const { topicFetchingStatus } = this.props
    const topicsData = this.getTopics()
    const dataFetchingStatus = topicFetchingStatus && topicFetchingStatus.getIn([`topics/${courseId}`])
    return (
      <>
        {courseId && this.renderTitle()}
        {
          <>
            {
              openModal && (
                <SessionModal
                  openModal={openModal}
                  operation={operation}
                  editData={editData}
                  searchByFilter={this.searchByFilter}
                  courseId={courseId}
                  sessionData={topicsData}
                  coursesList={coursesList}
                  closeModal={this.closeModal}
                  {...this.props}
                />
              )
            }
            {
              !openModal && (
                <>
                  <TopContainer justify='space-between'>
                    <SearchInput
                      value={courseId}
                      placeholder='Select a Course'
                      onChange={debounce((value) => this.onCourseChange(value), 1000)}
                      dataArray={coursesList}
                    />
                    <TopContainer>
                      <h4>Total Sessions: {topicCount || 0}</h4>
                      <StyledButton
                        icon='plus'
                        id='add-btn'
                        onClick={this.openAddModal}
                        disabled={dataFetchingStatus && get(dataFetchingStatus.toJS(), 'loading') || coursesList.length === 0}
                      >
                        ADD SESSION
                      </StyledButton>
                    </TopContainer>
                  </TopContainer>
                  <MDTable
                    columns={this.getColumns()}
                    dataSource={topicsData}
                    loading={tableLoading && dataFetchingStatus && get(dataFetchingStatus.toJS(), 'loading')}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                  />
                </>
              )
            }
          </>
        }
      </>
    )
  }
}

export default AddSessions
