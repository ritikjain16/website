import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import Banner from './Banner'

const BannerNav = withNav(Banner)({
  title: 'Banner',
  activeNavItem: 'Banner',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  banners: state.data.getIn(['banners', 'data']),
  isBannerFetching: state.data.getIn(['banners', 'fetchStatus', 'banners', 'loading']),
  hasBannerFetched: state.data.getIn(['banners', 'fetchStatus', 'banners', 'success']),
  bannerCount: state.data.getIn(['bannersMeta', 'data', 'count']),
  isBannerUpdating: state.data.getIn(['banners', 'updateStatus', 'updateBanner', 'loading']),
  isBannerUpdated: state.data.getIn(['banners', 'updateStatus', 'updateBanner', 'success']),
  bannerUpdateFailed: state.data.getIn(['banners', 'updateStatus', 'updateBanner', 'failure']),
  bannerUpdateFailure: state.data.getIn(['errors', 'banners/update']),
  isBannerDeleting: state.data.getIn(['banners', 'deleteStatus', 'deleteBanner', 'loading']),
  isBannerDeleted: state.data.getIn(['banners', 'deleteStatus', 'deleteBanner', 'success']),
  bannerDeleteFailed: state.data.getIn(['banners', 'deleteStatus', 'deleteBanner', 'failure']),
  bannerDeleteFailure: state.data.getIn(['errors', 'banners/delete'])
})

const BannerNavWithExtraProps = injectProps({
  notification,
})(BannerNav)

export default connect(mapStateToProps)(
  withRouter(BannerNavWithExtraProps)
)
