import React from 'react'
import SideNav from './SideNav'
import Screen from './withMentorDashboardNav.style'
import dimensions from '../../constants/dimensions'

const getLoginType = (props) => {
  // this will be helpful to show the showUMSAndSMS pages but will render the
  // sidenav based on the sms or ums value retrived from the url
  const loginType = props.history.location.pathname.split('/')[1]
  return loginType
}
const withUpdatedNav = WrappedComponent =>
  ({ title, activeNavItem, noPadding, hideSideNavItems,
  }) => props => {
    const [isMobileSidebarOpened, setIsMobileSidebarOpened] = React.useState(false)
    return (
      <Screen>
        <SideNav width={dimensions.updatedSideNavWidth}
          isMobileSidebarOpened={isMobileSidebarOpened}
          toggleMobileSidebarOpened={() =>
            setIsMobileSidebarOpened(!isMobileSidebarOpened)
          }
          activeNavItem={activeNavItem}
          title={title}
          hideSideNavItems={hideSideNavItems}
          loginType={getLoginType(props)}
        />
        <Screen.SideWrapper sideNavWidth={dimensions.updatedSideNavWidth}>
          {/* getting the login type which will help to render the header menu to show
            sms, or ums menu options */}
          <Screen.Main noPadding={noPadding}>
            <Screen.HambugerMenu onClick={() => {
              setIsMobileSidebarOpened(!isMobileSidebarOpened)
            }}
            >
              <div /> <div /> <div />
            </Screen.HambugerMenu>
            <WrappedComponent
              {...props}
              headerHeight={dimensions.headerHeight}
              sideNavWidth={dimensions.updatedSideNavWidth}
            />
          </Screen.Main>
        </Screen.SideWrapper>
      </Screen>
    )
  }

export default withUpdatedNav
