import { Button, Pagination } from 'antd'
import React from 'react'

/* eslint-disable no-unused-vars */
const Paginations = ({ salesCount, onChange, perPage, currentPage,
  fetchAllProgress, fetchFinanceReport, reportFetchLoading }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '10px',
        width: '100%',
        marginLeft: 'auto',
      }}
    >
      <Pagination
        total={!salesCount ? 0 : salesCount}
        onChange={onChange}
        current={currentPage}
        defaultPageSize={perPage}
      />
      {salesCount ? <h4>Total {salesCount}</h4> : <h4>Total 0</h4>}
      <div>
        {/* <Button
          type='primary'
          icon='file'
          loading={reportFetchLoading && reportFetchLoading}
          onClick={fetchFinanceReport}
          style={{ marginRight: '15px' }}
        >Download Financial Reports
        </Button> */}
        <Button type='primary' icon='download' onClick={fetchAllProgress} >Download All Reports</Button>
      </div>
    </div>
)

export default Paginations
