import styled from 'styled-components'
import { Button } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

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
export default { TopContainer, StyledButton }
