import styled from 'styled-components'
import { Table, Button, Tag, Select, Checkbox } from 'antd'
// import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const MentorSalesStyle = styled.div`
    width: 93vw;
    margin: 0 auto;
    overflow: hidden;
`

const StyledTable = styled(Table)`
  overflow: scroll;
  table thead th{
    color: #666666;
    background-color: #f7f7f7;
  }
  .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td, .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
    padding: 10px;
    font-family: 'Lato', sans-serif;
  }
  .ant-table-thead > tr > th{
    font-size: 16px;
    padding: 0 6px;
  }
  .ant-table-tbody > tr > td{
    background-color: #f7f7f7;
    font-size: 14px;
    padding: 0 6px;
  }
  .ant-table-thead > tr.ant-table-row-hover td,
  .ant-table-tbody > tr.ant-table-row-hover td,
  .ant-table-thead > tr:hover td,
  .ant-table-tbody > tr:hover td,
  tr:hover td{
    background: #f0f0f0 !important;
  }
  .ant-table-thead > tr > th[colspan]:not([colspan='1']){
    text-align:left;
  }
  // .midWidth{
  //   min-width: 150px !important;
  //   width: 150px;
  // }
  // .bigWidth{
  //   min-width: 200px !important;
  //   width: 230px;
  // }
  // .smallWidth{
  //   min-width: 50px !important;
  //   width: 50px;
  // }
  th.mentorStatus{
    background-color: #4a90e2;
    color: white;
  }
  td.mentorStatus{
    background-color: #ffffff !important;
    color: #666666;
    position: relative;
  }
  td.mentorStatus:hover{
    background-color: ${colors.taPage.tableBackground} !important;
  }
  .interest{
    padding: 0 !important;
  }
  .interest span[disabled]:hover{
    opacity: 0.5
  }
  th.interest{
    background-color: #4a90e2;
    color: white;
  }
  td.interest{
    display: flex;
    flex-direction: column;
    height: 100% !important;
    align-items: stretch;
    padding: 0 !important;
  }
  td.pipeline{
    background-color: #fbc46b !important;
  }
  td.hot{
    background-color: #b8e986 !important;
  }
  td.lost{
    background-color: #ff5744 !important;
  }
  td.cold{
    background-color: #fa8679 !important;
  }
  td.won{
    background-color: #6db921 !important;
  }
  td.unfit{
    background-color: #c9cbcc !important;
  }
`

const StyledSelect = styled(Select)`
  .ant-select-selection__rendered{
    margin: 0;
    margin-right: 0 !important;
  }
  .ant-select-selection{
    background-color: transparent;
    border: 0;
    padding: 0;
  }
  .ant-select-arrow{
    background-color: #80b8fa;
    color: transparent;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    width: 14px;
    right: 0 !imoprtant;
  }
`

const TagsContainer = styled.span`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
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

const StyledTagButton = styled.button`
    padding: 3px;
    margin: 5px 10px;
    display: flex;
    border: 1px solid #9121f2;
    border-radius: 25px;
    background-color: #c480ff;
    color: #fff !important;
    text-transform: capitalize;
    font-weight: 600 !important;
    font-size: 10px;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: 0.63px;
    transition: all 0.4s;
    &:hover {
      cursor: 'pointer'
    }
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

const StatusOfLeadStatus = styled.div`
    padding: 0 10px 0 20px;
    background-color: #f8ed6b;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 0 0 15px;
    font-size: 10px;
`
const StyledEditButton = styled(Button)`
    border: 0 !important;
    position: absolute !important;
    bottom: 0;
    right: 0;
    padding: 0 5px !important;
    height: 24px !important;
