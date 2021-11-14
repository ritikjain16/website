import styled from 'styled-components'
import { Button } from 'antd'
import colors from '../../constants/colors'

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 50px;
`

const SaveButton = styled(Button)`
 &&&{
  width: 64px;
  height: 36px;
  border-radius: 3px ;
  border-color: ${colors.modalFooterColors.modalSaveBtn};
  display: flex ;
  justify-content: center ;
  background-color: ${colors.modalFooterColors.modalSaveBtn} ;
  box-shadow: 0 2px 0 0 ${colors.modalFooterColors.modalSaveBtnShadow} ;
}
`

const Cancel = styled.div`
  width: 60px;
  height: 19px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: right;
  color: ${colors.modalFooterColors.modalCancelBtn};
  cursor: pointer;
  margin-right: 24px;
`

Footer.Cancel = Cancel
Footer.SaveButton = SaveButton


export default Footer
