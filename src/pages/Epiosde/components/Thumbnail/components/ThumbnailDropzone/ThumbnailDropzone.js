import React from 'react'
import PropTypes from 'prop-types'
import Main from './ThumbnailDropzone.style'

const ThumbnailDropzone = props => {
  const { parentState, setParentState } = props
  const { shouldThumbnail, thumbnailLink } = parentState
  const { setShouldThumbnail,
    setShouldUploadThumbnailFile,
    setThumbnailLink,
    setShouldDeleteThumbnailFile } = setParentState
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setThumbnailLink(URL.createObjectURL(acceptedFiles[0]))
      setShouldUploadThumbnailFile(true)
      setShouldThumbnail(true)
      setShouldDeleteThumbnailFile(true)
      props.onThumbnailDrop(acceptedFiles[0])
    }
  }

  return (
    <Main>
      <Main.ThumbnailWrapper>
        {shouldThumbnail
            ? (
              <Main.ThumbnaiImage className='thumbnail' src={thumbnailLink} alt='thumbnail' />
                  )

            : (
              <Main.Dropzone
                activeClassName='active'
                onDrop={onDrop}
                accept='.jpg, .png, .jpeg'
                disabled={shouldThumbnail}
              >
                <Main.UploadContainer>
                  <Main.UploadIcon type='picture' />
                  <Main.UploadText>
                    Click or drag to attach
                  </Main.UploadText>
                </Main.UploadContainer>
              </Main.Dropzone>
            )
          }
      </Main.ThumbnailWrapper>
    </Main>
  )
}

ThumbnailDropzone.propTypes = {
  onThumbnailDrop: PropTypes.func.isRequired,
  parentState: PropTypes.shape({}).isRequired,
  setParentState: PropTypes.shape({}).isRequired
}

export default ThumbnailDropzone
