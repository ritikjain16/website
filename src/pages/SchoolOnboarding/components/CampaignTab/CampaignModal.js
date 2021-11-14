import { ShareAltOutlined } from '@ant-design/icons'
import { Select, Tooltip } from 'antd'
import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import MainModal from '../../../../components/MainModal'
import {
  CloseIcon, FlexContainer, StyledButton, StyledDivider,
  StyledSelect, SectionButton
} from '../../SchoolOnBoarding.style'
import SchoolInput from '../SchoolInput'
import batchCreationStatus from '../../../../constants/batchCreationStatus'

const { Option } = Select

class CampaignModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedGrade: '',
      section: '',
      link: ''
    }
  }
  onClose = () => {
    const { onModalClose } = this.props
    this.setState({
      selectedGrade: '',
      section: '',
      link: ''
    }, () => onModalClose())
  }
  getBatchesCount = () => {
    let count = 0
    const { batchRule, selectedBatch } = this.props
    if (batchRule === 'grade') {
      count = selectedBatch.length
    } else {
      selectedBatch.forEach(({ sections }) => count += sections.length)
    }
    return count
  }
  getModalHeader = () => {
    const { modalContent, modalType, title, schoolName } = this.props
    if (modalType === 'linkModal') {
      return (
        <>
          <h1>{title}</h1>
          <h3>{get(modalContent, 'title')}</h3>
        </>
      )
    }
    if (modalType === 'ConfirmBatchDetails') {
      return (
        <>
          <h1>{title}</h1>
          <h3>{schoolName}</h3>
        </>
      )
    }
    return null
  }
  getResisterLink = (code) => {
    const { selectedGrade, section } = this.state
    let link = ''
    if (process.env.REACT_APP_NODE_ENV === 'staging') {
      link = `https://tekie-web-dev.herokuapp.com/login?code=${code}${selectedGrade ? `&grade=${selectedGrade}` : ''}${section ? `&section=${section}` : ''}`
    } else {
      link = `https://www.tekie.in/login?code=${code}${selectedGrade ? `&grade=${selectedGrade}` : ''}${section ? `&section=${section}` : ''}`
    }
    return link
  }
  getModalContent = () => {
    const { modalType, registerLink,
      campaignType, campaignTitle, selectedBatch,
      campaignsUpdateStatus, modalContent,
      onConfirm } = this.props
    const detailsStyle = {
      width: '80%',
      display: 'grid',
      gridTemplateColumns: '40% 60%',
      alignItems: 'baseline'
    }
    const { selectedGrade, section, link } = this.state
    if (modalType === 'linkModal') {
      return (
        <>
          {
            get(modalContent, 'type') === 'b2b' && (
              <>
                <FlexContainer justify='flex-start'>
                  <h2 className='studentTab__selectTitle'>Choose Grade</h2>
                  <StyledSelect
                    value={selectedGrade}
                    onChange={value => this.setState({ selectedGrade: value })}
                  >
                    {
                      get(modalContent, 'schoolClasses', []).map((cls) => (
                        <Option value={get(cls, 'grade')} key={get(cls, 'grade')} >{get(cls, 'grade')}</Option>
                      ))
                    }
                  </StyledSelect>
                </FlexContainer>
                {
                  selectedGrade && (
                    <FlexContainer justify='flex-start'>
                      <h2 className='studentTab__selectTitle'>Choose Section</h2>
                      <StyledSelect
                        value={section}
                        onChange={value => this.setState({ section: value })}
                      >
                        {
                          get(get(modalContent, 'schoolClasses', []).find(gr => get(gr, 'grade') === selectedGrade), 'sections', []).map((sect) => (
                            <Option value={get(sect, 'section')} key={get(sect, 'section')} >{get(sect, 'section')}</Option>
                          ))
                        }
                      </StyledSelect>
                    </FlexContainer>
                  )
                }
              </>
            )
          }
          <FlexContainer justify='center'>
            {
              get(modalContent, 'batchCreationStatus') === batchCreationStatus.complete ? (
                <StyledButton type='primary' onClick={() => this.setState({ link: this.getResisterLink(registerLink) })}>Generate Link</StyledButton>
              ) : (
                <Tooltip title='Please add slots in the campaign to generate link'>
                  <StyledButton type='primary' disabled>Generate Link</StyledButton>
                </Tooltip>
              )
            }
          </FlexContainer>
          <StyledDivider style={{ margin: '1vw 0' }} />
          <SchoolInput
            bodyStyle={{ height: 'auto', width: '75%' }}
            readOnly
            copyLink
            value={link}
          />
          <StyledButton type='primary'>
            Share Link
            <ShareAltOutlined className='shareIcon' />
          </StyledButton>
        </>
      )
    }
    if (modalType === 'ConfirmBatchDetails') {
      return (
        <>
          <FlexContainer style={detailsStyle}>
            <h3>Campaign Model:</h3>
            <h2>{campaignType}</h2>
          </FlexContainer>
          <FlexContainer style={detailsStyle}>
            <h3>Campaign Name:</h3>
            <h2>{campaignTitle}</h2>
          </FlexContainer>
          <FlexContainer style={detailsStyle}>
            <h3>Selected Grades:</h3>
            <div>
              {
                selectedBatch.map(({ grade }) => (
                  <h4>{grade}</h4>
                ))
              }
            </div>
          </FlexContainer>
          <FlexContainer style={{ width: '60%' }}>
            <SectionButton
              campaign
              onClick={this.onClose}
              style={{ margin: '0 10px' }}
              type='default'
            >Edit Details
            </SectionButton>
            <SectionButton
              campaign
              loading={campaignsUpdateStatus && get(campaignsUpdateStatus.toJS(), 'loading')}
              style={{ margin: '0 10px' }}
              type='primary'
              onClick={() => onConfirm(null, null, 'updateBatch')}
            >Confirm Details
            </SectionButton>
          </FlexContainer>
        </>
      )
    }
  }
  render() {
    const {
      visible, modalType,
    } = this.props
    return (
      <MainModal
        visible={visible}
        onCancel={this.onClose}
        maskClosable
        bodyStyle={{ padding: 0 }}
        closable={false}
        width='650px'
        centered
        destroyOnClose
        footer={null}
      >
        <FlexContainer noPadding style={{ width: '100%' }}>
          <div style={{ padding: '0.5vw 1.5vw' }}>
            {this.getModalHeader()}
            <CloseIcon onClick={this.onClose} />
          </div>
          {
            modalType === 'ConfirmBatchDetails' && (
              <h4 className='campaign__batchCount'>
                No. of batches:
                <strong>{this.getBatchesCount()}</strong>
              </h4>
            )
          }
        </FlexContainer>
        <StyledDivider style={{ marginBottom: '1vw' }} />
        <FlexContainer
          noPadding
          justify='center'
          style={{ flexDirection: 'column', paddingBottom: '1vw' }}
        >
          {this.getModalContent()}
        </FlexContainer>
      </MainModal>
    )
  }
}

CampaignModal.propTypes = {
  batchRule: PropTypes.string.isRequired,
  selectedBatch: PropTypes.arrayOf({}).isRequired,
  modalType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  registerLink: PropTypes.string.isRequired,
  onModalClose: PropTypes.func.isRequired,
  campaignType: PropTypes.string.isRequired,
  campaignTitle: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  campaignsUpdateStatus: PropTypes.shape({}).isRequired,
  schoolName: PropTypes.string.isRequired,
  modalContent: PropTypes.shape({}).isRequired
}

export default CampaignModal
