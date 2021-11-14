import React, { Component } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { get, sortBy } from 'lodash'
import Nav from './SideNav.style'
import NavItem from './components/NavItem'
import getFullPath from '../../../utils/getFullPath'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import fetchUsers from '../../../actions/ums/fetchUsers'
import fetchUserProfile from '../../../actions/userProfile/fetchUserProfile'
import nameFormat from '../../../utils/name-to-alphabet'
import { ADMIN, MENTOR, SALES_EXECUTIVE, UMS_ADMIN, UMS_VIEWER } from '../../../constants/roles'
import fetchMentorForSalesExec from '../../../actions/sessions/fetchMentorForSales'
// import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'

const ExpandSvg = () => (
  <svg width='.6em' height='.6em' viewBox='0 0 10 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M1.19329 8.52671C1.13081 8.58868 1.08121 8.66242 1.04737 8.74366C1.01352 8.8249 0.996094 8.91203 0.996094 9.00004C0.996094 9.08805 1.01352 9.17519 1.04737 9.25643C1.08121 9.33766 1.13081 9.4114 1.19329 9.47337L4.52663 12.8067C4.5886 12.8692 4.66234 12.9188 4.74357 12.9526C4.82481 12.9865 4.91195 13.0039 4.99996 13.0039C5.08797 13.0039 5.1751 12.9865 5.25634 12.9526C5.33758 12.9188 5.41132 12.8692 5.47329 12.8067L8.80663 9.47337C8.86911 9.4114 8.91871 9.33766 8.95255 9.25643C8.9864 9.17519 9.00383 9.08805 9.00383 9.00004C9.00383 8.91203 8.9864 8.8249 8.95255 8.74366C8.91871 8.66242 8.86911 8.58868 8.80663 8.52671C8.74465 8.46422 8.67092 8.41463 8.58968 8.38078C8.50844 8.34693 8.4213 8.32951 8.33329 8.32951C8.24529 8.32951 8.15815 8.34693 8.07691 8.38078C7.99567 8.41463 7.92194 8.46422 7.85996 8.52671L4.99996 11.3934L2.13996 8.52671C2.07798 8.46422 2.00425 8.41463 1.92301 8.38078C1.84177 8.34693 1.75463 8.32951 1.66663 8.32951C1.57862 8.32951 1.49148 8.34693 1.41024 8.38078C1.329 8.41463 1.25527 8.46422 1.19329 8.52671ZM4.52663 1.19337L1.19329 4.52671C1.13113 4.58887 1.08183 4.66266 1.04819 4.74387C1.01455 4.82509 0.997231 4.91213 0.997231 5.00004C0.997231 5.17758 1.06776 5.34784 1.19329 5.47337C1.25545 5.53553 1.32925 5.58484 1.41046 5.61848C1.49167 5.65212 1.57872 5.66943 1.66663 5.66943C1.84416 5.66943 2.01442 5.59891 2.13996 5.47337L4.99996 2.60671L7.85996 5.47337C7.92194 5.53586 7.99567 5.58546 8.07691 5.6193C8.15815 5.65315 8.24529 5.67057 8.33329 5.67057C8.4213 5.67057 8.50844 5.65315 8.58968 5.6193C8.67092 5.58546 8.74465 5.53586 8.80663 5.47337C8.86911 5.4114 8.91871 5.33766 8.95255 5.25642C8.9864 5.17519 9.00383 5.08805 9.00383 5.00004C9.00383 4.91203 8.9864 4.8249 8.95255 4.74366C8.91871 4.66242 8.86911 4.58868 8.80663 4.52671L5.47329 1.19337C5.41132 1.13089 5.33758 1.08129 5.25634 1.04745C5.1751 1.0136 5.08797 0.996175 4.99996 0.996175C4.91195 0.996175 4.82481 1.0136 4.74357 1.04745C4.66234 1.08129 4.5886 1.13089 4.52663 1.19337Z' fill='#A0B4BC' />
  </svg>
)

const navItems = [
  { iconType: 'calendar', title: 'Calendar', route: '/mentorDashboard' },
  { iconType: 'classes', title: 'Classes', comingSoon: true },
  { iconType: 'students', title: 'Students', comingSoon: true },
  { iconType: 'course', title: 'Course', comingSoon: true },
  { iconType: 'earnings', title: 'Earnings', comingSoon: true },
  { iconType: 'settings', title: 'Settings', comingSoon: true },
  { iconType: 'contactUs', title: 'Contact Us', comingSoon: true },
]

