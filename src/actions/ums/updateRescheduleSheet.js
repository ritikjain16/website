import { get } from 'lodash'
import moment from 'moment'
import updateSheet from '../../utils/updateSheet'

const updateRescheduleSheet = (data) => {
  const reasons = [
    {
      tag: get(data, 'internetIssue'),
      text: 'Slow/Unstable Internet'
    },
    {
      tag: get(data, 'zoomIssue'),
      text: 'Zoom Not Installed'
    },
    {
      tag: get(data, 'laptopIssue'),
      text: 'No Laptop - Joined Over The Phone'
    },
    {
      tag: get(data, 'chromeIssue'),
      text: 'Google Chrome Not Installed'
    },
    {
      tag: get(data, 'powerCut'),
      text: 'Power Cut'
    },
    {
      tag: get(data, 'notResponseAndDidNotTurnUp'),
      text: 'No Response And Didn\'t Turn Up'
    },
    {
      tag: get(data, 'turnedUpButLeftAbruptly'),
      text: 'Turned Up But Left Abruptly'
    },
    {
      tag: get(data, 'leadNotVerifiedProperly'),
      text: 'Lead Is Not Verified Properly'
    },
    {
      tag: get(data, 'otherReasonForReschedule'),
      text: 'Other Reasons'
    },
  ]
  const unqualfiedReasons = [
    {
      tag: get(data, 'knowCoding'),
      text: 'Already Knows Programming Basics'
    },
    {
      tag: get(data, 'lookingForAdvanceCourse'),
      text: 'Was Looking For Advance Course'
    },
    {
      tag: get(data, 'ageNotAppropriate'),
      text: 'Age Not Appropriate'
    },
    {
      tag: get(data, 'notRelevantDifferentStream'),
      text: 'Not Relevant'
    },
    {
      tag: get(data, 'noPayingPower'),
      text: 'No Paying Power'
    },
    {
      tag: get(data, 'notInterestedInCoding'),
      text: 'Not Interested In Coding(Just For Sake)'
    },
    {
      tag: get(data, 'learningAptitudeIssue'),
      text: 'Severe Aptitude Issues(Struggling To Learn, Unfit)'
    },
  ]
  const notAQualifiedLeadComment = get(data, 'notAQualifiedLeadComment')
  const isUnqualifiedLead = !!unqualfiedReasons.find(reason => reason.tag)
  const phone = get(data, 'client.studentProfile.parents[0].user.phone.number')
    ? get(data, 'client.studentProfile.parents[0].user.phone.number')
    : get(data, 'menteeSession.user.studentProfile.parents[0].user.phone.number')
  updateSheet({
    'Mentor Rescheduled': get(data, 'hasRescheduled') ? 'TRUE' : 'FALSE',
    'Mentor Rescheduled - Reason': reasons.filter(reason => reason.tag).map(reason => reason.text).join(' , '),
    Phone: phone,
    'New Date': get(data, 'rescheduledDate') ? moment(get(data, 'rescheduledDate')).format('DD-MM-YYYY') : 'NOT PROVIDED',
    'New Time': get(data, 'rescheduledDate') ? moment(get(data, 'rescheduledDate')).format('hh:mm') : 'NOT PROVIDED',
    'Already Knows Programming Basics': get(data, 'knowCoding'),
    'Was Looking For Advance Course': get(data, 'lookingForAdvanceCourse'),
    'Age Not Appropriate': get(data, 'ageNotAppropriate'),
    'Not Relevant': get(data, 'notRelevantDifferentStream'),
    'No Paying Power': get(data, 'noPayingPower'),
    'Not Interested In Coding(Just For Sake)': get(data, 'notInterestedInCoding'),
    'Severe Aptitude Issues(Struggling To Learn, Unfit)': get(data, 'learningAptitudeIssue'),
    'No laptop - joined over the phone': get(data, 'laptopIssue'),
    'slow/unstable internet': get(data, 'internetIssue'),
    'Unqualified lead comments': notAQualifiedLeadComment,
    'Mentor Rescheduled timestamp': get(data, 'rescheduledDateProvided') ? moment().format('DD-MM-YYYY hh:mm') : '',
    'Session Completed': get(data, 'hasRescheduled') ? 'No' : 'Yes'
  }, {})
  const leadSquaredInput = {
    Phone: phone,
    mx_Mentor_Rescheduled: get(data, 'hasRescheduled') ? 'Yes' : 'No',
    mx_Mentor_Rescheduled_Reason: reasons.filter(reason => reason.tag).map(reason => reason.text).join(' , '),
    mx_Unqualified_Lead: isUnqualifiedLead ? 'Yes' : 'No',
    mx_Unqualified_Lead_Reasons: unqualfiedReasons.filter(reason => reason.tag).map(reason => reason.text).join(' , '),
    mx_Unqualfied_Lead_Comment: notAQualifiedLeadComment,
  }

  if (isUnqualifiedLead) {
    leadSquaredInput.mx_Lead_Status = 'Dump'
    leadSquaredInput.ProspectStage = 'Dump'
  }

  if (get(data, 'hasRescheduled')) {
    leadSquaredInput.mx_Lead_Status = 'Reschedule'
    leadSquaredInput.ProspectStage = 'Pipeline'
  }

  if (get(data, 'rescheduledDate')) {
    leadSquaredInput.mx_Mentor_Rescheduled_Date_Time = moment(get(data, 'rescheduleDate')).utc().format('YYYY-MM-DD HH:mm:ss')
  }

  updateSheet({}, leadSquaredInput)
}


export default updateRescheduleSheet
