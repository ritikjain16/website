import styled from 'styled-components'
import colors from '../../constants/colors'

const StyledNavbar = styled.div`
  display:flex;
  border:1px solid #979797;
  margin-bottom:5px;
  justify-content:space-between;
  align-items:flex-end;
  padding:0px 10px 0px 10px;
  background-color:white;
  position: sticky;
  top: 0;
  z-index: 100
`
const Hdiv = styled.div`
  display:flex;
  align-items:flex-end;
  align-content:center;
  height:48px;
  border:2px solid transparent;
  padding:10px;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  cursor:pointer;
  text-align:center;
  &:hover{
    color:${colors.topicJourney.topicJourney};
  }
  color:${props => props.isActive ? colors.topicJourney.topicJourney : ''};
  border-bottom:${props => props.isActive ? `2px solid ${colors.topicJourney.topicJourney}` : ''}
`
StyledNavbar.Hdiv = Hdiv
export default StyledNavbar
