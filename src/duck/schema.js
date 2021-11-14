const schema = {
  user: {
    alias: [
      'users',
      'addUser',
      'updateUser',
      'deleteUser',
      'parentChildSignUp',
    ],
    type: 'arrayOfObjects',
  },
  userMeta: {
    alias: ['usersMeta'],
    type: 'object',
  },
  assignmentQuestion: {
    alias: [
      'assignmentQuestions',
      'addAssignmentQuestion',
      'updateAssignmentQuestion',
      'deleteAssignmentQuestion',
    ],
    type: 'arrayOfObjects',
  },
  assignmentQuestionMeta: {
    alias: ['assignmentQuestionsMeta'],
    type: 'object',
  },
  session: {
    alias: [
      'sessions',
      'mentorSessions',
      'addMentorSession',
      'updateMentorSession',
      'deleteMentorSession',
      'deleteMentorMenteeSession',
      'addMentorMenteeSession',
    ],
    type: 'arrayOfObjects',
  },
  sessionLogs: {
    alias: ['sessionLogs'],
    type: 'arrayOfObjects',
  },
  mentorSessions: {
    alias: [
      'mentorSessions',
      'addMentorSession',
      'mentorMenteeSession',
      'updateMentorMenteeSession',
      'updateBatchSession',
      'prevMentorSession',
      'updateMentorSession',
      'updateMenteeSession',
      'deleteMentorSession'
    ],
    type: 'arrayOfObjects',
  },
  completedSession: {
    alias: [
      'mentorMenteeSessions',
      'updateMentorMenteeSession',
      'deleteMentorMenteeSession',
      'addMentorMenteeSession',
      'firstMentorMenteeSession',
      'addSalesOperation',
      'updateSalesOperation',
    ],
    type: 'arrayOfObjects',
  },
  mentorAudits: {
    alias: ['mentorMenteeSessionAudits', 'updateMentorMenteeSessionAudit'],
    type: 'arrayOfObjects',
  },
  course: {
    alias: ['courses', 'addCourse', 'updateCourse', 'deleteCourse'],
    type: 'arrayOfObjects',
  },
  menteeSession: {
    alias: [
      'menteeSessions',
      'addMenteeSession',
      'deleteMenteeSession',
      'updateMenteeSession',
    ],
    type: 'arrayOfObjects',
  },
  availableSlot: {
    alias: ['availableSlots'],
    type: 'arrayOfObjects',
  },
  parentChildSignUp: {
    alias: ['parentChildSignUp'],
    type: 'object',
  },
  menteeSessionsMeta: {
    alias: ['menteeSessionsMeta'],
    type: 'object',
  },
  mentorMenteeSession: {
    alias: ['mentorMenteeSession'],
    type: 'object',
  },
  mentorMenteeSessionsMeta: {
    alias: ['mentorMenteeSessionsMeta'],
    type: 'object',
  },
  mentorMenteeSessionAuditsMeta: {
    alias: ['mentorMenteeSessionAuditsMeta'],
    type: 'object',
  },
  userCurrentTopicComponentStatusesMeta: {
    alias: ['userCurrentTopicComponentStatusesMeta'],
    type: 'object',
  },
  futureMenteeSessionsMeta: {
    alias: ['futureMenteeSessionsMeta'],
    type: 'object',
  },
  salesOperation: {
    alias: ['salesOperations', 'addSalesOperation', 'updateSalesOperation'],
    type: 'arrayOfObjects',
  },
  totalMenteeSessionsMeta: {
    alias: ['totalMenteeSessionsMeta'],
    type: 'object',
  },
  mentorMenteeSessionAudit: {
    alias: ['mentorMenteeSessionAudit', 'updateMentorMenteeSessionAudit'],
    type: 'object',
  },
  postSalesAudit: {
    alias: ['postSalesAudit'],
    type: 'object',
  },
  preSalesAudit: {
    alias: ['preSalesAudit', 'updatePreSalesAudit'],
    type: 'object',
  },
  mentorMenteeSessionTimestamp: {
    alias: ['mentorMenteeSessionTimestamp'],
    type: 'object',
  },
  salesOperationLog: {
    alias: [
      'salesOperationLogs',
      'addSalesOperationLog',
      'updateSalesOperationLog',
    ],
    type: 'arrayOfObjects',
  },
  netPromoterScore: {
    alias: ['netPromoterScore', 'nps'],
    type: 'arrayOfObjects',
  },
  countData: {
    alias: ['completedSessionDataCounts', 'mentorSalesMeta'],
    type: 'object',
  },
  totalCompletedSessions: {
    alias: ['totalCompletedSessions'],
    type: 'object',
  },
  totalMentorAudits: {
    alias: ['totalMentorAudits'],
    type: 'object',
  },
  salesOperationReport: {
    alias: ['salesOperationReports'],
    type: 'element',
  },
  salesOperationForMentorSales: {
    alias: ['salesOperations', 'addSalesOperation', 'updateSalesOperation'],
    type: 'arrayOfObjects',
  },
  mentors: {
    alias: ['users'],
    type: 'arrayOfObjects',
  },
  products: {
    alias: ['product', 'addProduct', 'deleteProduct', 'updateProduct'],
    type: 'arrayOfObjects',
  },
  productsMeta: {
    type: 'object',
  },
  userPaymentPlans: {
    alias: [
      'userPaymentPlans',
      'userPaymentPlan',
      'addUserPaymentPlan',
      'updateUserPaymentPlan',
    ],
    type: 'arrayOfObjects',
  },
  userPaymentLinks: {
    alias: ['userPaymentLinks'],
    type: 'arrayOfObjects',
  },
  product: {
    type: 'arrayOfObjects',
  },
  mentorPricings: {
    type: 'arrayOfObjects',
  },
  batches: {
    // alias: ['batches', 'batch'],
    type: 'arrayOfObjects',
  },
  batchesMeta: {
    type: 'object',
  },
  batchesForClassesMeta: {
    type: 'object',
  },
  allBatches: {
    type: 'arrayOfObjects',
  },
  topicsMeta: {
    type: 'object',
  },
  mentorSessionsMeta: {
    alias: ['mentorSessionsMeta'],
    type: 'object',
  },
  userCurrentTopicComponentStatus: {
    alias: [
      'userCurrentTopicComponentStatuses',
      'userCurrentTopicComponentStatus',
      'updateUserCurrentTopicComponentStatuses',
      'updateUserCurrentTopicComponentStatus',
    ],
    type: 'arrayOfObjects',
  },
  userProfile: {
    alias: ['user', 'userProfile'],
    type: 'arrayOfObjects',
  },
  userSavedCodes: {
    alias: ['userSavedCodes', 'updateUserSavedCode'],
    type: 'arrayOfObjects',
  },
  userSavedCodesMeta: {
    alias: ['userSavedCodesMeta'],
    type: 'object',
  },
  userApprovedCodeTagsMeta: {
    alias: ['userApprovedCodeTagsMeta'],
    type: 'object',
  },
  userApprovedCodeTag: {
    type: 'arrayOfObjects',
  },
  userApprovedCodeTags: {
    alias: [
      'userApprovedCodeTags',
      'addUserApprovedCodeTags',
      'updateUserApprovedCodeTags',
      'deleteUserApprovedCodeTag',
    ],
    type: 'arrayOfObjects',
  },
  userApprovedCodeTagMapping: {
    alias: [
      'userApprovedCodeTagMapping',
      'addUserApprovedCodeTagMapping',
      'deleteUserApprovedCodeTagMapping',
    ],
    type: 'arrayOfObjects',
  },
  updateUserApprovedCode: {
    alias: ['updateUserApprovedCode'],
    type: 'arrayOfObjects',
  },
  // mentorProfile: {
  //   alias: ['mentorProfile', 'updateMentorProfile', 'addMentorProfile'],
  //   type: 'object'
  // }
  salesOperationsMeta: {
    alias: ['salesOperationsMeta'],
    type: 'object',
  },
  topic: {
    alias: ['topics', 'addTopic', 'updateTopic', 'deleteTopic'],
    type: 'arrayOfObjects',
  },
  userForDashBoard: {
    alias: ['users', 'user', 'addUser', 'updateUser'],
    type: 'arrayOfObjects',
  },
  usersForAudits: {
    alias: ['users'],
    type: 'arrayOfObjects',
  },
  getTotalAmountCollected: {
    alias: ['mentorConversionTotalAmount'],
    type: 'object',
  },
  userInvites: {
    alias: ['userInvites'],
    type: 'arrayOfObject',
  },
  schools: {
    alias: ['schools', 'school', 'addSchool', 'updateSchool', 'deleteSchool'],
    type: 'arrayOfObjects',
  },
  schoolsMeta: {
    type: 'object',
  },
  studentsOfSchool: {
    alias: ['studentsOfSchool'],
    type: 'arrayOfObject',
  },
  studentsOfSchoolCount: {
    alias: ['studentsOfSchoolCount'],
    type: 'object',
  },
  unlinkedSalesOperation: {
    alias: ['unlinkedSalesOperation'],
    type: 'arrayOfObject',
  },
  batchSessions: {
    alias: ['batchSession', 'batchSessions', 'updateBatchSession'],
    type: 'arrayOfObjects',
  },
  batchSessionsMeta: {
    type: 'object',
  },
  mentorReports: {
    alias: ['mentorReports'],
    type: 'arrayOfObject',
  },
  mentorReportData: {
    type: 'arrayOfObject',
  },
  usersData: {
    type: 'arrayOfObject',
  },
  mentorReportsMeta: {
    type: 'arrayOfObject',
  },
  salesExecutiveProfiles: {
    alias: ['salesExectiveProfiles', 'salesExectiveProfile'],
    type: 'arrayOfObject',
  },
  lastSessionOfBatch: {
    alias: ['lastSessionOfBatch'],
    type: 'arrayOfObject',
  },
  topicId: {
    alias: ['topicId'],
    type: 'arrayOfObject',
  },
  checkMentorSession: {
    alias: ['checkMentorSession'],
    type: 'arrayOfObject',
  },
  mentorsession: {
    alias: ['mentorsession'],
    type: 'arrayOfObject',
  },
  salesExecutiveProfilesMeta: {
    type: 'object',
  },
  updateMentorProfile: {
    alias: ['updateMentor'],
    type: 'object',
  },
  batch: {
    alias: ['batch', 'batches', 'addBatch', 'deleteBatch', 'updateBatch'],
    type: 'arrayOfObjects',
  },
  studentsJourney: {
    alias: ['studentsJourney'],
    type: 'object',
  },
  studentReport: {
    type: 'object',
  },
  classProgress: {
    type: 'arrayOfObjects',
  },
  discounts: {
    alias: ['discounts'],
    type: 'arrayOfObjects',
  },
  classProgressData: {
    type: 'object',
  },
  classProgressAll: {
    type: 'arrayOfObjects',
  },
  banners: {
    alias: ['banners', 'addBanner', 'deleteBanner', 'updateBanner'],
    type: 'arrayOfObjects',
  },
  bannersMeta: {
    type: 'object',
  },
  cheatSheets: {
    alias: [
      'cheatSheets',
      'addCheatSheet',
      'deleteCheatSheet',
      'updateCheatSheet',
    ],
    type: 'arrayOfObjects',
  },
  cheatSheet: {
    type: 'object',
  },
  contentTags: {
    alias: [
      'contentTag',
      'contentTags',
      'addContentTag',
      'updateContentTag',
      'deleteContentTag',
    ],
    type: 'arrayOfObjects',
  },
  contentTagsMeta: {
    type: 'object',
  },
  workbooks: {
    alias: [
      'workbook',
      'workbooks',
      'addWorkbook',
      'updateWorkbook',
      'deleteWorkbook',
    ],
    type: 'arrayOfObjects',
  },
  workbooksMeta: {
    type: 'object',
  },
  projects: {
    alias: ['projects', 'addProject', 'updateProject', 'deleteProject'],
    type: 'arrayOfObjects',
  },
  project: {
    type: 'object',
  },
  projectsMeta: {
    type: 'object',
  },
  schoolDashboardCount: {
    type: 'object',
  },
  schoolClasses: {
    alias: ['schoolClasses', 'addSchoolClass', 'deleteSchoolClasses'],
    type: 'arrayOfObjects',
  },
  studentProfiles: {
    type: 'arrayOfObjects',
  },
  studentProfilesMeta: {
    type: 'object',
  },
  campaigns: {
    alias: ['campaigns', 'addCampaign', 'updateCampaign', 'deleteCampaign'],
    type: 'arrayOfObjects',
  },
  campaignBatches: {
    type: 'arrayOfObjects',
  },
  batchesData: {
    type: 'object',
  },
  campaignBatchesMeta: {
    type: 'object',
  },
  coursesMeta: {
    type: 'object',
  },
  learningObjectives: {
    alias: [
      'learningObjectives',
      'addLearningObjective',
      'deleteLearningObjective',
      'updateLearningObjective',
    ],
    type: 'arrayOfObjects',
  },
  learningObjectivesMeta: {
    type: 'object',
  },
  videos: {
    alias: ['videos', 'addVideo', 'updateVideo', 'deleteVideo'],
    type: 'arrayOfObjects',
  },
  videosMeta: {
    type: 'object',
  },
  blockBasedProjects: {
    alias: [
      'blockBasedProjects',
      'addBlockBasedProject',
      'updateBlockBasedProject',
      'deleteBlockBasedProject',
    ],
    type: 'arrayOfObjects',
  },
  blockBasedProjectsMeta: {
    type: 'object',
  },
  questionBanks: {
    alias: [
      'questionBanks',
      'updateQuestionBank',
      'addQuestionBank',
      'deleteQuestionBank',
    ],
    type: 'arrayOfObjects',
  },
  questionBanksMeta: {
    type: 'object',
  },
  comicStrips: {
    alias: ['comicStrips', 'addComicStrip', 'updateComicStrip'],
    type: 'arrayOfObjects',
  },
  comicImages: {
    alias: ['comicImages', 'addComicImage'],
    type: 'arrayOfObjects',
  },
  sessionTopic: {
    type: 'object',
  },
  campaignDetails: {
    type: 'object',
  },
  chapters: {
    alias: ['chapters', 'addChapter', 'updateChapter', 'deleteChapter'],
    type: 'arrayOfObjects',
  },
  chaptersMeta: {
    type: 'object',
  },
  badges: {
    alias: ['badges', 'addBadge', 'updateBadge', 'deleteBadge'],
    type: 'arrayOfObjects',
  },
  badgesMeta: {
    type: 'object',
  },
  studentSearchData: {
    type: 'arrayOfObjects',
  },
  messages: {
    alias: ['messages', 'addMessage'],
    type: 'arrayOfObjects',
  },
  stickerEmojis: {
    type: 'arrayOfObjects',
  },
  sessionLogsMeta: {
    type: 'object'
  },
  mentorMenteeSessions: {
    alias: ['mentorMenteeSessions', 'addMentorMenteeSession', 'deleteMentorMenteeSession'],
    type: 'arrayOfObjects'
  },
  auditQuestions: {
    alias: ['auditQuestions', 'addAuditQuestion', 'updateAuditQuestion', 'deleteAuditQuestion', 'updateAuditQuestions'],
    type: 'arrayOfObjects'
  },
  preSalesAudits: {
    alias: ['preSalesAudits', 'updatePreSalesAudit'],
    type: 'arrayOfObjects'
  },
  postSalesAudits: {
    alias: ['postSalesAudits', 'updatePostSalesAudit'],
    type: 'arrayOfObjects'
  },
  unVerifiedUsers: {
    type: 'object'
  },
  verifiedUsers: {
    type: 'object'
  },
  bookedSessionsCount: {
    type: 'object'
  },
  allottedSessionsCount: {
    type: 'object'
  },
  startedSessionsCount: {
    type: 'object'
  },
  completedSessionsCount: {
    type: 'object'
  },
  missedSessionsCount: {
    type: 'object'
  },
  convertedUsers: {
    type: 'object'
  },
  postSalesAuditsMeta: {
    type: 'object'
  },
  mentorMenteeSessionsForAudit: {
    alias: ['mentorMenteeSessionsForAudit'],
    type: 'arrayOfObjects'
  },
  auditQuestionSections: {
    type: 'arrayOfObjects'
  },
  auditQuestionSubSections: {
    type: 'arrayOfObjects'
  },
  sessionCountWith5Rating: {
    type: 'object'
  },
  sessionCountWithLessThanFiveRating: {
    type: 'object'
  },
  sessionCountWithLink: {
    type: 'object'
  },
  sessionCountWithIsAudit: {
    type: 'object'
  },
  sessionCountWithIsPostSalesAudit: {
    type: 'object'
  },
  mentorsForAudits: {
    type: 'arrayOfObjects'
  },
  sessionReports: {
    type: 'arrayOfObjects'
  },
  bdeProfiles: {
    alias: ['bdeProfiles', 'updateBDEProfile', 'removeFromBDEProfileSchool'],
    type: 'arrayOfObjects'
  },
  bdeProfilesMeta: {
    type: 'object'
  },
  schoolStudentData: {
    type: 'arrayOfObjects'
  },
  bdSchoolsMetaData: {
    type: 'arrayOfObjects'
  },
  userCourses: {
    alias: ['userCourses', 'addUserCourse', 'updateUserCourse', 'removeFromCourseUserCourse'],
    type: 'arrayOfObjects'
  },
  userCourseCompletions: {
    alias: ['userCourseCompletions'],
    type: 'arrayOfObjects'
  }
  // schoolAdmin: {
  //   alias: ['schoolAdmin'],
  //   type: 'arrayOfObject',
  // }
}

export default schema
