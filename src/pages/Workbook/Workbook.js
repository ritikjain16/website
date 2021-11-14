import { get } from 'lodash'
import React from 'react'
import fetchContentTags from '../../actions/contentTags/fetchContentTags'
import { fetchWorkbook } from '../../actions/workbook'
import TopicNav from '../../components/TopicNav'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import WorkBookModal from './components/WorkbookModal'
import WorkbookTable from './components/WorkbookTable/WorkbookTable'
import WorkbookStyle from './Workbook.style'

class WorkBook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topicId: this.props.match.params.topicId,
      openModal: false,
      operation: null,
      tags: [],
      editData: null,
      count: 0
    }
  }
  componentDidMount = async () => {
    const { topicId } = this.state
    if (!this.props.topicTitle) {
      this.props.fetchTopics(topicId)
    }
    await fetchWorkbook(topicId)
    await fetchContentTags(`{ and: [
        {status:published}
      ]
    }`, 0, 0)
  }
  componentDidUpdate = (prevProps) => {
    const { isContentTagsFetching, isContentTagsFetched } = this.props
    if (!isContentTagsFetching && isContentTagsFetched) {
      if (get(prevProps, 'contentTags') !== get(this.props, 'contentTags')) {
        this.setState({
          tags: this.props.contentTags ? this.props.contentTags.toJS() : []
        })
      }
    }
  }
  searchByFilter = () => {
    const { topicId } = this.state
    fetchWorkbook(topicId)
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  openEditModal = (data) => {
    this.setState({
      openModal: true,
      operation: 'edit',
      editData: data
    })
  }
  render() {
    const { openModal, operation, tags, topicId, editData, count } = this.state
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.workbook} />
        <WorkbookStyle.TopContainer>
          <div style={{ marginTop: '5px', marginRight: '10px' }}>Total Workbooks:{count}</div>
          <WorkbookStyle.StyledButton
            type='default'
            icon='plus'
            id='add-btn'
            onClick={this.openAddModal}
            disabled={this.props.isWorkbookFetching}
            style={{ marginRight: '10px' }}
          >
            ADD WORKBOOK
          </WorkbookStyle.StyledButton>
          <WorkBookModal
            openModal={openModal}
            operation={operation}
            tags={tags}
            editData={editData}
            searchByFilter={this.searchByFilter}
            closeEditModal={() =>
              this.setState({ openModal: false, operation: null, editData: null },
                () => this.searchByFilter())}
            closeModal={() => this.setState({ openModal: false, operation: null })}
            topicId={topicId}
            {...this.props}
          />
        </WorkbookStyle.TopContainer>
        <WorkbookTable
          searchByFilter={this.searchByFilter}
          openEditModal={this.openEditModal}
          setCount={(value) => this.setState({ count: value })}
          {...this.props}
        />
      </>
    )
  }
}

export default WorkBook
