import { notification, Popconfirm } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { deleteAssignmentQuestion } from '../../../../../actions/contentMaker'
import MainTable from '../../../../../components/MainTable'
import { ASSIGNMENT, HOMEWORK_ASSIGNMENT } from '../../../../../constants/CourseComponents'
import { getFailureStatus, getSuccessStatus } from '../../../../../utils/data-utils'
import parseChatStatement from '../../../../../utils/parseStatement'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import { AssignmentTable } from '../../ContentAssignment.style'
import AssignmentPublisher from './AssignmentPublisher'

class AssignTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      columns: [],
      openAssignModal: false,
      assignModalData: null
    }
  }
  componentDidUpdate = (prevProps) => {
    const { assignmentQuestionFetchingStatus, assignmentQuestionAddStatus,
      assignmentQuestionUpdateStatus, assignmentQuestionUpdateFailure,
      assignmentQuestionDeleteStatus, assignmentQuestionDeleteFailure,
      currentComponent, homeworkAddStatus, homeworkUpdateStatus,
      homeworkFetchStatus, fetchAssignmentCount } = this.props
    if (currentComponent === HOMEWORK_ASSIGNMENT) {
      if (getSuccessStatus(homeworkFetchStatus,
        prevProps.homeworkFetchStatus)) {
        this.convertDataToTable()
      }
    } else if (currentComponent === ASSIGNMENT) {
      if (getSuccessStatus(assignmentQuestionFetchingStatus,
        prevProps.assignmentQuestionFetchingStatus)) {
        this.convertDataToTable()
      }
    }

    if (currentComponent === HOMEWORK_ASSIGNMENT) {
      if (getSuccessStatus(homeworkAddStatus, prevProps.homeworkAddStatus)) {
        this.convertDataToTable()
        fetchAssignmentCount()
      }
    } else if (currentComponent === ASSIGNMENT) {
      if (getSuccessStatus(assignmentQuestionAddStatus, prevProps.assignmentQuestionAddStatus)) {
        this.convertDataToTable()
        fetchAssignmentCount()
      }
    }
    const success = currentComponent === HOMEWORK_ASSIGNMENT ?
      getSuccessStatus(homeworkUpdateStatus,
        prevProps.homeworkUpdateStatus) : getSuccessStatus(assignmentQuestionUpdateStatus,
        prevProps.assignmentQuestionUpdateStatus)
    if (success) {
      if (currentComponent === HOMEWORK_ASSIGNMENT) {
        notification.success({
          message: 'Homework Assignment updated successfully'
        })
      } else {
        notification.success({
          message: 'Assignment updated successfully'
        })
      }
      this.convertDataToTable()
    } else {
      getFailureStatus(currentComponent === HOMEWORK_ASSIGNMENT
        ? homeworkUpdateStatus : assignmentQuestionUpdateStatus,
      assignmentQuestionUpdateFailure, prevProps.assignmentQuestionUpdateFailure)
    }


    if (getSuccessStatus(assignmentQuestionDeleteStatus,
      prevProps.assignmentQuestionDeleteStatus)) {
      notification.success({
        message: 'Assignment deleted successfully'
      })
      fetchAssignmentCount()
      this.convertDataToTable()
    } else {
      getFailureStatus(assignmentQuestionDeleteStatus,
        assignmentQuestionDeleteFailure,
        prevProps.assignmentQuestionDeleteFailure)
    }
  }

  onOpenAssignModal = (data) => {
    this.setState({
      assignModalData: data,
      openAssignModal: true
    })
  }

  onCloseAssignModal = () => {
    this.setState({
      assignModalData: null,
      openAssignModal: false
    })
  }

  convertDataToTable = () => {
    const { opneEditModal, assignmentQuestion, setAssignmentData,
      selectedCourse, selectedTopic, searchKey, currentComponent, homeworkData } = this.props
    let newAssignmentData = []
    if (currentComponent === HOMEWORK_ASSIGNMENT) {
      const assignmentData = homeworkData &&
      homeworkData.toJS() ? homeworkData.toJS() : []
      if (searchKey === 'course' && selectedCourse) {
        newAssignmentData = assignmentData.filter(assignments =>
          get(assignments, 'courses', []).map(course => course.id).includes(selectedCourse))
      } else if (searchKey === 'topic' && selectedTopic) {
        newAssignmentData = assignmentData.filter(assign =>
          get(assign, 'topics', []).map(topic => topic.id).includes(selectedTopic))
      } else {
        newAssignmentData = [...assignmentData]
      }
    } else if (currentComponent === ASSIGNMENT) {
      const assignmentData = assignmentQuestion &&
      assignmentQuestion.toJS() ? assignmentQuestion.toJS() : []
      if (searchKey === 'course' && selectedCourse) {
        newAssignmentData = assignmentData.filter(assignments =>
          get(assignments, 'courses', []).map(course => course.id).includes(selectedCourse))
      } else if (searchKey === 'topic' && selectedTopic) {
        newAssignmentData = assignmentData.filter(assign =>
          get(assign, 'topics', []).map(topic => topic.id).includes(selectedTopic))
      } else {
        newAssignmentData = [...assignmentData]
      }
    }
    this.setState({
      tableData: sortBy(newAssignmentData, 'order').reverse()
    }, () => {
      let columns = []
      const { tableData } = this.state
      setAssignmentData(tableData)
      if (tableData.length > 0) {
        columns = [
          {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
            width: 100
          },
          {
            title: 'Statement',
            dataIndex: 'statement',
            key: 'statement',
            align: 'center',
            width: 500,
            render: (statement) => parseChatStatement({ statement: statement || '' })
          },
          {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            align: 'center',
            width: 200,
          },
          // {
          //   title: 'Is Homework',
          //   dataIndex: 'isHomework',
          //   key: 'isHomework',
          //   align: 'center',
          //   width: 200,
          //   render: (isHomework) => isHomework === true ? 'Yes' : 'No'
          // },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 200,
            render: (createdAt) => moment(createdAt).format('ll')
          },
          {
            title: 'Assign Course & Topic',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 400,
            render: (_, record) => (
              <AssignedView
                record={record}
                onAssignClick={() => this.onOpenAssignModal(record)}
              />
            )
          },
          {
            title: 'Publish Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <AssignmentPublisher status={status}
                assignmentId={record.id}
                currentComponent={currentComponent}
              />
            )
          },
          {
            title: 'Edit',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (_, record) => (
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.EditIcon onClick={() => opneEditModal(record)} />
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
                  title='Do you want to delete this Assignment ?'
                  placement='topRight'
                  onConfirm={async () => { await deleteAssignmentQuestion(id) }}
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
  render() {
    const { columns, tableData, openAssignModal, assignModalData } = this.state
    const { assignmentQuestionFetchingStatus, assignmentQuestionUpdateStatus
      , coursesFetchStatus, coursesList, currentComponent, homeworkFetchStatus,
      homeworkUpdateStatus, tableLoading } = this.props
    const tableLoadingFetch = currentComponent === HOMEWORK_ASSIGNMENT ?
      homeworkFetchStatus && get(homeworkFetchStatus.toJS(), 'loading')
      : assignmentQuestionFetchingStatus && get(assignmentQuestionFetchingStatus.toJS(), 'loading')
    const updateLoading = currentComponent === HOMEWORK_ASSIGNMENT ?
      homeworkUpdateStatus && get(homeworkUpdateStatus.toJS(), 'loading') : assignmentQuestionUpdateStatus
            && get(assignmentQuestionUpdateStatus.toJS(), 'loading')
    return (
      <>
        <AssignModal
          openAssignModal={openAssignModal}
          assignModalData={assignModalData}
          coursesList={coursesList}
          saveLoading={updateLoading}
          coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
          componentName={currentComponent}
          onCloseAssignModal={this.onCloseAssignModal}
        />
        <AssignmentTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading && tableLoadingFetch}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </>
    )
  }
}

export default AssignTable
