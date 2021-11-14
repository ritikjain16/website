import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PlaceHolderPage from './pages/PlaceHolderPage'
import Login from './pages/Login'
import LOPage from './pages/LearningObjective'
import Chapters from './pages/Chapters'
import Topics from './pages/Topics'
import TopicAssets from './pages/TopicAssets'
import Dashboard from './pages/Dashboard'
import Episode from './pages/Epiosde'
import TechTalk from './pages/TechTalk'
import QuestionBank from './pages/QuestionBank'
import Courses from './pages/Courses'
import Badges from './pages/Badges'
import Emojis from './pages/Emojis'
import LoginType from './pages/LoginType'
import UmsDashboard from './pages/UmsDashboard'
import Assignment from './pages/Assignment'
import SessionManagement from './pages/SessionManagement'
import CompletedSessions from './pages/CompletedSessions'
import SlotsInfo from './pages/SlotsInfo'
import NetPromoterScore from './pages/NetPromoterScore'
import Stats from './pages/Stats'
import MentorSales from './pages/MentorSales'
import MentorConversion from './pages/MentorConversion'
import TabularStats from './pages/TabularStats'
import Products from './pages/Products'
import UserProfilePage from './pages/UserProfilePage'
import Profile from './pages/Profile'
import MentorAuditsList from './pages/MentorAuditsList'
import CompletedSessionsOfSchools from './pages/SMS/CompletedSessions'
import MentorSalesOfSchools from './pages/SMS/MentorSales'
import MentorConversionOfSchool from './pages/SMS/MentorConversion'
import SmsDashboard from './pages/SMS/SMSDashboard'
import MentorReport from './pages/MentorReport'
import SalesExecMentor from './pages/SalesExecMentor'
import MentorsPay from './pages/MentorsPay'
import BatchUserMapping from './pages/BatchUserMapping'
import SmsBatchUserMapping from './pages/SMS/BatchUserMapping'
import BatchDashboard from './pages/SMS/BatchDashboard'
import BatchAttendance from './pages/BatchAttendance'
import SmsBatchAttendance from './pages/SMS/BatchAttendance'
import CodeApproval from './pages/CodeApproval'
import ApprovedCodeTags from './pages/ApprovedCodeTags'
import EditApprovedCode from './pages/EditApprovedCode'
import SmsAssignTime from './pages/SMS/AssignTime'
import AssignTime from './pages/AssignTime'
import StudentJourney from './pages/StudentJourney'
import MentorAudit from './pages/MentorAudit'
import SchoolOverviewTable from './pages/SchoolOverviewTable'
import ClassProgress from './pages/ClassProgress'
import SchoolProductMapping from './pages/SchoolProductMapping'
import UserDashboard from './pages/UserDashboard'
import Banner from './pages/Banner'
import EditBanner from './pages/EditBanner'
import CheatSheet from './pages/CheatSheet'
import Workbook from './pages/Workbook'
import Projects from './pages/Projects'
import SchoolOnboarding from './pages/SchoolOnboarding'
import SchoolBulkUpload from './pages/SMS/SchoolBulkUpload'
import AddCourse from './pages/AddCourse'
import AddSessions from './pages/AddSessions'
import ContentProject from './pages/ContentMaker/ContentProject'
import ContentLearningObjective from './pages/ContentMaker/ContentLearningObjective'
import ContentQuiz from './pages/ContentMaker/ContentQuiz'
import ContentAssignment from './pages/ContentMaker/ContentAssignment'
import Comic from './pages/ContentMaker/Comic'
import ContentTechTalk from './pages/ContentMaker/ContentTechTalk'
import ContentQuestions from './pages/ContentMaker/ContentQuestions'
import ContentPractice from './pages/ContentMaker/ContentPractice'
import Videos from './pages/ContentMaker/Videos'
import AddChapters from './pages/AddChapters'
import SessionBadge from './pages/SessionBadge'
import MentorDashboard from './pages/MentorDashboard'
import ClassFeedback from './pages/MentorDashboard/ClassFeedback'
import AuditBuilder from './pages/AuditBuilder'
import ContentHomeworkAssignment from './pages/ContentMaker/ContentHomeworkAssignment'
import ViewAuditForms from './pages/ViewAuditForms'
import BDEManagement from './pages/SMS/BDEManagement'
import CourseCompletion from './pages/CourseCompletion'

