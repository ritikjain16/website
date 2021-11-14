import React from 'react'
import { Link } from 'react-router-dom'
import ClassProgressStyle from '../ClassProgress.styles'

const TableTags = (props) => {
  const { data, type, id } = props
  let color = 'gray'
  if (type === 'paymentStatus') {
    if (data === 'paid') color = '#16d877'
    else if (data === 'overDue') color = '#ff5744'
    else if (data === 'pending') color = 'yellow'
  } else if (type === 'enrollmentStatus') {
    if (data === 'active') color = '#16d877'
    else if (data === 'dormant') color = 'yellow'
    else if (data === 'downgraded') color = '#ff5744'
  } else if (type === 'classStatus') {
    if (data === 'onTime') color = '#16d877'
    else if (data === 'ahead') color = '#16d877'
    else if (data === 'delayed') color = '#ff5744'
  }
  return (
    <ClassProgressStyle.PaymentStatusBox
      style={{
        backgroundColor: color,
        color: color === '#ff5744' ? 'white' : 'black',
      }}
      data={data}
    >
      {type === 'paymentStatus' ? (
        <Link
          target='_blank'
          style={{ color: type === 'paymentStatus' ? '#3b33ab' : 'inherit' }}
          rel='noopener noreferrer'
          to={`/ums/mentor-conversion/${id}`}
        >
          {data}
        </Link>
      ) : (
        data
      )}
    </ClassProgressStyle.PaymentStatusBox>
  )
}

export default TableTags
