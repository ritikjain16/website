import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Arrange from './Arrange.style'
import codeTagParser from '../../../../../utils/CodeTagParser'


const ArrangeBody = ({ emulatorViewData, showAnswers }) => {
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
  const terminalStyles = {
    height: '100%',
    width: '100%',
    margin: 0,
    paddingRight: 30,
    paddingLeft: 16,
    backgroundColor: '#002f3e',
    borderColor: '#aaacae',
    borderWidth: 1,
    borderStyle: 'solid'
  }
  const { statement, questionCodeSnippet, arrangeOptions } = emulatorViewData

  const getArrangeOptionsCorrectOrder = () => {
    const arrangeOptionsCorrectOrder = []
    for (let order = 1; order <= arrangeOptions.length; order += 1) {
      for (let index = 0; index < arrangeOptions.length; index += 1) {
        if (arrangeOptions[index].correctPosition === order) {
          arrangeOptionsCorrectOrder.push(arrangeOptions[index])
          break
        }
      }
    }
    return arrangeOptionsCorrectOrder
  }

  const renderArrangeOptions = (options) => options.map((option) => (
    <Arrange.Option>
      {get(option, 'statement') && (
        <SyntaxHighlighter
          language='python'
          style={darcula}
          fontSize={14}
          codeTagProps={{ style: { fontFamily: 'monaco' } }}
          fontFamily='Monaco'
          customStyle={terminalStyles}
        >
          {option.statement}
        </SyntaxHighlighter>
      )}
    </Arrange.Option>
  ))

  return (
    <Arrange>
      <Arrange.Question>
        {codeTagParser(statement)}
      </Arrange.Question>
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
      {!showAnswers ? renderArrangeOptions(arrangeOptions) :
          renderArrangeOptions(getArrangeOptionsCorrectOrder())}
    </Arrange>
  )
}

ArrangeBody.propTypes = {
  emulatorViewData: PropTypes.shape({}).isRequired,
  showAnswers: PropTypes.bool.isRequired
}

export default ArrangeBody
