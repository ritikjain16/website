import React, { Component } from 'react'
import SessionTableHead from './SessionTableHead'
import SessionTableBody from './SessionTableBody'
import { Table } from '../../../../components/StyledComponents'
import { AUDITOR, MENTOR } from '../../../../constants/roles'
import { vsValue } from '../../../../utils/scale'

class SessionTable extends Component {
  render() {
    const { savedRole, showBatchSessionTable } = this.props
    const cols = savedRole === MENTOR || savedRole === AUDITOR ? '380px' : '480px'
    const columnsTemplate = `${cols} 200px 250px 200px 200px 150px 150px repeat(5, 180px)`
    let minWidth = savedRole === MENTOR || savedRole === AUDITOR ? '2815px ' : '2915px '
    if (showBatchSessionTable) {
      minWidth = savedRole === MENTOR || savedRole === AUDITOR ? '2613px ' : '2713px '
    }
    const rowLayoutProps = {
      minWidth,
      columnsTemplate: `${columnsTemplate}100px 100px 200px `
    }
    return (
      <Table style={{
        width: '100%',
        overflowX: 'scroll',
        border: '1px solid #ddd',
        borderRadius: '5px',
        maxHeight: vsValue(750),
        position: 'relative'
      }}
      >
        <SessionTableHead {...rowLayoutProps}
          savedRole={savedRole}
          showBatchSessionTable={showBatchSessionTable}
        />
        <SessionTableBody
          {...this.props}
          {...rowLayoutProps}
        />
      </Table>
    )
  }
}

export default SessionTable
