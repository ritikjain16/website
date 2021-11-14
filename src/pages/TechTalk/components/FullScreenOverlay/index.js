import { connect } from 'react-redux'
import FullScreenOverlay from './FullScreenOverlay'
import {
  addMessageUI
} from '../../../../actions/message'
import { editLearningObjective } from '../../../../actions/LearningObjective'
import { getDataById } from '../../../../utils/data-utils'

const mapStateToProps = state => ({
  ...state.messageUI,
  learningObjective: getDataById(
    state.learningObjectives.learningObjectives,
    state.messageUI.selectedLearningObjectiveId
  )
})
const mapDispatchToProps = dispatch => ({
  addMessageUI: message => dispatch(addMessageUI(message)),
  editLearningObjective: input => dispatch(editLearningObjective(input))
})

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenOverlay)
