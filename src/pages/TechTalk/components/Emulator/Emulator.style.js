import styled from 'styled-components'
import { Icon } from 'antd'
import colors from '../../../../constants/colors'
import dimensions from '../../../../constants/dimensions'

const Main = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`
const Phone = styled.div`
  width: ${dimensions.phone.width};
  height: ${dimensions.phone.height};
  background: ghostwhite;
  border: 1px solid #e4dbda;
`
const FullScreenIcon = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  box-shadow: 5px 5px 25px 0 rgba(46,61,73,.2);
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 4px 8px 0 rgba(46,61,73,.2);
  }
`

const StyledIcon = styled(Icon)`
  font-size: 18px;
  opacity: 0.6;
  transition: 0.3s all ease-in-out;
  ${FullScreenIcon}:hover & {
    color: ${colors.themeColor};
    opacity: 1;
  }
`

const FullScreenOverlay = styled.div`
  display: ${props => props.isFullScreenMode ? 'block' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
`

Main.Phone = Phone
Main.FullScreenIcon = FullScreenIcon
Main.FullScreenOverlay = FullScreenOverlay
Main.Icon = StyledIcon
export default Main
