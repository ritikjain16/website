import React, { Component } from 'react'
import NPScoreTableHead from './NPScoreTableHead'
import NPScoreTableBody from './NPScoreTableBody'
import { Table } from '../../../../components/StyledComponents'

class NPScoreTable extends Component {
  render() {
    const { savedRole } = this.props
    const columnsTemplate = ' minmax(120px, 1fr) minmax(120px, 1fr) minmax(80px, 1fr) minmax(100px, 0.7fr) minmax(120px, 1fr) minmax(80px, 0.7fr) minmax(150px, 1.2fr)'
    const minWidth = '942px'
    const rowLayoutProps = {
      minWidth,
      columnsTemplate
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll' }}>
        <NPScoreTableHead {...rowLayoutProps} savedRole={savedRole} />
        <NPScoreTableBody
          {...this.props}
          {...rowLayoutProps}
        />
      </Table>
    )
  }
}

export default NPScoreTable
