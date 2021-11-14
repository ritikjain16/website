import { Button, message, Select } from 'antd'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { toSrtTime, parse } from 'subtitle'
import { BigPlayButton, Player } from 'video-react'
import Dropzone from '../../../../../components/Dropzone'
import { FlexContainer } from '../../Videos.styles'
import Input from './FormElements/Input'
import videoFormValidation from './FormElements/videoFormValidation'
import Main from './VideoForm.styles'
import { PublishInput } from '../../../ContentLearningObjective/components/LoForms/FormElements'

const AddFormVideo = (props) => {
  const { addFormData, handleAddVideo,
    coursesFetchStatus, coursesList, videoAddStatus } = props
  const thumbnailRef = useRef(null)
  const subTitleRef = useRef(null)

  const [videoFile, setVideoFile] = useState(null)
  const [videoLink, setVideoLink] = useState('')
  const [subTitleFile, setSubTitleFile] = useState(null)
  const [subtitleLink, setSubtitleLink] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [subtitleText, setsubtitleText] = useState('')
  const [videoRef, setVideoRef] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])

  const onVideoDrop = (file) => {
    if (file && file.length > 0) {
      setVideoLink(URL.createObjectURL(file[0]))
      setVideoFile(file[0])
    }
  }

  const onSubTitleDrop = (file) => {
    if (file && file.length > 0) {
      setSubtitleLink(URL.createObjectURL(file[0]))
      setSubTitleFile(file[0])
    }
  }

  const onThumbnailDrop = (file) => {
    setThumbnailFile(file)
  }
  const handleSubmit = (value, meta) => {
    handleAddVideo(value, videoFile, thumbnailFile, subTitleFile, selectedCourses, meta)
  }

  const highlightSubtitleDOM = i => {
    subTitleRef.current.children[i].children[0].children[0].style.color = 'Blue'
    subTitleRef.current.children[i].children[0].children[1].style.color = 'Blue'
    subTitleRef.current.children[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  const unHighlightSubtitleDOM = i => {
    subTitleRef.current.children[i].children[0].children[0].style.color = ''
    subTitleRef.current.children[i].children[0].children[1].style.color = ''
  }

  const handleVideoStateChange = state => {
    if (state.paused === false &&
        subTitleRef &&
        subTitleRef.current &&
        subTitleRef.current.children) {
      for (let i = 0; i < subTitleRef.current.children.length; i += 1) {
        if (
          state.currentTime * 1000 > subTitleRef.current.children[i].attributes.starttime.value &&
          state.currentTime * 1000 < subTitleRef.current.children[i].attributes.endtime.value
        ) {
          highlightSubtitleDOM(i)
        } else {
          unHighlightSubtitleDOM(i)
        }
      }
    }
  }

  useEffect(() => {
    if (videoRef) {
      videoRef.subscribeToStateChange(handleVideoStateChange)
    }
  }, [videoRef])

  const onSelect = (value) => {
    setSelectedCourses([...selectedCourses, value])
  }

  const onDeselect = (value) => {
    const newCourse = selectedCourses.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    setSelectedCourses(newCourse)
  }

  useEffect(() => {
    if (subtitleLink) {
      axios.get(subtitleLink).then(res => {
        try {
          const dataMs = parse(res.data)
          if (dataMs) {
            const subtitleBox = dataMs.map(subtitle => (
              <li starttime={subtitle.start} endtime={subtitle.end} key={subtitle.start}>
                <Main.SubtitleTextButton onClick={(e) => e.preventDefault()}>
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
          message.error('Something went wrong')
          setSubtitleLink('')
        }
      })
    }
  }, [subtitleLink])
  return (
    <Formik
      initialValues={addFormData}
      onSubmit={handleSubmit}
      validateOnBlur
      validationSchema={videoFormValidation}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form style={{ padding: '0 10px' }} id='form'>
          <FlexContainer justify='space-between' modalGrid style={{ gridTemplateColumns: '45% 45%' }}>
            <Input
              label='Add Video Title'
              placeholder='Add Video Title'
              name='title'
              type='text'
              value={values.title || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
              textArea='textArea'
            />
            <Input
              label='Add Video Description'
              placeholder='Add Video Description'
              name='description'
              type='text'
              value={values.description || ''}
              onChange={handleChange}
              setFieldValue={setFieldValue}
              textArea='textArea'
            />
          </FlexContainer>
          <FlexContainer modalGrid style={{ gridTemplateColumns: '45% 45%' }}>
            <Input
              label='Video Start Time'
              placeholder='Video Start Time'
              name='videoStartTime'
              type='number'
              value={values.videoStartTime || ''}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleChange(e)
                }
              }}
              setFieldValue={setFieldValue}
            />
            <Input
              label='Video End Time'
              placeholder='Video End Time'
              name='videoEndTime'
              type='number'
              value={values.videoEndTime || ''}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleChange(e)
                }
              }}
              setFieldValue={setFieldValue}
            />
            <Input
              label='Story Start Time'
              placeholder='Story Start Time'
              name='storyStartTime'
              type='number'
              value={values.storyStartTime || ''}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleChange(e)
                }
              }}
              setFieldValue={setFieldValue}
            />
            <Input
              label='Story End Time'
              placeholder='Story End Time'
              name='storyEndTime'
              type='number'
              value={values.storyEndTime || ''}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleChange(e)
                }
              }}
              setFieldValue={setFieldValue}
            />
          </FlexContainer>
          <FlexContainer justify='space-between' modalGrid style={{ gridTemplateColumns: '45% 45%' }}>
            <div>
              <h3>Video File</h3>
              {
                videoFile ? (
                  <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                    <Main.CloseIcon
                      onClick={() => {
                        setVideoFile(null)
                        setVideoLink('')
                      }}
                    />
                    <Player
                      ref={(player) => {
                        setVideoRef(player)
                      }}
                      className='react-player'
                      playsInline
                      src={videoLink}
                    >
                      <BigPlayButton position='center' />
                    </Player>
                  </div>
                ) : (
                  <Main.Dropzone
                    activeClassName='active'
                    accept='video/*'
                    onDrop={onVideoDrop}
                  >
                    <Main.UploadContainer>
                      <Main.UploadIcon type='video-camera' />
                      <Main.UploadText>
                        Click or drag to attach
                      </Main.UploadText>
                    </Main.UploadContainer>
                  </Main.Dropzone>
                )
              }
            </div>
            <div>
              <h3>Subtitle File</h3>
              {
                subTitleFile || subtitleLink ? (
                  <Main.Pre>
                    <Main.CloseIcon
                      style={{ color: 'black' }}
                      onClick={() => {
                        setSubTitleFile(null)
                        setSubtitleLink('')
                      }}
                    />
                    <Main.SubtitleUl innerRef={subTitleRef}>{subtitleText}</Main.SubtitleUl>
                  </Main.Pre>
                ) : (
                  <Main.Dropzone
                    activeClassName='active'
                    accept='.srt'
                    onDrop={onSubTitleDrop}
                  >
                    <Main.UploadContainer>
                      <Main.UploadIcon type='file' />
                      <Main.UploadText>Click or drag to attach</Main.UploadText>
                    </Main.UploadContainer>
                  </Main.Dropzone>
                )
              }
            </div>
          </FlexContainer>
          <FlexContainer justify='space-between' modalGrid style={{ gridTemplateColumns: '45% 45%' }}>
            <div>
              <h3>Select Courses</h3>
              <Select
                mode='multiple'
                labelInValue
                placeholder='Select Courses'
                loading={coursesFetchStatus && !get(coursesFetchStatus.toJS(), 'loading')}
                filterOption={false}
                value={selectedCourses}
                onSelect={onSelect}
                onDeselect={onDeselect}
                style={{ width: '100%' }}
              >
                {
                  coursesList.map(item =>
                    <Select.Option
                      value={get(item, 'id')}
                      key={get(item, 'id')}
                    >
                      {get(item, 'title')}
                    </Select.Option>
                  )
                }
              </Select>
              <div style={{ marginTop: 10 }}>
                <PublishInput
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
            <div>
              <h3>Thumbnail</h3>
              <Dropzone
                style={{ height: '200px', width: '100%', marginBottom: '15px' }}
                getDropzoneFile={onThumbnailDrop}
                ref={thumbnailRef}
                defaultFile={thumbnailFile}
              >Click or drag to attach
              </Dropzone>
            </div>
          </FlexContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            <Button
              type='primary'
              icon='file'
              id='add-btn'
              htmlType='submit'
              loading={videoAddStatus && get(videoAddStatus.toJS(), 'loading')}
            >
              Save
            </Button>
          </div>
        </Form>
    )}
    </Formik>
  )
}

export default AddFormVideo
