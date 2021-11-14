import styled from 'styled-components'
import { Col, Card, Divider } from 'antd'

const StyledTitle = styled.span`
  height: 3em;
  white-space: break-spaces;
  display: inline-flex;
  align-items: center;
  color: white;
`

const StyledCol = styled(Col)`
  && {
    padding: 2%;
    font-weight: bold;
    text-align: center;
    width: 390px !important;
    min-height: 285px !important;
  }
  & .ant-card-body{
    padding: 24px 0 0 0;
  }
  p{
    text-align: center;
    margin: 0px;
    padding: 5px;
    font-size: 12px;
    width: 100%;
  }
`

const StyledSpan = styled.span`
  min-width: 50px;
  background: ${props => props.filterWillWork ? '#1890ff' : '#d7b927'};
  display: inline-flex;
  min-width: 130px;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 50vh;

  &:hover {
    cursor: pointer;
  }
`

const StyledCard = styled(Card).attrs({
  headStyle: props => ({ background: props.filterWillWork ? '#1E3C60' : '#8d8627' })
})`
  && {
    background: ${props => props.filterWillWork ? '#122B4A' : '#6e671d'};
    color: white;
    border-radius: 5px;
    height: 100%;
  }
`

const StyledDetails = styled.div`
display: flex;
-webkit-box-pack: justify;
-webkit-justify-content: space-between;
-ms-flex-pack: justify;
justify-content: center;
margin-top: 20px;
border-top: 1px solid;
`

const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 3rem;
      background: #b6b6b6;
      position: unset !important;
    }
`
const CardStyle = {}

CardStyle.StyledTitle = StyledTitle
CardStyle.StyledCol = StyledCol
CardStyle.StyledSpan = StyledSpan
CardStyle.StyledCard = StyledCard
CardStyle.StyledDetails = StyledDetails
CardStyle.StyledDivider = StyledDivider

export default CardStyle