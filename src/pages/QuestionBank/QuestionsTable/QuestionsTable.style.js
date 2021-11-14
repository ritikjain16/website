import styled from 'styled-components'
import { Icon, Button } from 'antd'
import colors from '../../../constants/colors'
import antdButtonColor from '../../../utils/mixins/antdButtonColor'

const Header = styled.div`
  display:flex;
  justify-content:flex-end;
  align-items:center;
  padding:10px;
  align-content:center;
`
const ButtonContainer = styled.div`
  margin-left:20px;
`
const YellowButton = styled.button`
  height: 36px;
  color:white;
  background-color: ${colors.loPage.addLoBtn};
  box-shadow: 0 2px 0 0 ${colors.loPage.addLoBtnShadow};
  border:none;
  border-radius: 2px;
  padding:5px;
  font-size:16px;
  letter-spacing: 1.1px;
  text-align: center;
`
const StyledText = styled.span`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.4px;
  text-align: left;
  color: ${colors.loPage.loCountText};
`
const PlusIcon = styled(Icon)`
  margin-right: 5px;
`
const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`
ButtonContainer.YellowButton = YellowButton
ButtonContainer.PlusIcon = PlusIcon
Header.ButtonContainer = ButtonContainer
Header.Text = StyledText
Header.AddButton = StyledButton
export default Header
