import React from 'react'
import { Link } from 'react-router-dom'

const TableLink = ({ data, id }) => (
  <Link
    target='_blank'
    rel='noopener noreferrer'
    to={`/ums/studentJourney/${id}`}
  >
    {data}
  </Link>
)

export default TableLink
