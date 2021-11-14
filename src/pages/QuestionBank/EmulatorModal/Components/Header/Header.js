import React from 'react'
import PropTypes from 'prop-types'
import StyledHeader from './Header.style'


const Header = (props) => (
  <StyledHeader>
    <StyledHeader.TitleSection>
      <StyledHeader.PreviousIcon style={{ fontSize: '16px' }} type='left' />
      <StyledHeader.Title>{props.topicTitle}</StyledHeader.Title>
      <StyledHeader.ShareIcon style={{ fontSize: '22px' }} type='share-alt' />
    </StyledHeader.TitleSection>
    <StyledHeader.NavigationSection>
      <StyledHeader.Chat>Chat</StyledHeader.Chat>
      <StyledHeader.PQ>
        <StyledHeader.PQText>Practice</StyledHeader.PQText>
        <StyledHeader.UnderLine />
      </StyledHeader.PQ>
    </StyledHeader.NavigationSection>
  </StyledHeader>
)
Header.propTypes = {
  topicTitle: PropTypes.string.isRequired
}
Header.defaultProps = {

}
export default Header
