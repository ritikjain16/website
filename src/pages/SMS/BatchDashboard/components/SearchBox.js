import { Icon } from 'antd'
import React from 'react'
import BatchDashboardStyle from '../BatchDashboard.style'

const SearchBox = ({ value, onChange, placeholder, onKeyPress, searchByFilter }) => (
  <div style={{
    marginLeft: '20px',
    display: 'inline-flex',
    flexDirection: 'row' }}
  >
    <BatchDashboardStyle.Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
    <BatchDashboardStyle.SearchIcon onClick={searchByFilter}>
      <Icon type='search'
        style={{
          fontSize: 18
        }}
      />
    </BatchDashboardStyle.SearchIcon>
  </div>
)

export default SearchBox
