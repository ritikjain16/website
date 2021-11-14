import React from 'react'
import StyledText from './codeTagParser.style'

export default (statement) => {
  const styles = {
    fontFamily: 'Nunito',
    fontSize: '14px',
    fontStyle: 'normal',
    color: '#504f4f',
    lineHeight: 1.4
  }
  const statementArr = (statement) ? statement.split('<code>') : []
  return statementArr.map((textval, index) => {
    if (index % 2 === 0) {
      return (
        <StyledText>{textval}</StyledText>
      )
    }

    if (textval.indexOf('<bold>') !== -1) {
      const boldText = textval.replace(/<bold>/g, '')
      return (
        <StyledText.BoldText>{boldText}</StyledText.BoldText>
      )
    } else if (textval.indexOf('<block>') !== -1) {
      const boldText = textval.replace(/<block>/g, '')
      return (
        <StyledText.BlockText>{boldText}</StyledText.BlockText>
      )
    }

    return <StyledText style={styles}>{textval}</StyledText>
  })
}

