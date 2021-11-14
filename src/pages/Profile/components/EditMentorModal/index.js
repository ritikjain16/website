import React, { Component } from 'react'
import { Button } from 'antd'
import MainModal from '../../../../components/MainModal'
import hs from '../../../../utils/scale'

class EditMentorModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMentorId: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.defaultMentorId !== prevProps.defaultMentorId) ||
      (this.props.visible && !prevProps.visible)
    ) {
      this.setState({
        selectedMentorId: this.props.defaultMentorId
      })
    }
  }

  render() {
    const { visible, title, id } = this.props
    return (
      <MainModal
        visible={visible}
        title={title}
        onCancel={() => this.props.cancel()}
        maskClosable={false}
        width='540px'
        styles={{ marginTop: `${hs(150)}` }}
        footer={[
          <Button onClick={() => this.props.cancel()}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={() => this.props.onSave(this.state.selectedMentorId)}
            disabled={this.props.defaultMentorId === this.state.selectedMentorId}
          > {this.props.isSaving ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <div id='select-mentor-name'>
          <MainModal.Select
            showSearch
            placeholder='Mentor Name'
            width='70%'
            value={this.state.selectedMentorId}
            onChange={(value) => this.setState({ selectedMentorId: value })}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              this.props.mentorObjArr.map(mentor =>
                <MainModal.Option
                  key={mentor.id}
                  value={mentor.id}
                >
                  {mentor.name}
                </MainModal.Option>
              )}
          </MainModal.Select>
        </div>
      </MainModal>
    )
  }
}

export default EditMentorModal
