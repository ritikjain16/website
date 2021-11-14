import { connect } from 'react-redux'
import { List } from 'immutable'
import fetchMentorPayData from '../../actions/mentorPayCalculator/fetchMentorPayData'
import mentorsPay from './MentorsPay'

const mapStateToProps = (state) => ({
  mentorPricings: state.data.getIn(['mentorPricings', 'data'], List([])),
  topicsMeta: state.data.getIn(['topicsMeta', 'data']),
})
const mapDispatchToProps = (dispatch) => ({
  fetchMentorPayData: () => dispatch(fetchMentorPayData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(mentorsPay)
