import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Nav from './SideNav.style'
import NavItem from './components/NavItem'
import {
  ADMIN,
  MENTOR,
  SALES_EXECUTIVE,
  UMS_ADMIN,
  UMS_VIEWER,
  TRANSFORMATION_TEAM,
  TRANSFORMATION_ADMIN,
  SCHOOL_ADMIN,
  AUDIT_ADMIN,
  PRE_SALES,
  POST_SALES,
  AUDITOR,
  BDE,
  BDE_ADMIN,
} from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import renderNavItems from '../../utils/renderNavItem'


const navItems = [
  { iconType: 'dashboard', title: 'Dashboard', route: '/dashboard' },
  { iconType: 'folder', title: 'Courses', route: '/courses' },
  { iconType: 'copy', title: 'Chapters', route: '/chapters' },
  { iconType: 'file-text', title: 'Topics', route: '/topics' },
  { iconType: 'smile', title: 'Emojis and Stickers', route: '/emojis' },
  { iconType: 'shop', title: 'Products', route: '/products' },
  { iconType: 'approvedCodeTags', title: 'Tags', route: '/approvedCodeTags' },
]

const courseMakerNavItems = [
  { iconType: 'folder', title: 'Add Course', route: '/addCourse' },
  { iconType: 'copy', title: 'Add Chapter', route: '/addChapter' },
  { iconType: 'external', title: 'Add Sessions', route: '/course-sessions', icon: 'session' },
]

const contentMakerNavItems = [
  { iconType: 'video-camera', title: 'Content Videos', route: '/content-video' },
  { iconType: 'file-text', title: 'Learning Objective', route: '/content-learningObjective' },
  { title: 'Assignments', route: '/content-assignment', iconType: 'code' },
  { title: 'Homework Assignments', route: '/content-homeworkAssignment', iconType: 'snippets' },
  { iconType: 'projectIcon', title: 'Block based Project', route: '/content-project' },
  { iconType: 'aimIcon', title: 'Block based Practice', route: '/content-practice' },
  { iconType: 'flag', title: 'Content Quiz', route: '/content-quiz' }
]

const getUMSNavItems = (userRole) => {
  const {
    userDashboard,
    codeApproval,
    session,
    manageKids,
    mentorMenteeManagement,
    // assignedAudits,
    stats,
    tabularStats,
    netPromoterScore,
    mentorReport,
    mentorPay,
    SalesExecMentor,
    batchMapping,
    batchCreation,
    assignTimetable,
    batchAttendance,
    classProgress,
    salesDashboard,
    mentorConversionPage,
    banner,
    slotsInfo,
    auditBuilder,
    audit,
    auditViewer,
    // courseCompletion,
  } = renderNavItems('ums')
  let umsNavItems = []
  switch (userRole) {
    case ADMIN:
      umsNavItems = [
        userDashboard,
        codeApproval,
        session,
        manageKids,
        mentorMenteeManagement,
        audit,
        slotsInfo,
        stats,
        tabularStats,
        mentorPay,
        netPromoterScore,
        mentorReport,
        SalesExecMentor,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        classProgress,
        salesDashboard,
        mentorConversionPage,
        banner,
        auditBuilder,
        auditViewer,
        // courseCompletion
      ]
      break
    case UMS_ADMIN:
      umsNavItems = [
        userDashboard,
        codeApproval,
        session,
        manageKids,
        mentorMenteeManagement,
        audit,
        slotsInfo,
        stats,
        tabularStats,
        mentorPay,
        netPromoterScore,
        mentorReport,
        SalesExecMentor,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        classProgress,
        salesDashboard,
        mentorConversionPage,
        banner,
        auditBuilder,
        auditViewer,
        // courseCompletion
      ]
      break
    case UMS_VIEWER:
      umsNavItems = [
        userDashboard,
        session,
        manageKids,
        mentorMenteeManagement,
        audit,
        slotsInfo,
        stats,
        tabularStats,
        mentorPay,
        netPromoterScore,
        mentorReport,
        SalesExecMentor,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        classProgress,
        salesDashboard,
        mentorConversionPage,
        auditBuilder,
        auditViewer,
        // courseCompletion
      ]
      break
    case MENTOR:
      umsNavItems = [
        session,
        codeApproval,
        manageKids,
        mentorMenteeManagement,
        audit,
        // assignedAudits,
        mentorPay,
        mentorReport,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        salesDashboard,
        mentorConversionPage,
        classProgress,
      ]
      break
    case SALES_EXECUTIVE:
      umsNavItems = [
        userDashboard,
        mentorMenteeManagement,
        audit,
        // assignedAudits,
        mentorReport,
        SalesExecMentor,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        salesDashboard,
        mentorConversionPage,
        classProgress,
        auditBuilder,
        auditViewer,
        // courseCompletion
      ]
      break
    case TRANSFORMATION_TEAM:
      umsNavItems = [
        userDashboard,
        slotsInfo
      ]
      break
    case TRANSFORMATION_ADMIN:
      umsNavItems = [
        userDashboard,
        slotsInfo,
        mentorMenteeManagement,
      ]
      break
    case AUDIT_ADMIN:
      umsNavItems = [
        audit,
        auditBuilder,
        auditViewer
      ]
      break
    case PRE_SALES:
      umsNavItems = [
        audit
      ]
      break
    case POST_SALES:
      umsNavItems = [
        audit
      ]
      break
    case AUDITOR:
      umsNavItems = [
        audit
      ]
      break
    default:
      break
  }
  return umsNavItems
}

