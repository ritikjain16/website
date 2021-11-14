import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import AuditBuilder from './AuditBuilder'

const AuditBuilderNav = withNav(AuditBuilder)({
  title: 'Audit Builder',
  activeNavItem: 'Audit Builder',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  auditQuestions: state.data.getIn(['auditQuestions', 'data']),
  auditQuestionAddStatus: state.data.getIn(['auditQuestions', 'addStatus', 'auditQuestions']),
  auditQuestionAddFailure: state.data.getIn(['errors', 'auditQuestions/add']),
  auditQuestionFetchStatus: state.data.getIn(['auditQuestions', 'fetchStatus', 'auditQuestions']),
  auditQuestionDeleteStatus: state.data.getIn(['auditQuestions', 'deleteStatus', 'auditQuestions']),
  auditQuestionDeleteFailure: state.data.getIn(['errors', 'auditQuestions/delete']),
  auditQuestionUpdateStatus: state.data.getIn(['auditQuestions', 'updateStatus', 'auditQuestions']),
  auditQuestionUpdateFailure: state.data.getIn(['errors', 'auditQuestions/update']),
  auditQuestionsUpdateStatus: state.data.getIn(['auditQuestions', 'updateStatus', 'auditQuestions/reorder']),
  auditQuestionsUpdateFailure: state.data.getIn(['errors', 'auditQuestions/update']),
  auditQuestionSectionsFetchStatus: state.data.getIn(['auditQuestionSections', 'fetchStatus', 'auditQuestionSections']),
  auditQuestionSections: state.data.getIn(['auditQuestionSections', 'data']),
  auditQuestionSubSections: state.data.getIn(['auditQuestionSubSections', 'data'])
})

const AuditBuilderNavWithExtraProps = injectProps({
  notification,
})(AuditBuilderNav)

export default connect(mapStateToProps)(
  withRouter(AuditBuilderNavWithExtraProps)
)
