/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Tooltip } from 'antd'
import Item from './NavItem.style'
import SVGIcon from '../../../../../assets/icons'
import {
  CalendarSvg,
  ClassesSvg,
  StudentsSvg,
  ContactUsSvg,
  SettingsSvg,
  EarningsSvg,
  CourseSvg
} from '../../../../../constants/icons'

/**
 * renders individual nav items
 * @param { Object } props
 * @returns { React.ReactElement }
 */

const renderItem = ({ title, isActive, iconType, route, icon, style, toggleMobileSidebarOpened, comingSoon, componentToDisplay }) => (
  <Item
    onClick={toggleMobileSidebarOpened}
    isActive={isActive}
    to={route}
    comingSoon={comingSoon}
  >
    {
      iconType !== 'external'
      ? <Item.Icon type={iconType} isActive={isActive} theme='twoTone' component={componentToDisplay} style={style} />
      : <div style={{ width: '60px', position: 'relative', height: '60px', top: '13px', left: `${get(style, 'left') || '17px'}` }}><SVGIcon name={icon} /></div>
    }
    {title}
  </Item>
)

const NavItem = ({ title, isActive, iconType, route, icon, style, toggleMobileSidebarOpened, comingSoon }) => {
  let componentToDisplay = null
  switch (iconType) {
    case 'calendar':
      componentToDisplay = CalendarSvg
      break
    case 'classes':
      componentToDisplay = ClassesSvg
      break
    case 'students':
      componentToDisplay = StudentsSvg
      break
    case 'course':
      componentToDisplay = CourseSvg
      break
    case 'earnings':
      componentToDisplay = EarningsSvg
      break
    case 'settings':
      componentToDisplay = SettingsSvg
      break
    case 'contactUs':
      componentToDisplay = ContactUsSvg
      break
    default:
      componentToDisplay = null
      break
  }
  if (comingSoon) {
    return (
      <div className=''>
        <Tooltip overlayClassName='custom-ant-tooltip-inner' title='Coming Soon' placement='topLeft'>
          {renderItem({ title, isActive, iconType, route, icon, style, toggleMobileSidebarOpened, comingSoon, componentToDisplay })}
        </Tooltip>
      </div>
    )
  }
  return renderItem({ title, isActive, iconType, route, icon, style, toggleMobileSidebarOpened, comingSoon, componentToDisplay })
}

NavItem.propTypes = {
  /** The type of icon consumed by Icon component by antd */
  iconType: PropTypes.string.isRequired,
  /** Title text shows up as a tooltip */
  title: PropTypes.string.isRequired,
  /** Decides if item is active or not */
  isActive: PropTypes.bool.isRequired,
  /** route link */
  route: PropTypes.string.isRequired,
  icon: PropTypes.shape({}).isRequired
}

export default NavItem
