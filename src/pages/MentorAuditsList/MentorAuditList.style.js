import styled from 'styled-components'
import { Button, Select, Input } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'
import { ADMIN, UMS_ADMIN, UMS_VIEWER, SALES_EXECUTIVE } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'

const savedRole = getDataFromLocalStorage('login.role')
const admin = (savedRole
    && (savedRole === ADMIN || savedRole === UMS_ADMIN ||
        savedRole === UMS_VIEWER || savedRole === SALES_EXECUTIVE))

const MentorAuditStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    width: 100%;
    display:flex;
    justify-content: space-between;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`

const StyledSelect = styled(Select)`
    min-width: 200px;
    //display: flex;
    align-items: left;
`

const UserImage = styled.div`
  height: 65px;
  width: 65px;
  color: #fff;
  font-size: 1.5rem;
  background: gray;
  border-radius: 50%;
  display:flex;
  justify-content:center;
  align-items:center;
`

const BottomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: 70px;
`

const StyledOption = styled(Select.Option)``

const StyledInput = styled(Input)`
    min-width: 200px;
    display: flex;
    align-items: left;
    border-width: 0 0 2px 0 !important;
`

const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const PickSlotItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #0000EE;
    padding: 0 10px;
    text-align: center;
    flex-wrap: wrap;
    &:hover {
      cursor: pointer
    } 
`

const TopDetails = styled.div`
    margin: 0 0 20px 0;
    display: flex;
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
      opacity: ${admin ? 0.3 : 1}  !important;
      cursor: ${admin ? 'pointer' : 'revert'}
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


const SessionRatings = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: nowrap;
    &:hover {
      cursor: ${admin ? 'pointer' : 'revert'}
    } 
`

const SessionRatingsGroup = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 1;
`

const SessionRatingsComponent = styled.span`
    text-align: right;
    height: 20px;
    margin: 0 0 30px;
    border: solid #fff;
    border-width: thin;
    line-height: 1.2;
    font-size: 16px;
    font-weight: bold;
    color: black;
    display: grid;
    &:hover {
      cursor: ${admin ? 'pointer' : 'revert'}
    } 
`

const SessionRatingsButton = styled.button`
    display: inline;
    text-align: right;
    padding: 0;
    &:hover {
      cursor: ${admin ? 'pointer' : 'revert'}
    } 
`

const ClearButton = styled.button`
    display: inline;
    text-align: right;
    margin: 0 0 10px;
    padding: 5px 24px;
    background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid grey;
    float: right;
    &:hover {
      cursor: pointer
    } 
`
const PaginationHolder = styled.div`
  display: flex;
  justify-content: center;
`

const CommentSectionTitle = styled.div`
    display: flex;
    justify-content: space-between;
    p{
      margin-bottom: 0;
    }
    div{
      display: flex;
      p{
        margin-right: 20px;
      }
    }
`

const AuditTab = styled.div`
background: #FFFFFF;
border-radius: 8px;
cursor: pointer;
box-shadow: 0px 1.46867px 2.93734px rgba(0, 0, 0, 0.15);
height: 40px;
width: 115px;
display: flex;
justify-content: center;
align-items: center;
&:nth-of-type(2){
  margin: 0 15px;
}
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 29px;
color: #000000;
border-bottom: ${props => props.checked ? '2px solid #00ADE6' : ''};
`

MentorAuditStyle.TopContainer = TopContainer
MentorAuditStyle.StyledButton = StyledButton
MentorAuditStyle.Select = StyledSelect
MentorAuditStyle.Option = StyledOption
MentorAuditStyle.StyledInput = StyledInput
MentorAuditStyle.SearchIcon = SearchIcon
MentorAuditStyle.BottomContainer = BottomContainer
MentorAuditStyle.PickSlotItem = PickSlotItem
MentorAuditStyle.TopDetails = TopDetails
MentorAuditStyle.TagsContainer = TagsContainer
MentorAuditStyle.TagsIcon = TagsIcon
MentorAuditStyle.StyledTagButton = StyledTagButton
MentorAuditStyle.MoreTags = MoreTags
MentorAuditStyle.SessionRatings = SessionRatings
MentorAuditStyle.SessionRatingsButton = SessionRatingsButton
MentorAuditStyle.SessionRatingsGroup = SessionRatingsGroup
MentorAuditStyle.SessionRatingsComponent = SessionRatingsComponent
MentorAuditStyle.ClearButton = ClearButton
MentorAuditStyle.PaginationHolder = PaginationHolder
MentorAuditStyle.CommentSectionTitle = CommentSectionTitle
MentorAuditStyle.UserImage = UserImage
MentorAuditStyle.AuditTab = AuditTab

export default MentorAuditStyle