import React, { Component } from 'react'
import { Icon, Spin } from 'antd'
import PropTypes from 'prop-types'
import MainTable from '../../../../components/MainTable'
import AssignmentTableRow from './AssignmentTableRow'
import toastrMessage from '../../../../utils/messages'

class AssignmentTableBody extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.isAssignmentDeleting !== prevProps.isAssignmentDeleting) {
      if (this.props.isAssignmentDeleting) {
        toastrMessage(this.props.isAssignmentDeleting, prevProps.isAssignmentDeleting, 'loading', 'Deleting Assignment')
      }
    }
    if (this.props.hasAssignmentDeleteFailed !== prevProps.hasAssignmentDeleteFailed) {
      if (this.props.hasAssignmentDeleteFailed) {
        toastrMessage(this.props.hasAssignmentDeleteFailed, prevProps.hasAssignmentDeleteFailed, 'error', 'Assignment Deletion Failed')
      }
    }
    if (this.props.isAssignmentDeleted !== prevProps.hasAssignmentDeleteFailed) {
      if (this.props.isAssignmentDeleted) {
        toastrMessage(this.props.isAssignmentDeleted, prevProps.isAssignmentDeleted, 'success', 'Assignment deleted successfully')
      }
    }
    if (this.props.isAssignmentUpdating !== prevProps.isAssignmentUpdating) {
      if (this.props.isAssignmentUpdating) {
        toastrMessage(this.props.isAssignmentUpdating, prevProps.isAssignmentUpdating, 'loading', 'Updating Assignment')
      }
    }
    if (this.props.isAssignmentAdding !== prevProps.isAssignmentAdding) {
      if (this.props.isAssignmentAdding) {
        toastrMessage(this.props.isAssignmentAdding, prevProps.isAssignmentAdding, 'loading', 'Adding Assignment')
      }
    }
  }

  render() {
    const { assignmentErrors, sortedAssignments } = this.props
    if (this.props.isAssignmentFetching) {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      return (
        <div style={{ width: '100%', padding: '15px' }}>
          <Spin indicator={loadingIcon} />
        </div>
      )
    }
    if (this.props.hasAssignmentFetchFailed) {
      const fetchingError = assignmentErrors.toJS()['assignmentQuestion/fetch'][0].error
      const errorText = `Error: ${fetchingError.status}`
      return (
        <MainTable.EmptyTable>
          {errorText}
        </MainTable.EmptyTable>
      )
    }
    if (this.props.hasAssignmentFetched && sortedAssignments.length === 0) {
      const emptyText = 'No assignment found. Click on \'Add Assignment\' button to add assignments.'
      return (
        <MainTable.EmptyTable>
          {emptyText}
        </MainTable.EmptyTable>
      )
    }
    const lastUserIndex = sortedAssignments.length - 1
    return sortedAssignments.map((assignment, index) => (
      <AssignmentTableRow
        minWidth={this.props.minWidth}
        columnsTemplate={this.props.columnsTemplate}
        {...assignment}
        key={assignment.id}
        noBorder={index === lastUserIndex}
        openEditModal={(id) => this.props.openEditModal(id)}
        isAssignmentDeleting={this.props.isAssignmentDeleting}
        isAssignmentDeleted={this.props.isAssignmentDeleted}
        hasAssignmentDeleteFailed={this.props.hasAssignmentDeleteFailed}
        notification={this.props.notification}
      />
    ))
  }
}

AssignmentTableBody.propTypes = {
  isAssignmentFetching: PropTypes.bool.isRequired,
  hasAssignmentFetchFailed: PropTypes.bool.isRequired,
  assignmentErrors: PropTypes.shape([]),
  hasAssignmentFetched: PropTypes.bool.isRequired,
  sortedAssignments: PropTypes.shape({}),
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isAssignmentDeleting: PropTypes.bool.isRequired,
  isAssignmentDeleted: PropTypes.bool.isRequired,
  hasAssignmentDeleteFailed: PropTypes.bool.isRequired,
  isAssignmentUpdating: PropTypes.bool.isRequired,
  isAssignmentAdding: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}).isRequired
}

AssignmentTableBody.defaultProps = {
  assignmentErrors: [],
  sortedAssignments: {}
}

export default AssignmentTableBody
