import styled from 'styled-components'
import { Button, Select } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const SessionManagementStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:flex-end;
    padding-bottom:20px;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`

const StyledSelect = styled(Select)`
    min-width: 200px;
    display: flex;
    align-items: left;
`

const BottomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: 70px;
`

const PageNumbersContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #fdfdfd;
    box-shadow: 5px 10px;
    border-radius: 5px;
    box-shadow: 1px 1px #f6f6f6;
`

const PageNumberContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    background-color: ${props => props.isActive ? '#b4eeb4' : '#fff'};
    margin: 10px;
    padding-left: 2px;
    &:hover{
      cursor: ${props => props.isActive ? '' : 'pointer'};
    }
`

const PageNumber = styled.div`
    font-size: 18px;
    font-family: monospace;
    font-weight: 800;
`

const ArrowContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    background-color: ${props => props.isInvisible ? '#fff' : '#eeeeee'};
    &:hover{
      cursor: ${props => props.isActive ? 'pointer' : ''};
    }
`

const StyledOption = styled(Select.Option)``

SessionManagementStyle.TopContainer = TopContainer
SessionManagementStyle.StyledButton = StyledButton
SessionManagementStyle.Select = StyledSelect
SessionManagementStyle.Option = StyledOption
SessionManagementStyle.BottomContainer = BottomContainer
SessionManagementStyle.PageNumberContainer = PageNumberContainer
SessionManagementStyle.PageNumber = PageNumber
SessionManagementStyle.PageNumbersContainer = PageNumbersContainer
SessionManagementStyle.ArrowContainer = ArrowContainer

export default SessionManagementStyle
