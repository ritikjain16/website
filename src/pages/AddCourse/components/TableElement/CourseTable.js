import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { MDTable } from '../../AddCourse.styles'
import PublishSwitcher from './PublishSwitcher'
import TableAction from './TableAction'

class CourseTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      columns: [],
    }
  }
  componentDidUpdate = (prevProps) => {
    const { coursesFetchStatus, courseAddStatus, courseUpdateStatus, courseUpdateFailure,
      courseDeleteStatus, courseDeleteFailure, courseAddFailure, searchByFilter } = this.props
    if (coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')
      && get(coursesFetchStatus.toJS(), 'success') &&
      (prevProps.coursesFetchStatus !== coursesFetchStatus)) {
      this.convertDataToTable()
    }
    if (courseAddStatus && !get(courseAddStatus.toJS(), 'loading')
      && get(courseAddStatus.toJS(), 'success') &&
      (prevProps.courseAddStatus !== courseAddStatus)) {
      searchByFilter(false)
      notification.success({
        message: 'Course added successfully'
      })
      this.convertDataToTable()
    } else if (courseAddStatus && !get(courseAddStatus.toJS(), 'loading')
      && get(courseAddStatus.toJS(), 'failure') &&
      (prevProps.courseAddFailure !== courseAddFailure)) {
      if (courseAddFailure && courseAddFailure.toJS().length > 0) {
        const errors = courseAddFailure.toJS().pop()
        if (get(get(errors, 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'Course with similar title already exist.'
          })
        } else {
          notification.error({
            message: get(get(errors, 'error').errors[0], 'message').split(':')[0]
          })
        }
      }
    }
    if (courseUpdateStatus && !get(courseUpdateStatus.toJS(), 'loading')
      && get(courseUpdateStatus.toJS(), 'success') &&
      (prevProps.courseUpdateStatus !== courseUpdateStatus)) {
      this.convertDataToTable()
      notification.success({
        message: 'Course updated successfully'
      })
    } else if (courseUpdateStatus && !get(courseUpdateStatus.toJS(), 'loading')
      && get(courseUpdateStatus.toJS(), 'failure') &&
      (prevProps.courseUpdateFailure !== courseUpdateFailure)) {
      if (courseUpdateFailure && courseUpdateFailure.toJS().length > 0) {
        const errors = courseUpdateFailure.toJS().pop()
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }
    if (courseDeleteStatus && !get(courseDeleteStatus.toJS(), 'loading')
      && get(courseDeleteStatus.toJS(), 'success') &&
      (prevProps.courseDeleteStatus !== courseDeleteStatus)) {
      notification.success({
        message: 'Course deleted successfully'
      })
      this.convertDataToTable()
    } else if (courseDeleteStatus && !get(courseDeleteStatus.toJS(), 'loading')
      && get(courseDeleteStatus.toJS(), 'failure') &&
      (prevProps.courseDeleteFailure !== courseDeleteFailure)) {
      if (courseDeleteFailure && courseDeleteFailure.toJS().length > 0) {
        const errors = courseDeleteFailure.toJS().pop()
        notification.error({
          message: get(get(errors, 'error').errors[0], 'message')
        })
      }
    }
  }
  convertDataToTable = () => {
    this.setState({
      tableData: this.props.coursesData && sortBy(this.props.coursesData.toJS(), 'order')
    }, () => {
      let columns = []
      if (this.state.tableData.length > 0) {
        columns = [
          {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            align: 'center',
          },
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            render: (title, record) => <Link to={`/course-sessions/${get(record, 'id')}`}>{title}</Link>
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
          },
          {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (createdAt) => moment(createdAt).format('MM-DD-YY')
          },
          {
            title: 'Publish Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
              <PublishSwitcher status={status}
                courseId={record.id}
              />
            )
          },
          {
            title: 'Actions',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
              <TableAction
                id={id}
                record={record}
                openEditModal={this.props.openEditModal}
                searchByFilter={this.props.searchByFilter}
              />
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
    const { columns, tableData } = this.state
    const { coursesFetchStatus, tableLoading } = this.props
    return (
      <MDTable
        columns={columns}
        dataSource={tableData}
        loading={tableLoading && coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    )
  }
}

export default CourseTable
