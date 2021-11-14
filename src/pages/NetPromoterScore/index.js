import { connect } from 'react-redux'
import NetPromoterScore from './NetPromoterScore'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'

const NetPromoterScoreNav = withNav(NetPromoterScore)({
  title: 'Net Promoter Score',
  activeNavItem: 'Net Promoter Score',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  nps: state.data.getIn([
    'netPromoterScore',
    'data'
  ]),
  hasNPSFetched: state.data.getIn([
    'netPromoterScore',
    'fetchStatus',
    'netPromoterScore',
    'success'
  ]),
  isFetchingNps: state.data.getIn([
    'netPromoterScore',
    'fetchStatus',
    'netPromoterScore',
    'loading'
  ]),
  ratingAndCommentFetchStatus: state.data.getIn([
    'mentorMenteeSession',
    'fetchStatus',
    'rating/comment'
  ]),
  ratingAndComment: filterKey(
    state.data.getIn([
      'completedSession',
      'data'
    ]), 'rating/comment'
  ),
  countData: state.data.getIn([
    'countData',
    'data'
  ])
  ,
  courses: state.data.getIn([
    'course',
    'data'
  ])
})

export default connect(mapStateToProps)(NetPromoterScoreNav)
