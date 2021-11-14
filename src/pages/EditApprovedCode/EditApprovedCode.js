import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Spin, Empty, Icon } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { get, debounce } from 'lodash'
import { MENTOR } from '../../constants/roles'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import fetchUserSavedCodes from '../../actions/userSavedCodes/fetchUserSavedCodes'
import updateUserApprovedCode from '../../actions/userApprovedCodes/updateUserApprovedCodes'
import fetchConvertedUserInfo from '../../actions/profile/fetchConvertedUserInfo'
import EditApprovedCodeStyle from './EditApprovedCode.style'
import StudentDetails from './components/StudentDetails'
import CodeMetaDetails from './components/CodeMetaDetails'
import CodePreview from './components/CodePreview'
import Tags from './components/Tags'
import MainTable from '../../components/MainTable'
import './editor.scss'

class EditApprovedCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUserSavedCode: null
    }
  }

  async componentDidMount() {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole && savedRole === MENTOR) {
      const savedId = getDataFromLocalStorage('login.id')
      await fetchConvertedUserInfo(0, savedId, null, 0)
      const salesOperations = this.props.salesOperation && this.props.salesOperation.toJS()
      const menteeIds = salesOperations.map(salesOperation => salesOperation.studentId)
      await this.setState({
        menteeIds
      })
    }
    this.fetchUserSavedCodeData(true)
  }

  componentDidUpdate(preProps) {
    const savedCodeId = this.props.match.params.id
    const prevSavedCodeId = preProps.match.params.id
    if (savedCodeId !== prevSavedCodeId) {
      this.fetchUserSavedCodeData(false)
    }
  }

  getQueryFilters = (prevFilterQuery) => {
    let filterQuery = '{isApprovedForDisplay: accepted},'
    if (prevFilterQuery) {
      if (prevFilterQuery.requestedByMentee) {
        filterQuery += '{hasRequestedByMentee:true},'
      }
      if (prevFilterQuery.requestedByMentor) {
        filterQuery += '{hasRequestedByMentor:true},'
      }
    }
    return filterQuery
  }

  fetchUserSavedCodeData = async (updateFetch) => {
    const prevFilterQuery = get(this.props.history, 'location.state.filterQuery')
    const savedCodeId = this.props.match.params.id
    let filterQuery = this.getQueryFilters(prevFilterQuery)
    if (updateFetch) {
      const savedRole = getDataFromLocalStorage('login.role')
      if (savedRole && savedRole === MENTOR) {
        const { menteeIds } = this.state
        if (menteeIds && menteeIds.length) {
          filterQuery += `{user_some:{id_in:[${getIdArrForQuery(menteeIds)}]}},`
          await fetchUserSavedCodes(filterQuery, 0, 0)
        }
      } else {
        await fetchUserSavedCodes(filterQuery, 0, 0)
      }
    }
    const userSavedCodes = this.props.userSavedCodes &&
      this.props.userSavedCodes.toJS()
    this.setState({
      prevFilterQuery,
      selectedUserSavedCode: userSavedCodes.filter(savedCode => savedCode.id === savedCodeId)[0]
    })
  }

  updateApprovedCode = (id, input) => {
    updateUserApprovedCode(id, input).then(() => {
      this.fetchUserSavedCodeData(true)
    })
  }

  onPublish = (id, isPublished) => {
    const input = {
      status: 'published'
    }
    if (isPublished) input.status = 'unpublished'
    this.updateApprovedCode(id, input)
  }

  loadPrevData = () => {
    const userSavedCodesData = this.props.userSavedCodes && this.props.userSavedCodes.toJS()
    const index = this.getSelectedSavedCodeIndex() - 1
    if (userSavedCodesData[index] && userSavedCodesData[index].id) {
      this.props.history.replace(`${userSavedCodesData[index].id}`, {
        filterQuery: this.state.prevFilterQuery
      })
    }
  }

  loadNextData = () => {
    const userSavedCodesData = this.props.userSavedCodes && this.props.userSavedCodes.toJS()
    const index = this.getSelectedSavedCodeIndex() + 1
    if (userSavedCodesData[index] && userSavedCodesData[index].id) {
      this.props.history.replace(`${userSavedCodesData[index].id}`, {
        filterQuery: this.state.prevFilterQuery
      })
    }
  }

  getSelectedSavedCodeIndex = () => {
    const { selectedUserSavedCode } = this.state
    const userSavedCodesData = this.props.userSavedCodes && this.props.userSavedCodes.toJS()
    if (userSavedCodesData && userSavedCodesData.length && selectedUserSavedCode) {
      return userSavedCodesData.findIndex(savedCode => savedCode.id === selectedUserSavedCode.id)
    }
    return null
  }

  render() {
    const userSavedCodeCurrentPageCount = this.props.userSavedCodes &&
    this.props.userSavedCodes.toJS().length
    const { selectedUserSavedCode: userSavedCodes } = this.state
    const approvedCodeTags = this.props.userApprovedCodeTags &&
      this.props.userApprovedCodeTags.toJS()
    const isUpdating = this.props.isUserSavedCodeFetching ||
      this.props.isUserApprovedCodeUpdating &&
      this.props.isUserApprovedCodeUpdating.toJS().loading
    const isMentorLoggedIn = getDataFromLocalStorage('login.role') === MENTOR

    const isSpinnerVisible = this.props.isUserSavedCodeFetching
      || Boolean(isUpdating)
      || !!this.props.isSalesOperationFetching

    if (!userSavedCodes && !this.props.isUserSavedCodeFetching
      && !this.props.isSalesOperationFetching) {
      return (
        <EditApprovedCodeStyle.EmptyState>
          <Empty />
        </EditApprovedCodeStyle.EmptyState>
      )
    }
    return (
      <EditApprovedCodeStyle>
        <EditApprovedCodeStyle.PrevBtn
          disabled={isSpinnerVisible}
          style={{ visibility: this.getSelectedSavedCodeIndex() > 0 ? 'visible' : 'hidden' }}
          onClick={debounce(this.loadPrevData, 300)}
        >
          <LeftOutlined />
        </EditApprovedCodeStyle.PrevBtn>
        <EditApprovedCodeStyle.Container>
          <div
            style={{
              minWidth: 845,
              padding: '1rem',
              position: 'relative'
            }}
          >
            <Spin
              spinning={isSpinnerVisible}
              size='large'
            >
              <div
                style={{
                  display: 'flex', justifyContent: 'flex-end', fontSize: '20px'
                }}
              >
                <button
                  style={{ border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    this.props.history.push('/ums/codeApproval', {
                      filterQuery: this.state.prevFilterQuery
                    })
                  }}
                >
                  <Icon type='cross' />
                </button>
              </div>
              <StudentDetails
                studentName={get(userSavedCodes, 'studentName', '')}
                grade={get(userSavedCodes, 'grade', '')}
              />
              <CodeMetaDetails
                title='Title'
                userSavedCodes={userSavedCodes}
                updateApprovedCode={this.updateApprovedCode}
              />
              <CodeMetaDetails
                title='Description'
                userSavedCodes={userSavedCodes}
                updateApprovedCode={this.updateApprovedCode}
              />
              <CodePreview
                userSavedCodes={userSavedCodes}
                updateApprovedCode={this.updateApprovedCode}
              />
              <Tags
                userApprovedCode={get(userSavedCodes, 'userApprovedCode')}
                fetchUserSavedCodeData={() => { this.fetchUserSavedCodeData(true) }}
                approvedCodeTags={approvedCodeTags}
              />
            </Spin>
          </div>
        </EditApprovedCodeStyle.Container>
        <EditApprovedCodeStyle.NextBtn
          disabled={isSpinnerVisible}
          style={{
            visibility: this.getSelectedSavedCodeIndex() < (userSavedCodeCurrentPageCount - 1) ?
              'visible' : 'hidden'
          }}
          onClick={debounce(this.loadNextData, 300)}
        >
          <RightOutlined />
        </EditApprovedCodeStyle.NextBtn>
        {!isMentorLoggedIn && (
          <EditApprovedCodeStyle.StyledButton
            onClick={() => {
              const isPublished = get(userSavedCodes, 'userApprovedCode.status') === 'published'
              this.onPublish(get(userSavedCodes, 'userApprovedCode.id'), isPublished)
            }
            }
          >
            {get(userSavedCodes, 'userApprovedCode.status') === 'published' ?
              (<>
                Unpublish
                <MainTable.ActionItem.UnpublishIcon style={{ color: '#fff' }} />
              </>
              ) : (
                <>
                  Publish
                  <MainTable.ActionItem.PublishIcon style={{ color: '#fff' }} />
                </>
              )
            }
          </EditApprovedCodeStyle.StyledButton>
        )}
      </EditApprovedCodeStyle>
    )
  }
}

EditApprovedCode.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
}

export default EditApprovedCode
