import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import MentorConversionOfSchool from './MentorConversion'
import withNav from '../../../components/withNav'
import { filterKey } from '../../../utils/data-utils'
import injectProps from '../../../components/injectProps'

const MentorConversionsNav = withNav(MentorConversionOfSchool)({
  title: 'Mentor Mentee Management',
  activeNavItem: 'Mentor Mentee Management',
  showSMSNavigation: true,
})

const mapStateToProps = state => ({
  firstMentorMenteeSession: filterKey(
    state.data.getIn([
      'completedSession',
      'data'
    ]), 'completedSession'
  ),
  dataFetchStatus: state.data.getIn([
    'mentorConversion',
    'fetchStatus'
  ]),
  salesOperation: state.data.getIn([
    'salesOperation',
    'data'
  ]),
  products: state.data.getIn([
    'products',
    'data'
  ]),
  userPaymentPlans: state.data.getIn([
    'userPaymentPlans',
    'data'
  ]),
  userPaymentLinks: state.data.getIn([
    'userPaymentLinks',
    'data'
  ]),
  planStatus: state.data.getIn([
    'userPaymentPlans',
    'fetchStatus'
  ]),
  userCurrentTopicComponentStatus: state.data.getIn([
    'userCurrentTopicComponentStatus',
    'data'
  ]),
  userCurrentTopicComponentStatusFetchStatus: state.data.getIn([
    'userCurrentTopicComponentStatus',
    'fetchStatus'
  ]),
  totalConverted: state.data.getIn([
    'salesOperationsMeta',
    'data'
  ]),
  getTotalAmountCollected: state.data.getIn([
    'getTotalAmountCollected',
    'data'
  ])
})


const MentorConversionsNavWithExtraProps = injectProps({
  notification
})(MentorConversionsNav)
export default connect(mapStateToProps)(withRouter(MentorConversionsNavWithExtraProps))
