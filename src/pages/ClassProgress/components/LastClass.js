import React from 'react'

const LastClass = ({ date, msg }) => {
  if (date !== '-') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{date}</span>
        <span>({msg})</span>
      </div>
    )
  }
  return '-'
}

export default LastClass
