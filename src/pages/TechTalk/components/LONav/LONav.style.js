import styled from 'styled-components'
import colors from '../../../../constants/colors'

const Main = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-bottom: 1px solid #e8e8e8;
  .ant-tabs-bar {
    margin: 0;
  }
  .ant-tabs {
    position: relative;
    top: 1px;
  }
  .ant-tabs-nav {
    .ant-tabs-tab {
      color: #000;
      opacity: 0.7;
      &:hover {
        color: #000;
        opacity: 1;
      }
    }
    .ant-tabs-tab {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .ant-tabs-tab.ant-tabs-tab-active {
      color: ${colors.themeColor};
      opacity: 1;
      font-weight: 400;
    }
  }
`

export default Main
