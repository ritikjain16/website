import { PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons'
// import { get } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
// import getFullPath from '../../../utils/getFullPath'
import AudioPlayerStyle from './AudioPlayer.style'

/* eslint-disable */

const AudioPlayer = (props) => {
  const { audioSrc } = props
  const [duration, setDuration] = useState()
  const [curTime, setCurTime] = useState()
  const [playing, setPlaying] = useState(false)
  const [clickedTime, setClickedTime] = useState()
  useEffect(() => {
    const audio = document.getElementById('audio')

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurTime(audio.currentTime)
    }
    const setAudioTime = () => setCurTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)

    audio.addEventListener('timeupdate', setAudioTime)
    playing ? audio.play() : audio.pause()
    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime
      setClickedTime(null)
    }
    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  })

  useEffect(() => {
    const audio = document.getElementById('audio')
    audio.setAttribute('src', audioSrc)
    audio.play()
  }, [audioSrc])

  const curPercentage = (curTime / duration) * 100

  const formatDuration = (durationTime) => durationTime ? moment.utc(durationTime * 1000).format("mm:ss") : '00:00'

  const calcClickedTime = (e) => {
    const clickPositionInPage = e.pageX
    const bar = document.querySelector('.bar__progress')
    const barStart = bar.getBoundingClientRect().left + window.scrollX
    const barWidth = bar.offsetWidth
    const clickPositionInBar = clickPositionInPage - barStart
    const timePerPixel = duration / barWidth
    return timePerPixel * clickPositionInBar
  }

  const handleTimeDrag = (e) => {
    setClickedTime(calcClickedTime(e))

    const updateTimeOnMove = eMove => {
      setClickedTime(calcClickedTime(eMove))
    }
    document.addEventListener('mousemove', updateTimeOnMove)

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', updateTimeOnMove)
    })
  }
  return (
    <AudioPlayerStyle>
      <audio id='audio'>
        <source src={audioSrc} type='audio/mp3' />
        Your browser does not support the <code>audio</code> element.
      </audio>
      <AudioPlayerStyle.AudioControls>
        {playing ?
            (
              <AudioPlayerStyle.PlayerButton onClick={() => setPlaying(false)}>
                <PauseCircleFilled />
              </AudioPlayerStyle.PlayerButton>
            ) : (
              <AudioPlayerStyle.PlayerButton onClick={() => setPlaying(true)}>
                <PlayCircleFilled />
              </AudioPlayerStyle.PlayerButton>
            )
        }
        <AudioPlayerStyle.AudioBar>
          <span className='bar__time'>{formatDuration(curTime)}</span>
          <AudioPlayerStyle.AudioBarProgress
            className='bar__progress'
            style={{
              background: `linear-gradient(to right, #ffc1ea ${curPercentage}%, #ddd092 0)`
            }}
            onMouseDown={e => handleTimeDrag(e)}
          >
            <span
              className='bar__progress__knob'
              style={{ left: `${curPercentage - 2}%` }}
            />
          </AudioPlayerStyle.AudioBarProgress>
          <span className='bar__time'>{formatDuration(duration)}</span>
        </AudioPlayerStyle.AudioBar>
      </AudioPlayerStyle.AudioControls>
    </AudioPlayerStyle>
  )
}

export default AudioPlayer
