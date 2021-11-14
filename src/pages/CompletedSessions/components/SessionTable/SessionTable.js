import React, { Component } from 'react'
import SessionTableHead from './SessionTableHead'
import SessionTableBody from './SessionTableBody'
import { Table } from '../../../../components/StyledComponents'
import { MENTOR } from '../../../../constants/roles'

class SessionTable extends Component {
  render() {
    const { savedRole, country, showSessionLogs } = this.props
    // const cols = savedRole !== MENTOR ? 3 : 2
    const cols = savedRole !== MENTOR ? '380px' : '240px'
    const columnsTemplate = country === 'india'
      ? `${cols} 150px 200px 150px 150px 100px 160px 160px 140px 140px 150px repeat(5, 150px) 100px 100px `
      : `${cols} 150px 200px 150px 150px 100px 200px 160px 160px 140px 140px 150px repeat(5, 150px) 150px 100px `
    const intlTableWidthAdmin = country === 'india' ? '3510px ' : '3760px'
    const intlTableWidthMentor = country === 'india' ? '2750px' : '2960px'
    const sessionLogWidthAdmin = country === 'india' ? '3140px' : '3390px'
    const sessionLogWidthMentor = country === 'india' ? '2544px' : '2743px'
    let minWidth = savedRole !== MENTOR
      ? intlTableWidthAdmin
      : intlTableWidthMentor // If the role is not mentor subtract 180px and 1px gap b/w grid
    if (showSessionLogs) {
      minWidth = savedRole === MENTOR ? sessionLogWidthMentor : sessionLogWidthAdmin
    }
    const rowLayoutProps = {
      minWidth,
      columnsTemplate: savedRole !== MENTOR ? `${columnsTemplate}100px 150px 200px 100px 100px` : columnsTemplate
    }
    return (
      <Table style={{ width: '100%', overflowX: 'scroll' }}>
        <SessionTableHead
          showSessionLogs={showSessionLogs}
          {...rowLayoutProps}
          savedRole={savedRole}
          country={country}
        />
        <SessionTableBody
          {...this.props}
          {...rowLayoutProps}
          country={country}
          queryFetchingNumber={this.props.queryFetchingNumber}
          queryFetchedNumber={this.props.queryFetchedNumber}
          updateSessionIdOfUpdatingSessionInState={
            (id) => this.props.updateSessionIdOfUpdatingSessionInState(id)
          }
        />
      </Table>
    )
  }
}

export default SessionTable
