import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import SchoolProductMapping from './SchoolProductMapping'

const SchoolProductMappingNav = withNav(SchoolProductMapping)({
  title: 'School Product Mapping',
  activeNavItem: 'School Product Mapping',
  shouldBack: false,
  showSMSNavigation: true,

})

const mapStateToProps = (state) => (
  {
    schoolData: filterKey(state.data.getIn([
      'schools',
      'data'
    ]),
    'schools'
    ),
    schoolProductData: filterKey(
      state.data.getIn([
        'products',
        'data'
      ]),
      'schools'),
    schoolDiscountsData: filterKey(
      state.data.getIn([
        'discounts',
        'data'
      ]),
      'schools'
    ),
    schoolsCount: state.data.getIn([
      'schoolsMeta',
      'data',
      'count'
    ]),
    fetchSchoolsCountSuccess: state.data.getIn([
      'schoolsMeta',
      'fetchStatus',
      'schoolsMeta',
      'success'
    ]),

    fetchSchoolProductSuccess: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'success'
    ]),
    fetchSchoolProductLoading: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'loading'
    ]),
    fetchSchoolProductFailure: state.data.getIn([
      'schools',
      'fetchStatus',
      'schools',
      'failure'
    ]),
    fetchSchoolsErrors: state.data.toJS().errors['schools/fetch'],
    existingProductData: filterKey(state.data.getIn([
      'products',
      'data'
    ]), 'products'),
    fetchExistingProductSuccess: state.data.getIn([
      'products',
      'fetchStatus',
      'products',
      'success'
    ]),
    fetchExistingProductLoading: state.data.getIn([
      'products',
      'fetchStatus',
      'products',
      'loading'
    ]),
    fetchExistingProductFailure: state.data.getIn([
      'products',
      'fetchStatus',
      'products',
      'failure'
    ]),
    fetchProductErrors: state.data.toJS().errors['products/fetch'],
    addProductSuccess: state.data.getIn([
      'products',
      'addStatus',
      'products',
      'success'
    ]),
    addProductLoading: state.data.getIn([
      'products',
      'addStatus',
      'products',
      'loading'
    ]),
    addProductFailure: state.data.getIn([
      'products',
      'addStatus',
      'products',
      'failure'
    ]),
    addProductErrors: state.data.toJS().errors['products/add'],
    updateProductSuccess: state.data.getIn([
      'products',
      'updateStatus',
      'products',
      'success'
    ]),
    updateProductLoading: state.data.getIn([
      'products',
      'updateStatus',
      'products',
      'loading'
    ]),
    updateProductFailure: state.data.getIn([
      'products',
      'updateStatus',
      'products',
      'failure'
    ]),
    updateProductErrors: state.data.toJS().errors['products/update'],
    deleteProductSuccess: state.data.getIn([
      'products',
      'deleteStatus',
      'products',
      'success'
    ]),
    deleteProductLoading: state.data.getIn([
      'products',
      'deleteStatus',
      'products',
      'loading'
    ]),
    deleteProductFailure: state.data.getIn([
      'products',
      'deleteStatus',
      'products',
      'failure'
    ]),
    deleteProductErrors: state.data.toJS().errors['products/delete'],
    addDiscountSuccess: state.data.getIn([
      'discounts',
      'addStatus',
      'discounts',
      'success'
    ]),
    addDiscountLoading: state.data.getIn([
      'discounts',
      'addStatus',
      'discounts',
      'loading'
    ]),
    addDiscountFailure: state.data.getIn([
      'discounts',
      'addStatus',
      'discounts',
      'failure'
    ]),
    addDiscountErrors: state.data.toJS().errors['discounts/add'],
    updateDiscountSuccess: state.data.getIn([
      'discounts',
      'updateStatus',
      'discounts',
      'success'
    ]),
    updateDiscountLoading: state.data.getIn([
      'discounts',
      'updateStatus',
      'discounts',
      'loading'
    ]),
    updateDiscountFailure: state.data.getIn([
      'discounts',
      'updateStatus',
      'discounts',
      'failure'
    ]),
    updateDiscountErrors: state.data.toJS().errors['discounts/update'],
    deleteDiscountSuccess: state.data.getIn([
      'discounts',
      'deleteStatus',
      'discounts',
      'success'
    ]),
    deleteDiscountLoading: state.data.getIn([
      'discounts',
      'deleteStatus',
      'discounts',
      'loading'
    ]),
    deleteDiscountFailure: state.data.getIn([
      'discounts',
      'deleteStatus',
      'discounts',
      'failure'
    ]),
    deleteDiscountErrors: state.data.toJS().errors['discounts/delete'],
  }
)

export default connect(mapStateToProps)(withRouter(SchoolProductMappingNav))
