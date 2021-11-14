import styled from 'styled-components'
import { Icon, Button } from 'antd'
import colors from '../../../../constants/colors'
import antdButtonColor from '../../../../utils/mixins/antdButtonColor'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  & > div {
    display: flex;
  }
`
const ButtonContainer = styled.div`
  margin-left:20px;
`

const YellowButton = styled(Button)`
  &&& {
    color: white;
    ${antdButtonColor(colors.subThemeColor)}
  }
`
const StyledText = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`
const PlusIcon = styled(Icon)`
  margin-right: 5px;
`
ButtonContainer.YellowButton = YellowButton
ButtonContainer.PlusIcon = PlusIcon
Header.ButtonContainer = ButtonContainer
Header.Text = StyledText
export default Header
