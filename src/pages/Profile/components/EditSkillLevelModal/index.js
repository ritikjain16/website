import React, { Component } from 'react'
import { Button, Radio } from 'antd'
import hs from '../../../../utils/scale'
import MainModal from '../../../../components/MainModal'
import Main from '../../../../components/TopicNav/TopicNav.style'
import '../../profile.scss'

class EditSkillLevelModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSkillLevel: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (this.props.defaultSkillLevel !== prevProps.defaultSkillLevel) ||
      (this.props.visible && !prevProps.visible)
    ) {
      this.setState({
        selectedSkillLevel: this.props.defaultSkillLevel
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
            onClick={() => this.props.onSave(this.state.selectedSkillLevel)}
            disabled={this.props.defaultSkillLevel === this.state.selectedSkillLevel}
          > {this.props.isSaving ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Main.RadioGroup
            value={this.state.selectedSkillLevel}
            onChange={(e) => this.setState({ selectedSkillLevel: e.target.value })}
            buttonStyle='solid'
            className='skillTypeRadioGrp'
          >
            <Radio.Button className='skillTypeRadioBtn' value='easy'>easy</Radio.Button>
            <Radio.Button className='skillTypeRadioBtn' value='medium'>medium</Radio.Button>
            <Radio.Button className='skillTypeRadioBtn' value='hard'>hard</Radio.Button>
          </Main.RadioGroup>
        </div>
      </MainModal>
    )
  }
}

export default EditSkillLevelModal
