import React from 'react'
import { Button } from 'antd'
import { get, sortBy } from 'lodash'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { AppstoreOutlined, CaretLeftFilled, CaretRightFilled } from '@ant-design/icons'
import {
  CloseIcon,
  FlexContainer, ImageCard, SliderContainer, StyledButton,
  StyledDivider, StyledInput, StyledSwitch, StyledTextArea
} from '../Comic.styles'
import PublishSwitcher from './PublishSwitcher'
import { PUBLISHED_STATUS } from '../../../../constants/questionBank'
import getFullPath from '../../../../utils/getFullPath'
import { deleteComicImage } from '../../../../actions/contentMaker'
import Dropzone from '../../../../components/Dropzone'


class ComicForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageFile: null,
      activeIndex: 0,
      rearrange: true,
    }
  }
  dropzoneRef = React.createRef()
  onNavClick = (newIndex) => {
    const { imagesArray } = this.props
    if (newIndex < 0) {
      newIndex = imagesArray.length - 1
    } else if (newIndex >= imagesArray.length) {
      newIndex = 0
    }
    this.setState({ activeIndex: newIndex })
  }

  renderSliderContent = (file, i) => {
    const { activeIndex } = this.state
    if (i === activeIndex || i === activeIndex + 1) {
      return <ImageCard src={getFullPath(get(file, 'image.uri'))} key={i} />
    }
  }

  reorder = (data, startIndex, endIndex) => {
    const result = Array.from(data)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  onDragEnd = (result) => {
    const { imagesArray, onNewImageSet } = this.props
    if (!result.destination) {
      return
    }
    const data = [...imagesArray]
    const draggedContent = this.reorder(
      data,
      result.source.index,
      result.destination.index
    )
    const newImagees = []
    draggedContent.forEach((image, i) => {
      newImagees.push({ ...image, order: i + 1 })
    })
    onNewImageSet(newImagees)
  }

  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: isDragging ? 'lightgray' : 'white',
      ...dragglePropsStyle
    }
  )
  disabledSave = () => {
    const { comicName, comicDesc } = this.props
    if (!comicName || !comicDesc) return true
    return false
  }

  onDeleteClick = (file) => {
    const { onNewImageSet, imagesArray } = this.props
    if (get(file, 'id')) {
      deleteComicImage(get(file, 'id'))
      const newImages = imagesArray.filter(image =>
        get(image, 'id') !== get(file, 'id'))
      onNewImageSet(newImages, true)
    }
  }

  onSave = async (e) => {
    const { onSaveClick } = this.props
    const { imageFile } = this.state
    await onSaveClick(imageFile)
    this.setState({
      imageFile: null
    })
    this.dropzoneRef.current.onCloseClick(e)
  }

  disableUpload = () => !this.props.comicName || !this.props.comicDesc || !this.state.imageFile
  renderImageView = () => {
    const { imagesArray } = this.props
    const { activeIndex, rearrange, imageFile } = this.state
    const iconStyle = { fontSize: '24px' }
    if (rearrange) {
      return (
        <div
          style={{
            display: 'flex',
            overflow: 'auto',
            alignItems: 'center',
            height: '500px',
          }}
        >
          <DragDropContext onDragEnd={this.onDragEnd} >
            <Droppable droppableId='droppable' direction='horizontal' >
              {provided => (
                <div ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: 'flex',
                  }}
                >
                  {
                    imagesArray.map((file, i) => (
                      <Draggable index={i}
                        draggableId={get(file, 'id')}
                        key={get(file, 'id')}
                      >
                        {
                          (provid, snapshot) => (
                            <div
                              ref={provid.innerRef}
                              {...provid.draggableProps}
                              {...provid.dragHandleProps}
                              style={this.rowStyle(snapshot.isDragging,
                                provid.draggableProps.style)}
                            >
                              <ImageCard isDragging src={getFullPath(get(file, 'image.uri'))} key={get(file, 'order')} >
                                <CloseIcon onClick={() => this.onDeleteClick(file)} />
                              </ImageCard>
                              <span style={{ textAlign: 'center' }}>{`${i + 1} of ${imagesArray.length}`}</span>
                            </div>
                          )
                        }
                      </Draggable>
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <FlexContainer style={{ width: '188px', flexDirection: 'column', padding: '0' }}>
            <Dropzone
              width='188px'
              height='200px'
              style={{ margin: '10px' }}
              getDropzoneFile={this.onDrop}
              ref={this.dropzoneRef}
              defaultFile={imageFile}
            >Click or drag to attach
            </Dropzone>
            <Button disabled={this.disableUpload()} icon='edit' onClick={this.onSave} >Upload</Button>
          </FlexContainer>
        </div>
      )
      /* eslint-disable no-else-return */
    } else {
      return (
        <FlexContainer>
          <CaretLeftFilled style={iconStyle} onClick={() => this.onNavClick(activeIndex - 1)} />
          <SliderContainer>
            {sortBy(imagesArray, 'order').map(this.renderSliderContent)}
          </SliderContainer>
          <CaretRightFilled
            style={iconStyle}
            onClick={() => this.onNavClick(activeIndex + 1)}
          />
        </FlexContainer>
      )
    }
  }
  onDrop = (file) => {
    if (file) {
      this.setState({ imageFile: file })
    }
  }

  onRearrangeClick = async () => {
    const { rearrange } = this.state
    const { onRearrangeSave } = this.props
    if (rearrange) {
      await onRearrangeSave()
    } else {
      this.setState({ rearrange: true })
    }
  }
  render() {
    const { rearrange } = this.state
    const { comicData, comicStripsAddStatus,
      comicName, comicDesc, status, onDetailsChange,
      comicStripsUpdateStatus, onNewImageSet } = this.props
    return (
      <>
        {comicData ? <PublishSwitcher status={status} comicId={get(comicData, 'id')} /> : (
          <FlexContainer justify='flex-end'>
            <StyledSwitch
              bgcolor={status === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
              checked={status === PUBLISHED_STATUS}
              onChange={() => onDetailsChange(null, null, status)}
              size='default'
            />
            {status}
          </FlexContainer>
        )}
        <FlexContainer style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: '0.6' }}>
            <FlexContainer comicForm>
              <h3>Comic Name: </h3>
              <StyledInput
                value={comicName}
                name='comicName'
                onChange={({ target: { value, name } }) => onDetailsChange(name, value)}
              />
            </FlexContainer>
            <FlexContainer comicForm>
              <h3>Comic Description: </h3>
              <StyledTextArea
                value={comicDesc}
                name='comicDesc'
                onChange={({ target: { value, name } }) => onDetailsChange(name, value)}
              />
            </FlexContainer>
          </div>
        </FlexContainer>
        <FlexContainer justify='center'>
          <StyledButton
            icon='file'
            onClick={this.onSave}
            disabled={this.disabledSave()}
            loading={comicStripsAddStatus && get(comicStripsAddStatus.toJS(), 'loading')
              || comicStripsUpdateStatus && get(comicStripsUpdateStatus.toJS(), 'loading')}
          >
            {comicData ? 'UPDATE' : 'SAVE'}
          </StyledButton>
        </FlexContainer>
        {this.renderImageView()}
        <FlexContainer justify='flex-end'>
          {
            !rearrange ? (
              <Button
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={this.onRearrangeClick}
              >
                Rearrange
                <AppstoreOutlined
                  style={{ fontSize: '24px' }}
                />
              </Button>
            ) : (
              <div>
                <Button
                  type='dashed'
                  icon='eye'
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    this.setState({ rearrange: false },
                      () => onNewImageSet(get(comicData, 'comicImages', [])))
                  }}
                >
                  VIEW
                </Button>
                <Button
                  type='dashed'
                  onClick={this.onRearrangeClick}
                >
                  SAVE
                </Button>
              </div>
            )
          }
        </FlexContainer>
        <StyledDivider />
      </>
    )
  }
}

export default ComicForm
