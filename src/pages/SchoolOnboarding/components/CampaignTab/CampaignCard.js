import React from 'react'
import { get } from 'lodash'
import { Popconfirm } from 'antd'
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import {
  CampaignBox, FlexContainer, LinkIcon, SectionButton, SettingIcon
} from '../../SchoolOnBoarding.style'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'
import { addPosterToCampaign, deleteCampaign } from '../../../../actions/SchoolOnboarding'
import batchCreationStatus from '../../../../constants/batchCreationStatus'
import MainTable from '../../../../components/MainTable'
import campaignTypes from '../../../../constants/campaignType'

const { todo, inProgress, complete } = batchCreationStatus

const { b2b2cEvent } = campaignTypes

class CampaignCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageFile: null,
      imageUrl: null,
      showPopup: false,
      isSubmitting: false
    }
  }
  dropzoneRef = React.createRef(null)
  onDropFile = (file) => {
    this.setState({ imageFile: file })
  }
  updatePoster = async () => {
    const { imageFile } = this.state
    const { campaign } = this.props
    if (imageFile) {
      addPosterToCampaign({
        file: imageFile,
        campaignId: get(campaign, 'id'),
        prevFileId: get(campaign, 'poster.id')
      })
    }
  }
  renderViewButton = () => {
    const { campaign, selectCampaignBatch, onCreateBatch } = this.props
    if (get(campaign, 'batchCreationStatus') === todo) {
      return (
        <SectionButton
          campaign
          style={{ margin: '5px 0' }}
          type='primary'
          onClick={onCreateBatch}
        >Create Batches
        </SectionButton>
      )
    }
    if (get(campaign, 'batchCreationStatus') === inProgress) {
      return <SectionButton disabled campaign style={{ margin: '5px 0' }} type='primary'>In Progress</SectionButton>
    }
    if (get(campaign, 'batchCreationStatus') === complete) {
      return (
        <>
          <SectionButton
            campaign
            style={{ margin: '5px 0' }}
            onClick={() => selectCampaignBatch(get(campaign, 'id'))}
            type='primary'
          >View Batches
          </SectionButton>
        </>
      )
    }
  }
  deleteAction = async () => {
    const { campaign } = this.props
    this.setState({
      isSubmitting: true,
      showPopup: true
    })
    await deleteCampaign(get(campaign, 'id'))
    this.setState({
      isSubmitting: false,
      showPopup: false
    })
  }

  onEdit = () => {
    const { onSettingClick, onCreateBatch, campaign } = this.props
    if (get(campaign, 'batchCreationStatus') === complete && get(campaign, 'type') === b2b2cEvent) {
      onCreateBatch()
    } else {
      onSettingClick()
    }
  }
  render() {
    const { imageFile, showPopup, isSubmitting } = this.state
    const flexCol = { flexDirection: 'column' }
    const {
      onOpenModal, campaign
    } = this.props
    return (
      <CampaignBox>
        <FlexContainer style={flexCol} noPadding>
          <Dropzone
            width='100%'
            height='100%'
            style={{ margin: '0' }}
            getDropzoneFile={this.onDropFile}
            ref={this.dropzoneRef}
            defaultImage={
              getFullPath(get(campaign, 'poster.uri')) ||
              this.state.imageUrl
            }
            defaultFile={imageFile}
            onImageUrl={imageUrl => this.setState({ imageUrl })}
          >Click or drag to attach
          </Dropzone>
          <FlexContainer style={{ margin: '0', backgroundColor: '#04316B', color: 'white', width: '100%' }}>
            <button
              onClick={!this.state.imageFile ? null : this.updatePoster}
              className='campaign__uploadButton'
              style={{ cursor: !this.state.imageFile ? 'not-allowed' : 'pointer' }}
              type='text'
            >
              <span>
                {get(campaign, 'poster.uri') ||
                  get(this.state, 'imageFile') ? 'Edit' : 'Upload'}
              </span><EditOutlined />
            </button>
            <FullscreenOutlined style={{ fontSize: '1.2vw', cursor: 'pointer' }} />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          noPadding
          style={{
            ...flexCol, marginLeft: '8px', textAlign: 'center'
          }}
        >
          <FlexContainer justify='space-between' noPadding style={{ width: '100%' }}>
            <div style={{ flex: '1' }}>
              <h4 className='campaign__name' style={{ flex: '1' }}>
                {get(campaign, 'title')}
              </h4>
              <p style={{ opacity: '0.6' }}>{get(campaign, 'type')}</p>
            </div>
            <div>
              <SettingIcon onClick={this.onEdit} />
              {
                get(campaign, 'batchCreationStatus') === todo && (
                  <MainTable.ActionItem.IconWrapper style={{ marginLeft: '10px' }}>
                    <Popconfirm
                      title='Do you want to delete this Campaign ?'
                      placement='top'
                      visible={showPopup}
                      onConfirm={this.deleteAction}
                      onCancel={() =>
                        this.setState(prevState => ({ showPopup: !prevState.showPopup }))}
                      okText='Yes'
                      cancelText='Cancel'
                      key='delete'
                      okButtonProps={{ loading: isSubmitting }}
                      overlayClassName='popconfirm-overlay-primary'
                    >
                      <MainTable.ActionItem.DeleteIcon
                        onClick={() =>
                          this.setState(
                            (prevstate) => ({
                              showPopup: !prevstate.showPopup
                            })
                          )
                        }
                      />
                    </Popconfirm>
                  </MainTable.ActionItem.IconWrapper>
                )
              }
            </div>
          </FlexContainer>
          <FlexContainer noPadding style={flexCol}>
            <SectionButton
              campaign
              onClick={onOpenModal}
              style={{ margin: '5px 0' }}
              type='default'
            >Generate Link <LinkIcon />
            </SectionButton>
            {this.renderViewButton()}
          </FlexContainer>
        </FlexContainer>
      </CampaignBox>
    )
  }
}

CampaignCard.propTypes = {
  campaign: PropTypes.shape({}).isRequired,
  selectCampaignBatch: PropTypes.func.isRequired,
  onCreateBatch: PropTypes.func.isRequired,
  onOpenModa: PropTypes.func.isRequired,
  onSettingClick: PropTypes.func.isRequired,
}

export default CampaignCard
