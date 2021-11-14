import { Icon } from 'antd'
import React from 'react'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import { BDE } from '../../../../constants/roles'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import BDManagementStyle from '../BDManagement.style'
import BDTableRow from './BDTableRow'

const BDManagementTable = (props) => {
  let columnsTemplate = 'minmax(12px,1fr) minmax(110px,1fr) minmax(150px,1fr) minmax(290px,1fr) minmax(50px,1fr)'
  const savedRole = getDataFromLocalStorage('login.role')
  if (savedRole === BDE) columnsTemplate += ' minmax(160px,1fr)'
  else columnsTemplate += ' minmax(320px,1fr)'
  const minWidth = '960px'
  const rowLayoutProps = {
    minWidth,
    columnsTemplate
  }
  const { showLoading,
    bdProfilesData,
    onOpenAddSchoolModal,
  } = props
  return (
    <div>
      <Table.Row
        columnsTemplate={rowLayoutProps.columnsTemplate}
        minWidth={rowLayoutProps.minWidth}
      >
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>#</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 16 }}>Name</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 16 }}>Phone Number</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Email</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Created At</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Action</MainTable.Title>
        </Table.Item>
      </Table.Row>
      {
        showLoading === true ?
          <BDManagementStyle.IconContainer>
            <Icon type='loading' style={{ fontSize: '40px' }} spin />
          </BDManagementStyle.IconContainer>
          :
          bdProfilesData.map((data, index) => <BDTableRow
            key={data.id}
            columnsTemplate={columnsTemplate}
            minWidth={minWidth}
            data={data}
            index={index}
            onOpenAddSchoolModal={onOpenAddSchoolModal}
          />)
      }
    </div>
  )
}

export default BDManagementTable
