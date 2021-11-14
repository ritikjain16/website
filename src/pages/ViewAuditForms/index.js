import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import ViewAuditForm from './ViewAuditForm'

const ViewAuditFormNav = withNav(ViewAuditForm)({
  title: 'Audit Viewer',
  activeNavItem: 'Audit Viewer',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  auditQuestions: state.data.getIn(['auditQuestions', 'data']),
  auditQuestionFetchStatus: state.data.getIn(['auditQuestions', 'fetchStatus', 'auditQuestions']),
})

const ViewAuditFormNavWithExtraProps = injectProps({
  notification,
})(ViewAuditFormNav)

export default connect(mapStateToProps)(
  withRouter(ViewAuditFormNavWithExtraProps)
)
