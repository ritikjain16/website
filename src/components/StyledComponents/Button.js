import styled from 'styled-components'
import { Button } from 'antd'
import colors from '../../constants/colors'

const StyledButton = styled(Button)`
  &&& {
    width: 100%;
    border: none;
    outline: none;
    background: ${colors.themeColor};
    font-size: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 0px;
    padding-left: 0px;
    border-radius: 2px;
    height: auto;
    margin-bottom: 30px;
  }
`
export default StyledButton
