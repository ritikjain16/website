import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import Main from './SplitScreen.style'

const SplitScreen = props => {
  const [isMobile, setIsMobile] = useState(false)
  if (React.Children.count(props.children) !== 2) {
    throw new Error('SplitScreen only handles two childrens')
  }

  const onWindowResize = () => {
    if (window.innerWidth < props.mobileBreak) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    onWindowResize()
    window.addEventListener('resize', debounce(onWindowResize))
  }, [])

  const childrenArray = React.Children.toArray(props.children)
  return (
    <Main headerHeight={props.headerHeight}>
      {(!props.hideScreenLeft || isMobile) && <Main.ScreenLeft className='screenLeft' style={props.screenLeftStyle}>{childrenArray[0]}</Main.ScreenLeft>}
      {(!isMobile && !props.hideScreenRight) && <Main.ScreenRight className='screenRight' style={props.screenRightStyle}>{childrenArray[1]}</Main.ScreenRight>}
    </Main>
  )
}


SplitScreen.propTypes = {
  headerHeight: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  hideScreenLeft: PropTypes.bool.isRequired,
  hideScreenRight: PropTypes.bool.isRequired,
  mobileBreak: PropTypes.number.isRequired
}
export default SplitScreen
