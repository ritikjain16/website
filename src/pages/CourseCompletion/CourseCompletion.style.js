import { LinkOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import styled from 'styled-components'


const CourseCompletionStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const IconContainer = styled.div`
display:grid;
place-items:center;
min-height:60vh;
`

const StyledCollapse = styled(Collapse)``

const StyledPanel = styled(Collapse.Panel)`
& .ant-collapse-header{
  padding: 0 !important;
  cursor: default !important;
}
`

const LinkIcon = styled(LinkOutlined)`
font-size: 1vw;
cursor: pointer;
transition: all 0.1s ease-in-out;
&:hover{
  background-color: lightgray;
}
`

CourseCompletionStyle.IconContainer = IconContainer
CourseCompletionStyle.StyledCollapse = StyledCollapse
CourseCompletionStyle.StyledPanel = StyledPanel
CourseCompletionStyle.LinkIcon = LinkIcon

export default CourseCompletionStyle
