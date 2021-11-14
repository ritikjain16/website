import React from 'react'
import styled from 'styled-components'
import { Icon, Input } from 'antd'
import colors from '../../../../../../constants/colors'
import { Button } from '../../../../../../components/StyledComponents'
import resetButtonStyle from '../../../../../../utils/mixins/resetButtonStyle'

const Screen = styled.div`
  width: 100%;
  height:auto;
  display:flex;
  flex-direction:column;
  background-color:${colors.loPage.tableBg};
  padding-top:4em;
  background: #E8E8E8;
`

const StyledButton = styled(Button)`
  &&& {
    border-radius: 3px;
    width: 2em;
    padding: 0.25em 0;
    margin-top: 1em;
    margin-left: 0.5em;
    margin-right: 1em;
    margin-bottom: 1em;
    background-color: #e99a54 !important;
    &:disabled {
      color: ${colors.video.disable.color};
      border-color: ${colors.video.disable.color};
      background-color: ${colors.video.disable.background};
    }
    color: white;
  }
`
const StyledInput = styled(Input)`
  &&& {
    /* resets input style */
    border: 0;
    outline: 0;
    box-shadow: none;
    border-radius: 0;
    padding: 12px;
    /* resets input style */
    max-width: 110px;
    border-bottom: 2px solid ${colors.input.theme};
    padding-bottom: 6px;
    margin-right: 6px;
    font-weight: 500;
    &::placeholder {
      color: ${colors.input.theme};
    }

    &:focus {
      border-bottom-color: ${colors.themeColor};
      color: ${colors.themeColor};
      box-shadow: none;
      &::placeholder {
        color: ${colors.themeColor};
      }
    }
  }
`
const LOErrorDiv = styled.div`
   min-height: 50px;
   display: flex;
   justify-content: center;
   line-height: 84px;
   font-size: 20px;
`
const TimeDiv = styled.div`
    display: flex;
    justify-content: center;
`

const TimeInnerDiv = styled.div`
    width: 8em;
    padding: 0.25em 0;
    margin-top: 1em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
`

const ActionsIconWrapper = styled.button`
  ${resetButtonStyle};
  cursor: pointer;
  i {
    opacity: 1;
  }
  &:hover i, &:focus i {
    opacity: 0.6;
  }
`

const ActionsEditIcon = styled(props => <Icon {...props} type='upload' />)`
  font-size: 21px;
  color: ${colors.table.editIcon};
`

Screen.Button = StyledButton
Screen.Input = StyledInput
Screen.LOErrorDiv = LOErrorDiv
Screen.TimeDiv = TimeDiv
Screen.TimeInnerDiv = TimeInnerDiv
Screen.ActionsEditIcon = ActionsEditIcon
Screen.ActionsIconWrapper = ActionsIconWrapper

export default Screen
