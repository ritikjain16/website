import React from 'react'
import { Table } from '../../../../components/StyledComponents'
import ChaptersTableHead from './ChaptersTableHead'
import ChaptersTableBody from './ChaptersTableBody'

const columnsTemplate = '64px minmax(100px, 1fr) minmax(250px, 1.5fr) repeat(3, 79px) 61px 122px;'
const minWidth = '942px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth
}

const ChaptersTable = props => (
  <Table>
    <ChaptersTableHead {...rowLayoutProps} />
    <ChaptersTableBody {...props} {...rowLayoutProps} />
  </Table>
)

export default ChaptersTable
