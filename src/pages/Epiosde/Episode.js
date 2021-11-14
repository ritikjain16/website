import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { message, Popconfirm } from 'antd'
import Main from './Episode.style'
import TopicNav from '../../components/TopicNav'
import Video from './components/Video'
import Subtitle from './components/Subtitle'
import Thumbnail from './components/Thumbnail'
import LearningObjective from './components/LearningObjective'
import VideoMeta from './components/VideoMeta'
import { getDataById } from '../../utils/data-utils'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import { UNPUBLISHED_STATUS, PUBLISHED_STATUS } from '../../constants/questionBank'
import MainTable from '../../components/MainTable'
import getFullPath from '../../utils/getFullPath'
import LOVideoThumbnailModal from './components/LOVideoThumbnailModal/LOVideoThumbnailModal'
import StoryVideoThumbnailModal
  from './components/StoryVideoThumbnailModal/StoryVideoThumbnailModal'
import BulletPoints from './components/BulletPoints'


const Episode = ({ ...props }) => {
  const topicId = props.match.params.id
  const topicIndex = props.episodes.findIndex(obj => obj.id === topicId)
  const storyVideoThumbnailDoc = get(props.episodes[topicIndex], 'storyThumbnail')

  const [isFailedInFetch, setIsFailedInFetch] = useState(false)
  const [isTopicPresent, setIsTopicPresent] = useState(true)
  const [isFetching, setIsFetching] = useState(true)
  const [isLOPresent, setIsLOPresent] = useState(true)
  const [videoPlayer, setVideoPlayer] = useState()
  const [isVideoMeta, setIsVideoMeta] = useState(false)
  const [videoLink, setVideoLink] = useState('')
  const [shouldUploadVideoFile, setShouldUploadVideoFile] = useState(false)
  const [shouldDeleteVideoFile, setShouldDeleteVideoFile] = useState(false)
  const [shouldVideo, setShouldVideo] = useState(false)
  const [subtitleLink, setSubtitleLink] = useState('')
  const [shouldUploadSubtitleFile, setShouldUploadSubtitleFile] = useState(false)
  const [shouldDeleteSubtitleFile, setShouldDeleteSubtitleFile] = useState(false)
  const [shouldSubtitle, setShouldSubtitle] = useState(false)
  const [thumbnailLink, setThumbnailLink] = useState('')
  const [shouldUploadThumbnailFile, setShouldUploadThumbnailFile] = useState(false)
  const [shouldDeleteThumbnailFile, setShouldDeleteThumbnailFile] = useState(false)
  const [shouldThumbnail, setShouldThumbnail] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [
    shouldEditLOVideoThumbnailVisible,
    setShouldEditLOVideoThumbnailVisible
  ] = useState(false)
  const [
    shouldEditStoryVideoThumbnailVisible,
    setShouldEditStoryVideoThumbnailVisible
  ] = useState(false)

  const [editLOVideoThumbnailId, setEditLOVideoThumbnailId] = useState('')
  const [defaultDataInEditLOVideoThumbnail, setDefaultDataInEditLOVideoThumbnail] = useState({})

  const { fetchingEpisodesError } = props
  const videoPlayerFromEpisode = (vp) => {
    setVideoPlayer(vp)
  }

  const openEditLOVideoThumbnail = id => () => {
    setEditLOVideoThumbnailId(id)
    setTimeout(() => {
      setShouldEditLOVideoThumbnailVisible(true)
    }, 250)
  }

  const closeEditLOVideoThumbnail = () => {
    setShouldEditLOVideoThumbnailVisible(false)
  }

  const onEditLOVideoThumbnailSave = async ({ id, isThumbnail, thumbnailUrl, ...rest }) => {
    const {
      addLearningObjectiveVideoThumbnail,
      removeLearningObjectiveVideoThumbnail,
      learningObjectives
    } = props
    const editedLO = getDataById(learningObjectives, id)
    const shouldRemoveThumbnail = !isThumbnail && thumbnailUrl
    const hideLoadingMessage = message.loading('Editing LO Thumbnail in video...')
    const data = rest

    if (!shouldRemoveThumbnail && editedLO && editedLO.videoThumbnail &&
      editedLO.videoThumbnail.id) {
      await removeLearningObjectiveVideoThumbnail(
        id, editedLO.videoThumbnail.id)
    }
    const result = shouldRemoveThumbnail
      ? await removeLearningObjectiveVideoThumbnail(
        id, editedLO.videoThumbnail.id)
      : await addLearningObjectiveVideoThumbnail(data.file, id)

    hideLoadingMessage()
    if (shouldRemoveThumbnail && result) {
      closeEditLOVideoThumbnail()
      message.success(`Removed video thumbnail for Learning Objective "${editedLO.title}"`)
    } else if (!shouldRemoveThumbnail && result.id) {
      closeEditLOVideoThumbnail()
      message.success(`Added video thumbnail for Learning Objective "${editedLO.title}"`)
    } else {
      message.error()
    }
  }

  const openEditStoryVideoThumbnail = () => {
    setTimeout(() => {
      setShouldEditStoryVideoThumbnailVisible(true)
    }, 250)
  }

  const closeEditStoryVideoThumbnail = () => {
    setShouldEditStoryVideoThumbnailVisible(false)
  }

  const onEditStoryVideoThumbnailSave = async ({ id, isThumbnail, thumbnailUrl, ...rest }) => {
    const {
      addStoryVideoThumbnail,
      removeStoryVideoThumbnail,
    } = props
    const shouldRemoveThumbnail = !isThumbnail && thumbnailUrl
    const hideLoadingMessage = message.loading('Editing Story Thumbnail...')
    const data = rest

    const result = shouldRemoveThumbnail
      ? await removeStoryVideoThumbnail(
        id, storyVideoThumbnailDoc.id)
      : await addStoryVideoThumbnail(data.file, topicId)

    hideLoadingMessage()
    if (shouldRemoveThumbnail && result) {
      closeEditStoryVideoThumbnail()
      message.success('Removed story video thumbnail')
    } else if (!shouldRemoveThumbnail && result.id) {
      closeEditStoryVideoThumbnail()
      message.success('Added story video thumbnail')
    } else {
      message.error()
    }
  }

  const fetchLOInEpisode = async () => {
    const { hasLoFetched, fetchLearningObjectives, learningObjectives } = props
    if (!hasLoFetched) {
      await fetchLearningObjectives(topicId)
    }
    setIsFetching(false)
    if (props.hasLoFetched && learningObjectives
      && learningObjectives.length) {
      setIsLOPresent(true)
    } else {
      setIsLOPresent(false)
    }
  }

  useEffect(() => { fetchLOInEpisode() }, props.learningObjectives)

  const setTopicsState = (topics) => {
    setIsVideoMeta(true)
    const topic = getDataById(topics, topicId)
    const { id,
      video,
      videoSubtitle,
      videoThumbnail,
      videoStatus
    } = topic
    if (id) setIsTopicPresent(true)
    if (video && video.id) {
      const { uri: videoUri } = video
      const splittedVideoUrl = videoUri.split('.')
      const videoUrl480 = getFullPath(`${splittedVideoUrl[0]}_480.${splittedVideoUrl[1]}`)
      setVideoLink(getFullPath(videoUrl480))
      setShouldVideo(true)
      setShouldDeleteVideoFile(true)
    }
    if (videoSubtitle && videoSubtitle.id) {
      const { uri: videoSubtitleUri } = videoSubtitle
      setSubtitleLink(getFullPath(videoSubtitleUri))
      setShouldSubtitle(true)
      setShouldDeleteSubtitleFile(true)
    }
    if (videoThumbnail && videoThumbnail.id) {
      const { uri: videoThumbnailUri } = videoThumbnail
      setThumbnailLink(getFullPath(videoThumbnailUri))
      setShouldThumbnail(true)
      setShouldDeleteThumbnailFile(true)
    }
    if (!topics.length) {
      setIsTopicPresent(false)
    }
    if (videoStatus === PUBLISHED_STATUS) {
      setIsPublished(true)
    }
  }

  const changeEpisodeStatus = async () => {
    const req = {}
    req.topicId = topicId
    if (isPublished) req.videoStatus = UNPUBLISHED_STATUS
    else req.videoStatus = PUBLISHED_STATUS
    await props.editTopicVideoMeta(req)
    setIsPublished(!isPublished)
  }

  const fetchTopicsInEpisode = async () => {
    const { hasEpisodesFetched, fetchTopics } = props
    setShouldUploadVideoFile(false)
    setShouldUploadSubtitleFile(false)
    const topicData = getDataById(props.episodes, topicId)
    if (!hasEpisodesFetched || Object.keys(topicData).indexOf('video') < 0) {
      const hideLoading = message.loading('Loading video data...', 0)
      const episodes = await fetchTopics(topicId)
      hideLoading()
      if (episodes && episodes.length) {
        setTopicsState(episodes)
      }
    } else if (props.episodes && props.episodes.length) {
      setTopicsState(props.episodes)
    }
  }

  useEffect(() => { fetchTopicsInEpisode() }, [topicId])

  const fetchingTopicsErrorInEpisode = () => {
    if (fetchingEpisodesError !== null) {
      setIsFailedInFetch(true)
    }
  }

  useEffect(() => { fetchingTopicsErrorInEpisode() }, [fetchingEpisodesError])

  useEffect(() => {
    const { learningObjectives } = props
    if (learningObjectives.length && editLOVideoThumbnailId) {
      setDefaultDataInEditLOVideoThumbnail(getDataById(learningObjectives, editLOVideoThumbnailId))
    }
  }, [editLOVideoThumbnailId, ...props.learningObjectives])

  if (isFailedInFetch) {
    return (
      <div>
        <Main.FetchError>{fetchingEpisodesError}</Main.FetchError>
      </div>
    )
  }

  if (!isTopicPresent) {
    return (
      <div>
        <TopicNav activeTab={topicJourneyRoutes.episode} />
        <Main>
          Topic is not present. Please add a topic.
        </Main>
      </div>

    )
  }

  return (
    <div>
      <TopicNav activeTab={topicJourneyRoutes.episode} />
      <Main.FirstSection>
        <Main.CommonDropzoneDiv>
          <Main.FirstDropzoneDiv>
            <VideoMeta
              isVideoMeta={isVideoMeta}
              setIsVideoMeta={setIsVideoMeta}
              {...props}
            />
          </Main.FirstDropzoneDiv>
        </Main.CommonDropzoneDiv>
        <Main.CommonDropzoneDiv>
          <Main.FirstDropzoneDiv>
            <Thumbnail
              parentState={
                {
                  thumbnailLink,
                  shouldUploadThumbnailFile,
                  shouldDeleteThumbnailFile,
                  shouldThumbnail
                }}
              setParentState={
                {
                  setThumbnailLink,
                  setShouldUploadThumbnailFile,
                  setShouldDeleteThumbnailFile,
                  setShouldThumbnail
                }
              }
              {...props}
            />
          </Main.FirstDropzoneDiv>
        </Main.CommonDropzoneDiv>
      </Main.FirstSection>
      <Main>
        <Main.CommonDropzoneDiv>
          <Main.SecondDropzoneDiv>
            <Video
              videoPlayerFromEpisode={videoPlayerFromEpisode}
              parentState={
                {
                  videoLink,
                  shouldUploadVideoFile,
                  shouldDeleteVideoFile
                }
              }
              setParentState={
                {
                  setVideoLink,
                  setShouldUploadVideoFile,
                  setShouldVideo,
                  setShouldDeleteVideoFile
                }
              }
              {...props}
            />
          </Main.SecondDropzoneDiv>
        </Main.CommonDropzoneDiv>
        <Main.CommonDropzoneDiv>
          <Main.SecondDropzoneDiv>
            <Subtitle
              videoPlayer={videoPlayer}
              parentState={
                {
                  subtitleLink,
                  shouldUploadSubtitleFile,
                  shouldDeleteSubtitleFile,
                  shouldSubtitle
                }}
              setParentState={
                {
                  setSubtitleLink,
                  setShouldUploadSubtitleFile,
                  setShouldDeleteSubtitleFile,
                  setShouldSubtitle
                }
              }
              {...props}
            />
          </Main.SecondDropzoneDiv>
        </Main.CommonDropzoneDiv>
        <Main.LODiv>
          <LearningObjective
            videoPlayer={videoPlayer}
            isLOPresent={isLOPresent}
            isFetching={isFetching}
            shouldVideo={shouldVideo}
            openEditLOVideoThumbnail={openEditLOVideoThumbnail}
            openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
            updateLO={props.updateLO}
            updateEpisode={props.updateEpisode}
            learningObjectives={props.learningObjectives}
            {...props}
          />
        </Main.LODiv>
        <Main.LODiv style={{ marginTop: '40px' }}>
          <BulletPoints
            {...props}
          />
        </Main.LODiv>
        <Main.PublishSection>
          <Main.ButtonsWrapper>
            <Main.StatusSpan>
              Status:
              <Main.InnerStatusSpan>
                <MainTable.Status
                  status={isPublished ? PUBLISHED_STATUS : UNPUBLISHED_STATUS}
                />
              </Main.InnerStatusSpan>
            </Main.StatusSpan>
            <Popconfirm
              title={isPublished ? 'Do you want to unpublish this episode?' : 'Do you want to publish this episode?'}
              placement='topRight'
              onConfirm={changeEpisodeStatus}
              okText='Yes'
              cancelText='Cancel'
              key='status'
            >
              <Main.StatusButton
                icon='publish'
              >{isPublished ? 'Unpublish' : 'Publish'}
              </Main.StatusButton>
            </Popconfirm>
          </Main.ButtonsWrapper>
        </Main.PublishSection>
      </Main>
      <LOVideoThumbnailModal
        id='editLOVideoThumbnail'
        title='Edit LO Video Thumbnail'
        onSave={onEditLOVideoThumbnailSave}
        visible={shouldEditLOVideoThumbnailVisible}
        closeModal={closeEditLOVideoThumbnail}
        defaultValues={{
          id: defaultDataInEditLOVideoThumbnail.id,
          thumbnailUrl: getFullPath(
            get(defaultDataInEditLOVideoThumbnail, 'videoThumbnail.uri', null)
          )
        }}
      />
      <StoryVideoThumbnailModal
        id='editStoryVideoThumbnail'
        title='Edit Story Video Thumbnail'
        onSave={onEditStoryVideoThumbnailSave}
        visible={shouldEditStoryVideoThumbnailVisible}
        closeModal={closeEditStoryVideoThumbnail}
        defaultValues={{
          id: topicId,
          thumbnailUrl: getFullPath(get(storyVideoThumbnailDoc, 'uri'))
        }}
      />
    </div>
  )
}
Episode.defaultProps = {
  fetchingEpisodesError: null
}
Episode.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  fetchTopics: PropTypes.func.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchingEpisodesError: PropTypes.instanceOf(Error),
  fetchLearningObjectives: PropTypes.func.isRequired,
  addLearningObjectiveVideoThumbnail: PropTypes.func.isRequired,
  removeLearningObjectiveVideoThumbnail: PropTypes.func.isRequired,
  updateLO: PropTypes.func.isRequired,
  hasEpisodesFetched: PropTypes.bool.isRequired,
  learningObjectives: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  hasLoFetched: PropTypes.bool.isRequired,
  editTopicVideoMeta: PropTypes.func.isRequired,
}
export default Episode
