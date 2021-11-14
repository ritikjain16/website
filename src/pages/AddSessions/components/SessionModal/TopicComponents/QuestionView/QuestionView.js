import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons'
import { get, sortBy } from 'lodash'
import React, { useState } from 'react'
import ArrangeBlock from './ArrangeBlock'
import FibBlock from './FibBlock'
import FibInput from './FibInput'
import Mcq from './Mcq'
import {
  QuestionContainer, SliderContainer
} from './QuestionView.styles'

const QuestionView = (props) => {
  const [activeIndex, setActiveIndex] = useState(0)
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

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = get(props, 'questions', []).length - 1
    } else if (newIndex >= get(props, 'questions', []).length) {
      newIndex = 0
    }
    setActiveIndex(newIndex)
  }

  const renderQuestions = (question, i) => {
    if (i === activeIndex) {
      if (get(question, 'questionType') === 'mcq') {
        return <Mcq question={question} inputCodeStyles={inputCodeStyles} />
      }
      if (get(question, 'questionType') === 'fibInput') {
        return <FibInput question={question} inputCodeStyles={inputCodeStyles} />
      }
      if (get(question, 'questionType') === 'fibBlock') {
        return <FibBlock question={question} inputCodeStyles={inputCodeStyles} />
      }
      if (get(question, 'questionType') === 'arrange') {
        return <ArrangeBlock question={question} inputCodeStyles={inputCodeStyles} />
      }
    }
  }
  return (
    <QuestionContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CaretLeftFilled style={{ marginRight: '10px' }} onClick={() => updateIndex(activeIndex - 1)} />
        <h3>{activeIndex + 1} <span style={{ opacity: '0.7' }}>of</span> {get(props, 'questions', []).length}</h3>
        <CaretRightFilled onClick={() => updateIndex(activeIndex + 1)} />
      </div>
      <SliderContainer>
        {sortBy(get(props, 'questions', []), 'order').map(renderQuestions)}
      </SliderContainer>
    </QuestionContainer>
  )
}

export default QuestionView
