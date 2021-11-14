/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { Button, Input, Spin } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import uploadFile from '../../../actions/utils/uploadFile'
import MainModal from '../../../components/MainModal'
import generateCourseCompletionCertificate from '../../../utils/generateCourseCompletionCertificate'
import generateJourneySnapshot from '../../../utils/generateJourneySnapshot'

class ViewCertificateModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blobCertificateUrl: '',
      nameEntered: '',
      blobJourneySnapshotUrl: '',
      canvasImageBlob: null
    }
    this.canvasRef = React.createRef()
  }
  getUserProficiency = (userProfile) => {
    if (!userProfile) return 'PROFICIENT'
    const { topicsCompleted, proficientTopicCount, masteredTopicCount } = userProfile
    const proficientTopicsPer = (proficientTopicCount / topicsCompleted) * 100
    const masterTopicsPer = (masteredTopicCount / topicsCompleted) * 100
    if (proficientTopicsPer >= 20) {
      return 'PROFICIENT'
    } else if (masterTopicsPer >= 10) {
      return 'MASTER'
    }
    return 'FAMILIAR'
  }
  getCertificateUrl = async () => {
    const { nameEntered } = this.state
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    const { data } = this.props
    const userProfile = this.props.userProfile && this.props.userProfile.toJS()[0]
    const proficiencyLevel = this.getUserProficiency(userProfile)
    const lastSessionDate = get(data, 'courseEndingDate', '-')
    const blobCertificateUrl = await generateCourseCompletionCertificate(
      false,
      lastSessionDate,
      proficiencyLevel,
      data,
      nameEntered)
    if (blobCertificateUrl) {
      this.setState({
        blobCertificateUrl
      })
    }
  }
  /*
  upload course completion certificate as blob
  */
  uploadCompletionCertificate = async (
    file,
    courseCompletionId,
  ) => {
    if (courseCompletionId) {
      if (file) {
        const mappingInfo = file && {
          typeId: courseCompletionId,
          type: 'UserCourseCompletion',
          typeField: 'journeySnapshot'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const res = uploadFile(file, fileInfo, mappingInfo).then(ress => {
          if (ress.id) {
            return ress
          }
        })
        return res
      }
    }
    return {}
  }
  /*
    to avoid generating journey snapshot everytime,
    we will store it in the form of an image (blob)
  */
  convertCanvasToImage = () => {
    const canvasImage = this.canvasRef.current
    if (!get(canvasImage, 'toBlob')) {
      const dataURL = canvasImage.toDataURL()
      const bytes = atob(dataURL.split(',')[1])
      const arr = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i += 1) {
        arr[i] = bytes.charCodeAt(i)
      }
      const blob = new Blob([arr], { type: 'image/png' })
      URL.createObjectURL(blob)
      this.setState({
        canvasImageBlob: blob,
      }, () => console.log('canvasImageBlob', this.state.canvasImageBlob))
    } else {
      canvasImage.toBlob((blob) => {
        URL.createObjectURL(blob)
        this.setState({
          canvasImageBlob: blob,
        })
      })
    }
    return true
  }
  /*
  get url after generating certificate
  */
  getJourneySnapshotUrl = async () => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    const { data } = this.props
    const userSavedCodesRes = this.props.userSavedCodes && this.props.userSavedCodes.toJS()
    const userSavedCodes = get(userSavedCodesRes, 'data.userSavedCodes', [])
    const userApprovedCodes = get(userSavedCodesRes, 'data.userApprovedCodes', [])
    const userPqCount = get(userSavedCodesRes, 'data.userPracticeQuestionReportsMeta.count', 0)
    const userQuizCount = get(userSavedCodesRes, 'data.userQuizReportsMeta.count', 0)
    const avatarCode = get(data, 'user.studentProfile.profileAvatarCode', 'auli')
    const templateToFetch = (userApprovedCodes && userApprovedCodes > 0) ?
      'JourneySnapshot-1' : 'JourneySnapshot-2'
    const blobJourneySnapshotUrl = await generateJourneySnapshot(
      templateToFetch,
      data,
      userSavedCodes,
      userApprovedCodes,
      userPqCount + userQuizCount,
      avatarCode
    )
    if (blobJourneySnapshotUrl) {
      this.setState({
        blobJourneySnapshotUrl
      })
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { isModalVisible, asset } = this.props
    if (isModalVisible && !prevProps.isModalVisible) {
      if (asset === 'certificate') {
        await this.getCertificateUrl()
      } else {
        await this.getJourneySnapshotUrl()
      }
    }
  }
  handleNameChange = (event) => {
    this.setState({
      nameEntered: event.target.value
    })
  }
  changeNameInCertificate = async () => {
    await this.getCertificateUrl()
  }
  render() {
    const { isModalVisible, closeModal, asset, data } = this.props
    const { nameEntered, blobCertificateUrl } = this.state
    return (
      <MainModal
        visible={isModalVisible}
        title={asset === 'certificate' ? 'View Certificate' : 'View Journey Snapshot'}
        onCancel={() => {
          this.setState({
            nameEntered: ''
          }, () => closeModal())
        }}
        maskClosable={false}
        width='780px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          (asset === 'certificate') ?
            (this.state.blobCertificateUrl) ? (
              <div style={{ minHeight: 400 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 310 }}>
                  <Document
                    style={{ marginBottom: 15, overflow: 'scroll', height: 310 }}
                    file={this.state.blobCertificateUrl}
                    loading={<Spin spinning />}
                  >
                    <Page
                      width={400}
                      pageNumber={1}
                      canvasRef={this.canvasRef}
                    // onRenderSuccess={async () => {
                    //   await this.convertCanvasToImage()
                    //   const { id } = data
                    //   console.log('this.state.canvasImageBlob', this.state.canvasImageBlob)
                    //   console.log('id', id)
                    //   const res = await this.uploadCompletionCertificate(
                    //     this.state.canvasImageBlob,
                    //     id)
                    //   console.log('res obj', res)
                    // }}
                    />
                  </Document>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <h4>Edit Details</h4>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h4 style={{ marginRight: 10 }}>Name :</h4>
                    <Input
                      value={nameEntered}
                      type='text'
                      onChange={this.handleNameChange}
                      style={{ width: 200 }}
                      maxLength={25}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    style={{ marginLeft: 15 }}
                    onClick={this.changeNameInCertificate}
                    type='primary'
                  >
                    REGENERATE CERTIFICATE
                  </Button>
                  <Button
                    style={{ marginLeft: 15 }}
                    type='primary'
                  >
                    <a href={blobCertificateUrl}
                      download={`${get(data, 'course.title')}_proof_of_completion.pdf`}
                    >
                      DOWNLOAD
                    </a>
                  </Button>
                </div>
              </div>
            ) :
              <div style={{ minHeight: 400 }} />
            :
            null
        }
        {
          (asset !== 'certificate') ?
            (this.state.blobJourneySnapshotUrl) ? (
              <div style={{ minHeight: 400 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 310 }}>
                  <Document
                    style={{ marginBottom: 15 }}
                    file={this.state.blobJourneySnapshotUrl}
                    loading={<Spin spinning />}
                  >
                    <Page width={400} pageNumber={1} />
                  </Document>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                  <Button
                    style={{ marginLeft: 15, float: 'right' }}
                    type='primary'
                  >
                    <a href={this.state.blobJourneySnapshotUrl}
                      download={`${get(data, 'course.title')}_journey_snapshot.pdf`}
                    >
                      DOWNLOAD
                    </a>
                  </Button>
                </div>
              </div>
            ) :
              <div style={{ minHeight: 400 }} />
            :
            null
        }
      </MainModal>
    )
  }
}

export default ViewCertificateModal
