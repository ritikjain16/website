import { find, get } from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { toSrtTime } from 'subtitle'
import { message } from 'antd'
import MainTable from '../../../../../../components/MainTable'
import { Table } from '../../../../../../components/StyledComponents'
import Screen from './LearningObjectiveTable.style'
import getFullPath from '../../../../../../utils/getFullPath'

const LORow = ({
  id,
  order,
  title,
  videoStartTime,
  videoEndTime,
  columnsTemplate,
  minWidth,
  isVideoLOMapping,
  videoPlayer,
  openEditLOVideoThumbnail,
  openEditStoryVideoThumbnail,
  editVideoThumbnail,
  titleId,
  topicVideoThumbnail,
  isStoryTopicRow,
  ...props
}) => {
  const topicId = props.match.params.id
  const topicIndex = props.episodes.findIndex(obj => obj.id === topicId)
  const videoLOThumbnailUriDoc = find(props.learningObjectives, { id })
  const videoLOThumbnailUri = get(videoLOThumbnailUriDoc, 'videoThumbnail.uri')
  const storyVideoThumbnailUri = get(props.episodes[topicIndex], 'storyThumbnail.uri')

  const [isHovering, setIsHovering] = useState(false)
  const [playerState, setPlayerState] = useState(0)
  const lORow = useRef()
  const handleVideoStateChange = (state) => {
    if (state) { setPlayerState(state) }
  }
  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.subscribeToStateChange(handleVideoStateChange.bind())
    }
  }, [videoPlayer])

  const onCapture = async (loId, titleLO, element) => {
    const elementPos = props.learningObjectives.findIndex(obj => obj.id === loId)
    if (elementPos < 0) {
      if (element === 'starttime') {
        if (titleLO === 'Whole Topic') {
          props.episodes[topicIndex].videoStartTime =
            Math.floor(playerState.currentTime * 1000)
          props.updateEpisode(props.episodes[topicIndex])
        } else if (titleLO === 'Story Topic') {
          props.episodes[topicIndex].storyStartTime =
            Math.floor(playerState.currentTime * 1000)
          props.updateEpisode(props.episodes[topicIndex])
        }
      } else if (element === 'endtime') {
        if (titleLO === 'Whole Topic') {
          props.episodes[topicIndex].videoEndTime =
            Math.floor(playerState.currentTime * 1000)
          props.updateEpisode(props.episodes[topicIndex])
        } else if (titleLO === 'Story Topic') {
          props.episodes[topicIndex].storyEndTime =
            Math.floor(playerState.currentTime * 1000)
          props.updateEpisode(props.episodes[topicIndex])
        }
      }
    } else if (element === 'starttime') {
      props.learningObjectives[elementPos].videoStartTime =
        Math.floor(playerState.currentTime * 1000)
      props.updateLO(props.learningObjectives[elementPos])
    } else if (element === 'endtime') {
      props.learningObjectives[elementPos].videoEndTime =
        Math.floor(playerState.currentTime * 1000)
      props.updateLO(props.learningObjectives[elementPos])
    }
  }

  const onTimeChange = (loId, titleLO, element) => e => {
    let elementValue = e.currentTarget.value
    if (Math.floor(elementValue) > playerState.duration * 1000) {
      elementValue = playerState.duration * 1000
      const mssg = `Duration of video is ${playerState.duration * 1000} ms. Please set a time less or equal to this.`
      message.error(mssg)
    }
    const elementPos = props.learningObjectives.findIndex(obj => obj.id === loId)
    if (elementPos < 0) {
      if (element === 'starttime') {
        if (titleLO === 'Whole Topic') {
          props.episodes[topicIndex].videoStartTime =
            Math.floor(elementValue)
          props.updateEpisode(props.episodes[topicIndex])
        } else if (titleLO === 'Story Topic') {
          props.episodes[topicIndex].storyStartTime =
            Math.floor(elementValue)
          props.updateEpisode(props.episodes[topicIndex])
        }
      } else if (element === 'endtime') {
        if (titleLO === 'Whole Topic') {
          props.episodes[topicIndex].videoEndTime =
            Math.floor(elementValue)
          props.updateEpisode(props.episodes[topicIndex])
        } else if (titleLO === 'Story Topic') {
          props.episodes[topicIndex].storyEndTime =
            Math.floor(elementValue)
          props.updateEpisode(props.episodes[topicIndex])
        }
      }
    } else if (element === 'starttime') {
      props.learningObjectives[elementPos].videoStartTime =
        Math.floor(elementValue)
      props.updateLO(props.learningObjectives[elementPos])
    } else if (element === 'endtime') {
      props.learningObjectives[elementPos].videoEndTime =
        Math.floor(elementValue)
      props.updateLO(props.learningObjectives[elementPos])
    }
  }

  const onMouseEnter = () => {
    setIsHovering(true)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <MainTable.Row
      columnsTemplate={columnsTemplate}
      minWidth={minWidth}
      isVideoLOMapping={isVideoLOMapping}
      innerRef={lORow}
      isHovering={isHovering}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
      <Table.Item>
        <MainTable.Item id={titleId}>
          <Link to={`/learning-objectives/${topicId}`}>{title}</Link>
        </MainTable.Item>
      </Table.Item>
      <Table.Item>
        <Screen.TimeDiv>
          <Screen.TimeInnerDiv id={`starttime-${id}`} className='time'>
            <Screen.Input
              type='number'
              name='startTime'
              defaultValue={videoStartTime}
              value={videoStartTime}
              onChange={onTimeChange(id, title, 'starttime')}
              className={`starttime-${id}`}
            />
          </Screen.TimeInnerDiv>
          <Screen.TimeInnerDiv>
              ({toSrtTime(videoStartTime).substring(0, toSrtTime(videoStartTime).indexOf(':')) === '00'
                ? (
                    toSrtTime(videoStartTime).substring(toSrtTime(videoStartTime).indexOf(':') + 1, toSrtTime(videoStartTime).indexOf(','))
                )
                : (
                    toSrtTime(videoStartTime).substring(0, toSrtTime(videoStartTime).indexOf(','))
                )
            })
          </Screen.TimeInnerDiv>
          <Screen.Button
            icon='ant-design'
            onClick={() => onCapture(id, title, 'starttime')}
          >
          </Screen.Button>
        </Screen.TimeDiv>
      </Table.Item>
      <Table.Item>
        <Screen.TimeDiv>
          <Screen.TimeInnerDiv id={`endtime-${id}`} className='time'>
            <Screen.Input
              type='number'
              name='endTime'
              value={videoEndTime}
              defaultValue={videoEndTime}
              onChange={onTimeChange(id, title, 'endtime')}
              className={`endtime-${id}`}
            />
          </Screen.TimeInnerDiv>
          <Screen.TimeInnerDiv>
              ({toSrtTime(videoEndTime).substring(0, toSrtTime(videoEndTime).indexOf(':')) === '00'
                ? (
                    toSrtTime(videoEndTime).substring(toSrtTime(videoEndTime).indexOf(':') + 1, toSrtTime(videoEndTime).indexOf(','))
                )
                : (
                    toSrtTime(videoEndTime).substring(0, toSrtTime(videoEndTime).indexOf(','))
                )
            })
          </Screen.TimeInnerDiv>
          <Screen.Button
            icon='ant-design'
            onClick={() => onCapture(id, title, 'endtime')}
          >
          </Screen.Button>
        </Screen.TimeDiv>
      </Table.Item>
      {order === 1 ?
        (
          <Table.Item>
            {topicVideoThumbnail &&
            <img src={topicVideoThumbnail && getFullPath(topicVideoThumbnail)}
              alt=''
              style={{ height: '100%', width: '100%' }}
            />}
          </Table.Item>
        )

        : (
          <Table.Item>
            {editVideoThumbnail &&
            <img src={videoLOThumbnailUri && getFullPath(videoLOThumbnailUri)}
              alt=''
              style={{ height: '100%', width: '100%' }}
            />}

            {isStoryTopicRow &&
            <img src={storyVideoThumbnailUri && getFullPath(storyVideoThumbnailUri)}
              alt=''
              style={{ height: '100%', width: '100%' }}
            />}
          </Table.Item>
        )
      }

      {isStoryTopicRow !== true ?
        (
          <Table.Item>
            {editVideoThumbnail &&
            <Screen.ActionsIconWrapper
              onClick={openEditLOVideoThumbnail(id)}
            >
              <Screen.ActionsEditIcon />
            </Screen.ActionsIconWrapper>}
          </Table.Item>
        ) :
        (
          <Table.Item>
            <Screen.ActionsIconWrapper
              onClick={openEditStoryVideoThumbnail}
            >
              <Screen.ActionsEditIcon />
            </Screen.ActionsIconWrapper>
          </Table.Item>
        )
      }
    </MainTable.Row>
  )
}
LORow.defaultProps = {
  videoPlayer: null
}
LORow.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isVideoLOMapping: PropTypes.bool.isRequired,
  editVideoThumbnail: PropTypes.bool.isRequired,
  isStoryTopicRow: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  videoStartTime: PropTypes.number.isRequired,
  videoEndTime: PropTypes.number.isRequired,
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
  videoPlayer: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  titleId: PropTypes.string.isRequired,
  topicVideoThumbnail: PropTypes.string.isRequired,
  openEditLOVideoThumbnail: PropTypes.func.isRequired,
  openEditStoryVideoThumbnail: PropTypes.func.isRequired,
  updateLO: PropTypes.func.isRequired,
  updateEpisode: PropTypes.func.isRequired,
}

export default LORow
