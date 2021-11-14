import styled from 'styled-components'
import { Select, Button } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
`
const TopicsCount = styled.div`
  margin-right: 15px;
`
const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`
const StyledSelect = styled(Select)`
min-width: 160px;
display: flex;
align-items: left;
`

const StyledOption = styled(Select.Option)``

const Main = styled.div``

Main.Button = StyledButton
Main.TopicsCount = TopicsCount
Main.TopContainer = TopContainer
Main.Select = StyledSelect
Main.Option = StyledOption
export default Main
