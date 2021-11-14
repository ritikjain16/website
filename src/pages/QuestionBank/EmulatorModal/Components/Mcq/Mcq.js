import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { BlocklyWorkspace } from 'tekie-blockly'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import codeTagParser from '../../../../../utils/CodeTagParser'
import { BLOCKLY } from '../../../../../constants/questionBank'
import { decodeBase64 } from '../../../../../utils/base64Utility'
import { buildCustomToolJSON, DEFAULT_WORKSPACE_CONFIG } from '../../../../../utils/blocklyUtils'
import Mcq from './Mcq.style'

const renderMCQQuestions = (showAnswers, mcqOptions, isBlocklyView = false) => {
  if (mcqOptions) {
    return mcqOptions.map((option) => {
      if (isBlocklyView) {
        return (
          <Mcq.BlocklyItem highlightOptions={showAnswers && option.isCorrect}>
            {buildCustomToolJSON(decodeBase64(get(option, 'blocksJSON'))) && (
              <BlocklyWorkspace
                useDefaultToolbox
                customTools={buildCustomToolJSON(decodeBase64(get(option, 'blocksJSON')))}
                workspaceConfiguration={DEFAULT_WORKSPACE_CONFIG({ readOnly: true })}
                initialXml={decodeBase64(get(option, 'initialXML', null)) || ''}
              />
            )}
          </Mcq.BlocklyItem>
        )
      }
      return (
        <Mcq.Option highlightOptions={showAnswers && option.isCorrect}>
          <Mcq.OptionText highlightOptions={showAnswers && option.isCorrect}>
            {option.statement}
          </Mcq.OptionText>
        </Mcq.Option>
      )
    })
  }
}
const McqBody = ({ emulatorViewData, showAnswers }) => {
  const inputCodeStyles = {
    height: '44px',
    borderRadius: '3px',
    backgroundColor: '#013d4e',
    marginTop: '11px',
    marginBottom: '12px',
    marginHorizontal: 0,
    paddingVertical: '12px',
    paddingHorizontal: 0
  }
  const { statement, questionCodeSnippet, mcqOptions, questionLayoutType } = emulatorViewData
  const isBlocklyView = questionLayoutType === BLOCKLY
  return (
    <Mcq>
      <Mcq.QuestionStatement>
        {codeTagParser(statement)}
      </Mcq.QuestionStatement>
      {questionCodeSnippet && (
      <SyntaxHighlighter
        language='python'
        style={darcula}
        customStyle={inputCodeStyles}
        codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
        fontSize={16}
        fontFamily='Monaco'
        highlighter='prism'
      >
          {decodeURIComponent(emulatorViewData.questionCodeSnippet)}
      </SyntaxHighlighter>
      )}
      {isBlocklyView ? (
        <Mcq.BlocklyContainer>
          {renderMCQQuestions(showAnswers, mcqOptions, isBlocklyView)}
        </Mcq.BlocklyContainer>
      ) : renderMCQQuestions(showAnswers, mcqOptions)}
    </Mcq>
  )
}

McqBody.propTypes = {
  emulatorViewData: PropTypes.shape({}).isRequired,
  showAnswers: PropTypes.bool.isRequired
}

export default McqBody
