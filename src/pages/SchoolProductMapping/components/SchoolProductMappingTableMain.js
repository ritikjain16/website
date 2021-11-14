import React from 'react'
import { Icon } from 'antd'
import SchoolProductMappingRow from './SchoolProductMappingRow'
import SchoolProductMappingTableHead from './SchoolProductMappingTableHead'
import { Table } from '../../../components/StyledComponents'

const SchoolProductMappingTableMain = (props) => {
  const columnsTemplate =
    'minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(220px, 1fr)  '
  const minWidth = '840px'
  const rowLayoutProps = {
    minWidth,
    columnsTemplate,
  }
  const {
    showLoading,
    schoolData,
    schoolProductData,
    schoolDiscountsData,
    showModal,
    schoolsCount,
  } = props

  return (
    <div>
      <Table
        style={{
          width: '100%',
          overflowY: 'scroll',
          height: 'calc(100vh - 200px)',
        }}
      >
        <SchoolProductMappingTableHead {...rowLayoutProps} />
        {// eslint-disable-next-line no-nested-ternary
        showLoading ? (
          <Icon
            type='loading'
            style={{
              display: 'grid',
              placeItems: 'center',
              minHeight: '80vh',
              fontSize: '30px',
            }}
          />
        ) : schoolsCount === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: '#BFDBFE',
            }}
          >
            <h2> No Schools found</h2>
          </div>
        ) : (
          schoolData.map((data, i) => (
            <SchoolProductMappingRow
              data={data}
              schoolProductData={schoolProductData}
              i={i}
              schoolDiscountsData={schoolDiscountsData}
              key={data.id}
              columnsTemplate={columnsTemplate}
              minWidth={minWidth}
              showModal={showModal}
            />
          ))
        )}
      </Table>
    </div>
  )
}

export default SchoolProductMappingTableMain
