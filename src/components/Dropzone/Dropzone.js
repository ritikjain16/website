import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import Main from './Dropzone.style'

class Dropzone extends Component {
  static propTypes = {
    defaultImage: PropTypes.string,
    onDrop: PropTypes.func,
    onClose: PropTypes.func,
    getDropzoneFile: PropTypes.func,
    defaultFile: PropTypes.shape({}),
    onShouldImage: PropTypes.func,
    onImageUrl: PropTypes.func,
    id: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
  }

  static defaultProps = {
    onDrop: () => {},
    onClose: () => {},
    getDropzoneFile: () => {},
    defaultImage: null,
    defaultFile: null,
    onShouldImage: () => {},
    onImageUrl: () => {},
    id: null,
  }

  state = {
    shouldImage: false,
    imageUrl: '',
    file: null,
    isDefaultImage: false
  }

  setDefaultImage(imageUrl) {
    this.setState({
      shouldImage: true,
      imageUrl,
      isDefaultImage: true
    })
  }

  componentDidMount() {
    this.onOpen()
    this.imageContainerClassName = this.props.id
      ? this.props.id
      : 'upload-image-container'
  }

  componentDidUpdate(prevProps, prevState) {
    const { getDropzoneFile, onImageUrl, onShouldImage } = this.props
    const isDropzoneChanged =
      this.state.file !== prevState.file ||
      this.state.shouldImage !== prevState.shouldImage
    if (isDropzoneChanged && getDropzoneFile) {
      getDropzoneFile(this.state.file, this.state.shouldImage)
    }
    if (this.state.shouldImage !== prevState.shouldImage) {
      onShouldImage(this.state.shouldImage)
    }
    if (this.state.imageUrl !== prevState.imageUrl) {
      onImageUrl(this.state.imageUrl)
    }
  }

  onOpen = () => {
    const { defaultImage, defaultFile } = this.props
    if (defaultImage) {
      this.setDefaultImage(defaultImage)
    } else {
      this.resetDropzone()
    }

    if (defaultFile) {
      this.setState({ file: defaultFile })
    }
  }

  resetDropzone() {
    this.setState({
      shouldImage: false,
      imageUrl: '',
      file: null,
      isDefaultImage: false
    })
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const { onDrop } = this.props
    if (acceptedFiles[0]) {
      this.setState({
        shouldImage: true,
        file: acceptedFiles[0],
        imageUrl: URL.createObjectURL(acceptedFiles[0])
      })
    }
    if (onDrop) {
      onDrop(acceptedFiles, rejectedFiles)
    }
  }

  uploadMouseOut = () => {
    const image =
      document.querySelector(`.${this.imageContainerClassName}`)
    if (image) {
      image.classList.remove('blur')
    }
  }

  uploadMouseOver = () => {
    const image =
      document.querySelector(`.${this.imageContainerClassName}`)
    if (image) {
      image.classList.add('blur')
    }
  }

  onCloseClick = e => {
    const { onDrop } = this.props
    this.setState({
      shouldImage: false,
      imageUrl: '',
      file: null,
      isDefaultImage: false
    })
    if (onDrop) {
      onDrop([], [])
    }
    e.stopPropagation()
    this.props.onClose()
  }

  render() {
    const { onDrop, defaultImage, ...rest } = this.props
    const { shouldImage, imageUrl, isDefaultImage } = this.state
    return (
      <Main {...rest}
        activeClassName='active'
        accept='image/png,image/jpeg,image/gif'
        onDrop={this.onDrop}
        shouldImage={shouldImage}
        width={this.props.width}
        height={this.props.height}
      >
        {shouldImage &&
          <Main.ImageContainer imageUrl={imageUrl}
            isDefaultImage={isDefaultImage}
            className={this.imageContainerClassName}
          />}
        {shouldImage &&
          <Main.CloseImage onClick={this.onCloseClick}>
            <Icon type='close' />
          </Main.CloseImage>
        }
        <Main.UploadContainer
          shouldImage={shouldImage}
          onMouseOver={this.uploadMouseOver}
          onMouseOut={this.uploadMouseOut}
        >
          <Main.UploadIcon type='picture' />
          <Main.UploadText>{
            this.props.children
              ? this.props.children
              : 'Click or drag to upload'
          }
          </Main.UploadText>
        </Main.UploadContainer>
      </Main>
    )
  }
}

export default Dropzone
