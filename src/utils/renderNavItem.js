const renderNavItems = (routeBase) => {
  // specify all the routes here and pass the base route either ums or sms
  const items = {
    userDashboard: { iconType: 'dashboard', title: 'User', route: `/${routeBase}/dashboard`, blockName: 'Users', },
    codeApproval: {
      iconType: 'codeApproval',
      title: 'Code Approval',
      route: `/${routeBase}/codeApproval`,
      style: { fontSize: 32 },
      blockName: 'Code Approval',
    },
    mentorDashboard: {
      iconType: 'mentorDashboard',
      title: 'Mentor Dashboard',
      route: '/mentorDashboard',
      style: { fontSize: 32 },
      blockName: 'Mentor Dashboard',
    },
    mentorMenteeManagement: {
      iconType: 'teacher',
      title: 'Mentor Mentee Management',
      route: `/${routeBase}/completedSessions`,
      style: { fontSize: 32 },
      blockName: 'Manage Conversion',
    },
    mentorSalesDashboard: {
      iconType: 'teacher',
      title: 'Mentor Sales Dashboard',
      route: `/${routeBase}/mentor-sales-dashboard`,
      style: { fontSize: 32 },
      blockName: 'Manage Conversion',
    },
    mentorAudits: {
      iconType: 'mentorAudits',
      title: 'Mentor Audits',
      route: `/${routeBase}/mentorAudits`,
      style: { fontSize: 32 },
      blockName: 'Audit'
    },
    assignedAudits: {
      iconType: 'assignedAudits',
      title: 'Assigned Audits',
      route: `/${routeBase}/mentorAudits/assignedAudits`,
      style: { fontSize: 32 },
      blockName: 'Audit'
    },
    mentorConversion: {
      iconType: 'teacher',
      title: 'Mentor Conversion',
      route: `/${routeBase}/mentor-conversion`,
      style: { fontSize: 32 },
      blockName: 'Manage Conversion',
    },
    session: {
      iconType: 'external',
      title: 'Sessions',
      route: `/${routeBase}/sessions`,
      icon: 'session',
      style: { left: '12px' },
      blockName: 'Manage Sessions',
    },
    manageKids: {
      iconType: 'external',
      title: 'Manage Kids',
      route: `/${routeBase}/manageKids`,
      icon: 'profile',
      blockName: 'Manage Sessions',
    },
    slotsInfo: { iconType: 'file', title: 'Slots Info', route: `/${routeBase}/slotsInfo`, blockName: 'Assign Mentors', },
    stats: { iconType: 'pie-chart', title: 'Stats', route: `/${routeBase}/stats`, blockName: 'Analytics', },
    tabularStats: { iconType: 'file', title: 'Stats Table', route: `/${routeBase}/tabularStats`, blockName: 'Analytics', },
    mentorPay: {
      iconType: 'calculator',
      title: 'Mentors Pay',
      route: `/${routeBase}/mentorsPay`,
      style: { fontSize: 32 },
      blockName: 'Mentor Payment',
    },
    netPromoterScore: {
      iconType: 'star',
      title: 'Net Promoter Score',
      route: `/${routeBase}/net-promoter-score`,
      blockName: 'Analytics',
    },
    mentorReport: {
      iconType: 'calendar',
      title: 'Mentor Report',
      route: `/${routeBase}/mentorReport`,
      blockName: 'Mentor Performance',
    },
    SalesExecMentor: {
      iconType: 'check-circle',
      title: 'Sales Executive Mentor',
      route: `/${routeBase}/sales-exec-mentor`,
      blockName: 'Sales Exec-Mentor Mapping',
    },
    batchCreation: {
      iconType: 'batchCreation',
      title: 'Batch Dashboard',
      route: `/${routeBase}/batchDashboard`,
      blockName: 'Manage Batches',
    },
    salesDashboard: {
      iconType: 'check-circle',
      title: 'Sales Dashboard',
      route: `/${routeBase}/mentor-sales-dashboard`,
      style: { fontSize: 32 },
      blockName: 'Manage Conversion',
    },
    mentorConversionPage: {
      iconType: 'star',
      title: 'Mentor Conversion',
      route: `/${routeBase}/mentor-conversion`,
      style: { fontSize: 32 },
      blockName: 'Manage Conversion',
    },
    batchMapping: {
      iconType: 'batchMapping',
      title: 'Batch-User Mapping',
      route: `/${routeBase}/batchMapping`,
      style: { fontSize: 32 },
      blockName: 'Manage Batches',
    },
    assignTimetable: {
      iconType: 'assignTimetable',
      title: 'Assign Timetable',
      route: `/${routeBase}/assignTimetable`,
      style: { fontSize: 32 },
      blockName: 'Manage Batches',
    },
    batchAttendance: {
      iconType: 'batchAttendance',
      title: 'Batch Attendance',
      route: `/${routeBase}/batchAttendance`,
      style: { fontSize: 32 },
      blockName: 'Manage Batches',
    },
    schoolBulkUpload: {
      title: 'School Bulk Upload',
      route: `/${routeBase}/bulk-upload`,
      style: { fontSize: 32 },
      iconType: 'file-add',
      blockName: 'Manage Schools',
    },
    smsDashboard: {
      title: 'SMS Dashboard',
      route: `/${routeBase}/dashboard`,
      style: { fontSize: 32 },
      iconType: 'external',
      icon: 'profile',
      blockName: 'Schools-Kids',
    },
    schoolOverviewTable: {
      title: 'School Overview Table',
      route: `/${routeBase}/schoolOverviewTable`,
      style: { fontSize: 32 },
      icon: 'profile',
      blockName: 'Manage Schools',
      iconType: 'bank',
    },
    schoolProductMapping: {
      title: 'School Product Mapping',
      route: `/${routeBase}/schoolProductMapping`,
      style: { fontSize: 32 },
      icon: 'profile',
      blockName: 'Manage Schools',
      iconType: 'project',
    },
    classProgress: {
      title: 'Class Progress',
      route: `/${routeBase}/classProgress`,
      style: { fontSize: 32 },
      iconType: 'external',
      icon: 'profile',
      blockName: 'Student Performance'
    },
    banner: {
      title: 'Banner',
      route: `/${routeBase}/banner`,
      style: { fontSize: 32 },
      iconType: 'calendar',
      blockName: 'Marketing'
    },
    SchoolOnboarding: {
      title: 'School Onboarding',
      route: `/${routeBase}/school-dashboard/grade`,
      style: { fontSize: 32 },
      iconType: 'calendar',
      blockName: 'Manage Schools'
    },
    auditBuilder: {
      title: 'Audit Builder',
      route: `/${routeBase}/auditBuilder`,
      style: { fontSize: 32 },
      iconType: 'calendar',
      blockName: 'Audit'
    },
    audit: {
      iconType: 'mentorAudits',
      title: 'Audit',
      route: '/audit',
      style: { fontSize: 32 },
      blockName: 'Audit'
    },
    auditViewer: {
      iconType: 'file',
      title: 'Audit Viewer',
      route: `/${routeBase}/auditBuilder-viewForm`,
      style: { fontSize: 32 },
      blockName: 'Audit'
    },
    bdManagement: {
      iconType: 'idcard',
      title: 'BDE Management',
      route: '/bde-management',
      style: { fontSize: 32 },
      blockName: 'Manage Schools',
    },
    courseCompletion: {
      iconType: 'trophy',
      title: 'Course Completion',
      route: `/${routeBase}/course-completion`,
      style: { fontSize: 32 },
      blockName: 'Student Performance'
    }
  }
  return items
}

export default renderNavItems
