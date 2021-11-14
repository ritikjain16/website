import { Link } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../../constants/colors'

const Nav = styled.div`
  min-width: ${props => props.width};
  background: ${colors.sideNavBG};
  height: 100vh;
`
const LogoContainer = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  cursor: pointer;
  img {
    height: 36px;
    width: auto;
  }
  background-color: rgba(158, 121, 209, 0.2);
`
Nav.LogoContainer = LogoContainer
export default Nav
