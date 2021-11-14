import styled from 'styled-components'
import { Button, Collapse } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const SchoolOverviewTableStyle = styled.div`
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
const DeleteModalWrraper = styled.div`
text-align:center;
`

const AddModalWrapper = styled.div`
display:flex;
row-gap: 15px;
flex-direction:column;
`

const ModalButtonWrapper = styled.div`
display:flex;
justify-content:space-between;
margin: 5px 10px;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
  color:"#fff"
`
const StyledCollapse = styled(Collapse)``

const StyledPanel = styled(Collapse.Panel)`
& .ant-collapse-header{
  padding: 0 !important;
  cursor: default !important;
}
`
const ToggleButton = styled(Button)`
  margin-left: 0 !important;
  border-radius: 0 !important;
  border-color: #73a5aa !important;
`

SchoolOverviewTableStyle.FlexContainer = FlexContainer
SchoolOverviewTableStyle.StyledButton = StyledButton
SchoolOverviewTableStyle.ButtonContainer = ButtonContainer
SchoolOverviewTableStyle.IconContainer = IconContainer
SchoolOverviewTableStyle.DeleteModalWrraper = DeleteModalWrraper
SchoolOverviewTableStyle.AddModalWrapper = AddModalWrapper
SchoolOverviewTableStyle.ModalButtonWrapper = ModalButtonWrapper
SchoolOverviewTableStyle.StyledCollapse = StyledCollapse
SchoolOverviewTableStyle.StyledPanel = StyledPanel
SchoolOverviewTableStyle.ToggleButton = ToggleButton


export default SchoolOverviewTableStyle
