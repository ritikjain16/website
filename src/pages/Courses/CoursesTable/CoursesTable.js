import React from 'react'
import { Table } from '../../../components/StyledComponents'
import CoursesHeader from './CoursesHeader'
import CoursesBody from './CoursesBody'
// used to set the width of each column of grid
const columnsTemplate = '70px 100px minmax(150px,1fr) 130px repeat(3,100px) 50px 150px'
const minWidth = '950px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth
}
/** @returns Entire course table */
const CoursesTable = props => (
  <Table>
    <CoursesHeader {...rowLayoutProps} />
    <CoursesBody {...props} {...rowLayoutProps} />
  </Table>
)
export default CoursesTable
