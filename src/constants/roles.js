const CMS_ADMIN = 'cmsAdmin'
const CMS_VIEWER = 'cmsViewer'
const ADMIN = 'admin'
const SELF_LEARNER = 'selfLearner'
const STUDENT = 'schoolStudent'
const UMS_ADMIN = 'umsAdmin'
const UMS_VIEWER = 'umsViewer'
const MENTOR = 'mentor'
const MENTEE = 'mentee'
const UMS = 'ums'
const CMS = 'cms'
const SMS = 'sms'
const COURSE_MAKER = 'Course Maker'
const CONTENT_MAKER = 'Content Maker'
const PARENT = 'parent'
const PARENT_MENTEE = 'parentMentee'
const AFFILIATE = 'affiliate'
const SALES_EXECUTIVE = 'salesExecutive'
const TRANSFORMATION_ADMIN = 'transformationAdmin'
const TRANSFORMATION_TEAM = 'transformationTeam'
const SCHOOL_ADMIN = 'schoolAdmin'
const AUDIT_ADMIN = 'auditAdmin'
const PRE_SALES = 'preSales'
const POST_SALES = 'postSales'
const AUDITOR = 'auditor'
const BDE = 'BDE'
const BDE_ADMIN = 'bdeAdmin'

const USER_TYPES = [
  {
    id: 'ADMIN',
    type: { ADMIN }
  },
  {
    id: 'CMS_ADMIN',
    type: { CMS_ADMIN }
  },
  {
    id: 'CMS_VIEWER',
    type: { CMS_VIEWER }
  },
  {
    id: 'SELF_LEARNER',
    type: { SELF_LEARNER }
  },
  {
    id: 'STUDENT',
    type: { STUDENT }
  },
  {
    id: 'UMS_ADMIN',
    type: { UMS_ADMIN }
  },
  {
    id: 'UMS_VIEWER',
    type: { UMS_VIEWER }
  },
  {
    id: 'MENTOR',
    type: { MENTOR }
  },
  {
    id: 'MENTEE',
    type: { MENTEE }
  },
  {
    id: 'PARENT',
    type: { PARENT }
  },
  {
    id: 'PARENT_MENTEE',
    type: { PARENT_MENTEE }
  },
  {
    id: 'AFFILIATE',
    type: { AFFILIATE }
  },
  {
    id: 'SALES_EXECUTIVE',
    type: { SALES_EXECUTIVE }
  },
  {
    id: 'TRANSFORMATION_TEAM',
    type: { TRANSFORMATION_TEAM }
  },
  {
    id: 'TRANSFORMATION_ADMIN',
    type: { TRANSFORMATION_ADMIN }
  },
  {
    id: 'SCHOOL_ADMIN',
    type: { SCHOOL_ADMIN }
  },
  {
    id: 'BDE_ADMIN',
    type: { BDE_ADMIN }
  }
]

const USERS_ACCESS = [
  ADMIN,
  UMS_ADMIN,
  UMS_VIEWER,
  SALES_EXECUTIVE,
  TRANSFORMATION_ADMIN,
  TRANSFORMATION_TEAM
]

const WRITE_ABILITY_USER_TYPES = [ADMIN, CMS_ADMIN, UMS_ADMIN, MENTOR]

export {
  CMS_ADMIN,
  CMS_VIEWER,
  ADMIN,
  SELF_LEARNER,
  STUDENT,
  UMS_ADMIN,
  UMS_VIEWER,
  MENTOR,
  MENTEE,
  PARENT,
  CMS,
  UMS,
  SMS,
  COURSE_MAKER,
  CONTENT_MAKER,
  USER_TYPES,
  USERS_ACCESS,
  PARENT_MENTEE,
  WRITE_ABILITY_USER_TYPES,
  AFFILIATE,
  SALES_EXECUTIVE,
  TRANSFORMATION_TEAM,
  TRANSFORMATION_ADMIN,
  SCHOOL_ADMIN,
  AUDIT_ADMIN,
  PRE_SALES,
  POST_SALES,
  AUDITOR,
  BDE,
  BDE_ADMIN,
}
