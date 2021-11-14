import styled from 'styled-components'
import { Select, Table } from 'antd'

const StudentJourneyStyle = styled.div`
    height: 100%;
    max-width:fit-content;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:grid;
    grid-template-columns:43% 43% 14%;
    width:100%;
    justify-content:space-between;
    padding-bottom:20px;
    align-items:flex-start;
`
const TopContainerInner = styled.div`
width:100%;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    padding-bottom:20px;
    align-items:flex-start;
`
const InfoBox = styled.div`
padding:8px;
width:100%;
box-sizing:border-box;
font-size: 14px;
word-break:break-all;
height:fit-content;
font-weight: normal;
font-style: normal;
  letter-spacing: 1.15px;
background-color: ${props => props.title ? 'rgba(18, 43, 74, 0.17)' : ''};
color: ${props => props.title ? '#122b4a' : 'black'};
border: ${props => !props.title && '1px solid #122b4a'};
margin-left: ${props => !props.title && '10px'};
`

const InfoBoxStatus = styled.div`
padding:8px;
width:100%;
box-sizing:border-box;
font-size: 14px;
word-break:break-all;
height:fit-content;
font-weight: normal;
font-style: normal;
  letter-spacing: 1.15px;
background-color:${props => props.value === 'ahead' && '#16d877'};
background-color:${props => props.value === 'onTime' && 'yellow'};
background-color:${props => props.value === 'delayed' && '#ff5744'};
color:${props => props.value === 'delayed' && 'white'};
margin-left: 10px;
`

const TagsIcon = styled.span`
    height: 24px;
    width: 24px;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    text-transform: capitalize;
    line-height: 24px;
    font-style: normal;
    letter-spacing: normal;
    font-size: 10px;
    color: #fff;
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`
const MoreTags = styled.div`
    text-transform: capitalize;
    font-family: Nunito;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
`

const MDTable = styled(Table)``

const StyledSelect = styled(Select)`
  .ant-select-selection__rendered{
    margin: 0;
    margin-right: 0 !important;
  }
  .ant-select-selection{
    background-color:${props => props.value === 'active' && '#16d877'};
    background-color:${props => props.value === 'dormant' && 'brown'};
    background-color:${props => props.value === 'downgraded' && 'red'};
    color: black !important;
    border: 0;
    padding: 5px;
  }
  .ant-select-selection__placeholder, .ant-select-search__field__placeholder{
      color:black;
  }
  .ant-select-arrow{
    background-color: black;
    color: transparent;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    width: 14px;
    right: 5px !important;
  }
`

const PaymentStatusBox = styled.a`
padding:8px;
width:100%;
box-sizing:border-box;
font-size: 14px;
word-break:break-all;
height:fit-content;
font-weight: normal;
font-style: normal;
letter-spacing: 1.15px;
background-color: ${props => props.value === 'OverDue' && '#ff5744'};
background-color: ${props => props.value === 'Paid' && '#16d877'};
background-color: ${props => props.value === 'Pending' && 'yellow'};
color:${props => props.value === 'OverDue' && 'white !important'};
font-weight:600;
&:hover{
  color:${props => props.value === 'OverDue' && 'blue !important'};
}
`

StudentJourneyStyle.TopContainer = TopContainer
StudentJourneyStyle.MDTable = MDTable
StudentJourneyStyle.InfoBox = InfoBox
StudentJourneyStyle.TopContainerInner = TopContainerInner
StudentJourneyStyle.TagsIcon = TagsIcon
StudentJourneyStyle.MoreTags = MoreTags
StudentJourneyStyle.StyledSelect = StyledSelect
StudentJourneyStyle.InfoBoxStatus = InfoBoxStatus
StudentJourneyStyle.PaymentStatusBox = PaymentStatusBox
export default StudentJourneyStyle
