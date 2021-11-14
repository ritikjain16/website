import React, { Component } from 'react'
import SessionTableHead from './SessionTableHead'
import SessionTableBody from './SessionTableBody'
import { Table } from '../../../../components/StyledComponents'
import isUserWrite from '../../../../utils/userRolePermissions/isUserWrite'

const columnsTemplateWithActions = '60px repeat(1, minmax(250px, 1.5fr)) repeat(3, minmax(180px, 1.5fr)) 120px;'
const columnsTemplateWithOutActions = '100px repeat(1, minmax(250px, 1.5fr)) repeat(3, minmax(180px, 1.5fr))'
const minWidth = '942px'

class SessionTable extends Component {
  render() {
    const rowLayoutProps = {
      minWidth,
      columnsTemplate: isUserWrite() ? columnsTemplateWithActions : columnsTemplateWithOutActions
    }
    return (
      <Table>
        <SessionTableHead {...rowLayoutProps} />
        <SessionTableBody
          {...this.props}
          {...rowLayoutProps}
          openEditSession={(id) => this.props.openEditSession(id)}
        />
      </Table>
    )
  }
}

export default SessionTable
