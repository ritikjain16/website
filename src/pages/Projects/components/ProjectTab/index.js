import { connect } from 'react-redux'
import ProjectTab from './ProjectTab'

const mapStateToProps = (state) => ({
  projectContents: state.data.getIn(['project', 'data']),
})

export default connect(mapStateToProps)(ProjectTab)
