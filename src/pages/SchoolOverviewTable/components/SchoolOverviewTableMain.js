import { Icon } from 'antd'
import React from 'react'
import SchoolOverviewTableStyle from '../SchoolOverviewTable.style'
import SchoolOverviewTableHead from './SchoolOverviewTableHead'
import SchoolOverviewTableRow from './SchoolOverviewTableRow'

const SchoolOverviewTableMain = (props) => {
  const columnsTemplate = 'minmax(12px,1fr) minmax(110px,1fr) minmax(150px,1fr) minmax(290px,1fr) minmax(50px,1fr) minmax(100px,1fr) minmax(50px,1fr) minmax(320px,1fr) minmax(100px,1fr)'
  const minWidth = '960px'
  const rowLayoutProps = {
    minWidth,
    columnsTemplate
  }
  const { showLoading,
    schoolsData,
    showModal,
    fetchSchoolData
  } = props
  return (
    <div>
      <SchoolOverviewTableHead {...rowLayoutProps} />
      {
        showLoading === true ?
          <SchoolOverviewTableStyle.IconContainer>
            <Icon type='loading' style={{ fontSize: '40px' }} spin />
          </SchoolOverviewTableStyle.IconContainer>
          :
          schoolsData.map((data, index) => <SchoolOverviewTableRow
            key={data.id}
            columnsTemplate={columnsTemplate}
            minWidth={minWidth}
            data={data}
            index={index}
            showModal={showModal}
            fetchSchoolData={fetchSchoolData}
          />)
      }
    </div>
  )
}

export default SchoolOverviewTableMain
