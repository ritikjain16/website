import React, { Component } from 'react'
import SessionTableHead from './SessionTableHead'
import SessionTableBody from './SessionTableBody'
import { Table } from '../../../../../components/StyledComponents'
import { MENTOR } from '../../../../../constants/roles'

class SessionTable extends Component {
  render() {
    const { savedRole } = this.props
    // const cols = savedRole !== MENTOR ? 3 : 2
    const cols = savedRole !== MENTOR ? '380px' : '240px'
    const columnsTemplate = `${cols} 150px 200px 150px 100px 160px 160px 140px 140px 150px repeat(5, 150px) 150px `
    const minWidth = savedRole !== MENTOR ? '3060px ' : '2330px' // If the role is not mentor subtract 180px and 1px gap b/w grid
    const rowLayoutProps = {
      minWidth,
      columnsTemplate: savedRole !== MENTOR ? `${columnsTemplate}100px 100px 300px` : columnsTemplate
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll' }}>
        <SessionTableHead {...rowLayoutProps} savedRole={savedRole} />
        <SessionTableBody
          {...this.props}
          {...rowLayoutProps}
        />
      </Table>
    )
  }
}

export default SessionTable
