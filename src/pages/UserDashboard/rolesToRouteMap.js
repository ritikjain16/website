import { FolderOutlined, UserOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import {
  ADMIN, AUDITOR, AUDIT_ADMIN, BDE, BDE_ADMIN, CMS, CONTENT_MAKER, COURSE_MAKER, MENTOR, POST_SALES,
  PRE_SALES, SALES_EXECUTIVE,
  SCHOOL_ADMIN, SMS, UMS, UMS_ADMIN, UMS_VIEWER
} from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import renderNavItems from '../../utils/renderNavItem'
import roleToSystemMap from '../Login/roleToSystemMap'


const { session, manageKids, batchCreation, batchMapping, assignTimetable, batchAttendance,
  mentorMenteeManagement, mentorSalesDashboard, mentorConversion, mentorReport, mentorPay,
  userDashboard, SalesExecMentor, classProgress, mentorAudits, assignedAudits,
  stats, tabularStats, netPromoterScore, slotsInfo, banner, codeApproval, mentorDashboard, auditBuilder, audit, auditViewer, courseCompletion } = renderNavItems('ums')

const { schoolOverviewTable, schoolProductMapping, smsDashboard, SchoolOnboarding, schoolBulkUpload,
  bdManagement, ...otherSms } = renderNavItems('sms')

// blocks to display on the dashboard page
const blocks = {
  [UMS]: {
    manageSessions: {
      Icon: FolderOutlined,
      blockName: 'Manage Sessions',
      routes: [
        session,
        manageKids,
        { route: '/ums/sessions/paid' }
      ]
    },
    manageBatches: {
      Icon: FolderOutlined,
      blockName: 'Manage Batches',
      routes: [
        batchCreation,
        batchMapping,
        assignTimetable,
        batchAttendance,
        { route: '/ums/batchMapping/:code' },
        { route: '/ums/assignTimetable/:code' },
        { route: '/ums/batchAttendance/:code' },
        { route: '/sms/batchMapping/:code' },
        { route: '/sms/assignTimetable/:code' },
        { route: '/sms/batchAttendance/:code' },
      ]
    },
    manageConversions: {
      Icon: FolderOutlined,
      blockName: 'Manage Conversion',
      routes: [
        mentorMenteeManagement,
        mentorSalesDashboard,
        mentorConversion,
        { route: '/ums/mentor-conversion/:id' },
        { route: '/ums/completedSessions/:userId' },
        { route: '/ums/mentor-sales-dashboard/:userId' }
      ]
    },
    mentorPerformance: {
      Icon: FolderOutlined,
      blockName: 'Mentor Performance',
      routes: [mentorReport]
    },
    mentorPayment: {
      Icon: FolderOutlined,
      blockName: 'Mentor Payment',
      routes: [mentorPay]
    },
    users: {
      Icon: FolderOutlined,
      blockName: 'Users',
      routes: [userDashboard]
    },
    salesExecMapping: {
      Icon: FolderOutlined,
      blockName: 'Sales Exec-Mentor Mapping',
      routes: [SalesExecMentor]
    },
    studentsPerformance: {
      Icon: FolderOutlined,
      blockName: 'Student Performance',
      routes: [classProgress, courseCompletion, { route: '/ums/studentJourney/:id' }]
    },
    codeApprovals: {
      Icon: FolderOutlined,
      blockName: 'Code Approval',
      routes: [
        codeApproval,
        { route: '/ums/approvedCode/:id' }
      ]
    },
    mentorAudit: {
      Icon: FolderOutlined,
      blockName: 'Audit',
      routes: [
        audit,
        { route: '/audit/:auditType' },
        { route: '/audit/:auditType/:auditId' },
        mentorAudits,
        assignedAudits,
        auditBuilder,
        { route: '/ums/mentorAudits/:id' },
        { route: '/ums/auditBuilder/:auditType' },
        { route: '/ums/mentorAudits/:id' },
        auditViewer,
        { route: '/ums/auditBuilder-viewForm/:auditType' },
      ]
    },
    analytics: {
      Icon: FolderOutlined,
      blockName: 'Analytics',
      routes: [stats, tabularStats, netPromoterScore]
    },
    assignMentors: {
      Icon: FolderOutlined,
      blockName: 'Assign Mentors',
      routes: [slotsInfo, { route: '/ums/report' }]
    },
    marketing: {
      Icon: FolderOutlined,
      blockName: 'Marketing',
      routes: [
        banner,
        { route: '/ums/banner/addBanner' },
        { route: '/ums/banner/:id' },
      ]
    },
    mentorDashboardBeta: {
      Icon: UserOutlined,
      blockName: 'Mentor Dashboard',
      withUpdatedDesign: true,
      routes: [
        mentorDashboard,
        { route: '/mentorDashboard/:mentorId/classFeedback/:sessionId' },
        { route: '/mentorDashboard/classFeedback/:sessionId' },
        { route: '/mentorDashboard/:mentorId' },
      ]
    }
  },
  [SMS]: {
    smsUsers: {
      blockName: 'Schools-Kids',
      routes: [smsDashboard,
        { route: '/sms/studentJourney/:id' },
        { route: '/sms/dashboard/:id' }
      ]
    },
    schooloverview: {
      blockName: 'Manage Schools',
      routes: [
        schoolOverviewTable,
        schoolProductMapping,
        SchoolOnboarding,
        bdManagement,
        { route: '/sms/school-dashboard/:schoolId/grade' },
        { route: '/sms/school-dashboard/:schoolId/students' },
        { route: '/sms/school-dashboard/:schoolId/campaigns' },
        { route: '/sms/school-dashboard/:schoolId/batches' },
        { route: '/sms/schoolProductMapping/:schoolId' },
        { route: '/sms/school-dashboard/:schoolId/batches/:batchId/students' },
        { route: '/sms/school-dashboard/:schoolId/batches/:batchId/scheduling' },
        { route: '/sms/school-dashboard/:schoolId/batches/:batchId/mentors' },
        schoolBulkUpload,
        { route: '/sms/schoolProductMapping/:schoolId' },
        { route: '/sms/bulk-upload/:id' }
      ]
    },
    smsManageBatches: {
      blockName: 'Manage Batches',
      routes: [
        otherSms.batchCreation,
        otherSms.batchMapping,
        otherSms.assignTimetable,
        otherSms.batchAttendance,
        { route: '/sms/assignTimetable/:code' },
        { route: '/sms/batchMapping/:code' },
        { route: '/sms/batchAttendance/:code' },
      ]
    },
    smsManageConversion: {
      blockName: 'Manage Conversion',
      routes: [
        otherSms.mentorMenteeManagement,
        otherSms.mentorSalesDashboard,
        otherSms.mentorConversion
      ]
    }
  }
}

const getUmsBlocks = (savedRole) => {
  const { manageSessions, manageBatches, manageConversions, mentorPerformance,
    mentorPayment, users, salesExecMapping, studentsPerformance,
    mentorAudit, analytics, assignMentors, marketing, codeApprovals,
    mentorDashboardBeta } = blocks[UMS]

  // blocks created according to the roles
  const rolesToRouteMap = {
    [MENTOR]: [
      manageSessions, manageConversions, studentsPerformance,
      manageBatches, mentorAudit, mentorPerformance,
      mentorPayment, codeApprovals, mentorDashboardBeta,
    ],
    [SALES_EXECUTIVE]: [
      users, manageSessions, manageConversions, studentsPerformance,
      salesExecMapping, manageBatches, mentorPerformance,
      mentorPayment, mentorDashboardBeta,
    ],
    [UMS_ADMIN]: [
      users, assignMentors, manageSessions, manageConversions,
      studentsPerformance, salesExecMapping, manageBatches,
      mentorAudit, mentorPerformance, mentorPayment, analytics,
      marketing, codeApprovals, mentorDashboardBeta,
    ],
    [UMS_VIEWER]: [
      users, assignMentors, manageSessions, manageConversions,
      studentsPerformance, salesExecMapping, manageBatches,
      mentorAudit, mentorPerformance, mentorPayment, analytics,
    ],
    [ADMIN]: [
      users, assignMentors, manageSessions, manageConversions,
      studentsPerformance, salesExecMapping, manageBatches,
      mentorAudit, mentorPerformance, mentorPayment, analytics,
      marketing, codeApprovals, mentorDashboardBeta,
    ],
    [AUDIT_ADMIN]: [
      mentorAudit
    ],
    [PRE_SALES]: [
      mentorAudit
    ],
    [POST_SALES]: [
      mentorAudit
    ],
    [AUDITOR]: [
      mentorAudit
    ],
  }
  return rolesToRouteMap[savedRole]
}

const getSmsBlock = () => {
  const { schooloverview, smsUsers, smsManageBatches, smsManageConversion } = blocks[SMS]
  let rolesToRouteMapSms = []
  const savedRole = getDataFromLocalStorage('login.role')
  if (savedRole === MENTOR) {
    rolesToRouteMapSms = [smsUsers, smsManageBatches, smsManageConversion]
  } else if (savedRole === SCHOOL_ADMIN) {
    const schoolAdminSchoolOverView = { ...schooloverview }
    schoolAdminSchoolOverView.routes = [schoolProductMapping, { route: '/sms/schoolProductMapping/:schoolId' }]
    rolesToRouteMapSms = [schoolAdminSchoolOverView, smsUsers, smsManageBatches]
  } else if (savedRole === BDE || savedRole === BDE_ADMIN) {
    const newSchoolOverview = {
      ...schooloverview,
      routes: [...schooloverview.routes].filter(route => get(route, 'title') === 'BDE Management')
    }
    rolesToRouteMapSms = [
      newSchoolOverview
    ]
  } else {
    rolesToRouteMapSms = [
      schooloverview, smsUsers, smsManageBatches, smsManageConversion
    ]
  }
  return rolesToRouteMapSms
}

const getCmsBlock = () => {
  const cmsRoutes = [
    '/dashboard',
    '/courses',
    '/chapters',
    '/topics',
    '/emojis',
    '/products',
    '/approvedCodeTags',
    '/topic/:id',
    '/approvedCodeTags',
    '/learning-objectives/:id',
    '/topicjourney',
    '/episode/:id',
    '/tech-talk/:topicId',
    '/tech-talk/:topicId/:learningObjectiveId',
    '/questionbank/:id',
    '/assignment/:id',
    '/badges/:id',
    '/cheatSheet/:topicId',
    '/workbook/:topicId',
    '/project/:topicId',
  ]
  return cmsRoutes
}

const getCourseMakerBlock = () => {
  const courseMakerRoutes = [
    '/addCourse',
    '/addChapter',
    '/course-sessions',
    '/course-sessions/:courseId',
    '/course-sessions/:courseId/add-session',
    '/course-sessions/:courseId/badge/:topicId'
  ]
  return courseMakerRoutes
}

const getContentMakerBlock = () => {
  const contentMakerRoutes = [
    '/content-comic',
    '/content-project',
    '/content-practice',
    '/comic/:learningObjectiveId',
    '/content-techTalk/:learningObjectiveId',
    '/content-questions/:learningObjectiveId',
    '/content-quiz',
    '/content-assignment',
    '/content-learningObjective',
    '/content-video',
    '/content-homeworkAssignment'
  ]
  return contentMakerRoutes
}

const checkAllowedRoutes = (path) => {
  // this function maps each block and to get the each route which can be accessed by the
  // user, and checks if the user can access the particular route or not
  // and then accordingly it will allow or redirects to the / route which is the dashboard
  const savedRole = getDataFromLocalStorage('login.role')
  const allowedRoles = roleToSystemMap[savedRole]
  const allowedRoutes = ['/', '/user-profile']
  if (allowedRoles.includes(UMS)) {
    const umsBlocks = getUmsBlocks(savedRole)
    umsBlocks.forEach(({ routes }) => {
      routes.forEach(({ route }) => {
        allowedRoutes.push(route)
      })
    })
  }


  if (allowedRoles.includes(SMS)) {
    const smsBlock = getSmsBlock()
    smsBlock.forEach(({ routes }) => {
      routes.forEach(({ route }) => {
        allowedRoutes.push(route)
      })
    })
  }


  if (allowedRoles.includes(CMS)) {
    const cmsBlock = getCmsBlock()
    cmsBlock.forEach((route) => allowedRoutes.push(route))
  }


  if (allowedRoles.includes(COURSE_MAKER)) {
    const courseMakerBlock = getCourseMakerBlock()
    courseMakerBlock.forEach((route) => allowedRoutes.push(route))
  }

  if (allowedRoles.includes(CONTENT_MAKER)) {
    const contentMakerBlock = getContentMakerBlock()
    contentMakerBlock.forEach((route) => allowedRoutes.push(route))
  }


  if (allowedRoutes.includes(path)) {
    return true
  }
  return false
}

export { getSmsBlock, getUmsBlocks, getCmsBlock, checkAllowedRoutes }
