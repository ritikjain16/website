import styled from 'styled-components'
import { Button } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const AssignmentStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 20px;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`

AssignmentStyle.TopContainer = TopContainer
AssignmentStyle.StyledButton = StyledButton

export default AssignmentStyle
