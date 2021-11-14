import React, { useEffect, useState } from 'react'
import MainTable from '../../../components/MainTable'
import EditBannerStyle from '../EditBanner.style'

const FileInput = ({ setFieldValue, fileName, lottieUri, handleFileChange }) => {
  const [file, setFile] = useState(fileName || null)
  const [empty, setEmpty] = useState(false)
  useEffect(() => {
    if (lottieUri) handleFileChange(null, 'lottie', lottieUri)
  }, [lottieUri])
  const handleChange = (e) => {
    if (e.target.files[0]) {
      if (fileName && lottieUri) {
        setFieldValue('lottieName', null)
        setFieldValue('lottieUri', null)
      }
      setFieldValue('lottie', e.target.files[0])
      handleFileChange(e.target.files[0], 'lottie')
      setFile(e.target.files[0].name)
      setEmpty(false)
    }
  }
  return (
    <div style={{ position: 'relative' }} >
      {!empty && file &&
        <EditBannerStyle.CloseImage
          onClick={() => {
            setFieldValue('lottie', null)
            setEmpty(true)
            if (fileName && lottieUri) {
              setFieldValue('lottieName', null)
              setFieldValue('lottieUri', null)
            }
            setFile(null)
          }}
        >X
        </EditBannerStyle.CloseImage>}
      <EditBannerStyle.StyledLabel htmlFor='fileInput' style={{ width: '60%' }}>
        <MainTable.ActionItem.PublishIcon
          style={{ marginRight: '10px' }}
        />{!file ? 'Please upload Lottie file' : file}
      </EditBannerStyle.StyledLabel>
      <EditBannerStyle.StyledInput
        accept='application/json'
        id='fileInput'
        type='file'
        name='lottie'
        style={{ display: 'none' }}
        onChange={(e) => handleChange(e)}
        autoComplete='off'
      />
    </div>
  )
}

export default FileInput
