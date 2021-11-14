import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { notification } from 'antd'
import EditBanner from './EditBanner'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import addBanner from '../../actions/banner/addBanner'
import updateBanner from '../../actions/banner/updateBanner'
import removeBackground from '../../actions/banner/removeBackground'
import removeLottieFile from '../../actions/banner/removeLottie'

const EditBannerNav = withNav(EditBanner)({
  title: 'Banner Settings',
  activeNavItem: 'Banner',
  shouldBack: true,
  backRoute: '/ums/banner',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  banners: state.data.getIn(['banners', 'data']),
  isBannerFetching: state.data.getIn(['banners', 'fetchStatus', 'banners', 'loading']),
  hasBannerFetched: state.data.getIn(['banners', 'fetchStatus', 'banners', 'success']),
})

const mapDispatchToProps = dispatch => ({
  addBanner: (input) =>
    dispatch(addBanner(input)),
  updateBanner: (input) =>
    dispatch(updateBanner(input)),
  removeBackground: (input) =>
    dispatch(removeBackground(input)),
  removeLottieFile: (input) =>
    dispatch(removeLottieFile(input))
})

const EditBannerNavWithExtraProps = injectProps({
  notification
})(EditBannerNav)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditBannerNavWithExtraProps))
