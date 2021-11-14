import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledFooter from './Footer.style'
import parseChatStatement from '../../../../../utils/parseStatement'

const Footer = (props) => {
  const { hint, explanation } = props.emulatorViewData
  const [showHelpOption, setShowHelpOption] = useState(false)

  const toggleOptionSelected = () => {
    if (showHelpOption) {
      setShowHelpOption(false)
    } else {
      setShowHelpOption(true)
    }
  }

  const showHelp = () => {
    props.emulatorViewHint(true)
    setShowHelpOption(true)
  }
  const hideHelp = () => {
    props.emulatorViewHint(false)
  }

  const showAnswer = () => {
    props.emulatorViewAnswers(true)
  }
  const hideAnswer = () => {
    props.emulatorViewAnswers(false)
  }

  const getQuestionIdFromOrder = (questionOrder) => {
    const questionIds = Object.keys(props.questionOrderIdMap)
    let questionId = ''
    for (let index = 0; index < questionIds.length; index += 1) {
      if (props.questionOrderIdMap[questionIds[index]] === questionOrder) {
        questionId = questionIds[index]
      }
    }
    return questionId
  }

  const showHintExplanationSection = () => {
    if (showHelpOption) {
      return (
        <StyledFooter.HelpExplanationOptionSection>
          <StyledFooter.Options showBorder highlightOption onClick={() => toggleOptionSelected()}>
                      Help
          </StyledFooter.Options>
          <StyledFooter.Options activateHover onClick={() => toggleOptionSelected()}>
                      Explanation
          </StyledFooter.Options>
        </StyledFooter.HelpExplanationOptionSection>
      )
    }
    return (
      <StyledFooter.HelpExplanationOptionSection>
        <StyledFooter.Options activateHover onClick={() => toggleOptionSelected()}>
                Help
        </StyledFooter.Options>
        <StyledFooter.Options showBorder highlightOption onClick={() => toggleOptionSelected()}>
                Explanation
        </StyledFooter.Options>
      </StyledFooter.HelpExplanationOptionSection>
    )
  }

  const RenderHelp = () => (
    <StyledFooter showHelp>
      {showHintExplanationSection()}
      <StyledFooter.HelpSection>
        {showHelpOption ? parseChatStatement({ statement: hint || '' })
          : parseChatStatement({ statement: explanation || '' })}
      </StyledFooter.HelpSection>
      <StyledFooter.ButtonSection>
        <StyledFooter.HelpButton onClick={() => hideHelp()} showHelp>
          Help!
        </StyledFooter.HelpButton>
        <StyledFooter.CheckButton showHelp onClick={() => showAnswer()}>
          Show Answer
        </StyledFooter.CheckButton>
      </StyledFooter.ButtonSection>
    </StyledFooter>
  )

  const RenderNumbers = () => {
    const arr = []
    for (let i = 1; i <= (props.emulatorViewQuestions).length; i += 1) {
      arr.push(i)
    }
    return arr.map((val, index) => (index !== props.questionOrderIdMap[props.questionId] - 1) ?
      <StyledFooter.NumberText onClick={
          () => props.openEmulatorView(getQuestionIdFromOrder(val))
        }
      >
        {val}
      </StyledFooter.NumberText> :
      <StyledFooter.Number style={{ color: '#00ade6' }}>
        <StyledFooter.NumberText>{val}</StyledFooter.NumberText>
        <StyledFooter.Underline />
      </StyledFooter.Number>)
  }
  const RenderAnswer = () => (
    <StyledFooter>
      <StyledFooter.NumberSection>{RenderNumbers()}</StyledFooter.NumberSection>
      <StyledFooter.ButtonSection>
        <StyledFooter.HelpButton showAnswer onClick={() => showHelp()}>
          Help!
        </StyledFooter.HelpButton>
        <StyledFooter.CheckButton showAnswer onClick={() => hideAnswer()}>
            Hide Answer
        </StyledFooter.CheckButton>
      </StyledFooter.ButtonSection>
    </StyledFooter>
  )

  const RenderHelpAnswer = () => (
    <StyledFooter showHelp>
      {showHintExplanationSection()}
      <StyledFooter.HelpSection>
        {showHelpOption ? parseChatStatement({ statement: hint || '' })
          : parseChatStatement({ statement: explanation || '' })}
      </StyledFooter.HelpSection>
      <StyledFooter.ButtonSection>
        <StyledFooter.HelpButton showHelp onClick={() => hideHelp()}>
            Help!
        </StyledFooter.HelpButton>
        <StyledFooter.CheckButton showAnswer onClick={() => hideAnswer()}>
            Hide Answer
        </StyledFooter.CheckButton>
      </StyledFooter.ButtonSection>
    </StyledFooter>
  )

  if (props.showHint && props.showAnswers && !props.cancelClicked) {
    return RenderHelpAnswer()
  }

  if (props.showHint && !props.cancelClicked) {
    return RenderHelp()
  }

  if (props.showAnswers && !props.cancelClicked) {
    return RenderAnswer()
  }

  return (
    <StyledFooter>
      <StyledFooter.NumberSection>{RenderNumbers()}</StyledFooter.NumberSection>
      <StyledFooter.ButtonSection>
        <StyledFooter.HelpButton onClick={() => showHelp()}>Help!</StyledFooter.HelpButton>
        <StyledFooter.CheckButton onClick={() => showAnswer()}>
          Check Answer
        </StyledFooter.CheckButton>
      </StyledFooter.ButtonSection>
    </StyledFooter>
  )
}
Footer.propTypes = {
  emulatorViewQuestions: PropTypes.shape({}),
  questionOrderIdMap: PropTypes.shape({}),
  questionId: PropTypes.string.isRequired,
  openEmulatorView: PropTypes.func.isRequired,
  emulatorViewData: PropTypes.shape({}),
  cancelClicked: PropTypes.bool.isRequired,
  emulatorViewAnswers: PropTypes.func.isRequired,
  emulatorViewHint: PropTypes.func.isRequired,
  showHint: PropTypes.bool.isRequired,
  showAnswers: PropTypes.bool.isRequired
}
Footer.defaultProps = {
  emulatorViewQuestions: {},
  questionOrderIdMap: {},
  emulatorViewData: {}
}

export default Footer
