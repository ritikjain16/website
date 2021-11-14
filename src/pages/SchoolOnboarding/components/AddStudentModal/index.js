import { connect } from 'react-redux'
import AddStudentModal from './AddStudentModal'

const mapStateToProps = (state) => ({
  parentSignUpStatus: state.data.getIn([
    'parentChildSignUp', 'addStatus', 'addParentSignUp'
  ]),
  parentSignUpFailure: state.data.getIn([
    'errors',
    'parentChildSignUp/add'
  ]),
  studentProfileUpdateStatus: state.data.getIn(['studentProfiles', 'updateStatus', 'studentProfiles']),
  studentProfileUpdateFailure: state.data.getIn([
    'errors',
    'studentProfiles/update'
  ])
})

export default connect(mapStateToProps)(AddStudentModal)

