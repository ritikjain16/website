import { connect } from 'react-redux'
import GradesTab from './GradesTab'

const mapStateToProps = (state) => ({
  schoolClassesAddStatus: state.data.getIn(['schoolClasses', 'addStatus', 'schoolClasses']),
  schoolClassesDeleteStatus: state.data.getIn(['schoolClasses', 'deleteStatus', 'schoolClasses']),
  schoolClassAddFailure: state.data.getIn([
    'errors',
    'schoolClasses/add'
  ]),
  schoolClassDeleteFailure: state.data.getIn([
    'errors',
    'schoolClasses/delete'
  ]),
})


export default connect(mapStateToProps)(GradesTab)