const navItemsTitle = navItems.map((navItem) => navItem.title)

/**
 * Responsible for rendering SideNav
 */
class SideNav extends Component {
  static propTypes = {
    /** history prop by react-router */
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    /** location prop by react-router */
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    /** decides width for the component */
    width: PropTypes.string.isRequired,
    loginType: PropTypes.string.isRequired,
    /**
     * decides which item should be active
     * (title of the item is passed prop to decide active item)
     * */
    activeNavItem: PropTypes.oneOf(navItemsTitle).isRequired,
    /** User's Name */
    name: PropTypes.string.isRequired,
    /** If user has login or not? */
    hasLogin: PropTypes.bool.isRequired,
    role: PropTypes.string.isRequired,
  }

  state = {
    userProfile: null,
    selectedMentor: { id: 'all', name: 'All Mentors' },
    isAdminLoggedIn: false,
    isDropDownOpen: false,
    salesMentors: null
  }

  SelectRef = React.createRef()

  async componentDidMount() {
    const savedRole = getDataFromLocalStorage('login.role')
    const userProfile = get(this.props, 'userProfile')
    if (userProfile) {
      this.setState({
        userProfile: userProfile.toJS(),
      })
    }
    const isAdmin = savedRole === ADMIN || savedRole === UMS_ADMIN
      || savedRole === UMS_VIEWER || savedRole === SALES_EXECUTIVE
    this.setState({
      isAdminLoggedIn: isAdmin
    })
    if (savedRole && savedRole === SALES_EXECUTIVE) {
      const salesExecutiveId = getDataFromLocalStorage('login.id')
      await fetchMentorForSalesExec(salesExecutiveId).then(res => {
        const mentors = res.user.salesExecutiveProfile.mentors.map(({ user }) => user)
        const { mentorId } = this.props.match.params
        if (mentorId && mentors) {
          const profile = mentors.filter(user => user.id === mentorId)
          if (profile && profile.length) {
            this.setState({
              selectedMentor: { id: get(profile[0], 'id'), name: get(profile[0], 'name') }
            })
          }
        }
        this.setState({
          salesMentors: mentors,
        })
      })
    } else if (isAdmin) {
      fetchUsers({ role: MENTOR }).then(res => {
        const { mentorId } = this.props.match.params
        if (mentorId && res && res.users) {
          const profile = res.users.filter(user => user.id === mentorId)
          if (profile && profile.length) {
            this.setState({
              selectedMentor: { id: get(profile[0], 'id'), name: get(profile[0], 'name') }
            })
          }
        }
      })
    }
    if (this.state.userProfile === null) {
      fetchUserProfile()
    }
  }
  componentDidUpdate(prevProps) {
    const prevUserProfile = get(prevProps, 'userProfile')
    const userProfile = get(this.props, 'userProfile')
    if (prevUserProfile !== userProfile) {
      this.setState({
        userProfile: userProfile.toJS(),
      })
    }
  }

  renderLogo = () => (
    <Nav.LogoContainer to='/' >
      <img src='/images/tekieLogo.png' alt='tekie logo' />
    </Nav.LogoContainer>
  )

  calculateMentorRating = () => {
    let ratingNum = 0
    let ratingDen = 0
    const mentorInfo = get(this.state, 'userProfile[0].mentorProfile') ?
      get(this.state, 'userProfile[0].mentorProfile') : {}
    Object.keys(mentorInfo).forEach((key) => {
      if (key.includes('pythonCourseRating') && mentorInfo[key] > 0) {
        const ratingValue = key.split('pythonCourseRating')[1]
        ratingNum += ratingValue * mentorInfo[key]
        ratingDen += mentorInfo[key]
      }
    })
    if (ratingNum > 0 && ratingDen > 0) {
      return (ratingNum / ratingDen).toFixed(2)
    }
    return 'NA'
  }

  handleMenuClick = (value) => {
    const key = value && value.split('-')
    this.setState({
      selectedMentor: { id: key[0], name: key[1] }
    })
    if (key[0] === 'all') {
      this.props.history.push('/mentorDashboard')
    } else {
      this.props.history.push(`/mentorDashboard/${key[0]}`)
    }
  }

