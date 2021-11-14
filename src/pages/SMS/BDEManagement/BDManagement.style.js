import styled from 'styled-components'
import { Collapse } from 'antd'

const BDManagementStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const FlexContainer = styled.div`
    display:flex;
    justify-content: ${props => props.spacebetween && 'space-between'}
`
const ButtonContainer = styled.div`
    display:flex;
    justify-content: space-between;
    margin: 10px 0px;
`
const IconContainer = styled.div`
display:grid;
place-items:center;
min-height:60vh;
`

const StyledCollapse = styled(Collapse)``

const StyledPanel = styled(Collapse.Panel)`
& .ant-collapse-header{
  padding: 0 !important;
  cursor: default !important;
}
`

BDManagementStyle.FlexContainer = FlexContainer
BDManagementStyle.ButtonContainer = ButtonContainer
BDManagementStyle.IconContainer = IconContainer
BDManagementStyle.StyledCollapse = StyledCollapse
BDManagementStyle.StyledPanel = StyledPanel


export default BDManagementStyle
