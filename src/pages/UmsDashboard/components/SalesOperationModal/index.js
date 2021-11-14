import { connect } from 'react-redux'
import SalesOperationModal from './SalesOperationModal'
import { filterKey } from '../../../../utils/data-utils'

const mapStateToProps = state => ({
  newSalesOperationLog: filterKey(
    state.data.getIn([
      'salesOperationLog',
      'data'
    ]),
    'salesOperationLogAdd'
  ),
  updatedSalesOperationLog: filterKey(
    state.data.getIn([
      'salesOperationLog',
      'data'
    ]),
    'salesOperationLogUpdate'
  ),
  newSalesOperationStatus: state.data.getIn([
    'salesOperationLog',
    'addStatus',
    'salesOperationLogAdd',
    'success'
  ]),
  updateSalesOperationStatus: state.data.getIn([
    'salesOperationLog',
    'updateStatus',
    'salesOperationLogUpdate',
    'success'
  ]),
  updateMentorMenteeSessionStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'completedSession',
    'success'
  ]),
  salesOperation: state.data.getIn([
    'salesOperation',
    'data'
  ])
})

export default connect(mapStateToProps)(SalesOperationModal)
