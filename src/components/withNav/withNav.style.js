import { get } from 'lodash'
import styled from 'styled-components'

const Screen = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`
const SideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${props => props.sideNavWidth});
  height: 100%;
`
const Main = styled.div`
  flex: 1;
  width: 100%;
  overflow: scroll;
  background-color: ${props => {
    if (get(props, 'children.props.location.pathname') === '/user-profile') {
      return '#f5f5f5'
    }
    return '#fff'
  }};
  padding: ${props => props.noPadding ? '0px' : '15px'};
`
Screen.SideWrapper = SideWrapper
Screen.Main = Main
export default Screen
