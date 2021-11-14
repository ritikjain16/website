import styled from 'styled-components'
import { Radio } from 'antd'
import colors from '../../constants/colors'

const Main = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const RadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper-checked {
    background: ${colors.themeColor};
    color: white;
    &:hover {
      color: white;
    }
  }
`

Main.RadioGroup = RadioGroup
export default Main
