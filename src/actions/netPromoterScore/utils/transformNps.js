import { get } from 'lodash'

const transformNps = (data) => {
  const transformedData = data.map(item => ({
    id: item.id,
    studentName: item.user.name,
    parentName: get(item, 'user.studentProfile.parents[0].user.name'),
    phoneNo: `${get(item, 'user.studentProfile.parents[0].user.phone.countryCode')} ${get(item, 'user.studentProfile.parents[0].user.phone.number')}`,
    score: item.score,
    createdAt: item.createdAt,
    studentId: get(item, 'user.id')
  }))
  return transformedData
}

export default transformNps
