import { message, notification, Spin } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import {
  addComicStrip, fetchComics,
  updateComicStrip, fetchContentLearningObjective
} from '../../../actions/contentMaker'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import ComicForm from './components/ComicForm'
import TopicNav from '../../../components/TopicNav'
import topicJourneyRoutes from '../../../constants/topicJourneyRoutes'
import addComicImage from '../../../actions/contentMaker/comic/addComicImage'
import addImageToComic from '../../../actions/contentMaker/comic/addImageToComic'
import updateComicsOrder from '../../../actions/contentMaker/comic/updateComicsOrder'
import { getFailureStatus, getSuccessStatus } from '../../../utils/data-utils'

class Comic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loId: this.props.match.params.learningObjectiveId,
      imagesArray: [],
      comicData: null,
      comicName: '',
      comicDesc: '',
      status: UNPUBLISHED_STATUS,
    }
  }
  componentDidMount = async () => {
    const { loId } = this.state
    if (!this.props.topicTitle) {
      fetchContentLearningObjective({ loId })
    }
    await fetchComics(loId)
  }

  componentDidUpdate = async (prevProps) => {
    const { comicStripsFetchingStatus, comicStripsAddStatus,
      comicStripsAddFailure, comicStripsUpdateStatus,
      comicStripsUpdateFailure } = this.props
    const { loId } = this.state
    if (getSuccessStatus(comicStripsFetchingStatus, prevProps.comicStripsFetchingStatus)) {
      if (this.props.comicStrips && this.props.comicStrips.toJS().length) {
        this.addToState()
      }
    }

    if (getSuccessStatus(comicStripsAddStatus, prevProps.comicStripsAddStatus)) {
      notification.success({
        message: 'Comic added successfully'
      })
    } else {
      getFailureStatus(comicStripsAddStatus, comicStripsAddFailure, prevProps.comicStripsAddFailure)
    }

    if (getSuccessStatus(comicStripsUpdateStatus, prevProps.comicStripsUpdateStatus)) {
      notification.success({
        message: 'Comic updated successfully'
      })
      fetchComics(loId)
    } else {
      getFailureStatus(comicStripsUpdateStatus,
        comicStripsUpdateFailure, prevProps.comicStripsUpdateFailure)
    }
  }

  addToState = () => {
    this.setState({
      comicData: this.props.comicStrips.toJS()[0]
    }, () => {
      const { comicData } = this.state
      if (comicData && comicData.id) {
        this.setState({
          comicName: get(comicData, 'title'),
          comicDesc: get(comicData, 'description'),
          status: get(comicData, 'status', UNPUBLISHED_STATUS),
          imagesArray: get(comicData, 'comicImages')
        })
      }
    })
  }
  onImageSelect = (file) => {
    this.setState(prevState => ({ imagesArray: [...prevState.imagesArray, {
      file,
      order: prevState.imagesArray.length === 0 ? 1 :
        Math.max(...prevState.imagesArray.map((data) => data.order)) + 1, }] }))
  }

  onSaveClick = async (file) => {
    const { comicName, comicDesc, status, loId } = this.state
    if (this.state.comicData) {
      if (file) {
        addComicImage({
          input: { order: this.state.imagesArray.length === 0 ? 1 :
            Math.max(...this.state.imagesArray.map((data) => data.order)) + 1 },
          comicId: this.state.comicData.id
        }).then(async addImageRes => {
          if (addImageRes && addImageRes.addComicImage && addImageRes.addComicImage.id) {
            await addImageToComic({
              file,
              imageId: addImageRes.addComicImage.id
            }).then(async () => {
              await updateComicStrip({
                input: { title: comicName, description: comicDesc, status },
                comicId: this.state.comicData.id
              })
            })
          }
        })
      } else {
        await updateComicStrip({
          input: { title: comicName, description: comicDesc, status },
          comicId: this.state.comicData.id
        })
      }
    } else {
      await addComicStrip({
        input: { title: comicName, description: comicDesc, status },
        loId: this.state.loId
      }).then(addResp => {
        if (file && addResp && addResp.addComicStrip
          && addResp.addComicStrip.id) {
          addComicImage({
            input: { order: this.state.imagesArray.length === 0 ? 1 :
              Math.max(...this.state.imagesArray.map((data) => data.order)) + 1 },
            comicId: addResp.addComicStrip.id
          }).then(async addImageRes => {
            if (addImageRes && addImageRes.addComicImage
              && addImageRes.addComicImage.id) {
              await addImageToComic({
                file,
                imageId: addImageRes.addComicImage.id
              }).then(async () => {
                await fetchComics(loId)
              })
            }
          })
        } else {
          fetchComics(loId)
        }
      })
    }
  }

  onDetailsChange = (name, value, status) => {
    if (status) {
      this.setState(prevState =>
        ({
          status: prevState.status === PUBLISHED_STATUS ?
            UNPUBLISHED_STATUS : PUBLISHED_STATUS
        }))
    } else {
      this.setState({
        [name]: value
      })
    }
  }

  onRearrangeSave = async () => {
    const hideLoading = message.loading('Shuffling Images', 0)
    const { imagesArray } = this.state
    const input = imagesArray.map((file, index) => ({
      id: file.id,
      fields: {
        order: index + 1
      }
    }))
    const { updateComicImages: data } = await updateComicsOrder(input)
    if (data && data.length) {
      hideLoading()
      message.success('Images reordered')
      this.setState({
        imagesArray: data
      }, () => {
        this.setState(prevState => (
          {
            comicData: {
              ...prevState.comicData,
              comicImages: this.state.imagesArray
            }
          }
        ))
      })
    } else {
      hideLoading()
      message.error('Unexpected error')
    }
  }

  onNewImageSet = (newImage, isUpdateComic) => {
    if (isUpdateComic) {
      this.setState(prevState => (
        {
          comicData: {
            ...prevState.comicData,
            comicImages: newImage
          }
        }
      ))
    }
    this.setState({
      imagesArray: newImage
    })
  }
  render() {
    const { imagesArray, comicData, comicName, comicDesc, status } = this.state
    const { comicStripsFetchingStatus, comicStripsAddStatus,
      comicStripsUpdateStatus } = this.props
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.contentComic} loNav />
        <Spin spinning={comicStripsFetchingStatus && get(comicStripsFetchingStatus.toJS(), 'loading')}>
          <ComicForm
            imagesArray={sortBy(imagesArray, 'order')}
            onImageSelect={this.onImageSelect}
            onNewImageSet={this.onNewImageSet}
            comicData={comicData}
            onSaveClick={this.onSaveClick}
            comicStripsAddStatus={comicStripsAddStatus}
            comicStripsUpdateStatus={comicStripsUpdateStatus}
            comicName={comicName}
            comicDesc={comicDesc}
            status={status}
            onRearrangeSave={this.onRearrangeSave}
            onDetailsChange={this.onDetailsChange}
          />
        </Spin>
      </>
    )
  }
}

export default Comic
