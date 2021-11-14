import { Icon } from 'antd'
import React from 'react'
import BannerStyle from '../Banner.style'

const SearchBox = ({ value, onChange, placeholder, onKeyPress, searchByFilter }) => (
  <div style={{
    marginLeft: '20px',
    display: 'inline-flex',
    flexDirection: 'row' }}
  >
    <BannerStyle.Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
    <BannerStyle.SearchIcon onClick={searchByFilter}>
      <Icon type='search'
        style={{
          fontSize: 18
        }}
      />
    </BannerStyle.SearchIcon>
  </div>
)

export default SearchBox
