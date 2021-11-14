import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AssignmentTable from './components/AssignmentTable'
import AssignmentStyle from './Assignment.style'
import fetchAssignments from '../../actions/assignment/fetchAssignments'
import AssignmentModal from './components/AssignmentModal/AssignmentModal'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import TopicNav from '../../components/TopicNav'

class Assignment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAssignmentModal: false,
      addingAssignment: false,
      editingAssignment: false,
      assignment: {}
    }
  }

  componentDidMount() {
    const topicId = this.props.match.params.id
    if (!this.props.hasAssignmentFetched) {
      fetchAssignments(topicId)
    }
  }

  makeAddAssignmentModalVisible = () => {
    this.setState({
      showAssignmentModal: true,
      addingAssignment: true
    })
  }

  openEditModal = (id, assignments) => {
    for (let index = 0; index < assignments.length; index += 1) {
      if (assignments[index].id === id) {
        this.setState({
          assignment: assignments[index],
          showAssignmentModal: true,
          editingAssignment: true
        })
      }
    }
  }

  closeModal = () => {
    this.setState({
      showAssignmentModal: false,
      addingAssignment: false,
      editingAssignment: false
    })
  }

  getOrdersInUse = (assignments) => {
    const ordersInUse = []
    for (let index = 0; index < assignments.length; index += 1) {
      ordersInUse.push((assignments)[index].order)
    }
    ordersInUse.sort((a, b) => a - b)
    return ordersInUse
  }

  sortAssignmentsByOrder = (assignments, ordersInUse) => {
    const sortedAssignments = []
    for (let i = 0; i < ordersInUse.length; i += 1) {
      for (let j = 0; j < assignments.length; j += 1) {
        if (assignments[j].order === ordersInUse[i]) {
          sortedAssignments.push(assignments[j])
          assignments.splice(j, j)
          break
        }
      }
    }
    return sortedAssignments
  }

  render() {
    const { assignments, isAssignmentAdding,
      isAssignmentAdded, hasAssignmentAddFailed, assignmentErrors,
      isAssignmentUpdating, isAssignmentUpdated, hasAssignmentUpdateFailed,
      isAssignmentDeleting, isAssignmentDeleted, hasAssignmentDeleteFailed
    } = this.props
    let ordersInUse = []
    let sortedAssignments = []
    let totalAssignments = 0
    if (assignments && assignments.toJS().length > 0) {
      ordersInUse = this.getOrdersInUse(assignments.toJS())
      sortedAssignments = this.sortAssignmentsByOrder(assignments.toJS(), ordersInUse)
      totalAssignments = sortedAssignments.length
    }
    return (
      <div>
        <TopicNav activeTab={topicJourneyRoutes.assignment} />
        <div
          style={{
            height: '10px'
        }}
        />
        <AssignmentStyle.TopContainer>
          <div style={{ marginTop: '5px', marginRight: '10px' }}>
              Total Assignments: {totalAssignments}
          </div>
          <AssignmentStyle.StyledButton
            type='primary'
            icon='plus'
            id='add-btn'
            onClick={this.makeAddAssignmentModalVisible}
          >
              ADD ASSIGNMENT
          </AssignmentStyle.StyledButton>
        </AssignmentStyle.TopContainer>
        <AssignmentTable
          {...this.props}
          sortedAssignments={sortedAssignments}
          openEditModal={(id) => this.openEditModal(id, sortedAssignments)}
          isAssignmentDeleting={isAssignmentDeleting}
          isAssignmentDeleted={isAssignmentDeleted}
          hasAssignmentDeleteFailed={hasAssignmentDeleteFailed}
        />
        <AssignmentModal
          id='Add Assignment Modal'
          title='Add Assignment'
          visible={this.state.showAssignmentModal}
          closeModal={this.closeModal}
          ordersInUse={ordersInUse}
          topicId={this.props.match.params.id}
          editingAssignment={this.state.editingAssignment}
          addingAssignment={this.state.addingAssignment}
          assignments={sortedAssignments}
          assignmentAddStatus={this.props.assignmentAddStatus}
          isAssignmentAdding={isAssignmentAdding}
          isAssignmentAdded={isAssignmentAdded}
          hasAssignmentAddFailed={hasAssignmentAddFailed}
          isAssignmentUpdating={isAssignmentUpdating}
          isAssignmentUpdated={isAssignmentUpdated}
          hasAssignmentUpdateFailed={hasAssignmentUpdateFailed}
          errors={assignmentErrors}
          notification={this.props.notification}
          assignment={this.state.assignment}
        />
      </div>
    )
  }
}

Assignment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  hasAssignmentFetched: PropTypes.bool.isRequired,
  assignments: PropTypes.shape([]),
  isAssignmentAdding: PropTypes.bool.isRequired,
  isAssignmentAdded: PropTypes.bool.isRequired,
  hasAssignmentAddFailed: PropTypes.bool.isRequired,
  isAssignmentUpdating: PropTypes.bool.isRequired,
  isAssignmentUpdated: PropTypes.bool.isRequired,
  hasAssignmentUpdateFailed: PropTypes.bool.isRequired,
  isAssignmentDeleting: PropTypes.bool.isRequired,
  isAssignmentDeleted: PropTypes.bool.isRequired,
  hasAssignmentDeleteFailed: PropTypes.bool.isRequired,
  assignmentErrors: PropTypes.shape([])
}

Assignment.defaultProps = {
  assignments: [],
  assignmentErrors: []
}

export default Assignment
