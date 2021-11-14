import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { message, Popconfirm } from 'antd'
import LearningObjectiveTable from './components/LearningObjectiveTable'
import Main from './LearningObjective.style'

const LO = ({
  videoPlayer,
  isLOPresent,
  isFetching,
  shouldVideo,
  openEditLOVideoThumbnail,
  openEditStoryVideoThumbnail,
  ...props }) => {
  const topicId = props.match.params.id
  const { loFetchError, loEditError } = props
  const [messageLO, setMessageLO] = useState('')
  const [isMessageLO, setIsMessageLO] = useState(true)
  const lOTimeDiv = useRef()

  const fetchMessageInLO = () => {
    setIsMessageLO(true)
    if (!props.learningObjectives ||
      (props.learningObjectives && props.learningObjectives.length === 0)) {
      setMessageLO('No learning objective is present')
      setIsMessageLO(false)
    }
    if (!shouldVideo) {
      setMessageLO('No video is present')
      setIsMessageLO(false)
    }
    if (!shouldVideo && !isLOPresent) {
      setMessageLO('No video and learning objective is present')
      setIsMessageLO(false)
    }
  }
  useEffect(() => {
    fetchMessageInLO()
  }, [isLOPresent, shouldVideo])

  useEffect(() => {
    fetchMessageInLO()
  }, props.learningObjectives)

  useEffect(() => {
    if (loFetchError !== null) {
      message.error(loFetchError)
    }
  }, [loFetchError])

  useEffect(() => {
    if (loEditError !== null) {
      message.error(loEditError)
    }
  }, [loEditError])

  const clearTimeStamp = async () => {
    // initiating endTime and startTime in DOM to 0
    const list = lOTimeDiv.current.getElementsByClassName('time')
    if (list && list.length) {
      for (let i = 0; i < list.length;) {
        list[i].firstChild.value = 0
        list[i].nextSibling.innerHTML =
            '(00:00)'
        i += 1
      }
    }

    // initiating endTime and startTime in props to 0
    if (props.learningObjectives && props.learningObjectives.length) {
      for (let i = 0; i < props.learningObjectives.length;) {
        props.learningObjectives[i].videoStartTime = 0
        props.learningObjectives[i].videoEndTime = 0
        i += 1
      }
    }
  }

  const onUpload = async () => {
    let topicValidation = true
    let validation = true
    const input = []
    const topicInput = {}
    if (props.learningObjectives && props.learningObjectives.length) {
      // let success = 0
      for (let j = 0; j < props.learningObjectives.length;) {
        const obj = {}
        const currentLo = props.learningObjectives[j]
        if (currentLo.videoStartTime === null) {
          currentLo.videoStartTime = 0
        }
        if (currentLo.videoEndTime === null) {
          currentLo.videoEndTime = 0
        }
        obj.id = currentLo.id
        obj.fields = {}
        obj.fields.videoStartTime = currentLo.videoStartTime
        obj.fields.videoEndTime = currentLo.videoEndTime
        input.push(obj)
        const startTimeInput = lOTimeDiv.current.getElementsByClassName(`starttime-${currentLo.id}`)
        const endTimeInput = lOTimeDiv.current.getElementsByClassName(`endtime-${currentLo.id}`)
        startTimeInput[0].style.color = ''
        endTimeInput[0].style.color = ''
        if (typeof currentLo.videoStartTime === 'undefined') currentLo.videoStartTime = 0
        if (typeof currentLo.videoEndTime === 'undefined') currentLo.videoEndTime = 0
        if (currentLo.videoStartTime > currentLo.videoEndTime) {
          startTimeInput[0].style.color = 'red'
          endTimeInput[0].style.color = 'red'
          validation = false
          message.error(`Start time of "${currentLo.title}" is greater than end time`)
        }
        j += 1
      }
    }
    if (props.episodes && props.episodes.length) {
      const topicIndex = props.episodes.findIndex(obj => obj.id === topicId)
      const topicToEdit = props.episodes[topicIndex]
      const {
        videoStartTime,
        videoEndTime,
        storyStartTime,
        storyEndTime
      } = topicToEdit
      if (videoStartTime > videoEndTime) {
        topicValidation = false
        message.error('Start time of whole topic is greater than end time')
      }
      if (storyStartTime > storyEndTime) {
        topicValidation = false
        message.error('Start time of topic story is greater than end time')
      }
      topicInput.topicId = topicId
      topicInput.videoStartTime = videoStartTime
      topicInput.videoEndTime = videoEndTime
      topicInput.storyStartTime = storyStartTime
      topicInput.storyEndTime = storyEndTime
    }
    if (validation === true && topicValidation === true) {
      props.editLearningObjectives(input)
      props.editTopicVideoMeta(topicInput)
    }
  }

  return (
    <Main.loWrapper innerRef={lOTimeDiv}>
      <LearningObjectiveTable
        isFetching={isFetching}
        videoPlayer={videoPlayer}
        isLOPresent={isLOPresent}
        shouldVideo={shouldVideo}
        isMessageLO={isMessageLO}
        messageLO={messageLO}
        openEditLOVideoThumbnail={openEditLOVideoThumbnail}
        openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
        updateLO={props.updateLO}
        updateEpisode={props.updateEpisode}
        learningObjectives={props.learningObjectives}
        {...props}
      />
      <div>
        <Main.ButtonsWrapper>
          <Main.TextSpan>
            Video to learning objectives mapping
          </Main.TextSpan>
          <div>
            <Popconfirm
              title='Do you want to clear the time of learning objectives?'
              placement='topRight'
              onConfirm={clearTimeStamp}
              okText='Yes'
              cancelText='Cancel'
              key='delete'
            >
              <Main.DeleteButton
                icon='delete'
                disabled={!isMessageLO}
              >Clear
              </Main.DeleteButton>
            </Popconfirm>
            <Main.Button
              icon='upload'
              onClick={onUpload}
              disabled={!isMessageLO}
            >Upload
            </Main.Button>
          </div>
        </Main.ButtonsWrapper>
      </div>
    </Main.loWrapper>


  )
}
LO.defaultProps = {
  loFetchError: null,
  loEditError: null,
  videoPlayer: null
}
LO.propTypes = {
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({
    /** id of the Learning Objective */
    id: PropTypes.string.isRequired,
    /** Title of the Learning Objective */
    title: PropTypes.string.isRequired,
    /** Order of the Learning Objective */
    order: PropTypes.number.isRequired,
    /** Video time stamps at which LO is starting */
    videoStartTime: PropTypes.number,
    /** Video time stamps at which LO is ending */
    videoEndTime: PropTypes.number
  })).isRequired,
  episodes: PropTypes.arrayOf(PropTypes.shape({
    /** id of the Learning Objective */
    id: PropTypes.string.isRequired,
    /** Video time stamps at which story is starting */
    storyStartTime: PropTypes.number,
    /** Video time stamps at which story is ending */
    storyEndTime: PropTypes.number,
    /** Video time stamps at which topic is starting */
    videoStartTime: PropTypes.number,
    /** Video time stamps at which topic is ending */
    videoEndTime: PropTypes.number
  })).isRequired,
  isFetching: PropTypes.bool.isRequired,
  editLearningObjectives: PropTypes.func.isRequired,
  loFetchError: PropTypes.string,
  loEditError: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  videoPlayer: PropTypes.shape({}),
  isLOPresent: PropTypes.bool.isRequired,
  shouldVideo: PropTypes.bool.isRequired,
  openEditLOVideoThumbnail: PropTypes.func.isRequired,
  openEditStoryVideoThumbnail: PropTypes.func.isRequired,
  editTopicVideoMeta: PropTypes.func.isRequired,
  updateLO: PropTypes.func.isRequired,
  updateEpisode: PropTypes.func.isRequired,
}

export default LO
