import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'
import { message } from 'antd'
import { parse, toSrtTime } from 'subtitle'
import Main from './SubtitleDropzone.style'

const SubtitleDropzone = props => {
  const [subtitleText, setsubtitleText] = useState('')
  const { parentState, setParentState, videoPlayer } = props
  const { shouldSubtitle, subtitleLink } = parentState
  const subtitleUlRef = useRef()
  const subtitleWrapperRef = useRef()
  const {
    setShouldSubtitle,
    setShouldUploadSubtitleFile,
    setSubtitleLink,
    setShouldDeleteSubtitleFile
  } = setParentState
  const onDrop = async acceptedFiles => {
    subtitleWrapperRef.current.style.overflow = 'auto'
    if (acceptedFiles[0]) {
      setSubtitleLink(URL.createObjectURL(acceptedFiles[0]))
      setShouldUploadSubtitleFile(true)
      setShouldSubtitle(true)
      setShouldDeleteSubtitleFile(true)
      props.onSubtitleDrop(acceptedFiles[0])
    }
  }

  const highlightSubtitleDOM = i => {
    subtitleUlRef.current.children[i].children[0].children[0].style.color = 'Blue'
    subtitleUlRef.current.children[i].children[0].children[1].style.color = 'Blue'
    subtitleUlRef.current.children[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  const unHighlightSubtitleDOM = i => {
    subtitleUlRef.current.children[i].children[0].children[0].style.color = ''
    subtitleUlRef.current.children[i].children[0].children[1].style.color = ''
  }

  const playVideoAtTime = time => {
    const timeInSec = time / 1000
    for (let i = 0; i < subtitleUlRef.current.children.length;) {
      if (time === subtitleUlRef.current.children[i].attributes.startTime.value) {
        highlightSubtitleDOM(i)
      } else {
        unHighlightSubtitleDOM(i)
      }
      i += 1
    }
    videoPlayer.seek(timeInSec)
    videoPlayer.play()
  }
  // code to highlight subtitle in subtitle box
  const handleVideoStateChange = state => {
    if (state.paused === false &&
        subtitleUlRef &&
        subtitleUlRef.current &&
        subtitleUlRef.current.children) {
      for (let i = 0; i < subtitleUlRef.current.children.length;) {
        if (
          state.currentTime * 1000 > subtitleUlRef.current.children[i].attributes.starttime.value &&
          state.currentTime * 1000 < subtitleUlRef.current.children[i].attributes.endtime.value
        ) {
          highlightSubtitleDOM(i)
        } else {
          unHighlightSubtitleDOM(i)
        }
        i += 1
      }
    }
  }
  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.subscribeToStateChange(handleVideoStateChange.bind())
    }
  }, [videoPlayer])

  useEffect(() => {
    if (subtitleLink) {
      Axios.get(subtitleLink).then(res => {
        try {
          const dataMs = parse(res.data)
          if (dataMs) {
            const subtitleBox = dataMs.map(subtitle => (
              <li starttime={subtitle.start} endtime={subtitle.end} key={subtitle.start}>
                <Main.SubtitleTextButton
                  onClick={() => {
                    playVideoAtTime(subtitle.start)
                  }}
                >
                  <Main.SubtitleTimeSpan>
                    {toSrtTime(subtitle.start).substring(0, toSrtTime(subtitle.start).indexOf(','))}{' '}
                  </Main.SubtitleTimeSpan>
                  <Main.SubtitleTextSpan>{subtitle.text}</Main.SubtitleTextSpan>
                </Main.SubtitleTextButton>
              </li>
            ))
            setsubtitleText(subtitleBox)
          }
        } catch (error) {
          message.error('Something is wrong with subtitle file')
          setSubtitleLink('')
          setShouldUploadSubtitleFile(false)
          setShouldSubtitle(false)
          setShouldDeleteSubtitleFile(false)
        }
      })
      subtitleWrapperRef.current.style.overflow = 'auto'
    }
  }, [shouldSubtitle])

  return (
    <Main>
      <Main.SubtitleWrapper innerRef={subtitleWrapperRef}>
        {shouldSubtitle ? (
          <Main.Pre>
            <Main.SubtitleUl innerRef={subtitleUlRef}>{subtitleText}</Main.SubtitleUl>
          </Main.Pre>
        ) : (
          <Main.Dropzone
            activeClassName='active'
            accept='.srt'
            onDrop={onDrop}
            disabled={shouldSubtitle}
          >
            <Main.UploadContainer>
              <Main.UploadIcon type='file' />
              <Main.UploadText>Click or drag to attach</Main.UploadText>
            </Main.UploadContainer>
          </Main.Dropzone>
        )}
      </Main.SubtitleWrapper>
    </Main>
  )
}
SubtitleDropzone.defaultProps = {
  videoPlayer: null
}
SubtitleDropzone.propTypes = {
  onSubtitleDrop: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired,
  videoPlayer: PropTypes.shape({})
}

export default SubtitleDropzone
