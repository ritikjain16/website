import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import LearningObjectiveRow from './LearningObjectiveRow'
import Loader from '../../../../../../utils/Loader'

// format data of LOs
const getData = (data) => data.map(row => {
  const videoStartTime = (typeof row.videoStartTime === 'undefined' || row.videoStartTime === null) ? 0 : row.videoStartTime
  const videoEndTime = (typeof row.videoEndTime === 'undefined' || row.videoEndTime === null) ? 0 : row.videoEndTime
  return {
    id: row.id,
    order: row.order + 1,
    title: row.title,
    videoStartTime,
    videoEndTime
  }
})

/**
 * responsible for rendering the whole LearningObjectiveTable
 * @returns {React.ReactElement}
 */
const LearningObjectiveBody = ({
  columnsTemplate,
  minWidth,
  isVideoLOMapping,
  isFetching,
  videoPlayer,
  openEditLOVideoThumbnail,
  openEditStoryVideoThumbnail,
  ...props
}) => {
  const [storyRowOrder, setStoryRowOrder] = useState(1)
  const topicId = props.match.params.id
  const topicIndex = props.episodes.findIndex(obj => obj.id === topicId)
  const topicVideoThumbnail = get(props.episodes[topicIndex], 'videoThumbnail.signedUri')

  useEffect(() => {
    setStoryRowOrder(props.learningObjectives.length + 2)
  }, [props.learningObjectives])

  useEffect(() => {
    if (props.episodes[topicIndex] && (typeof props.episodes[topicIndex].videoStartTime === 'undefined' || props.episodes[topicIndex].videoStartTime === null)) {
      props.episodes[topicIndex].videoStartTime = 0
    }
    if (props.episodes[topicIndex] && (typeof props.episodes[topicIndex].videoEndTime === 'undefined' || props.episodes[topicIndex].videoEndTime === null)) {
      props.episodes[topicIndex].videoEndTime = 0
    }
    if (props.episodes[topicIndex] && (typeof props.episodes[topicIndex].storyStartTime === 'undefined' || props.episodes[topicIndex].storyStartTime === null)) {
      props.episodes[topicIndex].storyStartTime = 0
    }
    if (props.episodes[topicIndex] && (typeof props.episodes[topicIndex].storyEndTime === 'undefined' || props.episodes[topicIndex].storyEndTime === null)) {
      props.episodes[topicIndex].storyEndTime = 0
    }
  }, [props.episodes])

  return (
    isFetching ? <Loader /> :
    <div>
      <LearningObjectiveRow
        id={topicId}
        order={1}
        title='Whole Topic'
        titleId='wholetopic'
        videoStartTime={props.episodes[topicIndex].videoStartTime}
        videoEndTime={props.episodes[topicIndex].videoEndTime}
        {...props}
        videoPlayer={videoPlayer}
        key={`wholetopic-${topicId}`}
        columnsTemplate={columnsTemplate}
        minWidth={minWidth}
        isVideoLOMapping={isVideoLOMapping}
        openEditLOVideoThumbnail={openEditLOVideoThumbnail}
        openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
        editVideoThumbnail={false}
        topicVideoThumbnail={topicVideoThumbnail}
        updateLO={props.updateLO}
        updateEpisode={props.updateEpisode}
      />
      {getData(props.learningObjectives).map((lo) => (
        <LearningObjectiveRow
          {...lo}
          {...props}
          updateLO={props.updateLO}
          updateEpisode={props.updateEpisode}
          videoPlayer={videoPlayer}
          titleId=''
          key={lo.id}
          columnsTemplate={columnsTemplate}
          minWidth={minWidth}
          isVideoLOMapping={isVideoLOMapping}
          openEditLOVideoThumbnail={openEditLOVideoThumbnail}
          openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
          editVideoThumbnail
        />
            ))}
      <LearningObjectiveRow
        id={topicId}
        order={storyRowOrder}
        title='Story Topic'
        titleId='storytopic'
        isStoryTopicRow
        videoStartTime={props.episodes[topicIndex].storyStartTime}
        videoEndTime={props.episodes[topicIndex].storyEndTime}
        {...props}
        videoPlayer={videoPlayer}
        key={`story-${topicId}`}
        columnsTemplate={columnsTemplate}
        minWidth={minWidth}
        isVideoLOMapping={isVideoLOMapping}
        openEditLOVideoThumbnail={openEditLOVideoThumbnail}
        openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
        editVideoThumbnail={false}
        updateLO={props.updateLO}
        updateEpisode={props.updateEpisode}
      />
    </div>
  )
}

LearningObjectiveBody.defaultProps = {
  videoPlayer: null,
}
LearningObjectiveBody.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isVideoLOMapping: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  videoPlayer: PropTypes.shape({}),
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
  openEditLOVideoThumbnail: PropTypes.func.isRequired,
  openEditStoryVideoThumbnail: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateLO: PropTypes.func.isRequired,
  updateEpisode: PropTypes.func.isRequired,
}

export default LearningObjectiveBody