  render() {
    const { name, username } = this.props
    const { selectedMentor, isAdminLoggedIn } = this.state
    const loggedInUser = name || username || ''
    // const blockName = localStorage.getItem('block')
    const savedRole = getDataFromLocalStorage('login.role')

    let mentors_ = []
    if (savedRole && savedRole === SALES_EXECUTIVE) {
      if (this.state.salesMentors) {
        mentors_ = sortBy(this.state.salesMentors, ['name'])
        mentors_.splice(0, 0, { id: 'all', name: 'All Mentors' })
      }
    } else if (isAdminLoggedIn) {
      const { mentors } = this.props
      if (mentors && mentors.toJS()) {
        mentors_ = mentors.toJS()
        mentors_ = sortBy(mentors_, ['name'])
        mentors_.splice(0, 0, { id: 'all', name: 'All Mentors' })
      }
    }
    if (this.props.hideSideNavItems) {
      return (
        <Nav width={this.props.width}>
          {this.renderLogo()}
        </Nav>
      )
    }
    const Options = (
      mentors_.map(mentor => (
        <Select.Option
          value={`${mentor.id}-${mentor.name}`}
          style={{
            fontFamily: 'Inter',
            letterSpacing: 0.3,
            color: `${selectedMentor.id === mentor.id ? '#8C61CB' : ''}`,
            background: `${selectedMentor.id === mentor.id ? '#FAF7FF' : ''}`
          }}
        >
          {mentor.name}
        </Select.Option>
      ))
    )

    const { toggleMobileSidebarOpened, isMobileSidebarOpened } = this.props
    return (
      <>
        <Nav.Backdrop
          isMobileSidebarOpened={isMobileSidebarOpened}
          onClick={toggleMobileSidebarOpened}
        />
        <Nav width={this.props.width} isMobileSidebarOpened={isMobileSidebarOpened}>
          {this.renderLogo()}
          <Nav.ProfileContainer
            onClick={() => {
              if (isAdminLoggedIn) {
                if (this.SelectRef && this.SelectRef.current && this.SelectRef.current.rcSelect) {
                  this.SelectRef.current.rcSelect.setOpenState(!this.state.isDropDownOpen)
                  this.setState({
                    isDropDownOpen: !this.state.isDropDownOpen
                  })
                }
              }
            }}
            isAdminLoggedIn={isAdminLoggedIn}
          >
            <Nav.FlexContainer justifyContent='flex-start'>
              <Nav.UserImage bgImage={this.state.userProfile ? getFullPath(get(this.state, 'userProfile[0].profilePic.uri')) : ''}>
                {isAdminLoggedIn ? nameFormat(get(selectedMentor, 'name', 'AllMentors')) : nameFormat(loggedInUser)}
              </Nav.UserImage>
              <Nav.UserDetails title={loggedInUser.length > 15 && loggedInUser}>
                {isAdminLoggedIn ? get(selectedMentor, 'name', 'All Mentors') : loggedInUser}
                <Nav.MentorRating>
                  <span>&#9733;</span>
                  {this.calculateMentorRating()}
                </Nav.MentorRating>
              </Nav.UserDetails>
            </Nav.FlexContainer>
            <Nav.Icon type='ExpandIcon' theme='twoTone' component={ExpandSvg} />
          </Nav.ProfileContainer>
          {isAdminLoggedIn && (
            <Nav.Select
              showArrow={false}
              refObj={this.SelectRef}
              style={{ width: '100%' }}
              showSearch
              value='Search for Mentor'
              placeholder='Select a mentor'
              onChange={this.handleMenuClick}
            >
              {Options}
            </Nav.Select>
          )}
          {navItems.map((navItem) => (
            <NavItem
              toggleMobileSidebarOpened={toggleMobileSidebarOpened}
              {...navItem}
              key={navItem.title}
              isActive={navItem.title === this.props.activeNavItem}
            />
          ))}
          <Nav.Divider />
          {/* <div style={{ padding: '12px 0px' }}>
            <Nav.TextMuted>Upcoming classes</Nav.TextMuted>
            <Nav.NoClassesImage />
            <Nav.NoClasses>No upcoming classes</Nav.NoClasses>
          </div> */}
        </Nav>
      </>
    )
  }
}

export default SideNav