const TopicJourneyPage = PlaceHolderPage({
  title: 'Topic Journey',
  shouldBack: true,
  activeNavItem: 'Topics',
  backRoute: '/topics',
})

const Routes = () => (
  <Switch>
    <Route exact path='/login' component={Login} />
    <PrivateRoute exact path='/' component={UserDashboard} componentName='UserDashboard' />
    <PrivateRoute exact path='/ums/mentorReport' component={MentorReport} componentName='MentorReport' />
    <PrivateRoute exact path='/ums/batchAttendance' component={BatchAttendance} componentName='BatchAttendance' />
    <PrivateRoute exact path='/ums/batchAttendance/:code' component={BatchAttendance} componentName='BatchAttendance' />
    <PrivateRoute exact path='/ums/batchMapping' component={BatchUserMapping} />
    <PrivateRoute exact path='/ums/batchMapping/:code' component={BatchUserMapping} />
    <PrivateRoute exact path='/loginType' component={LoginType} componentName='LoginType' />
    <PrivateRoute exact path='/dashboard' component={Dashboard} componentName='Dashboard' />
    <PrivateRoute exact path='/ums/dashboard' component={UmsDashboard} componentName='UmsDashboard' />
    <PrivateRoute exact path='/ums/slotsInfo' component={SlotsInfo} componentName='SlotsInfo' />
    <PrivateRoute exact path='/courses' component={Courses} componentName='Courses' />
    <PrivateRoute exact path='/learning-objectives/:id' component={LOPage} componentName='LOPage' />
    <PrivateRoute exact path='/chapters' component={Chapters} componentName='Chapters' />
    <PrivateRoute exact path='/topics' component={Topics} componentName='Topics' />
    <PrivateRoute exact path='/topic/:id' component={TopicAssets} componentName='TopicAssets' />
    <PrivateRoute exact path='/topicjourney' component={TopicJourneyPage} componentName='TopicJourneyPage' />
    <PrivateRoute exact path='/episode/:id' component={Episode} componentName='Episode' />
    <PrivateRoute exact path='/tech-talk/:topicId' component={TechTalk} componentName='TechTalk' />
    <PrivateRoute exact path='/tech-talk/:topicId/:learningObjectiveId' component={TechTalk} componentName='TechTalk' />
    <PrivateRoute exact path='/questionbank/:id' component={QuestionBank} componentName='QuestionBank' />
    <PrivateRoute exact path='/assignment/:id' component={Assignment} componentName='Assignment' />
    <PrivateRoute exact path='/badges/:id' component={Badges} componentName='Badges' />
    <PrivateRoute exact path='/emojis' component={Emojis} componentName='Emojis' />
    <PrivateRoute exact path='/products' component={Products} componentName='Products' />
    <PrivateRoute exact path='/ums/codeApproval' component={CodeApproval} componentName='CodeApproval' />
    <PrivateRoute exact path='/ums/approvedCode/:id' component={EditApprovedCode} componentName='EditApprovedCode' />
    <PrivateRoute exact path='/approvedCodeTags' component={ApprovedCodeTags} componentName='ApprovedCodeTags' />
    <PrivateRoute exact path='/ums/net-promoter-score' component={NetPromoterScore} componentName='NetPromoterScore' />
    <PrivateRoute exact path='/ums/mentor-sales-dashboard' component={MentorSales} componentName='MentorSales' />
    <PrivateRoute exact path='/ums/mentor-sales-dashboard/:userId' component={MentorSales} componentName='MentorSales' />
    <PrivateRoute exact path='/ums/sessions' component={SessionManagement} componentName='SessionManagement' />
    <PrivateRoute exact path='/ums/completedSessions' component={CompletedSessions} componentName='CompletedSessions' />
    <PrivateRoute exact path='/ums/completedSessions/:userId' component={CompletedSessions} componentName='CompletedSessions' />
    <PrivateRoute exact path='/ums/stats' component={Stats} componentName='Stats' />
    <PrivateRoute exact path='/ums/tabularStats' component={TabularStats} componentName='TabularStats' />
    <PrivateRoute exact path='/ums/mentor-conversion' component={MentorConversion} componentName='MentorConversion' />
    <PrivateRoute exact path='/ums/mentor-conversion/:id' component={MentorConversion} componentName='MentorConversion' />
    <PrivateRoute exact path='/ums/sessions/paid' component={SessionManagement} componentName='SessionManagement' />
    <PrivateRoute exact path='/user-profile' component={UserProfilePage} componentName='UserProfilePage' />
    <PrivateRoute exact path='/ums/manageKids' component={Profile} componentName='Profile' />
    <PrivateRoute exact path='/ums/mentorsPay' component={MentorsPay} componentName='MentorsPay' />
    <PrivateRoute exact path='/ums/assignTimetable' component={AssignTime} componentName='AssignTime' />
    <PrivateRoute exact path='/ums/assignTimetable/:code' component={AssignTime} componentName='AssignTime' />
    <PrivateRoute exact path='/ums/batchDashboard' component={BatchDashboard} componentName='BatchDashboard' />
    <PrivateRoute exact path='/ums/mentorAudits' component={MentorAuditsList} componentName='MentorAuditsList' />
    <PrivateRoute exact path='/ums/mentorAudits/assignedAudits' component={MentorAuditsList} componentName='MentorAuditsList' />
    <PrivateRoute exact path='/ums/mentorAudits/:id' component={MentorAudit} componentName='MentorAudit' />
    <PrivateRoute exact path='/ums/studentJourney/:id' component={StudentJourney} componentName='StudentJourney' />
    <PrivateRoute exact path='/ums/classProgress' componentName='ClassProgress' component={ClassProgress} />
    <PrivateRoute exact path='/ums/banner' component={Banner} componentName='Banner' />
    <PrivateRoute exact path='/ums/banner/addBanner' component={EditBanner} componentName='Banner' />
    <PrivateRoute exact path='/ums/banner/:id' component={EditBanner} componentName='Banner' />
    <PrivateRoute exact path='/cheatSheet/:topicId' component={CheatSheet} componentName='CheatSheet' />
    <PrivateRoute exact path='/workbook/:topicId' component={Workbook} componentName='WorkBook' />
    <PrivateRoute exact path='/project/:topicId' component={Projects} componentName='Project' />
    <PrivateRoute exact path='/sms/schoolProductMapping/:schoolId' component={SchoolProductMapping} componentName='SchoolProductMapping' />
    {/* SMS Routes */}
    <PrivateRoute exact path='/sms/dashboard' component={SmsDashboard} componentName='SmsDashboard' />
    <PrivateRoute exact path='/sms/studentJourney/:id' component={StudentJourney} componentName='StudentJourney' />
    <PrivateRoute exact path='/sms/completedSessions' component={CompletedSessionsOfSchools} componentName='CompletedSessionsOfSchools' />
    <PrivateRoute exact path='/sms/mentor-sales-dashboard' component={MentorSalesOfSchools} componentName='MentorSalesOfSchools' />
    <PrivateRoute exact path='/sms/mentor-conversion' component={MentorConversionOfSchool} componentName='MentorConversionOfSchool' />
    <PrivateRoute exact path='/ums/report' component={SlotsInfo} componentName='SlotsInfo' />
    <PrivateRoute exact path='/sms/batchDashboard' component={BatchDashboard} componentName='BatchDashboard' />
    <PrivateRoute exact path='/sms/batchMapping' component={SmsBatchUserMapping} componentName='SmsBatchUserMapping' />
    <PrivateRoute exact path='/sms/batchMapping/:code' component={SmsBatchUserMapping} componentName='SmsBatchUserMapping' />
    <PrivateRoute exact path='/sms/assignTimetable' component={SmsAssignTime} componentName='AssignTime' />
    <PrivateRoute exact path='/sms/assignTimetable/:code' component={SmsAssignTime} componentName='AssignTime' />
    <PrivateRoute exact path='/sms/batchAttendance' component={SmsBatchAttendance} componentName='SmsBatchAttendance' />
    <PrivateRoute exact path='/sms/schoolProductMapping' component={SchoolProductMapping} componentName='SchoolProductMapping' />
    <PrivateRoute exact path='/sms/batchAttendance/:code' component={SmsBatchAttendance} componentName='SmsBatchAttendance' />
    <PrivateRoute exact path='/ums/sales-exec-mentor' component={SalesExecMentor} componentName='SalesExecMentor' />
    <PrivateRoute exact path='/sms/bulk-upload' component={SchoolBulkUpload} componentName='SchoolBulkUpload' />
    <PrivateRoute exact path='/sms/bulk-upload/:id' component={SchoolBulkUpload} componentName='SchoolBulkUpload' />
    <PrivateRoute exact path='/sms/schoolOverviewTable' component={SchoolOverviewTable} componentName='SchoolOverviewTable' />
    <PrivateRoute exact path='/sms/dashboard/:id' component={SmsDashboard} componentName='SmsDashboard' />
    <PrivateRoute exact path='/sms/school-dashboard/grade' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/grade' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/students' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/campaigns' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/batches' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/batches/:batchId/students' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/batches/:batchId/scheduling' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/sms/school-dashboard/:schoolId/batches/:batchId/mentors' component={SchoolOnboarding} componentName='SchoolOnboarding' />
    <PrivateRoute exact path='/addCourse' component={AddCourse} componentName='AddCourse' />
    <PrivateRoute exact path='/course-sessions' component={AddSessions} componentName='AddSessions' />
    <PrivateRoute exact path='/course-sessions/:courseId' component={AddSessions} componentName='AddSessions' />
    <PrivateRoute exact path='/content-project' component={ContentProject} componentName='ContentProject' />
    <PrivateRoute exact path='/content-practice' component={ContentPractice} componentName='ContentPractice' />
    <PrivateRoute exact path='/content-learningObjective' component={ContentLearningObjective} componentName='ContentLearningObjective' />
    <PrivateRoute exact path='/comic/:learningObjectiveId' component={Comic} componentName='Comic' />
    <PrivateRoute exact path='/content-techTalk/:learningObjectiveId' component={ContentTechTalk} componentName='ContentTechTalk' />
    <PrivateRoute exact path='/content-questions/:learningObjectiveId' component={ContentQuestions} componentName='ContentQuestions' />
    <PrivateRoute exact path='/content-assignment' component={ContentAssignment} componentName='ContentAssignment' />
    <PrivateRoute exact path='/content-homeworkAssignment' component={ContentHomeworkAssignment} componentName='ContentAssignment' />
    <PrivateRoute exact path='/addChapter' component={AddChapters} componentName='AddChapter' />
    <PrivateRoute exact path='/content-quiz' component={ContentQuiz} componentName='ContentQuiz' />
    <PrivateRoute exact path='/content-video' component={Videos} componentName='Videos' />
    <PrivateRoute exact path='/course-sessions/:courseId/badge/:topicId' component={SessionBadge} componentName='SessionBadge' />
    {/* Mentor Dashboard */}
    <PrivateRoute exact path='/mentorDashboard/:mentorId/classFeedback/:sessionId' component={ClassFeedback} componentName='ClassFeedback' />
    <PrivateRoute exact path='/mentorDashboard/classFeedback/:sessionId' component={ClassFeedback} componentName='ClassFeedback' />
    <PrivateRoute exact path='/mentorDashboard/:mentorId' component={MentorDashboard} componentName='MentorDashboard' />
    <PrivateRoute exact path='/mentorDashboard' component={MentorDashboard} componentName='MentorDashboard' />
    {/* Audits */}
    <PrivateRoute exact path='/ums/auditBuilder' component={AuditBuilder} componentName='Audit Builder' />
    <PrivateRoute exact path='/ums/auditBuilder/:auditType' component={AuditBuilder} componentName='Audit Builder' />
    <PrivateRoute exact path='/audit' component={MentorAuditsList} componentName='PreSales Audit' />
    <PrivateRoute exact path='/audit/:auditType' component={MentorAuditsList} componentName='PreSales Audit' />
    <PrivateRoute exact path='/audit/:auditType/:auditId' component={MentorAudit} componentName='PreSales Audit' />
    <PrivateRoute exact path='/ums/auditBuilder-viewForm' component={ViewAuditForms} componentName='View Audit Form' />
    <PrivateRoute exact path='/ums/auditBuilder-viewForm/:auditType' component={ViewAuditForms} componentName='View Audit Form' />

    <PrivateRoute exact path='/bde-management' component={BDEManagement} componentName='BDE Management' />
    <PrivateRoute exact path='/ums/course-completion' component={CourseCompletion} componentName='Course Completion' />
    <Route path='/' render={() => 'Not Found'} />
  </Switch>
)

export default Routes
