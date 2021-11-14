import React, { memo } from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import EditApprovedCodeStyle from '../EditApprovedCode.style'

const CodeMetaDetails = ({ title, userSavedCodes, updateApprovedCode, isEditable = true }) => {
  const isPlaceHolderTitle = () => title === 'Title'

  const onInputChange = (value) => {
    if (value !== '' && (isPlaceHolderTitle() && (value !== get(userSavedCodes, 'userApprovedCode.approvedFileName')))
    || (!isPlaceHolderTitle() && (value !== get(userSavedCodes, 'userApprovedCode.approvedDescription')))) {
      const input = {}
      if (title === 'Title') {
        input.approvedFileName = value
      } else if (title === 'Description') {
        input.approvedDescription = value
      }
      updateApprovedCode(get(userSavedCodes, 'userApprovedCode.id'), input)
    }
  }

  const checkIfUserApprovedCodeExists = () => {
    if (get(userSavedCodes, 'userApprovedCode', false)) {
      return true
    }
    return false
  }

  return (
        <>
          <EditApprovedCodeStyle.StyledRow>
            <EditApprovedCodeStyle.StyledCol span={checkIfUserApprovedCodeExists() ? 12 : 24}>
              <EditApprovedCodeStyle.FlexContainer>
                <EditApprovedCodeStyle.TextContainer>
                  <EditApprovedCodeStyle.TextPrimary color='#1d2b37'>
                    {checkIfUserApprovedCodeExists() && 'Previous'} {title} :
                  </EditApprovedCodeStyle.TextPrimary>
                </EditApprovedCodeStyle.TextContainer>
                <EditApprovedCodeStyle.TextSecondary>
                  {isPlaceHolderTitle() ? (
                    get(userSavedCodes, 'title') || '-') : get(userSavedCodes, 'description') || '-' }
                </EditApprovedCodeStyle.TextSecondary>
              </EditApprovedCodeStyle.FlexContainer>
            </EditApprovedCodeStyle.StyledCol>
            {checkIfUserApprovedCodeExists() && (
              <EditApprovedCodeStyle.StyledCol span={12}>
                <EditApprovedCodeStyle.FlexContainer>
                  <EditApprovedCodeStyle.TextContainer>
                    <EditApprovedCodeStyle.TextPrimary color='#1d2b37'>
                              New {title} :
                    </EditApprovedCodeStyle.TextPrimary>
                  </EditApprovedCodeStyle.TextContainer>
                  <EditApprovedCodeStyle.TextSecondary
                    editable={isEditable && { onChange: onInputChange }}
                  >
                    { isPlaceHolderTitle() ? (get(userSavedCodes, 'userApprovedCode.approvedFileName')) : (get(userSavedCodes, 'userApprovedCode.approvedDescription'))}
                  </EditApprovedCodeStyle.TextSecondary>
                </EditApprovedCodeStyle.FlexContainer>
              </EditApprovedCodeStyle.StyledCol>
            )}
          </EditApprovedCodeStyle.StyledRow>
    </>
  )
}

CodeMetaDetails.propTypes = {
  title: PropTypes.string,
  updateApprovedCode: PropTypes.func,
  isEditable: PropTypes.bool,
}


export default memo(CodeMetaDetails)
