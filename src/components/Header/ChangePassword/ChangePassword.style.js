import styled from 'styled-components'
import { Button } from 'antd'
import colors from '../../../constants/colors'
import antdButtonColor from '../../../utils/mixins/antdButtonColor'

const ChangePasswordModal = styled.div`
   height: 520px;
   width: 520px;
   display: flex;
   flex-direction: column;
   margin: -24px 0 0 -24px;
`

const Head = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 238px;
  overflow: hidden;
`

const CircleBG = styled.div`
  position: absolute;
  bottom: 0px;
  left: calc((-2208px + 500px) / 2);
  border-radius: 50%;
  background: ${colors.themeColor};
  width: 2208px;
  height: 2208px;
  @media (max-width: 600px) {
    left: calc((-2208px + 100vw) / 2);
  }
`

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 2px;
  position: relative;
  z-index: 2;
`

const Body = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  flex: 1;
  width: 100%;
  margin-top: 20px;
`
const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.themeColor)}
  }
`

ChangePasswordModal.LogoWrapper = LogoWrapper
ChangePasswordModal.Head = Head
ChangePasswordModal.CircleBG = CircleBG
ChangePasswordModal.Body = Body
ChangePasswordModal.Button = StyledButton

export default ChangePasswordModal
