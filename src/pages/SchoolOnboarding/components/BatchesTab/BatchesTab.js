import { CalendarOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import { fetchCampaignBatches } from '../../../../actions/SchoolOnboarding'
import {
  BatchName,
  FlexContainer, MDTable, SectionButton,
  StudentModalBox, UserIcon
} from '../../SchoolOnBoarding.style'
import getSlotLabel from '../../../../utils/slots/slot-label'
import campaignTypes from '../../../../constants/campaignType'

const { b2b2cEvent } = campaignTypes

class BatchesTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      batchData: [],
      currentPage: 1,
      perPage: 20,
      skip: 0,
    }
  }
  fetchBatchesData = async () => {
    const { perPage, skip } = this.state
    const { chosenCampaign } = this.props
    await fetchCampaignBatches({
      id: chosenCampaign,
      perPage,
      skip
    })
  }
  componentDidMount = async () => {
    const { chosenCampaign, campaigns } = this.props
    if (campaigns.length > 0 && chosenCampaign) {
      this.fetchBatchesData()
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { chosenCampaign, campaignBatchesFetching, schoolId } = this.props
    if (prevProps.schoolId !== schoolId && schoolId) {
      this.setState({
        batchData: []
      })
    }
    if (prevProps.chosenCampaign !== chosenCampaign && chosenCampaign) {
      this.setState({
        currentPage: 1,
        perPage: 20,
        skip: 0,
        batchData: []
      }, () => this.fetchBatchesData())
    }
    if ((campaignBatchesFetching && !get(campaignBatchesFetching.toJS(), 'loading')
      && get(campaignBatchesFetching.toJS(), 'success') &&
      (prevProps.campaignBatchesFetching !== campaignBatchesFetching))) {
      this.convertDataToTable()
    }
  }
  renderTableContent = (type, content, data) => {
    const { history, schoolId } = this.props
    if (type === 'scheduling') {
      return (
        <SectionButton
          type='primary'
          disabled={get(data, 'bookingDate') && get(data, 'slot')}
          onClick={() => {
            if (this.getCampaignType() === b2b2cEvent) {
              localStorage.setItem('eventView', true)
            }
            history.push({
              pathname: `/sms/school-dashboard/${schoolId}/batches/${data.id}/scheduling`,
              state: {
                batchData: data
              }
              })
            }
          }
        >
          {get(data, 'bookingDate') && get(data, 'slot') ?
            `${moment(get(data, 'bookingDate')).format('L')} : 
            ${getSlotLabel(Number(get(data, 'slot').replace('slot', ''))).startTime}` :
            'Add Schedule'}<CalendarOutlined />
        </SectionButton>
      )
    }
    if (type === 'mentors') {
      return (
        <SectionButton
          type='primary'
          onClick={() => {
            if (this.getCampaignType() === b2b2cEvent) {
              localStorage.setItem('eventView', true)
            }
            history.push({
              pathname: `/sms/school-dashboard/${schoolId}/batches/${data.id}/mentors`,
              state: {
                batchData: data
              }
              })
          }
          }
        >
          {get(data, 'allottedMentor.id') ? get(data, 'allottedMentor.name') : 'Choose Mentor'}<UserIcon />
        </SectionButton>
      )
    }
    if (type === 'students') {
      return (
        <BatchName
          onClick={() => {
            if (this.getCampaignType() === b2b2cEvent) {
              localStorage.setItem('eventView', true)
            }
            history.push({
            pathname: `/sms/school-dashboard/${schoolId}/batches/${data.id}/students`,
            state: {
              batchData: data
            }
            })
          }
          }
        >
          {content}
        </BatchName>)
    }
    return null
  }
  gradeNumber = (grade) => grade.replace('Grade', '')
  renderClass = (data, type) => {
    if (type === 'grade') {
      return (
        data.length > 0 ? data.map((g, i) => i === data.length - 1 ? `${this.gradeNumber(g)}` : `${this.gradeNumber(g)},`) : '-'
      )
      /* eslint-disable no-else-return */
    } else {
      return (
        data.length > 0 ? data.map((s, i) => i === data.length - 1 ? `${s}` : `${s},`) : '-'
      )
    }
  }
  convertDataToTable = () => {
    this.setState({
      batchData: this.props.campaignBatches && this.props.campaignBatches.toJS()
    }, () => {
      let columns = []
      if (this.state.batchData.length > 0) {
        columns = [
          {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
          },
          {
            title: 'Batch Code',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            render: (content, data) => this.renderTableContent('students', content, data)
          },
          {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            align: 'center',
            render: (grade) => this.renderClass(grade, 'grade')
          },
          {
            title: 'Sections',
            dataIndex: 'section',
            key: 'section',
            align: 'center',
            render: (section) => this.renderClass(section)
          },
          {
            title: 'Students',
            dataIndex: 'students',
            key: 'students',
            align: 'center',
          },
          {
            title: 'Allot Mentor',
            dataIndex: 'allotedMentor',
            key: 'allotedMentor',
            align: 'center',
            render: (_, data) => this.renderTableContent('mentors', null, data)
          },
          {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            align: 'center',
          },
          {
            title: 'Schedule',
            dataIndex: 'Schedule',
            key: 'Schedule',
            align: 'center',
            render: (_, data) => this.renderTableContent('scheduling', null, data)
          },
        ]
        this.setState({
          columns
        })
      }
    })
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      () => this.fetchBatchesData()
    )
  }
  getCampaignType = () => {
    let type = ''
    const { chosenCampaign, campaigns } = this.props
    if (chosenCampaign && campaigns.length > 0) {
      type = get(campaigns.find((campaign) => get(campaign, 'id') === chosenCampaign), 'type')
    }
    return type
  }
  render() {
    const { chosenCampaign, campaigns, selectCampaign,
      campaignBatchesFetching, batchesMeta } = this.props
    const { columns, batchData, perPage, currentPage } = this.state
    return (
      <>
        <FlexContainer justify='flex-start' style={{ flexWrap: 'wrap' }}>
          {
            campaigns.map(({ id, title }) => (
              <SectionButton
                type={chosenCampaign === id ? 'primary' : 'default'}
                onClick={() => selectCampaign(id)}
                style={{ margin: '1vw' }}
              >{title}
              </SectionButton>
            ))
          }
        </FlexContainer>
        <FlexContainer justify='center'>
          <StudentModalBox style={{ width: 'auto' }}>
            <h4>Model: {this.getCampaignType()}</h4>
            <h4 style={{ marginLeft: '10px' }}>No. of batches: {batchData.length > 0 ? batchesMeta : 0}</h4>
          </StudentModalBox>
        </FlexContainer>
        <MDTable
          columns={columns}
          dataSource={batchData}
          loading={campaignBatchesFetching && get(campaignBatchesFetching.toJS(), 'loading')}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
        {
          batchesMeta > perPage && (
            <FlexContainer justify='center'>
              <Pagination
                total={batchesMeta || 0}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPage}
              />
            </FlexContainer>
          )
        }
      </>
    )
  }
}

BatchesTab.propTypes = {
  campaigns: PropTypes.arrayOf({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  schoolId: PropTypes.string.isRequired,
  campaignBatches: PropTypes.arrayOf({}).isRequired,
  chosenCampaign: PropTypes.string.isRequired,
  selectCampaign: PropTypes.string.isRequired,
  campaignBatchesFetching: PropTypes.shape({}).isRequired,
  batchesMeta: PropTypes.number.isRequired,
}

export default BatchesTab
