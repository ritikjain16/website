import React from 'react'
import PropTypes from 'prop-types'
import StyledNavbar from './TopicJourneyNavBar.style'
import topicJourneyTitles from '../../constants/topicJourneyTitles'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'

const {
  learningObjectives,
  episode,
  techTalk,
  questionBank,
  assignment
} = topicJourneyTitles
const navItems = [
  { title: learningObjectives, route: topicJourneyRoutes.learningObjectives },
  { title: episode, route: topicJourneyRoutes.episode },
  { title: techTalk, route: topicJourneyRoutes.techTalk },
  { title: questionBank, route: topicJourneyRoutes.questionBank },
  { title: assignment, route: topicJourneyRoutes.assignment }
]
/**
* This creates a nav bar on top of different pages.
* @param {Object} props
* @returns {React.ReactElement}
*/
class TopicJourneyNavBar extends React.Component {
  static propTypes = {
    // Required for the routing functionality
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    }).isRequired,
    // activeItem indicates what page should be active at a time
    activeItem: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      activeNavItem: this.props.activeItem || learningObjectives,

    }
    this.activeTab = this.activeTab.bind(this)
  }
   activeTab = (navItem, id) => {
     if (this.state.activeNavItem === navItem.title) { return }
     this.setState({
       activeNavItem: navItem.title,
     })
     this.props.history.push(`${navItem.route}/${id}`)
   }
   render() {
     /** Hdiv is a styled div which gives the navbar titles some styling */
     const { id } = this.props.match.params
     const { Hdiv } = StyledNavbar
     return (
       <StyledNavbar>
         {navItems.map(
          (navItem) =>
            <Hdiv
              isActive={this.state.activeNavItem === navItem.title}
              onClick={() => this.activeTab(navItem, id)}
              key={navItem.title}
            >
              {navItem.title}
            </Hdiv>
        )}
       </StyledNavbar>
     )
   }
}
export default TopicJourneyNavBar