const getSMSNavItems = (userRole) => {
  const { smsDashboard, mentorMenteeManagement, assignTimetable, batchCreation, batchMapping,
    batchAttendance, schoolOverviewTable, schoolProductMapping, salesDashboard,
    mentorConversionPage, schoolBulkUpload, SchoolOnboarding, bdManagement } = renderNavItems('sms')
  let smsNavItems = []
  switch (userRole) {
    case SCHOOL_ADMIN:
      smsNavItems = [
        smsDashboard,
        mentorMenteeManagement,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        schoolProductMapping,
        salesDashboard,
        mentorConversionPage,
        schoolBulkUpload,
        SchoolOnboarding
      ]
      break
    case BDE:
      smsNavItems = [
        bdManagement
      ]
      break
    case BDE_ADMIN:
      smsNavItems = [
        bdManagement
      ]
      break
    default:
      smsNavItems = [
        schoolOverviewTable,
        smsDashboard,
        mentorMenteeManagement,
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        schoolProductMapping,
        salesDashboard,
        mentorConversionPage,
        schoolBulkUpload,
        SchoolOnboarding,
        bdManagement,
      ]
      break
  }
  return smsNavItems
}
const navItemsTitle = navItems.map((navItem) => navItem.title)

/**
 * Responsible for rendering SideNav
 */
class SideNav extends Component {
  static propTypes = {
    /** history prop by react-router */
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    /** location prop by react-router */
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    /** decides width for the component */
    width: PropTypes.string.isRequired,
    loginType: PropTypes.string.isRequired,
    /**
     * decides which item should be active
     * (title of the item is passed prop to decide active item)
     * */
    activeNavItem: PropTypes.oneOf(navItemsTitle).isRequired,
  }

  renderLogo = () => (
    <Nav.LogoContainer to='/' >
      <img src='/images/logo.png' alt='tekie logo' />
    </Nav.LogoContainer>
  )

  render() {
    const { loginType } = this.props
    const blockName = localStorage.getItem('block')
    const savedRole = getDataFromLocalStorage('login.role')
    const umsNavFilters = getUMSNavItems(savedRole).filter((nav) => nav.blockName === blockName)
    const smsNavFilters = getSMSNavItems(savedRole).filter((nav) => nav.blockName === blockName)
    if (this.props.hideSideNavItems) {
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
        </Nav>
      )
    }
    if (this.props.showUmsNavigation) {
      const isTransformation = savedRole === TRANSFORMATION_ADMIN ||
        savedRole === TRANSFORMATION_TEAM
      const isAuditorRoles = savedRole === PRE_SALES
        || savedRole === POST_SALES || savedRole === AUDIT_ADMIN
        || savedRole === AUDITOR
      const navItemsFilter = isTransformation || isAuditorRoles ?
        getUMSNavItems(savedRole) : umsNavFilters
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
          {navItemsFilter.map(navItem => (
            <NavItem
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
        </Nav>
      )
    }

    if (this.props.showCMSNavigation) {
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
          {navItems.map((navItem) => (
            <NavItem
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
        </Nav>
      )
    }

    if (this.props.showCourseMakerNavigation) {
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
          {courseMakerNavItems.map((navItem) => (
            <NavItem
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
        </Nav>
      )
    }

    if (this.props.showContentMakerNavigation) {
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
          {contentMakerNavItems.map((navItem) => (
            <NavItem
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
        </Nav>
      )
    }

    if (this.props.showSMSNavigation) {
      const isBDE = savedRole === BDE
      const smsNavs = isBDE ? getSMSNavItems(savedRole) : smsNavFilters
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
          {smsNavs.map((navItem) => (
            <NavItem
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
        </Nav>
      )
    }
    if (this.props.showUMSAndSMSNavigation) {
      // checking for the login type and show the nav accordingly for sms and ums
      // we are routing the same BatchDashboard page for /ums/batchDashboard and for
      // /sms/batchDashboard
      if (loginType === 'sms') {
        return (
          <Nav width={this.props.width}>
            {this.renderLogo()}
            {smsNavFilters.map(navItem => (
              <NavItem
                {...navItem}
                key={navItem.title}
                isActive={navItem.title === this.props.activeNavItem}
              />
            ))}
          </Nav>
        )
      } else if (loginType === 'ums') {
        return (
          <Nav width={this.props.width}>
            {this.renderLogo()}
            {umsNavFilters.map(navItem => (
              <NavItem
                {...navItem}
                key={navItem.title}
                isActive={navItem.title === this.props.activeNavItem}
              />
            ))}
          </Nav>
        )
      }
    }
    return <div />
  }
}

export default SideNav
