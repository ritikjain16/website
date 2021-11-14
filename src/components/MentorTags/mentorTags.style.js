import styled from 'styled-components'

const MentorTagsStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
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
      opacity: 0.3 !important;
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

const SessionRatingsButton = styled.button`
    display: inline;
    text-align: right;
    padding: 0;
    &:hover {
      cursor: pointer
    } 
`

MentorTagsStyle.TagsContainer = TagsContainer
MentorTagsStyle.TagsIcon = TagsIcon
MentorTagsStyle.StyledTagButton = StyledTagButton
MentorTagsStyle.MoreTags = MoreTags
MentorTagsStyle.SessionRatingsButton = SessionRatingsButton

export default MentorTagsStyle
