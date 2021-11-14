import styled from 'styled-components'
import { Steps } from 'antd'

const MentorManagementNavStyle = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
`

const StyledSteps = styled(Steps)`
  padding: 0 !important;
  margin: -5px 0 20px !important;
  .ant-steps-item-icon {
    background: #86c5f9 !important;
  }
  .ant-steps-item-process .ant-steps-item-container .ant-steps-item-content .ant-steps-item-title a{
    color: #757575;
    font-weight: 400;
    &:hover {
      color: #1890ff;
    }
  }
  .ant-steps-item-active .ant-steps-item-container .ant-steps-item-content .ant-steps-item-title a{
    color: #1890ff;
    font-weight: 400;
  }
  .ant-steps-navigation .ant-steps-item::before{
    background-color: #86c5f9;
  }
`

MentorManagementNavStyle.StyledSteps = StyledSteps

export default MentorManagementNavStyle
