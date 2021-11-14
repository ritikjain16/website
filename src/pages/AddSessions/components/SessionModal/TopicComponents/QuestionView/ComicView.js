import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons'
import { get, sortBy } from 'lodash'
import React, { useState } from 'react'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import getFullPath from '../../../../../../utils/getFullPath'
import { QuestionContainer, SliderContainer } from './QuestionView.styles'

const ComicView = (props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = get(props, 'comicStrips[0].comicImages', []).length - 1
    } else if (newIndex >= get(props, 'comicStrips[0].comicImages', []).length) {
      newIndex = 0
    }
    setActiveIndex(newIndex)
  }

  const renderQuestions = (image, i) => {
    if (i === activeIndex) {
      return (
        <img
          src={getFullPath(get(image, 'image.uri'))}
          alt='comicImages'
          style={{ width: '100%', objectFit: 'contain' }}
        />
      )
    }
  }
  return (
    <QuestionContainer style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CaretLeftFilled style={{ marginRight: '10px' }} onClick={() => updateIndex(activeIndex - 1)} />
        <h3>{activeIndex + 1} <span style={{ opacity: '0.7' }}>of</span> {get(props, 'comicStrips[0].comicImages', []).length}</h3>
        <CaretRightFilled onClick={() => updateIndex(activeIndex + 1)} />
      </div>
      <h2>
        {CodeTagParser(get(props, 'comicStrips[0].title', '-'))}
      </h2>
      <h3>{get(props, 'comicStrips[0].description', '-')}</h3>
      <SliderContainer>
        {sortBy(get(props, 'comicStrips[0].comicImages', []), 'order').map(renderQuestions)}
      </SliderContainer>
    </QuestionContainer>
  )
}

export default ComicView
