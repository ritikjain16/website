import React from 'react'
import { Icon } from 'antd'
import StyledSpinner from './Loader.style'

const Loader = () => {
  const antIcon = <Icon type='loading' style={{ fontSize: 70 }} spin />
  return (
    <StyledSpinner indicator={antIcon} />
  )
}

export default Loader