`

const StyledChatIconWrap = styled.span`
    position: absolute !important;
    bottom: 0;
    right: 27px;
    display: flex;
    filter: drop-shadow(0px 1px 1px #a2caf9);
`

const StyledChatIcon = styled.span`
    -webkit-clip-path: polygon(0% 0%,100% 0%,100% 75%,75% 75%,33% 99%,42% 75%,0% 75%);
    clip-path: polygon(0% 0%,100% 0%,100% 75%,75% 75%,33% 99%,42% 75%,0% 75%);
    background-color: #fff;
    line-height: 16px;
    font-size: 12px;
    padding: 0 5px 5px;
    border-radius: 2px;
    text-align: center;
    height: 20px !important;
    width: 18px;
    color: #e07414;
`

const MentorSalesCountData = styled.div`
    display: flex;
    margin: 10px 0 20px;
    justify-content: space-around;
`

const FilterCheckBox = styled(Checkbox)`
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  .ant-checkbox + span{
    padding-right: 0px;
    padding-left: 0px;
  }
  &.ant-checkbox-wrapper + .ant-checkbox-wrapper{
    margin-left: 0;
  }
  &.ant-checkbox-wrapper{
    position: relative;
  }
  .ant-checkbox{
    position: absolute;
    z-index: 1;
    top: -5px;
    left: -5px;
  }
`

const FilterBox = styled.span`
    padding: 10px 5px;
    border: 1px solid;
    // margin-left: 5px;
    display: inline-flex;
    align-items: start;
    flex-direction: column;
    position: relative;
    height: 64px;
    justify-content: end;
    min-width: 100px;
`

const Vl = styled.span`
    width: 2px;
    background-color: #c9cbcc;
`

const InterestTags = styled(Tag.CheckableTag)`
  width: 100%;
  text-align: center;
  color: #666666 !important;
  cursor: pointer;
  transition: all 0.3s ease;
  &.ant-tag-checkable-checked {
    background-color: #a2caf9;
  }
  &.ant-tag-checkable:not(.ant-tag-checkable-checked):hover{
    background-color: #b1b1b1;
    color: white !important;
  }
  &.ant-tag:hover{
    background-color: #1890ff;
    color: white !important;
  }
  &:disabled{
    background-color: crimson !important;
  }
`

const IconWrap = styled.div`
    position: absolute;
    bottom: 0;
    right: 8px;
    font-size: 20px;
`
const LoadMoreButtonParent = styled.div`
    display:flex;
    justify-content:center;
    padding:10px 0px;
    `
const PaginationHolder = styled.div`
  margin: 20px 0;
  display: grid;
  justify-content: center;
`

const SalesPercentage = styled.span`
  position: absolute;
  top: 0;
  right: 5px;
`

const ActivityBtn = styled(Button)`
  width: 30px;
  background-color: transparent !important;
  border: 0 !important;
  display: flex !important;
  justify-content: center;
  font-size: 20px !important;
`
const Activities = styled.div`
  border-bottom: 1px solid #eee;
  
  p{
    margin-bottom: 0 !important;
    font-family: 'Lato', sans-serif;
    color: #666666;
    font-size: 16px;
  }
  p.createdAt{
    color: #888c8d;
    font-size: 14px;
    font-style: italic;
  }
  &:last-of-type{
    border-bottom: 0;
  }
`
const Activitie = styled.div`
  width:100%;
  height: 79px;
  background: #E6F7FE;
  display:flex;
  align-items: center;
  justify-content:center;

`
const SessionHeading = styled.p`
font-weight: bold;
font-size: 12px;
line-height: 16px;
text-align:center;
color: #000000;
padding:10px 0px;


`

const SearchBy = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-content: center;
`
const Session = styled.span`
padding:0px 10px;
width:100%;
`
const SessionColumn = styled.div`
display:flex;
flex-direction:column;
justify-content:flex-end;

`
const SessionItemNormal = styled.span`
font-size: 11px;
line-height: 14px;
color: #000000;
font-weight:bold;
text-align:center;
`
const SessionLoader = styled.div`
margin:40px;

`
const SessionItemBold = styled.span`
font-weight: bold;
font-size: 11px;
line-height: 14px;
color: #000000;
`

const Options = styled.button`
    height: 26px;
    border-radius: 18px;
    border: solid 1px #4c4c4c;
    text-align: center;
    line-height: 1;
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 100;
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
    margin: 5px;
    min-width: 45px;
    padding: 0 10px;
    &:hover {
        box-shadow: 5px 9px 13px #9fa2a445;
    }
`

const redOptions = styled(Options)`
    background-color: #f8cccc;
    border-color: #de2b20;
    color: #4a4a4a;
    margin: 8px 5px;
    opacity: 0.6;
`

MentorSalesStyle.StyledTable = StyledTable
MentorSalesStyle.StyledSelect = StyledSelect
MentorSalesStyle.TagsContainer = TagsContainer
MentorSalesStyle.TagsIcon = TagsIcon
MentorSalesStyle.StyledTagButton = StyledTagButton
MentorSalesStyle.MoreTags = MoreTags
MentorSalesStyle.StatusOfLeadStatus = StatusOfLeadStatus
MentorSalesStyle.StyledEditButton = StyledEditButton
MentorSalesStyle.StyledChatIcon = StyledChatIcon
MentorSalesStyle.StyledChatIconWrap = StyledChatIconWrap
MentorSalesStyle.MentorSalesCountData = MentorSalesCountData
MentorSalesStyle.FilterCheckBox = FilterCheckBox
MentorSalesStyle.FilterBox = FilterBox
MentorSalesStyle.Vl = Vl
MentorSalesStyle.InterestTags = InterestTags
MentorSalesStyle.IconWrap = IconWrap
MentorSalesStyle.PaginationHolder = PaginationHolder
MentorSalesStyle.SalesPercentage = SalesPercentage
MentorSalesStyle.ActivityBtn = ActivityBtn
MentorSalesStyle.Activities = Activities
MentorSalesStyle.Activitie = Activitie
MentorSalesStyle.SearchBy = SearchBy
MentorSalesStyle.Options = Options
MentorSalesStyle.redOptions = redOptions
MentorSalesStyle.Session = Session
MentorSalesStyle.SessionHeading = SessionHeading
MentorSalesStyle.SessionColumn = SessionColumn
MentorSalesStyle.SessionItemBold = SessionItemBold
MentorSalesStyle.SessionItemNormal = SessionItemNormal
MentorSalesStyle.SessionLoader = SessionLoader
MentorSalesStyle.LoadMoreButtonParent = LoadMoreButtonParent

export default MentorSalesStyle
