import React from 'react'
import { Table } from '../../../../components/StyledComponents'
import TopicsTableHead from './TopicsTableHead'
import TopicsTableBody from './TopicsTableBody'
import hs from '../../../../utils/scale'

const columnsTemplate = '58px minmax(100px,0.3fr) minmax(150px,0.5fr) 110px 90px 110px 90px 110px repeat(3,85px) 51px 95px;'
const minWidth = '813px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth,
  isVideoLOMapping: true
}

const TopicsTable = props => (
  <Table>
    <TopicsTableHead {...rowLayoutProps} />
    <div style={{ height: `${hs(670)}`, overflowY: 'scroll', overflowX: 'scroll' }}>
      <TopicsTableBody {...props} {...rowLayoutProps} />
    </div>
  </Table>
)

export default TopicsTable
