import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import { Icon } from 'antd'
import SideNav from '../SideNav'
import Header from '../Header'
import Screen from './withNav.style'
import dimensions from '../../constants/dimensions'
import { CONTENT_MAKER, COURSE_MAKER } from '../../constants/roles'


/**
 * withNav is a higher order component wraps a component and
   * Also it adds two props **headerheight** and **sideNavWidth**.
 *
 * ### Usage
 * @example
 * ```
 * const NewReturnedComponent = withNav(OriginalComponent)({
 *  title: String // Title of the header
 *  shouldBack: Boolean // Should back exist on Header or not?
 *  activeNavItem: String // Title of the Nav Item which should be active
 *  // route to push for click on back button, should be passed only if
 *  // shouldBack is true
 *  backRoute: String
 * })
 * ```
 * @param {function} WrappedComponent
 * @returns { function(Object): function(Object): React.ReactElement}
 */

function createPath(props, breadCrumbPath, blockType) {
  let titlePath = ''
  if (blockType === CONTENT_MAKER) {
    if (breadCrumbPath && breadCrumbPath.length) {
      titlePath = [<Link to='/content-learningObjective' style={{ color: 'white' }}>{breadCrumbPath[0].name}</Link>]
      for (let i = 1; i < breadCrumbPath.length; i += 1) {
        let { id } = props.match.params
        id = !id ? props.match.params.learningObjectiveId : id
        titlePath.push(<Icon type='caret-right' theme='filled' />)
        if ((Object.keys(breadCrumbPath[i])).includes('path')) {
          titlePath.push(
            <Link to={breadCrumbPath[i].route} style={{ color: 'white' }}>
              {get(props, breadCrumbPath[i].path)}
            </Link>)
        } else {
          titlePath.push(
            <Link to={breadCrumbPath[i].route + id} style={{ color: 'white' }}>
              {breadCrumbPath[i].name}
            </Link>)
        }
      }
    }
  } else if (blockType === COURSE_MAKER) {
    if (breadCrumbPath && breadCrumbPath.length) {
      const { courseId } = props.match.params
      titlePath = [<Link to={`/course-sessions/${courseId}`} style={{ color: 'white' }}>{breadCrumbPath[0].name}</Link>]
      for (let i = 1; i < breadCrumbPath.length; i += 1) {
        let { id } = props.match.params
        id = !id ? props.match.params.topicId : id
        titlePath.push(<Icon type='caret-right' theme='filled' />)
        if ((Object.keys(breadCrumbPath[i])).includes('path')) {
          titlePath.push(
            <Link to={breadCrumbPath[i].route + courseId} style={{ color: 'white' }}>
              {get(props, breadCrumbPath[i].path)}
            </Link>)
        } else {
          titlePath.push(
            <Link to={`/course-sessions/${courseId}${breadCrumbPath[i].route + id}`} style={{ color: 'white' }}>
              {breadCrumbPath[i].name}
            </Link>)
        }
      }
    }
  } else {
    /* eslint-disable no-lonely-if */
    if (breadCrumbPath && breadCrumbPath.length) {
      titlePath = [<Link to='/topics' style={{ color: 'white' }}>{breadCrumbPath[0].name}</Link>]
      for (let i = 1; i < breadCrumbPath.length; i += 1) {
        let { id } = props.match.params
        id = !id ? props.match.params.topicId : id
        titlePath.push(<Icon type='caret-right' theme='filled' />)
        if ((Object.keys(breadCrumbPath[i])).includes('path')) {
          titlePath.push(
            <Link to={breadCrumbPath[i].route + id} style={{ color: 'white' }}>
              {get(props, breadCrumbPath[i].path)}
            </Link>)
        } else {
          titlePath.push(
            <Link to={breadCrumbPath[i].route + id} style={{ color: 'white' }}>
              {breadCrumbPath[i].name}
            </Link>)
        }
      }
    }
  }
  return titlePath
}

function showBreadCrumb(breadCrumbPath, title, props, titlePath, blockType) {
  return ((title === 'Topics' || titlePath === 'topicTitle') ? createPath(props, breadCrumbPath, blockType) : (title || get(props, titlePath)))
}

// const getActiveNavItemAndTitle = (props, activeNavItem, title) => {
//   if (get(props, 'match.path') === '/ums/sessions') {
//     return {
//       activeNavItem: 'Trial Session',
//       title: 'Trial Sessions'
//     }
//   } else if (get(props, 'match.path') === '/ums/sessions/paid') {
//     return {
//       activeNavItem: 'Paid Session',
//       title: 'Paid Sessions'
//     }
//   }
//
//   return {
//     activeNavItem,
//     title
//   }
// }

const getLoginType = (props) => {
  // this will be helpful to show the showUMSAndSMS pages but will render the
  // sidenav based on the sms or ums value retrived from the url
  const loginType = props.history.location.pathname.split('/')[1]
  return loginType
}

const withNav = WrappedComponent =>
  ({ title, shouldBack, activeNavItem, backRoute, noPadding,
    breadCrumbPath, titlePath, hideSideNavItems, showUMSNavigation,
    showCMSNavigation, showSMSNavigation, showUMSAndSMSNavigation,
    showCountryDropdown, showTypeSelector, showCourseMakerNavigation,
    showContentMakerNavigation, blockType
  }) => props => (
    <Screen>
      <SideNav width={dimensions.sideNavWidth}
        activeNavItem={activeNavItem}
        hideSideNavItems={hideSideNavItems}
        showUmsNavigation={showUMSNavigation}
        showCMSNavigation={showCMSNavigation}
        showSMSNavigation={showSMSNavigation}
        showUMSAndSMSNavigation={showUMSAndSMSNavigation}
        showCourseMakerNavigation={showCourseMakerNavigation}
        showContentMakerNavigation={showContentMakerNavigation}
        loginType={getLoginType(props)}
      />
      <Screen.SideWrapper sideNavWidth={dimensions.sideNavWidth}>
        {/* getting the login type which will help to render the header menu to show
           sms, or ums menu options */}
        <Header
          height={dimensions.headerHeight}
          shouldBack={shouldBack}
          backRoute={backRoute}
          title={
              showBreadCrumb(
                  breadCrumbPath,
                  title,
                  props,
                  titlePath,
                  blockType
            )}
          showSwitchOptionToUMS={showCMSNavigation || showSMSNavigation}
          showSwitchOptionToCMS={showUMSNavigation || showSMSNavigation}
          showSwitchOptionToSMS={showUMSNavigation || showCMSNavigation}
          showCountryDropdown={showCountryDropdown}
          showSwitchOptionToSMSOrUMS={showUMSAndSMSNavigation}
          showTypeSelector={showTypeSelector}
          loginType={getLoginType(props)}
        />
        <Screen.Main noPadding={noPadding}>
          <WrappedComponent
            {...props}
            headerHeight={dimensions.headerHeight}
            sideNavWidth={dimensions.sideNavWidth}
          />
        </Screen.Main>
      </Screen.SideWrapper>
    </Screen>
  )

export default withNav
