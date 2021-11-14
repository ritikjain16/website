import styled from 'styled-components'
import { Button } from 'antd'
import colors from '../../../constants/colors'

const GridContainer = styled.div`
  display:grid;
  grid-template-columns:${props => props.columnTemplate};
  border:1px solid ${colors.loPage.tableBorder};
  margin-top:1px;
  color:black;
  background:white;
  overflow-y:hidden;
`
const GridItem = styled.div`
  border:1px solid grey;
  text-align:center;
  padding:10px;
  border-left:none;
  border-right:none;
  display:flex;
  justify-content:center;
  align-items:center;
  overflow:hidden;
`
const Title = styled.div`
  text-align:center;
  font-weight:bold;
  padding:10px;
`
const LORow = styled.div`
  background:#d9d9d9;
  grid-column-start:1;
  grid-column-end:9;
  padding:10px;
  color:black;
  font-weight:700;
  border:1px solid ${colors.loPage.tableBorder};
  border-left:none;
  border-right:none;
  text-align:center;
  overflow:hidden;
  text-overflow:ellipsis;
`
const TypeRow = styled.div`
  background:#f5f5f5;
  grid-column-start:1;
  grid-column-end:${props => props.questionsCount > 0 ? 7 : 9};
  padding:5px 0px 5px 5px;
  font-weight:bold;
  border:none;
  display:flex;
  justifyContent:space-between;
`
const Date = GridItem.extend`
  flex-direction:column;
`
const ReorderContainer = styled.div`
  background:#f5f5f5;
  grid-column-start:7;
  grid-column-end:9;
  padding:5px 0px;
  font-weight:bold;
  border:none;
  padding-left:60%;
`
const ButtonsContainer = styled.div`
  background:#f5f5f5;
  grid-column-start:7;
  grid-column-end:9;
  padding:5px 0px;
  font-weight:bold;
  border:none;
  padding-left:35%;
`
const StyledButton = styled(Button)`
  &.ant-btn{
    background:${colors.questionBank.addBlankButton};
    color:white;
    border:none;
  }
  &.ant-btn:hover, &.ant-btn:focus{
    background:${colors.questionBank.addBlankButton};
    color:white;
    border:none;
  }
  margin-left:10px;
  `
const Status = styled.div`
  width: 12px;
  height: 12px;
  background: ${props => colors.status[props.status]};
  border-radius: 50%;
`
const QuestionRow = styled.div`
  &:hover{
    background-color:${colors.video.background};
  }
`
export default {
  GridContainer,
  Title,
  GridItem,
  LORow,
  TypeRow,
  Date,
  StyledButton,
  ButtonsContainer,
  ReorderContainer,
  Status,
  QuestionRow
}
