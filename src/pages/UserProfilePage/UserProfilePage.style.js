import styled from 'styled-components'
import { Button } from 'antd'

const UserProfilePage = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 12px 24px 24px 24px;
`
const Title = styled.p`
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 32px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.34;
  letter-spacing: normal;
  color: #000000;
  margin-bottom: 10px;
  margin-top: 24px;
`

const Card = styled.div`
  background-color: #ffffff;
  box-shadow: 4px 5px 10px 0 rgba(46,61,73,.15);
  border-radius: 4px;
  padding: 20px;
`

const SubTitle = styled.p`
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #7f7f7f;  
  padding: 5px 10px;
`

const Content = styled.p`
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 100;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: right;
  color: #188af3;
  padding: 5px 10px;
`

const Vl = styled.div`
  width: 70vw;
  height: 1px;
  background-color: #707070;
  margin: 10px 0;
`

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-content: center  
`

const ProfilePicBox = styled(Button)`
  width: 150px;
  height: 150px !important;
  border-radius: 50% !important;
  background-position: center !important;
  background-size: cover !important;
  margin: 0 10px;
`

UserProfilePage.Title = Title
UserProfilePage.Card = Card
UserProfilePage.SubTitle = SubTitle
UserProfilePage.Content = Content
UserProfilePage.Vl = Vl
UserProfilePage.FlexBox = FlexBox
UserProfilePage.ProfilePicBox = ProfilePicBox

export default UserProfilePage
