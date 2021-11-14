import { connect } from 'react-redux'
import CampaignTab from './CampaignTab'

const mapStateToProps = (state) => ({
  campaignsUpdateStatus: state.data.getIn(['campaigns', 'updateStatus', 'addBatches']),
  campaignsAddStatus: state.data.getIn(['campaigns', 'addStatus', 'campaigns']),
  campaignsUpdateFailure: state.data.getIn([
    'errors',
    'campaigns/update'
  ]),
  campaignAddFailure: state.data.getIn(['errors', 'campaigns/add']),
  campaignsEditStatus: state.data.getIn(['campaigns', 'updateStatus', 'campaigns']),
  campaignsDeleteStatus: state.data.getIn(['campaigns', 'deleteStatus', 'campaigns']),
  campaignsDeleteFailure: state.data.getIn([
    'errors',
    'campaigns/delete'
  ]),
})

export default connect(mapStateToProps)(CampaignTab)

