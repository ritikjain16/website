/* eslint-disable no-console */
import React from 'react'
import { Select } from 'antd'
import { useHistory } from 'react-router-dom'
import { CMS, CONTENT_MAKER, COURSE_MAKER, SMS, UMS } from '../../constants/roles'
import UmsSmsSelectorStyles from './UmsSmsSelector.style'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { getUmsBlocks, getSmsBlock } from '../../pages/UserDashboard/rolesToRouteMap'
import roleToSystemMap from '../../pages/Login/roleToSystemMap'

const { Option } = Select
const UmsSmsSelector = ({ showSelector }) => {
  const history = useHistory()
  const handleTypeSelect = (value) => {
    if (value === UMS || value === SMS) {
      localStorage.setItem('type', value)
      history.push('/')
    } else if (value === CMS) {
      localStorage.setItem('type', value)
      history.push('/dashboard')
    } else if (value === COURSE_MAKER) {
      localStorage.setItem('type', value)
      history.push('/addCourse')
    } else if (value === CONTENT_MAKER) {
      localStorage.setItem('type', value)
      history.push('/content-video')
    }
  }
  const handleInnerBlockClick = (blockName, route, type) => {
    localStorage.setItem('type', type)
    localStorage.setItem('block', blockName)
    history.push(route)
  }
  const savedRole = getDataFromLocalStorage('login.role')
  const allotedRoutes = getUmsBlocks(savedRole)
  const allowedType = roleToSystemMap[savedRole]
  return (
    <UmsSmsSelectorStyles.Dropdown
      placeholder='Select Country'
      onChange={handleTypeSelect}
      value={localStorage.getItem('type')}
      backgroundColor={`${showSelector ? '#3f4e63' : 'white'}`}
      color={`${showSelector ? '#fff' : 'black'}`}
    >
      {
        allowedType.includes(UMS) && (
          <Option value={UMS} >{UMS}</Option>
        )
      }
      {allowedType.includes(UMS) && showSelector && allotedRoutes.map(({ blockName, routes }) => (
        <Option
          value={blockName}
          key={blockName}
          onClick={() => handleInnerBlockClick(blockName, routes[0].route, UMS)}
        >
          <span style={{ paddingLeft: '10px' }} >{blockName}</span>
        </Option>
      ))
      }
      {allowedType.includes(SMS) && (
        <Option value={SMS} >{SMS}</Option>
      )}
      {
        allowedType.includes(SMS) && showSelector && getSmsBlock().map(({ blockName, routes }) => (
          <Option
            value={`${blockName}${SMS}`}
            key={blockName}
            onClick={() => handleInnerBlockClick(blockName, routes[0].route, SMS)}
          >
            <span style={{ paddingLeft: '10px' }} >{blockName}</span>
          </Option>
        ))
      }
      {allowedType.includes(CMS) &&
        <Option value={CMS} >{CMS}</Option>}
      {allowedType.includes(COURSE_MAKER) &&
        <Option value={COURSE_MAKER} >{COURSE_MAKER}</Option>}
      {allowedType.includes(CONTENT_MAKER) &&
        <Option value={CONTENT_MAKER} >{CONTENT_MAKER}</Option>}
    </UmsSmsSelectorStyles.Dropdown>
  )
}

export default UmsSmsSelector
