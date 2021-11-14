import styled from 'styled-components'
import { Input, Button, Switch } from 'antd'

const ProjectStyle = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
`

const TopContainer = styled.div`
  display:flex;
  justify-content:space-between;
  padding:20px;
`
const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background-color: #fff;
    border: 1px solid ${(props) => props.bgcolor};
    margin: 0px 10px;
  }  
  &.ant-switch::after {
    background-color: ${(props) => props.bgcolor};
  }
`
const StyledInput = styled(Input)`
  width: 100%;
  display: flex;
  align-items: left;
  border-width: 0 0 2px 0 !important;
`

const StyledButton = styled(Button)`
height:50px !important;
padding: 0 20px !important;
font-size: 18px !important;
border:${props => props.type === 'default' ? '2px solid' : '1px solid'};
color: ${props => props.type === 'default' ? 'black' : 'whitesmoke'};
border-color: ${props => props.type === 'default' ? 'black' : 'inherit'};
  & .anticon-plus{
    padding: 8px;
    font-weight:900;
    color: #096dd9;
    background-color:whitesmoke;
    border-radius: 999px;
  }
`
export {
  ProjectStyle,
  StyledButton,
  StyledInput,
  StyledSwitch,
  TopContainer
}
