import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import { toPairs, groupBy, filter, get } from 'lodash'
import moment from 'moment'
import NPScoreTableRow from './NPScoreTableRow'
import MainTable from '../../../../components/MainTable'
import NetPromoterScoreStyle from '../../NetPromoterScore.style'

let data = null

const NPScoreTableBody = ({
  nps,
  columnsTemplate,
  minWidth,
  filters,
  fetchingRatingAndComment,
  hasNPSFetched,
  fetchingNpsError,
  ...rest
}) => {
  const npsData = nps && nps.toJS()
  const menteeFeedBack = rest.ratingAndComment && rest.ratingAndComment.toJS()
  if (!hasNPSFetched || fetchingRatingAndComment) {
    return (
      <MainTable.Item justifyContent='flex-start'>
        <Icon type='loading' style={{ fontSize: 18 }} spin />
      </MainTable.Item>
    )
  }

  if (hasNPSFetched && nps.length === 0) {
    const emptyText = 'No NPS found!'
    return <MainTable.EmptyTable>{emptyText}</MainTable.EmptyTable>
  }

  if (fetchingNpsError) {
    const emptyText = `Error: ${fetchingNpsError}`
    return <MainTable.EmptyTable>{emptyText}</MainTable.EmptyTable>
  }

  const { searchKey, searchValue } = filters
  if (searchKey !== 'Search By' && searchValue !== '') {
    switch (searchKey) {
      case "Student's name":
        data = filter(npsData, item =>
          get(item, 'studentName')
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        break
      case "Parent's name":
        data = filter(npsData, item =>
          get(item, 'parentName')
            ? get(item, 'parentName')
              .toLowerCase()
              .includes(searchValue.toLowerCase())
            : false
        )
        break
      case 'NPS score':
        data = filter(npsData, item => item.score.toString() === searchValue)
        break
      case 'Region':
        switch (searchValue) {
          case 'Promoters':
            data = filter(npsData, item => item.score >= 9)
            break
          case 'Passives':
            data = filter(npsData, item => item.score === 7 || item.score === 8)
            break
          case 'Detractors':
            data = filter(npsData, item => item.score <= 6)
            break
          default:
            data = npsData
            break
        }
        break
      default:
        data = npsData
        break
    }
  }

  // if (fromDate || toDate) {
  //   data = filter(data && data.length ? data : npsData, item => {
  //     if (fromDate && !toDate) {
  //       return (new Date(item.createdAt) >= new Date(fromDate))
  //     } else if (!fromDate && toDate) {
  //       return (new Date(item.createdAt) <= new Date(toDate))
  //     }
  //     return (new Date(item.createdAt) >= new Date(fromDate)
  //     && new Date(item.createdAt) <= new Date(toDate))
  //   })
  // }

  if (data && !data.length) {
    return (
      <NetPromoterScoreStyle.BottomContainer>No Result Found</NetPromoterScoreStyle.BottomContainer>
    )
  }
  return toPairs(
    groupBy(data && data.length && searchValue !== '' ? data : npsData, item =>
      moment(new Date(get(item, 'createdAt'))).format('DD-MM-YYYY')
    )
  )
    .reverse()
    .map(studentData => (
      <React.Fragment>
        <MainTable.TitleBlock minWidth={minWidth} style={{ textAlign: 'center' }}>
          {studentData[0]}&#40;{studentData[1].length}&#41;
        </MainTable.TitleBlock>
        {studentData[1].map(student => ((
          <NPScoreTableRow
            studentName={get(student, 'user.name')}
            parentName={get(student, 'user.studentProfile.parents.0.user.name')}
            phoneNo={get(student, 'user.studentProfile.parents.0.user.phone.number')}
            score={get(student, 'score')}
            mentorName={get(filter(menteeFeedBack, mentee => mentee.menteeId === get(student, 'user.id')), '0.mentorName')}
            rating={get(filter(menteeFeedBack, mentee => mentee.menteeId === get(student, 'user.id')), '0.rating')}
            comment={get(filter(menteeFeedBack, mentee => mentee.menteeId === get(student, 'user.id')), '0.comment')}
            {...rest}
            key={get(student, 'user.id')}
            columnsTemplate={columnsTemplate}
            minWidth={minWidth}
          />
          )))}
      </React.Fragment>
    ))
}

NPScoreTableBody.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isFetchingChapters: PropTypes.bool.isRequired
}

export default NPScoreTableBody
