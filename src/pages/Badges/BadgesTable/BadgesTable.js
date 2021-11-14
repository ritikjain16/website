import React from 'react'
import { Table } from '../../../components/StyledComponents'
import BadgesHeader from './BadgesHeader'
import BadgesBody from './BadgesBody'

// used to set the width of each column of grid
const columnsTemplate = '70px 100px repeat(2,minmax(150px,1fr)) repeat(2,100px) 50px 150px'
const minWidth = '870px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth
}

/** @returns Entire course table */
const BadgesTable = props => (
  <Table>
    <BadgesHeader {...rowLayoutProps} />
    <BadgesBody {...props} {...rowLayoutProps} />
  </Table>
)

export default BadgesTable
