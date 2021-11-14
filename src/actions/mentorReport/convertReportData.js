import moment from 'moment'

const convertReportData = (mentorReports = [], mentorsList = []) => {
  const mentorReportsArray = []
  if (mentorReports.length > 0) {
    let singleMentorData = {}
    const mentorD = []
    mentorsList.forEach((ment) => {
      singleMentorData.id = ment.id
      singleMentorData.name = ment.name
      const reports = mentorReports.filter(({ mentor }) => mentor && mentor.id === ment.id)
      singleMentorData.datas = reports
      mentorD.push(singleMentorData)
      singleMentorData = {}
    })
    mentorD.forEach(({ datas, id, name }, index) => {
      let bookingsAssigned = 0
      let slotsOpened = 0
      let bookingsRescheduled = 0
      let feedBackFormFilled = 0
      let videoLinkUploaded = 0
      let trialsCompleted = 0
      let lost = 0
      let cold = 0
      let pipeline = 0
      let hot = 0
      let won = 0
      let oneToOneConversion = 0
      let oneToTwoConversion = 0
      let oneToThreeConversion = 0
      let unfit = 0
      const dates = []
      datas.forEach((data) => {
        slotsOpened += data.slotsOpened
        bookingsAssigned += data.bookingsAssigned
        bookingsRescheduled += data.bookingsRescheduled
        feedBackFormFilled += data.formFilled
        videoLinkUploaded += data.sessionLinkUploaded
        trialsCompleted += data.trialsCompleted
        lost += data.lost
        cold += data.cold
        pipeline += data.pipeline
        hot += data.hot
        won += data.won
        oneToOneConversion += data.oneToOneConversion
        oneToTwoConversion += data.oneToTwoConversion
        oneToThreeConversion += data.oneToThreeConversion
        unfit += data.unfit
        dates.push(moment(data.reportDate))
      })
      const diffDay = moment.max(dates).diff(moment.min(dates), 'days')
      mentorReportsArray.push({
        avgSlotOpenPerDay: diffDay === 0 ? slotsOpened : (slotsOpened / diffDay).toFixed(2),
        bookingPercent: bookingsAssigned === 0 ? bookingsAssigned :
          ((bookingsAssigned / slotsOpened) * 100).toFixed(2),
        rescheduledPercent: bookingsRescheduled === 0 ? bookingsRescheduled :
          ((bookingsRescheduled / bookingsAssigned) * 100).toFixed(2),
        feedBackFormFilledPercent: feedBackFormFilled === 0 ? feedBackFormFilled :
          ((feedBackFormFilled / bookingsAssigned) * 100).toFixed(2),
        videoLinkUploadedPercent: videoLinkUploaded === 0 ? videoLinkUploaded :
          ((videoLinkUploaded / bookingsAssigned) * 100).toFixed(2),
        trialsQualified: trialsCompleted - unfit,
        conversionPercent: (trialsCompleted - unfit) === 0 ? 0 :
          ((won / (trialsCompleted - unfit)) * 100).toFixed(2),
        bookingsAssigned,
        slotsOpened,
        bookingsRescheduled,
        trialsCompleted,
        lost,
        cold,
        pipeline,
        hot,
        won,
        oneToOneConversion,
        oneToTwoConversion,
        oneToThreeConversion,
        status: datas[0] && datas[0].mentor.mentorProfile ?
          datas[0].mentor.mentorProfile.status : 0,
        salesExecutive: datas[0] && datas[0].mentor.mentorProfile &&
          datas[0].mentor.mentorProfile.salesExecutive ?
          datas[0].mentor.mentorProfile.salesExecutive.user.name : 0,
        isMentorActive: datas[0] && datas[0].mentor.mentorProfile ?
          datas[0].mentor.mentorProfile.isMentorActive : 0,
        id,
        key: id,
        name,
        srNo: index + 1
      })
    })
  } else {
    const emptyMentorD = []
    let singleMentorData = {}
    mentorsList.forEach((ment) => {
      singleMentorData.id = ment.id
      singleMentorData.name = ment.name
      const reports = []
      singleMentorData.datas = reports
      emptyMentorD.push(singleMentorData)
      singleMentorData = {}
    })
    emptyMentorD.forEach(({ datas, id, name }, index) => {
      let bookingsAssigned = 0
      let slotsOpened = 0
      let bookingsRescheduled = 0
      let feedBackFormFilled = 0
      let videoLinkUploaded = 0
      let trialsCompleted = 0
      let lost = 0
      let cold = 0
      let pipeline = 0
      let hot = 0
      let won = 0
      let oneToOneConversion = 0
      let oneToTwoConversion = 0
      let oneToThreeConversion = 0
      let unfit = 0
      const dates = []
      datas.forEach((data) => {
        slotsOpened += data.slotsOpened
        bookingsAssigned += data.bookingsAssigned
        bookingsRescheduled += data.bookingsRescheduled
        feedBackFormFilled += data.formFilled
        videoLinkUploaded += data.sessionLinkUploaded
        trialsCompleted += data.trialsCompleted
        lost += data.lost
        cold += data.cold
        pipeline += data.pipeline
        hot += data.hot
        won += data.won
        oneToOneConversion += data.oneToOneConversion
        oneToTwoConversion += data.oneToTwoConversion
        oneToThreeConversion += data.oneToThreeConversion
        unfit += data.unfit
        dates.push(moment(data.reportDate))
      })
      const diffDay = moment.max(dates).diff(moment.min(dates), 'days')
      mentorReportsArray.push({
        avgSlotOpenPerDay: diffDay === 0 ? slotsOpened : (slotsOpened / diffDay).toFixed(2),
        bookingPercent: bookingsAssigned === 0 ? bookingsAssigned :
          ((bookingsAssigned / slotsOpened) * 100).toFixed(2),
        rescheduledPercent: bookingsRescheduled === 0 ? bookingsRescheduled :
          ((bookingsRescheduled / bookingsAssigned) * 100).toFixed(2),
        feedBackFormFilledPercent: feedBackFormFilled === 0 ? feedBackFormFilled :
          ((feedBackFormFilled / bookingsAssigned) * 100).toFixed(2),
        videoLinkUploadedPercent: videoLinkUploaded === 0 ? videoLinkUploaded :
          ((videoLinkUploaded / bookingsAssigned) * 100).toFixed(2),
        trialsQualified: trialsCompleted - unfit,
        conversionPercent: (trialsCompleted - unfit) === 0 ? 0 :
          ((won / (trialsCompleted - unfit)) * 100).toFixed(2),
        bookingsAssigned,
        slotsOpened,
        bookingsRescheduled,
        trialsCompleted,
        lost,
        cold,
        pipeline,
        hot,
        won,
        oneToOneConversion,
        oneToTwoConversion,
        oneToThreeConversion,
        status: datas[0] && datas[0].mentor.mentorProfile ?
          datas[0].mentor.mentorProfile.status : 0,
        salesExecutive: '',
        isMentorActive: datas[0] && datas[0].mentor.mentorProfile ?
          datas[0].mentor.mentorProfile.isMentorActive : 0,
        id,
        key: id,
        name,
        srNo: index + 1
      })
    })
  }
  return mentorReportsArray
}

export default convertReportData
