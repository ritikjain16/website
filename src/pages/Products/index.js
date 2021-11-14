import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { List } from 'immutable'
import Products from './Products'
import withNav from '../../components/withNav'
import fetchProducts from '../../actions/products/fetchProducts'
import { fetchCourses } from '../../actions/Courses'

const mapStateToProps = state => ({
  ...fetchProducts(localStorage.getItem('country') || 'india').mapStateToProps(state, false),
  products: state.data.getIn(['products', 'data'], List([])).toJS(),
  fetchStatus: state.data.getIn(['products', 'fetchStatus']).toJS(),
  productAddStatus: state.data.getIn([
    'products',
    'addStatus',
    'product'
  ]),
  productAddFailure: state.data.getIn([
    'errors',
    'products/add'
  ]),
  productUpdateStatus: state.data.getIn([
    'products',
    'updateStatus',
    'product'
  ]),
  productUpdateFailure: state.data.getIn([
    'errors',
    'products/update'
  ]),
  productDeleteStatus: state.data.getIn([
    'products',
    'deleteStatus',
    'deleteProduct'
  ]),
  productDeleteFailure: state.data.getIn([
    'errors',
    'products/delete'
  ]),
  courses: state.course.courses
})
const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
})

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps
)(withNav(Products)({
  title: 'Products',
  activeNavItem: 'Products',
  showCMSNavigation: true,
  showCountryDropdown: true,
})
))
