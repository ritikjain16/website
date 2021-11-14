const headerConfig = [
  {
    label: 'ID',
    key: 'id',
  },
  {
    label: 'Student name',
    key: 'user.name',
  },
  {
    label: 'Parent name',
    key: 'user.studentProfile.parents[0].user.name',
  },
  {
    label: 'Phone No.',
    key: 'user.studentProfile.parents[0].user.phone.number',
  },
  {
    label: 'NPS Score',
    key: 'score',
  },
  {
    label: 'Mentor',
    key: 'mentor',
  },
  {
    label: 'Rating',
    key: 'rating',
  },
  {
    label: 'Created At',
    key: 'createdAt',
  },
]

export default headerConfig
